<?php
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();

echo "--- Updating Hero Slides ---\n";

// Clear existing slides to replace with new curated data
$db->exec('TRUNCATE TABLE hero_slides');

$heroSlides = [
    [
        "image_url" => "/produk/Gambar%20Latar/Latar%202.jpg",
        "sort_order" => 0,
        "eyebrow" => "PT Jagasura Agrotama Indonesia",
        "headline_part1" => "Industri Pertanian ",
        "headline_highlight" => "Terintegrasi",
        "headline_part2" => " — Ramah Lingkungan & Berkelanjutan",
        "description_text" => "Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan. Farm · Food · Mart dalam satu ekosistem agro terpadu di Tegal, Jawa Tengah.",
        "primary_cta_label" => "Lihat Produk Kami",
        "primary_cta_hash" => "produk",
        "secondary_cta_label" => "Hubungi Kami",
        "secondary_cta_hash" => "kontak",
        "footer_left" => "\"Bertani itu Keren dan Berdaya Saing\"",
        "footer_right" => "Dukuhwaru, Tegal"
    ],
    [
        "image_url" => "/produk/Gambar%20Latar/GH.jpg",
        "sort_order" => 1,
        "eyebrow" => "Inovasi Teknologi Pertanian",
        "headline_part1" => "Budidaya ",
        "headline_highlight" => "Greenhouse",
        "headline_part2" => " Modern Berkualitas Premium",
        "description_text" => "Pengendalian iklim mikro untuk hasil panen melon dan hortikultura yang konsisten, aman, dan berstandar nasional.",
        "primary_cta_label" => "Jelajahi Produk",
        "primary_cta_hash" => "produk",
        "secondary_cta_label" => "Program Pelatihan",
        "secondary_cta_hash" => "tentang",
        "footer_left" => "Jagasura Farm",
        "footer_right" => "Melon Premium"
    ],
    [
        "image_url" => "/produk/Gambar%20Latar/3.jpg",
        "sort_order" => 2,
        "eyebrow" => "Peternakan Mandiri",
        "headline_part1" => "Ekosistem Bisnis ",
        "headline_highlight" => "Ternak Kambing",
        "headline_part2" => " Terpadu",
        "description_text" => "Dari hulu ke hilir. Memenuhi kebutuhan daging berkualitas tinggi dengan standar pemotongan (RPH) yang aman dan higienis.",
        "primary_cta_label" => "Pesan Karkas",
        "primary_cta_hash" => "produk",
        "secondary_cta_label" => "Kemitraan",
        "secondary_cta_hash" => "kontak",
        "footer_left" => "MJ Farm",
        "footer_right" => "RPH Terintegrasi"
    ],
    [
        "image_url" => "/produk/Gambar%20Latar/2.jpg",
        "sort_order" => 3,
        "eyebrow" => "Zero Waste Agriculture",
        "headline_part1" => "Sistem Pertanian ",
        "headline_highlight" => "Sirkular",
        "headline_part2" => " Tanpa Limbah",
        "description_text" => "Memanfaatkan limbah pertanian untuk pakan maggot, yang kembali menjadi pakan ternak dan pupuk organik. Back to Nature.",
        "primary_cta_label" => "Sinergitas Kami",
        "primary_cta_hash" => "tentang",
        "secondary_cta_label" => "Lihat Galeri",
        "secondary_cta_hash" => "galeri",
        "footer_left" => "Koperasi Satria Tani Hanggawana",
        "footer_right" => "Zero Waste System"
    ],
    [
        "image_url" => "/produk/Gambar%20Latar/5.jpg",
        "sort_order" => 4,
        "eyebrow" => "Kemandirian Pangan",
        "headline_part1" => "Membangun Generasi ",
        "headline_highlight" => "Petani Muda",
        "headline_part2" => " yang Tangguh",
        "description_text" => "Melalui Agropreneurship Farm Class, kami mencetak SDM pertanian yang melek teknologi, tangguh, dan berdaya saing tinggi.",
        "primary_cta_label" => "Program Magang",
        "primary_cta_hash" => "kontak",
        "secondary_cta_label" => "Profil Kami",
        "secondary_cta_hash" => "tentang",
        "footer_left" => "AgroEdu Jagasura",
        "footer_right" => "Pemberdayaan Masyarakat"
    ]
];

$stmt = $db->prepare('INSERT INTO hero_slides (image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');

foreach ($heroSlides as $s) {
    $stmt->execute([
        $s['image_url'], $s['sort_order'], $s['eyebrow'], 
        $s['headline_part1'], $s['headline_highlight'], $s['headline_part2'], 
        $s['description_text'], $s['primary_cta_label'], $s['primary_cta_hash'], 
        $s['secondary_cta_label'], $s['secondary_cta_hash'], 
        $s['footer_left'], $s['footer_right']
    ]);
    echo "Inserted Slide: " . $s['headline_highlight'] . "\n";
}

echo "Done.\n";
