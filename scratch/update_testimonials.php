<?php
require_once __DIR__ . '/../jagatama/db.php';
$database = new Database();
$db = $database->getConnection();

echo "--- Updating Testimonials from Profile Data ---\n";

$db->exec('TRUNCATE TABLE testimonials');

$testimonials = [
    [
        "name" => "Tim Kemenpora RI",
        "role" => "Pemuda Pelopor Tingkat Nasional",
        "content" => "Dedikasi PT Jagasura Agro Utama dalam mencetak petani milenial dan memberdayakan lahan kosong patut menjadi percontohan nasional. Inovasi Integrated Farming mereka sangat inspiratif.",
        "rating" => 5
    ],
    [
        "name" => "Bupati Tegal",
        "role" => "Pemerintah Daerah",
        "content" => "Sangat mengapresiasi upaya nyata Jagasura Agrotama dalam membangun ekosistem agribisnis di Tegal, mulai dari budidaya melon premium hingga peternakan terintegrasi yang mampu menyerap tenaga kerja lokal.",
        "rating" => 5
    ],
    [
        "name" => "Rektor UMT",
        "role" => "Mitra Akademis",
        "content" => "Kolaborasi sinergis antara dunia akademis dan praktisi di Jagasura Agrotama memberikan fasilitas riset dan magang yang sangat berharga bagi mahasiswa kami dalam memahami agroteknologi.",
        "rating" => 5
    ],
    [
        "name" => "Ibu Ina",
        "role" => "Direktur Jalan Tol (Mitra Strategis)",
        "content" => "Kemitraan strategis dengan Jagasura Agrotama membuktikan bahwa sektor pertanian modern mampu dikelola secara profesional dengan tata kelola manajemen dan operasional yang unggul.",
        "rating" => 5
    ],
    [
        "name" => "Baznas Cirebon",
        "role" => "Mitra Pemberdayaan",
        "content" => "Model bisnis pemberdayaan masyarakat melalui kolaborasi lahan dan Agropreneurship sangat sejalan dengan visi kami. Kualitas pengelolaan yang transparan dan berdampak sosial tinggi.",
        "rating" => 5
    ],
    [
        "name" => "Peserta Agropreneurship",
        "role" => "Petani Milenial Binaan",
        "content" => "Program magang dan pelatihan di Jagasura mengubah pandangan saya. Bertani itu memang keren dan berdaya saing. Kini saya sudah bisa mengelola greenhouse mandiri dengan standar premium.",
        "rating" => 5
    ]
];

$stmt = $db->prepare('INSERT INTO testimonials (name, role, content, rating, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())');

foreach ($testimonials as $t) {
    $stmt->execute([$t['name'], $t['role'], $t['content'], $t['rating']]);
    echo "Inserted Testimonial: " . $t['name'] . "\n";
}

echo "Done.\n";
