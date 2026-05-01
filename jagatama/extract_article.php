<?php
require_once 'api_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$url = $_GET['url'] ?? '';

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL is required']);
    exit;
}

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

// Fetch content
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$html = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200 || !$html) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to fetch content from URL']);
    exit;
}

// Simple parsing
libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
libxml_clear_errors();

$xpath = new DOMXPath($dom);

$result = [
    'title' => '',
    'excerpt' => '',
    'image_url' => '',
    'paragraphs' => [],
    'date_display' => date('d M Y')
];

// Title
$titleNode = $dom->getElementsByTagName('title')->item(0);
if ($titleNode) {
    $result['title'] = trim($titleNode->nodeValue);
}

// OG Image
$ogImage = $xpath->query('//meta[@property="og:image"]/@content')->item(0);
if ($ogImage) {
    $result['image_url'] = $ogImage->nodeValue;
}

// Fallback: If no OG image or it looks generic, try finding first image in article/main content
if (empty($result['image_url'])) {
    $contentImages = $xpath->query('//article//img/@src | //main//img/@src | //div[contains(@class, "content")]//img/@src');
    if ($contentImages->length > 0) {
        $result['image_url'] = $contentImages->item(0)->nodeValue;
    }
}

// Make image URL absolute if relative
if (!empty($result['image_url']) && !preg_match('/^http/', $result['image_url'])) {
    $parsed = parse_url($url);
    $base = $parsed['scheme'] . '://' . $parsed['host'];
    if (strpos($result['image_url'], '/') === 0) {
        $result['image_url'] = $base . $result['image_url'];
    } else {
        $path = dirname($parsed['path'] ?? '/');
        $result['image_url'] = $base . ($path === '/' ? '' : $path) . '/' . $result['image_url'];
    }
}

// Meta Description
$metaDesc = $xpath->query('//meta[@name="description"]/@content')->item(0);
if ($metaDesc) {
    $result['excerpt'] = $metaDesc->nodeValue;
}

// Paragraphs - try to find main content
$pNodes = $dom->getElementsByTagName('p');
$paragraphs = [];
$blacklist = [
    '/fax/i',
    '/email/i',
    '/telp/i',
    '/phone/i',
    '/alamat/i',
    '/address/i',
    '/copyright/i',
    '/all rights reserved/i',
    '/\[email protected\]/i',
    '/website/i',
    '/\(\d{2,5}\) \d+/i', // Phone pattern (0298) 5200107
    '/08\d{2}-\d{4}-\d{3,}/', // Indo WA/Phone
    '/Kec\./i', // District (Alamat)
    '/Kab\./i', // Regency (Alamat)
    '/Prov\./i', // Province (Alamat)
    '/Baca Juga/i',
    '/Simak Juga/i',
    '/\d{5,}/' // Generic long numbers (Zip code, long phone without brackets)
];

foreach ($pNodes as $p) {
    $text = trim($p->nodeValue);
    
    // Skip short paragraphs
    if (strlen($text) < 40) continue;

    // Filter out contact info / footer stuff
    $isBlacklisted = false;
    foreach ($blacklist as $pattern) {
        if (preg_match($pattern, $text)) {
            $isBlacklisted = true;
            break;
        }
    }

    if (!$isBlacklisted) {
        $paragraphs[] = $text;
    }
}

// Limit to first 15 paragraphs
$result['paragraphs'] = array_slice($paragraphs, 0, 15);

echo json_encode($result);
