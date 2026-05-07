<?php
require_once __DIR__ . '/jagatama/config.php';
require_once __DIR__ . '/jagatama/db.php';
$database = new Database();
$db = $database->getConnection();
if (!$db) die("DB fail");
$sql = file_get_contents(__DIR__ . '/jagatama/gallery_to_drive.sql');
$db->exec($sql);
echo "Drive migration successful.\n";
