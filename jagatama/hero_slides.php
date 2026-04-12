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

$slideSelect = 'SELECT id, image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right, created_at, updated_at FROM hero_slides';

function hero_slide_bind_strings($data) {
    return [
        isset($data->eyebrow) ? (string) $data->eyebrow : '',
        isset($data->headline_part1) ? (string) $data->headline_part1 : '',
        isset($data->headline_highlight) ? (string) $data->headline_highlight : '',
        isset($data->headline_part2) ? (string) $data->headline_part2 : '',
        isset($data->description_text) ? (string) $data->description_text : '',
        isset($data->primary_cta_label) ? (string) $data->primary_cta_label : '',
        isset($data->primary_cta_hash) ? (string) $data->primary_cta_hash : '',
        isset($data->secondary_cta_label) ? (string) $data->secondary_cta_label : '',
        isset($data->secondary_cta_hash) ? (string) $data->secondary_cta_hash : '',
        isset($data->footer_left) ? (string) $data->footer_left : '',
        isset($data->footer_right) ? (string) $data->footer_right : '',
    ];
}

try {
    switch ($method) {
        case 'GET':
            if ($path && preg_match('/^(\d+)$/', $path, $m)) {
                $stmt = $db->prepare($slideSelect . ' WHERE id = ? LIMIT 1');
                $stmt->execute([(int) $m[1]]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    http_response_code(200);
                    echo json_encode($row);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Slide not found.']);
                }
            } else {
                $stmt = $db->query($slideSelect . ' ORDER BY sort_order ASC, id ASC');
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
            $sort_order = isset($data->sort_order) ? (int) $data->sort_order : 0;
            $s = hero_slide_bind_strings($data);

            $stmt = $db->prepare('INSERT INTO hero_slides (image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
            $stmt->execute(array_merge([$image_url, $sort_order], $s));
            $newId = (int) $db->lastInsertId();

            http_response_code(201);
            echo json_encode(['message' => 'Hero slide created.', 'id' => $newId]);
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
            $sort_order = isset($data->sort_order) ? (int) $data->sort_order : 0;
            $s = hero_slide_bind_strings($data);

            $stmt = $db->prepare('UPDATE hero_slides SET image_url = ?, sort_order = ?, eyebrow = ?, headline_part1 = ?, headline_highlight = ?, headline_part2 = ?, description_text = ?, primary_cta_label = ?, primary_cta_hash = ?, secondary_cta_label = ?, secondary_cta_hash = ?, footer_left = ?, footer_right = ?, updated_at = NOW() WHERE id = ?');
            $stmt->execute(array_merge([$image_url, $sort_order], $s, [$id]));

            http_response_code(200);
            echo json_encode(['message' => 'Hero slide updated successfully.']);
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
            $stmt = $db->prepare('DELETE FROM hero_slides WHERE id = ?');
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(['message' => 'Hero slide deleted successfully.']);
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
