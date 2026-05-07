<?php
require_once __DIR__ . '/jagatama/config.php';
require_once __DIR__ . '/jagatama/db.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed.");
}

$username = 'admin';
$password = 'jagatamaid';
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Delete existing admin if any
    $stmt = $db->prepare('DELETE FROM admins WHERE username = ?');
    $stmt->execute([$username]);

    // Insert new admin
    $stmt = $db->prepare('INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, NOW())');
    $stmt->execute([$username, $passwordHash]);

    echo "User '$username' created successfully with the requested password.\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
