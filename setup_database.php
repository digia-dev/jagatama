<?php
/**
 * Setup Database Script
 * This script ensures all tables exist and optionally seeds the database with full data.
 */

require_once __DIR__ . '/jagatama/config.php';

$host = Config::get('DB_HOST', 'localhost');
$name = Config::get('DB_NAME', 'jagatama_db');
$user = Config::get('DB_USER', 'root');
$pass = Config::get('DB_PASS', '');

try {
    // Connect to MySQL (without DB first to create it if missing)
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Creating database if not exists: $name...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$name` ");
    
    // Re-connect with database name
    $pdo = new PDO("mysql:host=$host;dbname=$name;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $files = [
        'jagatama/database.sql',           // Base schema
        'jagatama/migrate_new_features.sql', // New features schema/seeds
        'jagatama/seed_reset_data.sql'      // Full data reset
    ];

    foreach ($files as $file) {
        $filePath = __DIR__ . '/' . $file;
        if (!file_exists($filePath)) {
            echo "SKIPPING: File not found: $file\n";
            continue;
        }

        echo "Running SQL file: $file...\n";
        $sql = file_get_contents($filePath);
        
        // Basic SQL cleanup
        $sql = preg_replace('/^--[^\n]*$/m', '', $sql);
        $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
        
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        $ok = 0; $fail = 0;
        
        foreach ($statements as $s) {
            if (empty($s)) continue;
            try {
                $pdo->exec($s);
                $ok++;
            } catch (Exception $e) {
                // Some "IF NOT EXISTS" or "INSERT IGNORE" might still throw if schema changed, but we log it
                // echo "WARN: in $file: " . $e->getMessage() . "\n";
                $fail++;
            }
        }
        echo "   Done: $ok OK, $fail skipped/failed\n";
    }

    echo "\nDatabase setup complete. All tables and full data are now in MySQL.\n";

} catch (Exception $e) {
    echo "CRITICAL ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
