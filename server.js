const http = require('http');
const fs = require('fs');
const path = require('path');
const { VAKALAR, evaluateWithGemini } = require('./vaka_okulu.js');

const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Mevcut vakaları listele
  if (req.method === 'GET' && url.pathname === '/api/vakalar') {
    return sendJson(res, 200, VAKALAR);
  }

  // 2. Öğrenci cevabını Gemini Süpervizörüne değerlendirt
  if (req.method === 'POST' && url.pathname === '/api/degerlendir') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { vakaId, ogrenciCevabi } = JSON.parse(body || '{}');
        const secilenVaka = VAKALAR.find(v => v.id === Number(vakaId));

        if (!secilenVaka) {
          return sendJson(res, 400, { error: 'Geçerli bir vaka seçilmedi.' });
        }

        if (!ogrenciCevabi || ogrenciCevabi.trim().length < 15) {
          return sendJson(res, 400, {
            error: 'Lütfen değerlendirilebilmesi için daha detaylı bir klinik yanıt yazın (en az 15 karakter).'
          });
        }

        const rapor = await evaluateWithGemini(secilenVaka, ogrenciCevabi.trim());
        return sendJson(res, 200, {
          basarili: true,
          vaka: secilenVaka,
          ogrenciCevabi: ogrenciCevabi.trim(),
          rapor
        });
      } catch (error) {
        console.error('Değerlendirme hatası:', error);
        return sendJson(res, 500, {
          error: 'Süpervizyon değerlendirmesi alınırken bir hata oluştu: ' + error.message
        });
      }
    });
    return;
  }

  // 3. Statik dosyaları (public/index.html vb.) sun
  if (req.method === 'GET') {
    const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  sendJson(res, 404, { error: 'Sayfa bulunamadı.' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Aile Danışmanlığı Vaka Okulu Web Sunucusu çalışıyor: http://localhost:${PORT}`);
});
