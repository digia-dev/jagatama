<?php
require_once __DIR__ . '/../jagatama/config.php';
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->query("SELECT * FROM site_settings LIMIT 1");
$settings = $stmt->fetch(PDO::FETCH_ASSOC);
print_r($settings);
