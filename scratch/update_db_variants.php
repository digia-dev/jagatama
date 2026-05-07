<?php
require_once dirname(__DIR__) . '/jagatama/db.php';
$database = new Database();
$db = $database->getConnection();
if ($db) {
    try {
        $db->exec("ALTER TABLE product_variants ADD COLUMN image_url TEXT;");
        echo "Successfully added image_url to product_variants\n";
    } catch (Exception $e) {
        echo "Error or already exists: " . $e->getMessage() . "\n";
    }
} else {
    echo "Connection failed\n";
}
