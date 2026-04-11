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
            if ($path && preg_match('/^(\d+)$/', $path, $m)) {
                $stmt = $db->prepare('SELECT id, image_url, alt_text, sort_order, is_tall, created_at FROM gallery_items WHERE id = ? LIMIT 1');
                $stmt->execute([(int) $m[1]]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    http_response_code(200);
                    echo json_encode($row);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Item not found.']);
                }
            } else {
                $stmt = $db->query('SELECT id, image_url, alt_text, sort_order, is_tall, created_at FROM gallery_items ORDER BY sort_order ASC, id ASC');
                http_response_code(200);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) {
                break;
            }
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->image_url)) {
                http_response_code(400);
                echo json_encode(['message' => 'image_url is required']);
                break;
            }
            $image_url = (string) $data->image_url;
            $alt_text = isset($data->alt_text) ? (string) $data->alt_text : '';
            $sort_order = isset($data->sort_order) ? (int) $data->sort_order : 0;
            $is_tall = isset($data->is_tall) ? ((int) $data->is_tall ? 1 : 0) : 0;

            $stmt = $db->prepare('INSERT INTO gallery_items (image_url, alt_text, sort_order, is_tall, created_at) VALUES (?, ?, ?, ?, NOW())');
            $stmt->execute([$image_url, $alt_text, $sort_order, $is_tall]);
            $newId = (int) $db->lastInsertId();

            http_response_code(201);
            echo json_encode(['message' => 'Gallery item created.', 'id' => $newId]);
            break;

        case 'PUT':
            $user = require_auth();
            if (!$user) {
                break;
            }
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $id = (int) $m[1];
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->image_url)) {
                http_response_code(400);
                echo json_encode(['message' => 'image_url is required']);
                break;
            }
            $image_url = (string) $data->image_url;
            $alt_text = isset($data->alt_text) ? (string) $data->alt_text : '';
            $sort_order = isset($data->sort_order) ? (int) $data->sort_order : 0;
            $is_tall = isset($data->is_tall) ? ((int) $data->is_tall ? 1 : 0) : 0;

            $stmt = $db->prepare('UPDATE gallery_items SET image_url = ?, alt_text = ?, sort_order = ?, is_tall = ? WHERE id = ?');
            $stmt->execute([$image_url, $alt_text, $sort_order, $is_tall, $id]);

            http_response_code(200);
            echo json_encode(['message' => 'Gallery item updated successfully.']);
            break;

        case 'DELETE':
            $user = require_auth();
            if (!$user) {
                break;
            }
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $id = (int) $m[1];
            $stmt = $db->prepare('DELETE FROM gallery_items WHERE id = ?');
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(['message' => 'Gallery item deleted successfully.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
}
