<?php
require_once __DIR__ . '/api_bootstrap.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = api_get_path();

try {
    switch ($method) {
        case 'GET':
            $activeOnly = isset($_GET['active']) && $_GET['active'] === '1';
            $sql = 'SELECT id, name, position, department, bio, avatar_url, sort_order, is_active, created_at, updated_at FROM team_members';
            if ($activeOnly) $sql .= ' WHERE is_active = 1';
            $sql .= ' ORDER BY sort_order ASC, id ASC';
            $stmt = $db->query($sql);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) break;
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->name)) {
                http_response_code(400);
                echo json_encode(['message' => 'name is required']);
                break;
            }
            $stmt = $db->prepare('INSERT INTO team_members (name, position, department, bio, avatar_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                trim($data->name),
                isset($data->position) ? trim($data->position) : '',
                isset($data->department) ? trim($data->department) : '',
                isset($data->bio) ? $data->bio : '',
                isset($data->avatar_url) ? $data->avatar_url : '',
                isset($data->sort_order) ? (int)$data->sort_order : 0,
                isset($data->is_active) ? (int)$data->is_active : 1,
            ]);
            http_response_code(201);
            echo json_encode(['message' => 'Team member created.', 'id' => (int)$db->lastInsertId()]);
            break;

        case 'PUT':
            $user = require_auth();
            if (!$user) break;
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $id = (int)$m[1];
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->name)) {
                http_response_code(400);
                echo json_encode(['message' => 'name is required']);
                break;
            }
            $stmt = $db->prepare('UPDATE team_members SET name=?, position=?, department=?, bio=?, avatar_url=?, sort_order=?, is_active=?, updated_at=NOW() WHERE id=?');
            $stmt->execute([
                trim($data->name),
                isset($data->position) ? trim($data->position) : '',
                isset($data->department) ? trim($data->department) : '',
                isset($data->bio) ? $data->bio : '',
                isset($data->avatar_url) ? $data->avatar_url : '',
                isset($data->sort_order) ? (int)$data->sort_order : 0,
                isset($data->is_active) ? (int)$data->is_active : 1,
                $id,
            ]);
            echo json_encode(['message' => 'Team member updated.']);
            break;

        case 'DELETE':
            $user = require_auth();
            if (!$user) break;
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $stmt = $db->prepare('DELETE FROM team_members WHERE id=?');
            $stmt->execute([(int)$m[1]]);
            echo json_encode(['message' => 'Team member deleted.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
}
