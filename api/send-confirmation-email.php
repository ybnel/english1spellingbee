<?php
// Set Header JSON & CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Menerima data JSON yang dikirim dari sistem/bot
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['email'])) {
    echo json_encode(["status" => "error", "message" => "Invalid data or missing email"]);
    exit;
}

$to = $data['email'];
$participantName = htmlspecialchars($data['fullName'] ?? 'Peserta');
$subject = "Konfirmasi Pendaftaran - The 19th Spelling Bee Regional Competition 2026";

// Template HTML Email Konfirmasi Pendaftaran (Sesuai Wording & KV MarCom Farid)
$htmlMessage = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konfirmasi Pendaftaran Spelling Bee 2026</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:\'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner Image / Key Visual (Google Style Centered Top Banner) -->
          <tr>
            <td style="padding: 32px 32px 16px 32px; text-align: center; background-color: #ffffff;">
              <img src="https://english1spellingbee.com/Surabaya/api/assets_email/SB19th_e-Mail-Banner-01.png" alt="TERIMA KASIH! Pendaftaran Anda sedang diproses - English 1 Spelling Bee 2026" style="max-width: 100%; width: 540px; height: auto; display: block; margin: 0 auto; border: 0; border-radius: 8px;">
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px; font-size:15px; line-height:1.6; color:#334155;">
              
              <p style="margin-top:0; font-size:15px; color:#0f172a; line-height:1.6;">
                Saat ini, tim English 1 sedang melakukan proses verifikasi kelengkapan data diri dan pembayaran yang sudah terproses. Tim kami akan menghubungi Anda melalui <strong>WhatsApp</strong> dan mengirimkan <strong>bukti pembayaran</strong> jika proses verifikasi telah selesai.
              </p>

              <p style="font-size:15px; color:#0f172a; margin:16px 0; line-height:1.6;">
                Jika ada pertanyaan atau kendala, silahkan menghubungi official hotline number English 1 Surabaya di <strong>0822-2000-1000</strong>.
              </p>

              <p style="font-size:16px; font-weight:600; color:#e00078; margin:24px 0 0 0;">
                Sampai jumpa di The 19th Spelling Bee Regional Competition!
              </p>

              <hr style="border:0; border-top:1px solid #e2e8f0; margin: 28px 0;">

              <!-- Official Signature Block -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:14px; color:#475569; line-height:1.5;">
                    <p style="margin:0 0 12px 0;">Regards,</p>
                    <p style="margin:0 0 2px 0; font-weight:700; color:#0f172a; font-size:15px;">English1 Surabaya</p>
                    <p style="margin:0 0 16px 0; color:#64748b; font-size:13px;">Marketing Communication English 1 Eduka Group</p>
                    
                    <!-- English 1 Logo Image -->
                    <div style="margin: 16px 0;">
                      <img src="https://english1spellingbee.com/Surabaya/api/assets_email/english1.png" alt="English 1 Logo" style="height: 38px; width: auto; display: block; border: 0;">
                    </div>

                    <p style="margin:0 0 4px 0; font-weight:600; color:#1e293b;">English 1 Eduka Group</p>
                    <p style="margin:0 0 4px 0; color:#64748b; font-size:13px;">Jl. Pemuda 33-37 Surabaya</p>
                    <p style="margin:0 0 4px 0; color:#64748b; font-size:13px;">P: (031) 5484000 | M: +6282257922728</p>
                    <p style="margin:0;">
                      <a href="https://www.english1.co.id" target="_blank" style="color:#e00078; text-decoration:none; font-weight:500; font-size:13px;">www.english1.co.id</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px; background-color:#f8fafc; border-top:1px solid #e2e8f0; text-align:center; font-size:12px; color:#94a3b8;">
              © 2026 English 1 Eduka Group. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
';

// Fungsi Pengiriman SMTP Gmail TLS (smtp.gmail.com:587)
function sendGmailSMTP($to, $subject, $htmlContent) {
    $smtpHost = 'smtp.gmail.com';
    $smtpPort = 587;
    $username = 'info.ef@edukagroup.com';
    $password = 'cncuqdjtgnctwcuo'; // Gmail App Password 16 Digit
    $fromEmail = 'info.ef@edukagroup.com';
    $fromName = 'English 1 Surabaya';

    $socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 15);
    if (!$socket) {
        return ["status" => false, "message" => "Gagal terhubung ke SMTP host: $errstr"];
    }

    $read = function() use ($socket) {
        $response = "";
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) == " ") break;
        }
        return $response;
    };

    $send = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read(); // 220
    $send("EHLO localhost"); $read();
    $send("STARTTLS"); $read(); // 220

    $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
        $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
    }
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
        $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
    }

    if (!stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
        fclose($socket);
        return ["status" => false, "message" => "Enkripsi TLS Gagal"];
    }

    $send("EHLO localhost"); $read();
    $send("AUTH LOGIN"); $read();
    $send(base64_encode($username)); $read();
    $send(base64_encode($password)); $authResponse = $read();

    if (strpos($authResponse, '235') === false) {
        fclose($socket);
        return ["status" => false, "message" => "Autentikasi SMTP Gagal: " . trim($authResponse)];
    }

    $send("MAIL FROM: <$fromEmail>"); $read();
    $send("RCPT TO: <$to>"); $rcptResponse = $read();

    if (strpos($rcptResponse, '250') === false) {
        fclose($socket);
        return ["status" => false, "message" => "Alamat Email Penerima Ditolak: " . trim($rcptResponse)];
    }

    $send("DATA"); $read();

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $fromName <$fromEmail>\r\n";
    $headers .= "To: <$to>\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "Date: " . date("r") . "\r\n";

    $send($headers . "\r\n" . $htmlContent . "\r\n.");
    $dataResponse = $read();

    $send("QUIT");
    fclose($socket);

    if (strpos($dataResponse, '250') !== false) {
        return ["status" => true, "message" => "Email konfirmasi terkirim"];
    } else {
        return ["status" => false, "message" => "Gagal mengirim data email: " . trim($dataResponse)];
    }
}

// Eksekusi Pengiriman SMTP
$result = sendGmailSMTP($to, $subject, $htmlMessage);

if ($result['status']) {
    // Opsional: Jika dikirimkan appsScriptUrl & rowIndex, update otomatis Kolom Status Email di Google Sheets ke TRUE
    if (!empty($data['appsScriptUrl']) && !empty($data['rowIndex'])) {
        $updatePayload = json_encode([
            "action" => "updateStatus",
            "rowIndex" => $data['rowIndex'],
            "statusValue" => true
        ]);
        
        $ch = curl_init($data['appsScriptUrl']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $updatePayload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_exec($ch);
        curl_close($ch);
    }

    echo json_encode([
        "status" => "success", 
        "emailSent" => true,
        "statusValue" => true,
        "message" => "Email konfirmasi berhasil terkirim ke " . $to
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "emailSent" => false,
        "statusValue" => false,
        "message" => $result['message']
    ]);
}
