<?php
require __DIR__ . '/jagatama/config.php';
$host = Config::get('DB_HOST', 'localhost');
$name = Config::get('DB_NAME', 'jagatama_db');
$user = Config::get('DB_USER', 'root');
$pass = Config::get('DB_PASS', '');
try {
    $pdo = new PDO("mysql:host=$host;dbname=$name;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = file_get_contents(__DIR__ . '/jagatama/migrate_new_features.sql');
    // Remove full-line comments first, then split
    $sql = preg_replace('/^--[^\n]*$/m', '', $sql);
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    $ok = 0; $fail = 0;
    foreach ($statements as $s) {
        if (empty($s) || strpos(ltrim($s), '--') === 0) continue;
        try { $pdo->exec($s); $ok++; }
        catch (Exception $e) { echo "WARN: " . $e->getMessage() . "\n"; $fail++; }
    }
    echo "Migration done: $ok OK, $fail warnings\n";
} catch (Exception $e) {
    echo "ERR: " . $e->getMessage() . "\n";
}
