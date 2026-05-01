<?php
require_once 'jagatama/db.php';
$database = new Database();
$db = $database->getConnection();
if (!$db) {
    echo "Database connection failed.\n";
    exit(1);
}

echo "Articles count: " . $db->query("SELECT COUNT(*) FROM articles")->fetchColumn() . "\n";
echo "Products count: " . $db->query("SELECT COUNT(*) FROM products")->fetchColumn() . "\n";
echo "Hero slides count: " . $db->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn() . "\n";
echo "Gallery items count: " . $db->query("SELECT COUNT(*) FROM gallery_items")->fetchColumn() . "\n";

$articles = $db->query("SELECT title FROM articles")->fetchAll(PDO::FETCH_COLUMN);
echo "Article titles: " . implode(", ", $articles) . "\n";
