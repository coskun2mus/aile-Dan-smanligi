// Aile Danışmanlığı Vaka Okulu - Gemini API Entegrasyonu
// Çalıştırma: node --env-file=.env vaka_okulu.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Yerel çalışmada .env dosyası varsa otomatik yükle (Render.com'da ortam değişkenlerinden gelir)
const envPath = path.join(__dirname, '.env');
if (!process.env.GEMINI_API_KEY && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || '').replace(/^['"]|['"]$/g, '').trim();
    }
  });
}

// API Anahtarını al
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("HATA: GEMINI_API_KEY bulunamadı! Lütfen .env dosyasını veya ortam değişkenlerini kontrol edin.");
  process.exit(1);
}

// 3 Adet Zengin Aile Danışmanlığı Vakası
const VAKALAR = [
  {
    id: 1,
    baslik: "Vaka 1: Geniş Aile Müdahalesi & Sınır Aşımı (Yapısal/Bowen Yaklaşımı)",
    profil: "Aylin (29, Mimar) & Kerem (31, Bankacı) - 2 yıllık evli çift.",
    hikaye: `
Aylin ve Kerem 2 yıldır evlidir. Kerem'in annesi Nermin Hanım, evin bir anahtarına sahiptir ve haftada birkaç gün haber vermeden eve gelip 'yardım etmek' amacıyla temizlik yapmakta, buzdolabını düzenlemekte ve Aylin'in yemek yapma biçimini eleştirmektedir. 
Aylin bu durumdan son derece rahatsızdır ve Kerem'e 'Ya annenle sınır çizersin ya da bu evlilik biter' diyerek ültimatom vermiştir. 
Kerem ise 'Annem kötü niyetli değil, sadece bize destek olmak istiyor, onu kırarsam çok üzülür' diyerek arada sıkışmış ve çaresiz hissetmektedir. Seansa yoğun bir gerginlik ve karşılıklı suçlama ile gelirler.
    `,
    soru: `
ÖĞRENCİ DANIŞMAN GÖREVİ:
1. Bu seansta Kerem'i annesine karşı suçlu hissettirmeden ve Aylin'in de öfkesini değersizleştirmeden nasıl bir "Nötralite / Taraf Tutmama" duruşu sergilersiniz?
2. Yapısal Aile Terapisi perspektifinden bakarak "Eş Alt Sistemi" (Aylin-Kerem) ile "Geniş Aile" arasındaki sınırları netleştirmek için çifte seansta hangi somut 'Döngüsel Soruyu' (Circular Question) veya müdahaleyi yöneltirsiniz?
    `
  },
  {
    id: 2,
    baslik: "Vaka 2: Ebeveyn Çatışması & 'Semptom Taşıyıcısı' Ergen (Sistemik Yaklaşım)",
    profil: "Berna (42), Murat (45) ve kızları Melis (15).",
    hikaye: `
Berna ve Murat son 3 yıldır ciddi evlilik problemleri yaşamakta, sürekli boşanmanın eşiğine gelmektedir. Ancak son 4 aydır 15 yaşındaki kızları Melis'in okul başarısı aniden düşmüş, içine kapanmış ve kollarında yüzeysel kesikler (kendine zarar verme davranışı) tespit edilmiştir.
Anne ve baba telaşla seansa gelerek: 'Bizim evliliğimiz zaten kötü ama şu an tek sorunumuz kızımız. Lütfen Melis'i düzeltin, biz kızımız için her şeyi yaparız' derler. 
Sistemik gözlemde fark edilir ki Berna ve Murat ne zaman boşanmayı veya ayrılmayı konuşsa Melis yeni bir kriz çıkarmakta ve ebeveynler kavga etmeyi bırakıp Melis için birlik olmaktadır. Melis ailenin 'İşaret Edilmiş Danışanı' (Identified Patient) haline gelmiştir.
    `,
    soru: `
ÖĞRENCİ DANIŞMAN GÖREVİ:
1. Ailenin "Sorunlu olan sadece kızımız Melis, onu tedavi edin" beklentisini Melis'i suçlu hissettirmeden, sistemik bir 'Yeniden Çerçeveleme' (Reframing) ile tüm aileye nasıl yansıtırsınız?
2. Melis'in semptomunun evliliği ayakta tutan 'koruyucu/gizli işlevini' (homeostazis) ebeveynlere fark ettirmek için ilk seansta kullanacağınız terapötik dil ve strateji ne olurdu?
    `
  },
  {
    id: 3,
    baslik: "Vaka 3: Sadakatsizlik Sonrası Hakemlik Tuzağı (Duygu Odaklı Terapi - EFT)",
    profil: "Selin (38, Öğretmen) & Can (40, Mühendis) - 10 yıllık evli.",
    hikaye: `
Can'ın iş arkadaşıyla 6 ay süren sanal bir duygusal yazışması (aldatma/sadakatsizlik) 1 ay önce Selin tarafından yakalanmıştır. Can ilişkiyi derhal kesmiş, özür dilemiş ve pişman olduğunu söylemektedir.
Selin ise seansa büyük bir öfke, ağlama nöbetleri ve şüpheyle gelmiştir. Seansın başında doğrudan terapiste dönerek: 
'Hocam siz bir uzmansınız, lütfen ona yaptığı şeyin ne kadar iğrenç ve ahlaksızca olduğunu yüzüne söyleyin! Onun bana yaşattıklarının normal olmadığını onaylamanızı istiyorum!' der.
Can ise koltuğunda büzülmüş, göz temasından kaçınan, tamamen duygusuz/donuk bir tavırla 'Ne desem suçluyum, artık konuşmak istemiyorum' demektedir.
    `,
    soru: `
ÖĞRENCİ DANIŞMAN GÖREVİ:
1. Selin'in sizi 'hakem ve suçlayıcı yargıç' konumuna çekme çabasına karşı nasıl bir terapötik sınır çizersiniz? Terapist koltuğunda ona vereceğiniz ilk tepki ne olur?
2. Duygu Odaklı Terapi (EFT) ışığında, Selin'in yüzeydeki "öfke ve cezalandırma" tepkisi ile Can'ın "içe kapanma/donukluk" duvarının altındaki 'Birincil Duyguları' (korku, çaresizlik, terk edilme) seansa nasıl davet edersiniz?
    `
  }
];

// Gemini API Değerlendirme Fonksiyonu
async function evaluateWithGemini(vaka, ogrenciCevabi) {
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const systemInstruction = `
Sen 30 yıllık mesleki tecrübeye sahip, binlerce çift ve aile ile çalışmış duayen bir Klinik Psikolog, Aile Danışmanı ve Üniversitede Aile Terapisi Eğitmeni / Süpervizörüsün.

Karşında Açıköğretim Sosyoloji'den yeni mezun olmuş, teorik arka planı olan ancak klinik vaka tecrübesi bulunmayan, mesleğe yeni adım atan hevesli bir öğrenci var.

GÖREVİN VE EĞİTSEL TUTUMUN:
1. Eğitici ve Yapıcı Tutum: Öğrencinin sosyolojik bakış açısını ve iyi niyetini takdir et; fakat düştüğü kritik klinik tuzakları (tavsiye/öğüt verme, hakemlik yapma, yalan/bahane önerme, lineer soru sorma) kırmadan, şefkatli ve öğretici bir dille açıkla.
2. Sonuç Odaklı Vaka Çözümü: Seçilen vakayı (${vaka.baslik}) çözmek için ilgili aile terapisi kuramları (Yapısal Aile Terapisi, Bowen, Sistemik Terapi veya Duygu Odaklı Terapi - EFT) üzerinden atılması gereken somut klinik adımları ortaya koy.
3. Canlı Seans Replikleri: Terapistin seansta iki tarafı da kucaklayarak kullanacağı gerçek diyalogları ve sistemik döngüsel soruları kelimesi kelimesine göster.

Lütfen değerlendirmeni şu başlıklar altında kapsamlı, derinlikli ve akıcı bir süpervizyon dersi şeklinde sun:
1. 🎓 SÜPERVİZÖR DEĞERLENDİRMESİ VE NOTU (XX / 100)
2. 🌟 TEORİK GAYRET VE TAKDİR EDİLEN YÖNLER (Öğrencinin doğru yakaladığı sosyolojik sezgiler)
3. ⚠️ KLİNİK KÖR NOKTALAR VE "ACEMİ TERAPİST" TUZAKLARI (Neden tavsiye verilmez? Yalan söylemek terapiye neden zarar verir? Hakemlik tehlikesi nedir?)
4. 🧭 VAKAYI ÇÖZÜME GÖTÜREN SONUÇ ODAKLI KLİNİK STRATEJİ (Adım Adım Müdahale Planı)
5. 💬 SEANSTA KULLANILACAK SOMUT DİYALOGLAR VE DÖNGÜSEL SORULAR (Terapistin ağzından çıkacak kelimeler)
`;

  const prompt = `
VAKA BAŞLIĞI: ${vaka.baslik}
VAKA DETAYI: ${vaka.hikaye}
VAKA SORULARI: ${vaka.soru}

-------------------------
ÖĞRENCİNİN VERDİĞİ CEVAP:
${ogrenciCevabi}
-------------------------

Lütfen yukarıdaki kriterlere göre öğrencinin cevabını süpervizyon süzgecinden geçirerek değerlendir.
`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error("Gemini API yanıt üretemedi: " + JSON.stringify(data));
  }
}

// Konsol Arayüzü
async function main() {
  console.log("\n=======================================================");
  console.log("   🏠 AİLE DANIŞMANLIĞI VAKA OKULU (GEMINI API DESTEKLİ)");
  console.log("=======================================================\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (str) => new Promise(resolve => rl.question(str, resolve));

  console.log("Mevcut Vakalar:\n");
  VAKALAR.forEach(v => {
    console.log(`[${v.id}] ${v.baslik}`);
    console.log(`    Profil: ${v.profil}`);
  });

  const secim = await question("\nLütfen çalışmak istediğiniz vaka numarasını seçin (1, 2 veya 3): ");
  const secilenVaka = VAKALAR.find(v => v.id === parseInt(secim));

  if (!secilenVaka) {
    console.log("Geçersiz seçim! Program sonlandırılıyor.");
    rl.close();
    return;
  }

  console.log("\n-------------------------------------------------------");
  console.log(`📌 SEÇİLEN VAKA: ${secilenVaka.baslik}`);
  console.log("-------------------------------------------------------");
  console.log("\n📖 VAKA ÖYKÜSÜ:\n" + secilenVaka.hikaye.trim());
  console.log("\n❓ SİZDEN BEKLENEN CEVAP:\n" + secilenVaka.soru.trim());
  console.log("-------------------------------------------------------\n");

  console.log("✍️ Lütfen öğrenci/danışman cevabınızı yazın (Bitirince Enter'a basın):\n");
  const cevap = await question("> ");

  if (!cevap || cevap.trim().length < 5) {
    console.log("Cevap çok kısa olduğu için değerlendirilemedi.");
    rl.close();
    return;
  }

  console.log("\n⏳ Cevabınız Gemini API süpervizörüne iletiliyor, değerlendirme hazırlanıyor...\n");

  try {
    const sonuc = await evaluateWithGemini(secilenVaka, cevap);
    console.log(sonuc);
  } catch (err) {
    console.error("Hata oluştu:", err.message);
  }

  rl.close();
}

// Modül veya doğrudan çalıştırma kontrolü
if (require.main === module) {
  main();
}

module.exports = { VAKALAR, evaluateWithGemini };
