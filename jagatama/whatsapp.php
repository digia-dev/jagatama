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
            $sql = 'SELECT id, label, phone, department, is_primary, is_active, sort_order, created_at, updated_at FROM whatsapp_contacts';
            if ($activeOnly) $sql .= ' WHERE is_active = 1';
            $sql .= ' ORDER BY sort_order ASC, id ASC';
            $stmt = $db->query($sql);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) break;
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->phone) || empty($data->label)) {
                http_response_code(400);
                echo json_encode(['message' => 'phone and label are required']);
                break;
            }
            // If setting as primary, unset all others first
            if (!empty($data->is_primary)) {
                $db->query('UPDATE whatsapp_contacts SET is_primary = 0');
            }
            $stmt = $db->prepare('INSERT INTO whatsapp_contacts (label, phone, department, is_primary, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                trim($data->label),
                trim($data->phone),
                isset($data->department) ? trim($data->department) : '',
                isset($data->is_primary) ? (int)$data->is_primary : 0,
                isset($data->is_active) ? (int)$data->is_active : 1,
                isset($data->sort_order) ? (int)$data->sort_order : 0,
            ]);
            http_response_code(201);
            echo json_encode(['message' => 'WhatsApp contact created.', 'id' => (int)$db->lastInsertId()]);
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
            if (!$data || empty($data->phone) || empty($data->label)) {
                http_response_code(400);
                echo json_encode(['message' => 'phone and label are required']);
                break;
            }
            // If setting as primary, unset all others first
            if (!empty($data->is_primary)) {
                $db->prepare('UPDATE whatsapp_contacts SET is_primary = 0 WHERE id != ?')->execute([$id]);
            }
            $stmt = $db->prepare('UPDATE whatsapp_contacts SET label=?, phone=?, department=?, is_primary=?, is_active=?, sort_order=?, updated_at=NOW() WHERE id=?');
            $stmt->execute([
                trim($data->label),
                trim($data->phone),
                isset($data->department) ? trim($data->department) : '',
                isset($data->is_primary) ? (int)$data->is_primary : 0,
                isset($data->is_active) ? (int)$data->is_active : 1,
                isset($data->sort_order) ? (int)$data->sort_order : 0,
                $id,
            ]);
            echo json_encode(['message' => 'WhatsApp contact updated.']);
            break;

        case 'DELETE':
            $user = require_auth();
            if (!$user) break;
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $stmt = $db->prepare('DELETE FROM whatsapp_contacts WHERE id=?');
            $stmt->execute([(int)$m[1]]);
            echo json_encode(['message' => 'WhatsApp contact deleted.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
}
