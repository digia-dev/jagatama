<?php

require_once __DIR__ . '/api_bootstrap.php';

class AdminApi {
    private $conn;
    private $table_name = 'admins';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($username, $password) {
        $stmt = $this->conn->prepare('SELECT id, username, password_hash FROM ' . $this->table_name . ' WHERE username = ? LIMIT 1');
        $stmt->bindParam(1, $username);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return ['ok' => false, 'message' => 'Invalid credentials'];
        }

        if (!password_verify($password, $row['password_hash'])) {
            return ['ok' => false, 'message' => 'Invalid credentials'];
        }

        $token = generate_token((int) $row['id'], $row['username']);
        return [
            'ok' => true,
            'admin' => [
                'id' => (int) $row['id'],
                'username' => $row['username'],
            ],
            'token' => $token,
        ];
    }

    public function create($username, $password) {
        $stmt = $this->conn->prepare('SELECT id FROM ' . $this->table_name . ' WHERE username = ? LIMIT 1');
        $stmt->bindParam(1, $username);
        $stmt->execute();
        if ($stmt->fetch()) {
            return ['ok' => false, 'message' => 'Username already exists'];
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table_name . ' (username, password_hash, created_at) VALUES (?, ?, NOW())');
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $passwordHash);

        if ($stmt->execute()) {
            $adminId = $this->conn->lastInsertId();
            return [
                'ok' => true,
                'admin' => [
                    'id' => (int) $adminId,
                    'username' => $username,
                ],
            ];
        }

        return ['ok' => false, 'message' => 'Failed to create admin user'];
    }

    public function changePassword($adminId, $oldPassword, $newPassword) {
        $stmt = $this->conn->prepare('SELECT password_hash FROM ' . $this->table_name . ' WHERE id = ? LIMIT 1');
        $stmt->bindParam(1, $adminId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row || !password_verify($oldPassword, $row['password_hash'])) {
            return ['ok' => false, 'message' => 'Invalid old password'];
        }

        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare('UPDATE ' . $this->table_name . ' SET password_hash = ? WHERE id = ?');
        $stmt->bindParam(1, $newPasswordHash);
        $stmt->bindParam(2, $adminId);

        if ($stmt->execute()) {
            return ['ok' => true, 'message' => 'Password updated successfully'];
        }

        return ['ok' => false, 'message' => 'Failed to update password'];
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
$api = new AdminApi($db);

try {
    switch ($method) {
        case 'POST':
            if ($path !== 'login' && $path !== 'register' && $path !== '') {
                http_response_code(404);
                echo json_encode(['message' => 'Not found']);
                break;
            }

            $data = json_decode(file_get_contents('php://input'), true) ?? [];

            if ($path === 'login' || $path === '') {
                $username = isset($data['username']) ? trim((string) $data['username']) : '';
                $password = isset($data['password']) ? (string) $data['password'] : '';

                if ($username === '' || $password === '') {
                    http_response_code(400);
                    echo json_encode(['message' => 'username and password are required']);
                    break;
                }

                $result = $api->login($username, $password);
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(401);
                    echo json_encode($result);
                }
            } elseif ($path === 'register') {
                $user = require_auth();
                if (!$user) {
                    break;
                }

                $username = isset($data['username']) ? trim((string) $data['username']) : '';
                $password = isset($data['password']) ? (string) $data['password'] : '';

                if ($username === '' || $password === '') {
                    http_response_code(400);
                    echo json_encode(['message' => 'username and password are required']);
                    break;
                }

                $result = $api->create($username, $password);
                if ($result['ok']) {
                    http_response_code(201);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            }
            break;

        case 'PUT':
            if ($path !== 'change-password') {
                http_response_code(404);
                echo json_encode(['message' => 'Not found']);
                break;
            }

            $user = require_auth();
            if (!$user) {
                break;
            }

            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $oldPassword = isset($data['oldPassword']) ? (string) $data['oldPassword'] : '';
            $newPassword = isset($data['newPassword']) ? (string) $data['newPassword'] : '';

            if ($oldPassword === '' || $newPassword === '') {
                http_response_code(400);
                echo json_encode(['message' => 'oldPassword and newPassword are required']);
                break;
            }

            $result = $api->changePassword($user['sub'], $oldPassword, $newPassword);
            if ($result['ok']) {
                http_response_code(200);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }
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
