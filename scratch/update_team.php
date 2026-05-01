<?php
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();

echo "--- Updating Team Members from Profile Data ---\n";

// Ensure table exists
$db->exec('CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255), 
    position VARCHAR(255), 
    department VARCHAR(255), 
    bio TEXT, 
    avatar_url VARCHAR(1024), 
    sort_order INT DEFAULT 0, 
    is_active INT DEFAULT 1, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)');

$db->exec('TRUNCATE TABLE team_members');

$team = [
    [
        "name" => "Akhmad Otong Turmudi",
        "position" => "Direktur Utama (CEO)",
        "department" => "Manajemen",
        "bio" => "Memimpin visi dan strategi PT Jagasura Agro Utama menuju pertanian terpadu berkelanjutan.",
        "avatar_url" => "",
        "sort_order" => 1
    ],
    [
        "name" => "Rikhanah",
        "position" => "Keuangan",
        "department" => "Manajerial",
        "bio" => "Mengelola administrasi keuangan dan memastikan transparansi operasional perusahaan.",
        "avatar_url" => "",
        "sort_order" => 2
    ],
    [
        "name" => "Abin Helmi Alif",
        "position" => "Arsip & Administrasi",
        "department" => "Manajerial",
        "bio" => "Bertanggung jawab atas pengelolaan dokumen, kearsipan, dan administrasi umum.",
        "avatar_url" => "",
        "sort_order" => 3
    ],
    [
        "name" => "Pak TW",
        "position" => "Manajer Umum",
        "department" => "Pelaksana",
        "bio" => "Mengkoordinasi kegiatan operasional harian dan memastikan sinergi antar divisi.",
        "avatar_url" => "",
        "sort_order" => 4
    ],
    [
        "name" => "Tim Supervisor",
        "position" => "Supervisor Produksi",
        "department" => "Produksi",
        "bio" => "Nopita, Paung, Yusuf, Teguh, Ade, Imam, Hanapi, Refal, Tegar. Mengawasi budidaya greenhouse dan kontrol kualitas.",
        "avatar_url" => "",
        "sort_order" => 5
    ],
    [
        "name" => "Septi",
        "position" => "Gudang & Logistik",
        "department" => "Pelaksana",
        "bio" => "Menangani pengelolaan inventaris, penyimpanan hasil panen, dan alur distribusi.",
        "avatar_url" => "",
        "sort_order" => 6
    ]
];

$stmt = $db->prepare('INSERT INTO team_members (name, position, department, bio, avatar_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)');

foreach ($team as $t) {
    $stmt->execute([$t['name'], $t['position'], $t['department'], $t['bio'], $t['avatar_url'], $t['sort_order']]);
    echo "Inserted Team Member: " . $t['name'] . "\n";
}

echo "Done.\n";
