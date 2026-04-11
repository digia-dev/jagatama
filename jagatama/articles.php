<?php

require_once __DIR__ . '/api_bootstrap.php';

function articles_list_summaries($db) {
    $stmt = $db->query('SELECT id, slug, title, excerpt, category, date_display, image_url, created_at, updated_at FROM articles ORDER BY id DESC');
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function articles_read_full($db, $whereSql, $param) {
    $stmt = $db->prepare('SELECT id, slug, title, excerpt, category, date_display, image_url, created_at, updated_at FROM articles WHERE ' . $whereSql . ' LIMIT 1');
    $stmt->execute($param);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return null;
    }
    $aid = (int) $row['id'];

    $p = $db->prepare('SELECT id, body, sort_order FROM article_paragraphs WHERE article_id = ? ORDER BY sort_order ASC, id ASC');
    $p->execute([$aid]);
    $row['paragraphs'] = $p->fetchAll(PDO::FETCH_ASSOC);

    $e = $db->prepare('SELECT id, image_url, caption, sort_order FROM article_extra_images WHERE article_id = ? ORDER BY sort_order ASC, id ASC');
    $e->execute([$aid]);
    $row['extra_images'] = $e->fetchAll(PDO::FETCH_ASSOC);

    return $row;
}

function articles_replace_paragraphs($db, $articleId, $paragraphs) {
    $del = $db->prepare('DELETE FROM article_paragraphs WHERE article_id = ?');
    $del->execute([$articleId]);
    if (!is_array($paragraphs)) {
        return;
    }
    $ins = $db->prepare('INSERT INTO article_paragraphs (article_id, body, sort_order) VALUES (?, ?, ?)');
    $order = 0;
    foreach ($paragraphs as $para) {
        if (is_object($para)) {
            $body = isset($para->body) ? (string) $para->body : '';
        } else {
            $body = is_string($para) ? $para : (isset($para['body']) ? (string) $para['body'] : '');
        }
        if (trim($body) === '') {
            continue;
        }
        $ins->execute([$articleId, $body, $order]);
        $order++;
    }
}

function articles_replace_extra_images($db, $articleId, $extras) {
    $del = $db->prepare('DELETE FROM article_extra_images WHERE article_id = ?');
    $del->execute([$articleId]);
    if (!is_array($extras)) {
        return;
    }
    $ins = $db->prepare('INSERT INTO article_extra_images (article_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)');
    $order = 0;
    foreach ($extras as $ex) {
        if (is_object($ex)) {
            $url = isset($ex->image_url) ? (string) $ex->image_url : '';
            $cap = isset($ex->caption) ? (string) $ex->caption : '';
        } else {
            $url = isset($ex['image_url']) ? (string) $ex['image_url'] : '';
            $cap = isset($ex['caption']) ? (string) $ex['caption'] : '';
        }
        if (trim($url) === '') {
            continue;
        }
        $ins->execute([$articleId, $url, $cap, $order]);
        $order++;
    }
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = api_get_path();

try {
    switch ($method) {
        case 'GET':
            if ($path && preg_match('/^slug\/([^\/]+)$/', $path, $m)) {
                $slug = rawurldecode($m[1]);
                $row = articles_read_full($db, 'slug = ?', [$slug]);
                if ($row) {
                    http_response_code(200);
                    echo json_encode($row);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Article not found.']);
                }
            } elseif ($path && preg_match('/^(\d+)$/', $path, $m)) {
                $row = articles_read_full($db, 'id = ?', [(int) $m[1]]);
                if ($row) {
                    http_response_code(200);
                    echo json_encode($row);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Article not found.']);
                }
            } else {
                $rows = articles_list_summaries($db);
                http_response_code(200);
                echo json_encode($rows);
            }
            break;

        case 'POST':
            $user = require_auth();
            if (!$user) {
                break;
            }
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->slug) || empty($data->title)) {
                http_response_code(400);
                echo json_encode(['message' => 'slug and title are required']);
                break;
            }
            $slug = trim((string) $data->slug);
            $title = trim((string) $data->title);
            $excerpt = isset($data->excerpt) ? (string) $data->excerpt : '';
            $category = isset($data->category) ? (string) $data->category : '';
            $date_display = isset($data->date_display) ? (string) $data->date_display : '';
            $image_url = isset($data->image_url) ? (string) $data->image_url : '';
            $paragraphs = isset($data->paragraphs) ? $data->paragraphs : [];
            $extra_images = isset($data->extra_images) ? $data->extra_images : [];

            $stmt = $db->prepare('INSERT INTO articles (slug, title, excerpt, category, date_display, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())');
            $stmt->execute([$slug, $title, $excerpt, $category, $date_display, $image_url]);
            $newId = (int) $db->lastInsertId();
            articles_replace_paragraphs($db, $newId, $paragraphs);
            articles_replace_extra_images($db, $newId, $extra_images);

            http_response_code(201);
            echo json_encode(['message' => 'Article created.', 'id' => $newId]);
            break;

        case 'PUT':
            $user = require_auth();
            if (!$user) {
                break;
            }
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $id = (int) $m[1];
            $data = json_decode(file_get_contents('php://input'));
            if (!$data || empty($data->slug) || empty($data->title)) {
                http_response_code(400);
                echo json_encode(['message' => 'slug and title are required']);
                break;
            }
            $slug = trim((string) $data->slug);
            $title = trim((string) $data->title);
            $excerpt = isset($data->excerpt) ? (string) $data->excerpt : '';
            $category = isset($data->category) ? (string) $data->category : '';
            $date_display = isset($data->date_display) ? (string) $data->date_display : '';
            $image_url = isset($data->image_url) ? (string) $data->image_url : '';
            $paragraphs = isset($data->paragraphs) ? $data->paragraphs : [];
            $extra_images = isset($data->extra_images) ? $data->extra_images : [];

            $stmt = $db->prepare('UPDATE articles SET slug = ?, title = ?, excerpt = ?, category = ?, date_display = ?, image_url = ?, updated_at = NOW() WHERE id = ?');
            $stmt->execute([$slug, $title, $excerpt, $category, $date_display, $image_url, $id]);

            articles_replace_paragraphs($db, $id, $paragraphs);
            articles_replace_extra_images($db, $id, $extra_images);

            http_response_code(200);
            echo json_encode(['message' => 'Article updated successfully.']);
            break;

        case 'DELETE':
            $user = require_auth();
            if (!$user) {
                break;
            }
            if (!$path || !preg_match('/^(\d+)$/', $path, $m)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID']);
                break;
            }
            $id = (int) $m[1];
            $stmt = $db->prepare('DELETE FROM articles WHERE id = ?');
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(['message' => 'Article deleted successfully.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
}
