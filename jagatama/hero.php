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

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->query('SELECT id, image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right, created_at, updated_at FROM hero_slides ORDER BY sort_order ASC, id ASC');
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(['slides' => $rows]);
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
