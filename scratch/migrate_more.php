<?php
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();

echo "--- Altering products table ---\n";
try {
    $db->exec('ALTER TABLE products ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER id');
    echo "Column slug added to products table.\n";
} catch (PDOException $e) {
    echo "Column slug already exists or error: " . $e->getMessage() . "\n";
}

try {
    $db->exec('ALTER TABLE products ADD COLUMN price_on_request TINYINT(1) NOT NULL DEFAULT 0 AFTER price_note');
    echo "Column price_on_request added to products table.\n";
} catch (PDOException $e) {
    echo "Column price_on_request already exists or error: " . $e->getMessage() . "\n";
}

$products = [
    [
        "slug" => "melon-premium",
        "title" => "Melon Premium",
        "category" => "Buah",
        "description" => "Selain kaya akan nutrisi dan manfaat, melon kami juga menjadi potensi bisnis yang menjanjikan. Dibudidayakan dalam greenhouse berteknologi tinggi dengan kualitas premium.",
        "image" => "/produk/Melon%20Premium/IMG_20260419_234019%20(1).png",
        "price" => 85000,
        "price_note" => "per kg",
        "price_on_request" => 0,
        "items" => ["Fujisawa (Jepang)", "Inthanon (Belanda)", "Sweet Net (Thailand)", "Chamoe (Korea)", "Rangipo"]
    ],
    [
        "slug" => "buah-tropis",
        "title" => "Buah Tropis",
        "category" => "Buah",
        "description" => "Komoditas buah tropis unggulan dengan permintaan pasar tinggi dari perkebunan terpadu kami yang terintegrasi.",
        "image" => "/produk/Tanaman%20Buah/1776621428934.jpg.jpeg",
        "price" => 45000,
        "price_note" => "per kg",
        "price_on_request" => 0,
        "items" => ["Alpukat", "Durian", "Jambu Air", "Jambu Kristal", "Jeruk Lemon", "Mangga", "Markisa", "Pepaya"]
    ],
    [
        "slug" => "hortikultura",
        "title" => "Hortikultura",
        "category" => "Sayuran",
        "description" => "Sektor hortikultura mempunyai nilai ekonomis dan potensi agribisnis yang sangat tinggi.",
        "image" => "/produk/Holtikultura/Bayam%20Jepang.jpeg",
        "price" => 25000,
        "price_note" => "per kg",
        "price_on_request" => 0,
        "items" => ["Cabai", "Kembang Kol", "Kentang", "Lettuce", "Tomat", "Terong", "Timun"]
    ],
    [
        "slug" => "ubi-unggulan",
        "title" => "Ubi Unggulan",
        "category" => "Umbi-umbian",
        "description" => "Bisnis pertanian umbi-umbian adalah salah satu bisnis yang tidak pernah mati. Komoditas lokal dengan pangsa pasar internasional yang terus berkembang.",
        "image" => "/produk/Holtikultura/Ubi%20Madu.jpg",
        "price" => 18000,
        "price_note" => "per kg",
        "price_on_request" => 0,
        "items" => ["Ubi Madu", "Ubi Ungu (Murasaki)", "Ubi Ace Putih"]
    ],
    [
        "slug" => "ternak-rph",
        "title" => "Usaha Ternak & RPH",
        "category" => "Peternakan",
        "description" => "Ekosistem bisnis ternak kambing terintegrasi. Tegal terkenal dengan kuliner Sate Kambing — kebutuhan daging kambing mencapai 900 ekor per hari. RPH berstandar Kementan RI.",
        "image" => "/produk/Gambar%20Latar/3.jpg",
        "price" => 120000,
        "price_note" => "per kg",
        "price_on_request" => 1,
        "items" => ["Kambing Pedaging", "Susu Kambing Perah", "Karkas Berkualitas", "Cold Storage Terintegrasi", "RPH Standar Kementan RI"]
    ],
    [
        "slug" => "perikanan-terpadu",
        "title" => "Perikanan Terpadu",
        "category" => "Perikanan",
        "description" => "Konsep Zero Waste: limbah pertanian → pakan maggot → pakan lele. Integrated Farming yang ramah lingkungan dan efisien.",
        "image" => "/produk/Gambar%20Latar/GH.jpg",
        "price" => 30000,
        "price_note" => "per kg",
        "price_on_request" => 1,
        "items" => ["Budidaya Lele Terintegrasi", "Maggot Segar", "Maggot Sangrai", "Pakan Ternak Berbasis Maggot"]
    ],
    [
        "slug" => "pupuk-organik",
        "title" => "Pupuk Organik & APH",
        "category" => "Agriinput",
        "description" => "Pupuk organik padat dan cair berbahan baku limbah ternak dan budidaya. Mendukung pertanian berkelanjutan — Back to Nature.",
        "image" => "/produk/Gambar%20Latar/5.jpg",
        "price" => 15000,
        "price_note" => "per kg",
        "price_on_request" => 1,
        "items" => ["Pupuk Organik Padat", "Pupuk Organik Cair", "PGPR (Plant Growth Promoting Rhizobacteria)", "Agensia Pengendali Hayati (APH)"]
    ],
    [
        "slug" => "produk-olahan",
        "title" => "Produk Olahan & Kerajinan",
        "category" => "Produk Olahan",
        "description" => "Hasil panen diolah menjadi produk turunan bernilai ekonomi tinggi. Aneka kerajinan berbahan dasar bambu bernilai estetika tinggi.",
        "image" => "/produk/Gambar%20Latar/2.jpg",
        "price" => 25000,
        "price_note" => "per produk",
        "price_on_request" => 0,
        "items" => ["Olahan Bawang Merah", "Olahan Ubi", "Mug Bambu", "Tumbler Bambu", "Lonceng Angin", "Lampu Taman Bambu", "Gazebo Bambu", "Greenhouse Bambu"]
    ],
    [
        "slug" => "pelatihan",
        "title" => "Pelatihan & Agropreneurship",
        "category" => "Edukasi",
        "description" => "Agropreneurship Farm Class yang rekreatif, inovatif, dan inspiratif. Program magang, beasiswa, dan penempatan usaha pertanian bagi generasi muda.",
        "image" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png",
        "price" => 500000,
        "price_note" => "per program",
        "price_on_request" => 0,
        "items" => ["Pelatihan Pertanian Swadaya & Berbayar", "Tempat Magang & Praktek Kerja Langsung", "Beasiswa Petani Muda", "Program Penempatan Usaha Pertanian", "Kemitraan & Kerjasama"]
    ],
];

echo "\n--- Migrating Products ---\n";
foreach ($products as $order => $p) {
    $check = $db->prepare('SELECT id FROM products WHERE slug = ?');
    $check->execute([$p['slug']]);
    if ($check->fetch()) {
        echo "Product " . $p['slug'] . " exists. Skip.\n";
        continue;
    }
    $stmt = $db->prepare('INSERT INTO products (slug, title, category, description, image_url, price, price_note, price_on_request, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([$p['slug'], $p['title'], $p['category'], $p['description'], $p['image'], $p['price'], $p['price_note'], $p['price_on_request'], $order]);
    $newId = $db->lastInsertId();
    
    // insert variants/items
    $insV = $db->prepare('INSERT INTO product_variants (product_id, label, sort_order) VALUES (?, ?, ?)');
    foreach ($p['items'] as $i => $item) {
        $insV->execute([$newId, $item, $i]);
    }
    
    echo "Inserted Product: " . $p['title'] . "\n";
}

$gallery = [
  [ "src" => "/produk/Gambar%20Latar/Latar%202.jpg", "alt" => "Greenhouse Jagasura Agrotama" ],
  [ "src" => "/produk/Gambar%20Latar/GH.jpg", "alt" => "Interior Greenhouse" ],
  [ "src" => "/produk/Melon%20Premium/IMG_20260419_234019%20(1).png", "alt" => "Melon Premium Harvest" ],
  [ "src" => "/produk/Melon%20Premium/IMG_20260419_234135%20(1).png", "alt" => "Melon Premium Fujisawa" ],
  [ "src" => "/produk/Melon%20Premium/IMG_20260419_234202%20(1).png", "alt" => "Melon Premium Inthanon" ],
  [ "src" => "/produk/Melon%20Premium/IMG_20260419_234230%20(1).png", "alt" => "Sortasi Melon Premium" ],
  [ "src" => "/produk/Melon%20Premium/IMG_20260419_234255%20(1).png", "alt" => "Melon Premium Siap Distribusi" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png", "alt" => "Program Pelatihan Petani Muda" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bupati%20Tegal.png", "alt" => "Kunjungan Bupati Tegal" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Rektor%20UMT.jpg", "alt" => "Sinergi dengan Rektor UMT" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Kyai.png", "alt" => "Dukungan Tokoh Agama" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Baznaz%20Cirebon.png", "alt" => "Sinergi Baznaz Cirebon" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Halal%20Bi%20Halal.png", "alt" => "Halal Bi Halal Komunitas" ],
  [ "src" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bu%20Ina.png", "alt" => "Kunjungan Mitra Strategis" ],
  [ "src" => "/produk/Holtikultura/Ubi%20Madu.jpg", "alt" => "Ubi Madu Premium" ],
  [ "src" => "/produk/Holtikultura/Bayam%20Jepang.jpeg", "alt" => "Bayam Jepang Hortikultura" ],
  [ "src" => "/produk/Tanaman%20Buah/1776621791847.jpg.jpeg", "alt" => "Buah Tropis Unggulan" ],
];

echo "\n--- Migrating Gallery ---\n";
foreach ($gallery as $order => $g) {
    $check = $db->prepare('SELECT id FROM gallery_items WHERE image_url = ?');
    $check->execute([$g['src']]);
    if ($check->fetch()) {
        echo "Gallery item " . $g['src'] . " exists. Skip.\n";
        continue;
    }
    // Set is_tall roughly if it's portrait. Default to 0.
    $is_tall = 0;
    
    $stmt = $db->prepare('INSERT INTO gallery_items (image_url, alt_text, sort_order, is_tall, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$g['src'], $g['alt'], $order + 10, $is_tall]);
    echo "Inserted Gallery Item: " . $g['alt'] . "\n";
}
