<?php
require_once __DIR__ . '/jagatama/config.php';
require_once __DIR__ . '/jagatama/db.php';
$database = new Database();
$db = $database->getConnection();
if (!$db) die("DB fail");
$stmt = $db->query("SELECT COUNT(*) as total FROM products");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Total products in DB: " . $row['total'] . "\n";
$stmt = $db->query("SELECT * FROM products");
while($p = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "- ID: " . $p['id'] . ", Title: " . $p['title'] . "\n";
}
