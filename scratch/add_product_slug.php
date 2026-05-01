<?php
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $db->exec('ALTER TABLE products ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER id');
    echo "Column slug added to products table.\n";
} catch (PDOException $e) {
    echo "Error or column already exists: " . $e->getMessage() . "\n";
}
