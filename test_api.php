<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['SCRIPT_NAME'] = '/products.php';
$_SERVER['REQUEST_URI'] = '/products.php';
$_SERVER['QUERY_STRING'] = '';

ob_start();
require_once __DIR__ . '/jagatama/products.php';
$output = ob_get_clean();

echo "API RESPONSE:\n";
echo $output . "\n";
