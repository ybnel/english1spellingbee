<?php
// Set Header JSON & CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Menerima data JSON yang dikirim dari app.js
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['email'])) {
  echo json_encode(["status" => "error", "message" => "Invalid data or missing email"]);
  exit;
}

$to = $data['email'];
$subject = "Thanks for filling out: Online Registration Form Kolektif Sekolah Spelling Bee Regional Competition 2026";

// Desain Template HTML Response Receipt (Google Forms Style)
$htmlMessage = '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#e8f0fe; font-family:\'Roboto\',Arial,sans-serif; color:#202124;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e8f0fe; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.12);">
          <tr><td style="background-color:#e00078; height:10px;"></td></tr>
          <tr>
            <td style="padding:24px 32px 16px 32px; border-bottom:1px solid #dadce0;">
              <h1 style="font-size:20px; font-weight:500; color:#202124; margin:0 0 8px 0;">
                Thanks for filling out: <span style="color:#e00078; font-weight:700;">Online Registration Form Kolektif Sekolah Spelling Bee Regional Competition 2026</span>
              </h1>
              <p style="font-size:14px; color:#5f6368; margin:0;">Here\'s what was received.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <h3 style="font-size:16px; font-weight:700; color:#e00078; margin:0 0 20px 0; padding-bottom:8px; border-bottom:2px solid #e00078;">
                Ringkasan Jawaban Anda / Your Response
              </h3>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Nama Lengkap Peserta / Participant Full Name</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['fullName'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Tempat & Tanggal Lahir / Place and Date of Birth</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['birthDetails'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Berkewarganegaraan Indonesia / Indonesian Citizen</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['isIndonesianCitizen'] ?? 'Ya') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Asal Sekolah / School Name</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['schoolName'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Kelas / Grade</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['grade'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Kategori Group Kompetisi</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['groupCategory'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Nama Orang Tua / Parent\'s Name</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['parentName'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Nomor telpon orang tua yang tersambung dengan WA / Parent\'s phone number connected with WA</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['parentPhone'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Alamat Lengkap Peserta / Participant\'s Full Address</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['address'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Email Orang Tua / Parent\'s Email</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['email'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Sumber Informasi / Info Source</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['infoSource'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Apakah Siswa English 1 / Is English 1 Student</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['isEnglish1Student'] ?? '-') . '</div>
              </div>' . (!empty($data['wasEnglish1Student']) && $data['wasEnglish1Student'] !== '-' ? '
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Pernah Jadi Siswa English 1 / Has Ever Been English 1 Student</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['wasEnglish1Student']) . '</div>
              </div>' : '') . '
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Nama Guru Pendamping / Accompanying Teacher\'s Name</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['teacherName'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">No Telp Guru Pendamping (WA) / Teacher\'s WhatsApp Number</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['teacherPhone'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Pernyataan Kebenaran Data / Data Verification Statement</div>
                <div style="font-size:14px; color:#16a34a; background:#f0fdf4; padding:10px 14px; border-radius:6px; border:1px solid #bbf7d0;">✓ ' . htmlspecialchars($data['dataAgreement'] ?? 'Saya setuju & data sudah benar') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Kategori & Biaya Pendaftaran / Registration Category & Fee</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['branchCategory'] ?? '-') . '</div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px; font-weight:700; color:#202124; margin-bottom:4px;">Bukti Pembayaran / Uploaded Payment Receipt</div>
                <div style="font-size:14px; color:#3c4043; background:#f8f9fa; padding:10px 14px; border-radius:6px; border:1px solid #dadce0;">' . htmlspecialchars($data['paymentReceipt'] ?? '-') . '</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; background-color:#f8f9fa; border-top:1px solid #dadce0; text-align:center; font-size:12px; color:#70757a;">
              Email ini dikirim secara otomatis oleh <strong>English 1 Lombok</strong>.<br>
              Pertanyaan? Hubungi WhatsApp English 1 Lombok.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
';

// Fungsi Pengiriman SMTP Otomatis dengan Sertifikat TLS (smtp.gmail.com:587)
function sendGmailSMTP($to, $subject, $htmlContent)
{
  $smtpHost = 'smtp.gmail.com';
  $smtpPort = 587;
  $username = 'info.ef@edukagroup.com';
  $password = 'cncuqdjtgnctwcuo'; // Gmail App Password 16 Digit
  $fromEmail = 'info.ef@edukagroup.com';
  $fromName = 'English 1 Lombok';

  $socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 15);
  if (!$socket) {
    return ["status" => false, "message" => "Gagal terhubung ke SMTP host: $errstr"];
  }

  $read = function () use ($socket) {
    $response = "";
    while ($str = fgets($socket, 515)) {
      $response .= $str;
      if (substr($str, 3, 1) == " ")
        break;
    }
    return $response;
  };

  $send = function ($cmd) use ($socket) {
    fputs($socket, $cmd . "\r\n");
  };

  $read(); // 220
  $send("EHLO localhost");
  $read();
  $send("STARTTLS");
  $read(); // 220

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

  $send("EHLO localhost");
  $read();
  $send("AUTH LOGIN");
  $read();
  $send(base64_encode($username));
  $read();
  $send(base64_encode($password));
  $authResponse = $read();

  if (strpos($authResponse, '235') === false) {
    fclose($socket);
    return ["status" => false, "message" => "Autentikasi SMTP Gagal: " . trim($authResponse)];
  }

  $send("MAIL FROM: <$fromEmail>");
  $read();
  $send("RCPT TO: <$to>");
  $rcptResponse = $read();

  if (strpos($rcptResponse, '250') === false) {
    fclose($socket);
    return ["status" => false, "message" => "Alamat Email Penerima Ditolak: " . trim($rcptResponse)];
  }

  $send("DATA");
  $read();

  $headers = "MIME-Version: 1.0\r\n";
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
    return ["status" => true, "message" => "Email terkirim"];
  } else {
    return ["status" => false, "message" => "Gagal mengirim data email: " . trim($dataResponse)];
  }
}

// Jalankan Pengiriman SMTP
$result = sendGmailSMTP($to, $subject, $htmlMessage);

if ($result['status']) {
  echo json_encode(["status" => "success", "message" => "Email response receipt berhasil terkirim ke " . $to]);
} else {
  echo json_encode(["status" => "error", "message" => $result['message']]);
}
