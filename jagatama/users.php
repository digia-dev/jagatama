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
            $stmt = $db->query('SELECT id, username, created_at FROM admins ORDER BY id ASC');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) break;
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->username) || empty($data->password)) {
                http_response_code(400);
                echo json_encode(['message' => 'username and password are required']);
                break;
            }
            $username = trim($data->username);
            // Check if username exists
            $check = $db->prepare('SELECT id FROM admins WHERE username = ?');
            $check->execute([$username]);
            if ($check->fetch()) {
                http_response_code(409);
                echo json_encode(['message' => 'Username sudah digunakan.']);
                break;
            }
            $hash = password_hash($data->password, PASSWORD_DEFAULT);
            $stmt = $db->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
            $stmt->execute([$username, $hash]);
            http_response_code(201);
            echo json_encode(['message' => 'User created.', 'id' => (int)$db->lastInsertId()]);
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
            if (!$data || empty($data->username)) {
                http_response_code(400);
                echo json_encode(['message' => 'username is required']);
                break;
            }
            $username = trim($data->username);
            // Check username uniqueness (excluding self)
            $check = $db->prepare('SELECT id FROM admins WHERE username = ? AND id != ?');
            $check->execute([$username, $id]);
            if ($check->fetch()) {
                http_response_code(409);
                echo json_encode(['message' => 'Username sudah digunakan.']);
                break;
            }
            if (!empty($data->password)) {
                $hash = password_hash($data->password, PASSWORD_DEFAULT);
                $stmt = $db->prepare('UPDATE admins SET username=?, password_hash=? WHERE id=?');
                $stmt->execute([$username, $hash, $id]);
            } else {
                $stmt = $db->prepare('UPDATE admins SET username=? WHERE id=?');
                $stmt->execute([$username, $id]);
            }
            echo json_encode(['message' => 'User updated.']);
            break;

        case 'DELETE':
            $user = require_auth();
            if (!$user) break;
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $id = (int)$m[1];
            // Prevent deleting yourself
            if (isset($user['sub']) && (int)$user['sub'] === $id) {
                http_response_code(403);
                echo json_encode(['message' => 'Tidak bisa menghapus akun sendiri.']);
                break;
            }
            $stmt = $db->prepare('DELETE FROM admins WHERE id=?');
            $stmt->execute([$id]);
            echo json_encode(['message' => 'User deleted.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
}
