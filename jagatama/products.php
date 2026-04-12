<?php

require_once __DIR__ . '/api_bootstrap.php';

function products_read_all($db) {
    $stmt = $db->query('SELECT id, title, category, description, image_url, price, price_note, sort_order, created_at, updated_at FROM products ORDER BY sort_order ASC, id ASC');
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$row) {
        $pid = (int) $row['id'];
        $v = $db->prepare('SELECT id, label, sort_order FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC, id ASC');
        $v->execute([$pid]);
        $row['variants'] = $v->fetchAll(PDO::FETCH_ASSOC);
    }
    return $rows;
}

function products_read_one($db, $id) {
    $stmt = $db->prepare('SELECT id, title, category, description, image_url, price, price_note, sort_order, created_at, updated_at FROM products WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return null;
    }
    $v = $db->prepare('SELECT id, label, sort_order FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC, id ASC');
    $v->execute([(int) $row['id']]);
    $row['variants'] = $v->fetchAll(PDO::FETCH_ASSOC);
    return $row;
}

function products_replace_variants($db, $productId, $variants) {
    $del = $db->prepare('DELETE FROM product_variants WHERE product_id = ?');
    $del->execute([$productId]);
    if (!is_array($variants) || count($variants) === 0) {
        return;
    }
    $ins = $db->prepare('INSERT INTO product_variants (product_id, label, sort_order) VALUES (?, ?, ?)');
    $order = 0;
    foreach ($variants as $item) {
        if (is_object($item)) {
            $label = isset($item->label) ? trim((string) $item->label) : '';
        } else {
            $label = isset($item['label']) ? trim((string) $item['label']) : '';
        }
        if ($label === '') {
            continue;
        }
        $ins->execute([$productId, $label, $order]);
        $order++;
    }
}

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
                $row = products_read_one($db, (int) $m[1]);
                if ($row) {
                    http_response_code(200);
                    echo json_encode($row);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Product not found.']);
                }
            } else {
                $rows = products_read_all($db);
                http_response_code(200);
                echo json_encode($rows);
            }
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) {
                break;
            }
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->title)) {
                http_response_code(400);
                echo json_encode(['message' => 'title is required']);
                break;
            }
            $title = trim((string) $data->title);
            $category = isset($data->category) ? trim((string) $data->category) : '';
            $description = isset($data->description) ? (string) $data->description : '';
            $image_url = isset($data->image_url) ? (string) $data->image_url : '';
            $price = isset($data->price) ? (int) $data->price : 0;
            $price_note = isset($data->price_note) ? (string) $data->price_note : '';
            $sort_order = isset($data->sort_order) ? (int) $data->sort_order : 0;
            $variants = isset($data->variants) ? $data->variants : [];

            $stmt = $db->prepare('INSERT INTO products (title, category, description, image_url, price, price_note, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
            $stmt->execute([$title, $category, $description, $image_url, $price, $price_note, $sort_order]);
            $newId = (int) $db->lastInsertId();
            products_replace_variants($db, $newId, $variants);

            http_response_code(201);
            echo json_encode(['message' => 'Product created.', 'id' => $newId]);
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
            if (!$data || empty($data->title)) {
                http_response_code(400);
                echo json_encode(['message' => 'title is required']);
                break;
            }
            $title = trim((string) $data->title);
            $category = isset($data->category) ? trim((string) $data->category) : '';
            $description = isset($data->description) ? (string) $data->description : '';
            $image_url = isset($data->image_url) ? (string) $data->image_url : '';
            $price = isset($data->price) ? (int) $data->price : 0;
            $price_note = isset($data->price_note) ? (string) $data->price_note : '';
            $sort_order = isset($data->sort_order) ? (int) $data->sort_order : 0;
            $variants = isset($data->variants) ? $data->variants : [];

            $stmt = $db->prepare('UPDATE products SET title = ?, category = ?, description = ?, image_url = ?, price = ?, price_note = ?, sort_order = ?, updated_at = NOW() WHERE id = ?');
            $stmt->execute([$title, $category, $description, $image_url, $price, $price_note, $sort_order, $id]);

            products_replace_variants($db, $id, $variants);

            http_response_code(200);
            echo json_encode(['message' => 'Product updated successfully.']);
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
            $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(['message' => 'Product deleted successfully.']);
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
