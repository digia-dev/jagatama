<?php
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();

echo "--- Updating Data from Company Profile PDF ---\n";

// 1. Update Hero Slides
$db->exec('TRUNCATE TABLE hero_slides');
$heroSlides = [
    [
        "image_url" => "/produk/Gambar%20Latar/Latar%202.jpg",
        "sort_order" => 0,
        "eyebrow" => "PT Jagasura Agro Utama",
        "headline_part1" => "Membangun Kemandirian ",
        "headline_highlight" => "Pangan",
        "headline_part2" => " dari Lingkup Rumah Tangga",
        "description_text" => "Terwujudnya industri pertanian ramah lingkungan, berkelanjutan, dan mandiri. Menyajikan restorasi pertanian kekinian berbasis kearifan lokal.",
        "primary_cta_label" => "Lihat Produk Kami",
        "primary_cta_hash" => "produk",
        "secondary_cta_label" => "Program Kami",
        "secondary_cta_hash" => "tentang",
        "footer_left" => "Berdiri Sejak 2020",
        "footer_right" => "Adiwerna, Tegal"
    ],
    [
        "image_url" => "/produk/Gambar%20Latar/GH.jpg",
        "sort_order" => 1,
        "eyebrow" => "Program Unggulan",
        "headline_part1" => "Kolaborasi Lahan & ",
        "headline_highlight" => "Agrowisata",
        "headline_part2" => " Edukatif",
        "description_text" => "Mengusung konsep sharing economy untuk memanfaatkan lahan terbengkalai, serta mengembangkan pariwisata perkebunan melon dan hortikultura.",
        "primary_cta_label" => "Hubungi Kami",
        "primary_cta_hash" => "kontak",
        "secondary_cta_label" => "Galeri Kami",
        "secondary_cta_hash" => "galeri",
        "footer_left" => "30+ Green House Binaan",
        "footer_right" => "Tegal & Sekitarnya"
    ],
    [
        "image_url" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png",
        "sort_order" => 2,
        "eyebrow" => "Pemberdayaan SDM",
        "headline_part1" => "Mencetak Generasi ",
        "headline_highlight" => "Petani Muda",
        "headline_part2" => " Profesional",
        "description_text" => "Personil Jagasura Agrotama memberikan pelatihan, pendampingan, dan fasilitasi magang melalui Agropreneurship Farm Class yang inovatif.",
        "primary_cta_label" => "Gabung Kemitraan",
        "primary_cta_hash" => "kontak",
        "secondary_cta_label" => "Baca Artikel",
        "secondary_cta_hash" => "artikel",
        "footer_left" => "Agropreneurship Farm Class",
        "footer_right" => "Profesional & Inovatif"
    ]
];

$stmtH = $db->prepare('INSERT INTO hero_slides (image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
foreach ($heroSlides as $s) {
    $stmtH->execute([$s['image_url'], $s['sort_order'], $s['eyebrow'], $s['headline_part1'], $s['headline_highlight'], $s['headline_part2'], $s['description_text'], $s['primary_cta_label'], $s['primary_cta_hash'], $s['secondary_cta_label'], $s['secondary_cta_hash'], $s['footer_left'], $s['footer_right']]);
}
echo "Hero Slides updated.\n";

// 2. Update Product (Melon Premium variants and prices)
$melonSlug = 'melon-premium';
$checkP = $db->prepare('SELECT id FROM products WHERE slug = ?');
$checkP->execute([$melonSlug]);
$product = $checkP->fetch();

if ($product) {
    $pid = $product['id'];
    $db->prepare('UPDATE products SET title = ?, price = ?, price_note = ? WHERE id = ?')
       ->execute(['Melon Premium Jagasura', 28000, 'per kg (estimasi rata-rata)', $pid]);
       
    // Replace variants
    $db->prepare('DELETE FROM product_variants WHERE product_id = ?')->execute([$pid]);
    $variants = [
        ['label' => 'Melon Golden', 'price' => 28000],
        ['label' => 'Melon Hamiqua', 'price' => 30000],
        ['label' => 'Melon Inthanon', 'price' => 30000],
        ['label' => 'Melon Sweet Net 9', 'price' => 31000],
        ['label' => 'Melon Sweet Hami', 'price' => 30000],
        ['label' => 'Melon Sweet Net 8', 'price' => 31000],
        ['label' => 'Melon Snow White', 'price' => 30000],
        ['label' => 'Melon Sweet Lavender', 'price' => 30000],
        ['label' => 'Melon Dalmetian', 'price' => 30000],
    ];
    $stmtV = $db->prepare('INSERT INTO product_variants (product_id, label, price, sort_order) VALUES (?, ?, ?, ?)');
    foreach ($variants as $i => $v) {
        $stmtV->execute([$pid, $v['label'], $v['price'], $i]);
    }
    echo "Products updated (Melon Variants).\n";
}

// 3. Insert new Articles
$articles = [
    [
        "slug" => "sejarah-dan-komitmen-pt-jagasura-agro-utama",
        "title" => "Sejarah dan Komitmen PT Jagasura Agro Utama",
        "excerpt" => "Berawal dari upaya pemanfaatan lahan kosong di sekitar tempat tinggal pada tahun 2020, Jagasura Agrotama terus berkembang dan membangun sistem pertanian inklusif.",
        "category" => "Company News",
        "date" => "01 May 2026",
        "image" => "/produk/Gambar%20Latar/Latar%202.jpg",
        "content" => [
            "Berawal dari upaya pemanfaatan lahan kosong di sekitar tempat tinggal, Jagasura Agrotama didirikan pada tahun 2020. Berhasil menjuarai kompetisi Pemuda Pelopor di bidang sumber daya alam, Petani Milenial dan memperoleh sejumlah penghargaan lainnya.",
            "Jagasura Agrotama terus berkembang hingga kini telah memiliki kerjasama dengan lebih dari 30 Green House yang tersebar di wilayah Tegal - Jawa Tengah, serta sejumlah daerah di Jawa Timur dan Jawa Barat.",
            "Kami berkomitmen membangun sistem pertanian yang inklusif dengan melibatkan masyarakat dan petani lokal untuk menciptakan ketahanan pangan yang mandiri. Upaya ini kami bangun dengan melibatkan banyak pihak termasuk di antaranya petani, pemasok, masyarakat, pemerintah daerah dan dinas terkait.",
            "Harapan kami adalah terciptanya sinergi dalam peningkatan ekonomi masyarakat dari sektor pertanian. Kami menjunjung tinggi nilai kualitas, inovasi, kolaborasi, dan keberlanjutan."
        ]
    ],
    [
        "slug" => "program-unggulan-jagasura-kolaborasi-lahan-dan-agrowisata",
        "title" => "Program Unggulan Jagasura: Kolaborasi Lahan, Pelatihan, & Agrowisata",
        "excerpt" => "Jagasura Agrotama mengusung konsep sharing economy untuk memanfaatkan lahan terbengkalai, memberikan pelatihan SDM, dan membangun agrowisata edukatif.",
        "category" => "Programs",
        "date" => "01 May 2026",
        "image" => "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png",
        "content" => [
            "Program pertama kami adalah Kolaborasi Lahan. Jagasura Agrotama mengusung konsep sharing economy yang bertujuan untuk mempertemukan para pemilik lahan yang terbengkalai, untuk dapat dimanfaatkan sebagai lahan pertanian melalui kerjasama dengan PT JAGO.",
            "Program kedua adalah Pelatihan Petani. Personil Jagasura Agrotama merupakan praktisi profesional di bidang pertanian, sehingga mampu memberikan pelatihan dan pendampingan usaha di bidang pertanian kepada generasi muda.",
            "Program ketiga adalah Agrowisata. Dalam jangka waktu yang lebih panjang, diharapkan Jagasura Agrotama dapat membentuk sebuah agrowisata dengan konsep edukasi dan pariwisata perkebunan melon dan sejumlah komoditas lainnya.",
            "Jagasura Agrotama menjadi pengelola lumbung bahan baku produksi untuk disalurkan ke sejumlah mitra petani dan pemilik lahan, sehingga para petani dapat memperoleh biaya minimum secara kolektif."
        ]
    ]
];

$stmtA = $db->prepare('INSERT INTO articles (slug, title, excerpt, category, date_display, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())');
$stmtP = $db->prepare('INSERT INTO article_paragraphs (article_id, body, sort_order) VALUES (?, ?, ?)');

foreach ($articles as $a) {
    $checkA = $db->prepare('SELECT id FROM articles WHERE slug = ?');
    $checkA->execute([$a['slug']]);
    if ($checkA->fetch()) {
        echo "Article " . $a['slug'] . " already exists. Skip.\n";
        continue;
    }
    $stmtA->execute([$a['slug'], $a['title'], $a['excerpt'], $a['category'], $a['date'], $a['image']]);
    $newId = $db->lastInsertId();
    foreach ($a['content'] as $i => $para) {
        $stmtP->execute([$newId, $para, $i]);
    }
    echo "Article inserted: " . $a['title'] . "\n";
}

echo "Done.\n";
