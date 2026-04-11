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
            $stmt = $db->prepare('SELECT id, image_url, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right, updated_at FROM hero_content WHERE id = 1 LIMIT 1');
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                http_response_code(200);
                echo json_encode($row);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Hero content not found.']);
            }
            break;

        case 'PUT':
            $user = require_auth();
            if (!$user) {
                break;
            }
            $data = json_decode(file_get_contents('php://input'));
            if (!$data) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid JSON']);
                break;
            }

            $image_url = isset($data->image_url) ? (string) $data->image_url : '';
            $eyebrow = isset($data->eyebrow) ? (string) $data->eyebrow : '';
            $headline_part1 = isset($data->headline_part1) ? (string) $data->headline_part1 : '';
            $headline_highlight = isset($data->headline_highlight) ? (string) $data->headline_highlight : '';
            $headline_part2 = isset($data->headline_part2) ? (string) $data->headline_part2 : '';
            $description_text = isset($data->description_text) ? (string) $data->description_text : '';
            $primary_cta_label = isset($data->primary_cta_label) ? (string) $data->primary_cta_label : '';
            $primary_cta_hash = isset($data->primary_cta_hash) ? (string) $data->primary_cta_hash : '';
            $secondary_cta_label = isset($data->secondary_cta_label) ? (string) $data->secondary_cta_label : '';
            $secondary_cta_hash = isset($data->secondary_cta_hash) ? (string) $data->secondary_cta_hash : '';
            $footer_left = isset($data->footer_left) ? (string) $data->footer_left : '';
            $footer_right = isset($data->footer_right) ? (string) $data->footer_right : '';

            $stmt = $db->prepare('UPDATE hero_content SET image_url = ?, eyebrow = ?, headline_part1 = ?, headline_highlight = ?, headline_part2 = ?, description_text = ?, primary_cta_label = ?, primary_cta_hash = ?, secondary_cta_label = ?, secondary_cta_hash = ?, footer_left = ?, footer_right = ?, updated_at = NOW() WHERE id = 1');
            $stmt->execute([
                $image_url, $eyebrow, $headline_part1, $headline_highlight, $headline_part2,
                $description_text, $primary_cta_label, $primary_cta_hash, $secondary_cta_label, $secondary_cta_hash,
                $footer_left, $footer_right,
            ]);

            http_response_code(200);
            echo json_encode(['message' => 'Hero updated successfully.']);
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
