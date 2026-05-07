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
                $stmt = $db->prepare('SELECT * FROM gallery_items WHERE id = ? LIMIT 1');
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
                // Support filtering by parent_id
                $parent_id = isset($_GET['parent_id']) ? ($_GET['parent_id'] === 'root' ? null : (int)$_GET['parent_id']) : null;
                
                if ($parent_id === null) {
                    $stmt = $db->query('SELECT * FROM gallery_items WHERE parent_id IS NULL ORDER BY is_folder DESC, sort_order ASC, id DESC');
                } else {
                    $stmt = $db->prepare('SELECT * FROM gallery_items WHERE parent_id = ? ORDER BY is_folder DESC, sort_order ASC, id DESC');
                    $stmt->execute([$parent_id]);
                }
                
                http_response_code(200);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) break;
            
            $data = json_decode(file_get_contents('php://input'));
            if (!$data) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid data']);
                break;
            }

            $is_folder = isset($data->is_folder) ? (int)$data->is_folder : 0;
            $image_url = isset($data->image_url) ? (string)$data->image_url : '';
            
            if (!$is_folder && empty($image_url)) {
                http_response_code(400);
                echo json_encode(['message' => 'image_url is required for files']);
                break;
            }

            $title = isset($data->title) ? (string)$data->title : 'Untitled';
            $alt_text = isset($data->alt_text) ? (string)$data->alt_text : '';
            $tags = isset($data->tags) ? (string)$data->tags : '';
            $sort_order = isset($data->sort_order) ? (int)$data->sort_order : 0;
            $is_tall = isset($data->is_tall) ? (int)$data->is_tall : 0;
            $parent_id = isset($data->parent_id) && $data->parent_id > 0 ? (int)$data->parent_id : null;
            $file_type = isset($data->file_type) ? (string)$data->file_type : ($is_folder ? 'folder' : 'image');
            $file_size = isset($data->file_size) ? (int)$data->file_size : 0;
            $mime_type = isset($data->mime_type) ? (string)$data->mime_type : null;

            $stmt = $db->prepare('INSERT INTO gallery_items (image_url, alt_text, sort_order, is_tall, tags, title, parent_id, is_folder, file_type, file_size, mime_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())');
            $stmt->execute([$image_url, $alt_text, $sort_order, $is_tall, $tags, $title, $parent_id, $is_folder, $file_type, $file_size, $mime_type]);
            
            http_response_code(201);
            echo json_encode(['message' => 'Created successfully.', 'id' => $db->lastInsertId()]);
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
            
            // Allow partial updates
            $fields = [];
            $params = [];
            
            foreach(['image_url', 'alt_text', 'sort_order', 'is_tall', 'tags', 'title', 'parent_id', 'is_folder', 'file_type', 'file_size', 'mime_type'] as $f) {
                if (property_exists($data, $f)) {
                    $fields[] = "$f = ?";
                    $params[] = $data->$f;
                }
            }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['message' => 'No fields to update']);
                break;
            }
            
            $params[] = $id;
            $stmt = $db->prepare('UPDATE gallery_items SET ' . implode(', ', $fields) . ' WHERE id = ?');
            $stmt->execute($params);

            http_response_code(200);
            echo json_encode(['message' => 'Updated successfully.']);
            break;

        case 'DELETE':
            $user = require_auth();
            if (!$user) break;
            
            $input = json_decode(file_get_contents('php://input'));
            if ($input && isset($input->ids) && is_array($input->ids)) {
                // Bulk delete
                if (empty($input->ids)) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Nothing to delete.']);
                    break;
                }
                $placeholders = implode(',', array_fill(0, count($input->ids), '?'));
                $stmt = $db->prepare("DELETE FROM gallery_items WHERE id IN ($placeholders)");
                $stmt->execute($input->ids);
                http_response_code(200);
                echo json_encode(['message' => 'Bulk delete successful.']);
            } else {
                // Single delete
                if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                    http_response_code(400);
                    echo json_encode(['message' => 'Invalid ID']);
                    break;
                }
                $id = (int)$m[1];
                $stmt = $db->prepare('DELETE FROM gallery_items WHERE id = ?');
                $stmt->execute([$id]);
                http_response_code(200);
                echo json_encode(['message' => 'Deleted successfully.']);
            }
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
