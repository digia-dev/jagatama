<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'OPTIONS') {
    exit;
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

try {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT logo_url, brand_name, tagline FROM site_settings LIMIT 1");
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$settings) {
            $settings = [
                "logo_url" => "/logotp.png",
                "brand_name" => "Jagasura Agrotama",
                "tagline" => "Sustainable Agriculture"
            ];
        }
        
        echo json_encode($settings);
    } 
    elseif ($method === 'POST') {
        // Authenticate admin
        if (!require_auth()) {
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['brand_name'])) {
            throw new Exception("Invalid input: brand_name is required");
        }

        // Check if row exists
        $check = $db->query("SELECT COUNT(*) FROM site_settings")->fetchColumn();
        
        if ($check == 0) {
            $stmt = $db->prepare("INSERT INTO site_settings (logo_url, brand_name, tagline) VALUES (?, ?, ?)");
            $stmt->execute([
                $input['logo_url'] ?? '',
                $input['brand_name'],
                $input['tagline'] ?? ''
            ]);
        } else {
            $stmt = $db->prepare("UPDATE site_settings SET logo_url = ?, brand_name = ?, tagline = ?");
            $stmt->execute([
                $input['logo_url'] ?? '',
                $input['brand_name'],
                $input['tagline'] ?? ''
            ]);
        }

        echo json_encode(["status" => "success", "message" => "Settings updated"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
