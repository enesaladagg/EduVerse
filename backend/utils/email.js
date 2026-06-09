const https = require('https');

// Brevo HTTP API — SMTP yerine HTTPS (port 443) kullanır, Render'da kesinlikle çalışır
async function sendBrevoEmail({ to, toName, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY env eksik');

  const body = JSON.stringify({
    sender: { name: 'EduVerse', email: process.env.SMTP_FROM || 'aladag.ahmet.enes27@gmail.com' },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent: html,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Brevo API hata ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EduVerse</title>
</head>
<body style="margin:0;padding:0;background:#0e1628;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e1628;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#131d35;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#00d4aa,#7c6cf0);padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-block;line-height:40px;text-align:center;font-size:22px;">🎓</div>
                <span style="color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;vertical-align:middle;">EduVerse</span>
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="color:#475569;font-size:13px;margin:0;">Bu e-posta EduVerse tarafından otomatik gönderilmiştir. Lütfen yanıtlamayın.</p>
              <p style="color:#334155;font-size:12px;margin:8px 0 0;">© ${new Date().getFullYear()} EduVerse. Tüm hakları saklıdır.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const templates = {
  verifyEmail: ({ name, code }) => baseTemplate(`
    <h1 style="color:#f1f5f9;font-size:24px;font-weight:800;margin:0 0 8px;">Merhaba, ${name}! 👋</h1>
    <p style="color:#94a3b8;font-size:16px;margin:0 0 32px;line-height:1.6;">
      EduVerse'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki doğrulama kodunu kullanın.
    </p>
    <div style="background:rgba(0,212,170,0.08);border:2px solid rgba(0,212,170,0.25);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
      <p style="color:#64748b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Doğrulama Kodunuz</p>
      <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#00d4aa;font-family:monospace;">${code}</div>
      <p style="color:#64748b;font-size:13px;margin:16px 0 0;">Bu kod <strong style="color:#94a3b8;">10 dakika</strong> geçerlidir.</p>
    </div>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.6;">
      Eğer bu hesabı siz oluşturmadıysanız bu e-postayı görmezden gelebilirsiniz.
    </p>
  `),

  welcome: ({ name, provider }) => baseTemplate(`
    <h1 style="color:#f1f5f9;font-size:24px;font-weight:800;margin:0 0 8px;">Hoş geldiniz, ${name}! 🎉</h1>
    <p style="color:#94a3b8;font-size:16px;margin:0 0 32px;line-height:1.6;">
      ${provider} hesabınızla EduVerse'e başarıyla kaydoldunuz. Öğrenme yolculuğunuz başlıyor!
    </p>
    <div style="background:rgba(124,108,240,0.08);border:1px solid rgba(124,108,240,0.2);border-radius:16px;padding:24px;margin-bottom:32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ['🎓', 'Binlerce Kurs', 'Alanında uzman eğitmenlerden öğrenin'],
          ['🏆', 'Sertifika Kazanın', 'Tamamladığınız kurslar için dijital sertifika alın'],
          ['⚡', 'Canlı Dersler', 'Eğitmenlerle gerçek zamanlı etkileşime girin'],
        ].map(([icon, title, desc]) => `
          <tr>
            <td width="48" valign="top" style="padding-bottom:16px;">
              <div style="width:40px;height:40px;background:rgba(124,108,240,0.15);border-radius:10px;text-align:center;line-height:40px;font-size:20px;">${icon}</div>
            </td>
            <td style="padding-left:16px;padding-bottom:16px;">
              <p style="color:#e2e8f0;font-size:15px;font-weight:700;margin:0 0 4px;">${title}</p>
              <p style="color:#64748b;font-size:13px;margin:0;">${desc}</p>
            </td>
          </tr>
        `).join('')}
      </table>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display:inline-block;background:linear-gradient(135deg,#7c6cf0,#6c5ce7);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:12px;letter-spacing:0.3px;">
        Öğrenmeye Başla →
      </a>
    </div>
  `),

  resetPassword: ({ name, resetUrl }) => baseTemplate(`
    <h1 style="color:#f1f5f9;font-size:24px;font-weight:800;margin:0 0 8px;">Şifre Sıfırlama 🔐</h1>
    <p style="color:#94a3b8;font-size:16px;margin:0 0 32px;line-height:1.6;">
      Merhaba <strong style="color:#e2e8f0;">${name}</strong>, EduVerse hesabınız için şifre sıfırlama talebinde bulundunuz.
    </p>
    <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;">
      <p style="color:#94a3b8;font-size:15px;margin:0 0 20px;line-height:1.6;">
        Aşağıdaki butona tıklayarak yeni şifrenizi oluşturabilirsiniz.<br/>
        <strong style="color:#fca5a5;">Bu bağlantı 1 saat geçerlidir.</strong>
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:12px;">
        Şifremi Sıfırla
      </a>
    </div>
    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="color:#64748b;font-size:13px;margin:0 0 8px;">Bağlantı çalışmıyorsa aşağıdaki URL'yi tarayıcınıza yapıştırın:</p>
      <p style="color:#475569;font-size:12px;word-break:break-all;margin:0;">${resetUrl}</p>
    </div>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.6;">
      Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.
    </p>
  `),
};

const sendEmail = async ({ email, subject, template, data, message }) => {
  const html = template && templates[template]
    ? templates[template](data || {})
    : (message ? `<p>${message}</p>` : undefined);

  await sendBrevoEmail({
    to: email,
    toName: data?.name,
    subject,
    html,
  });
};

module.exports = sendEmail;
