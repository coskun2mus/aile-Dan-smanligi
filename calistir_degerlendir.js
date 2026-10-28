// Gemini API Değerlendirme Çalıştırıcı
const fs = require('fs');
const { VAKALAR, evaluateWithGemini } = require('./vaka_okulu.js');

const ogrenciCevabi = `
Hocam merhabalar, ben Açıköğretim Sosyoloji'den yeni mezun oldum. Aile Sosyolojisi dersinde gördüğümüz kadarıyla burada tipik bir 'Geleneksel Geniş Aile' ile 'Modern Çekirdek Aile' çatışması yaşanıyor. Benim yaklaşımım şu şekilde olurdu:

1. Nötralite (Taraf Tutmama) Sorusuna Cevabım:
Seansta iki tarafı da kırmamak için ortada dururum. Kerem Bey'e derim ki: 'Kerem Bey, bizim toplumumuzda ataerkil kodlar ve anneye hürmet çok güçlüdür. Sizin iyi bir evlat olma çabanızı anlıyorum ama artık modern bir çekirdek aile kurdunuz.' Sonra hemen Aylin Hanım'a dönüp: 'Aylin Hanım, siz de mimarsınız, modern bir bireysiniz ama kayınvalideniz eski kuşak, niyetinde kötülük yok, sadece yardım etmek istiyor. Büyüklere karşı biraz daha alttan alıcı ve sabırlı olmalısınız' derim. Böylece iki tarafın da toplumsal rollerini onlara hatırlatarak eşit mesafede kalmış olurum.

2. Döngüsel Soru ve Müdahale Sorusuna Cevabım:
Döngüsel soru olarak Kerem Bey'e şunu sorardım:
'Kerem Bey, annenizden anahtarı geri alsanız sence evliliğiniz kurtulur mu?'
Aylin Hanım'a da şunu sorardım:
'Aylin Hanım, kayınvalidenizi haftada sadece 1 gün pazar kahvaltısına çağırsanız bu öfkeniz geçer mi?'

Müdahale olarak da çifte şu tavsiyeyi verirdim:
Anneyi doğrudan kırmamak için kapının kilidini 'bozuldu' bahanesiyle değiştirmelerini, yeni anahtarı da Nermin Hanım'a hemen vermeyip 'Yedek anahtarı henüz yaptıramadık' diyerek zamana yaymalarını önerirdim. Böylece hem sınır çizilmiş olur hem de kayınvalidenin tansiyonu çıkmaz.
`;

async function run() {
  console.log("⏳ Gemini API'ye bağlanılıyor ve süpervizyon değerlendirmesi alınıyor...");
  try {
    const baslangic = Date.now();
    const sonuc = await evaluateWithGemini(VAKALAR[0], ogrenciCevabi);
    const sure = ((Date.now() - baslangic) / 1000).toFixed(1);
    
    fs.writeFileSync('supervizyon_raporu.md', sonuc, 'utf8');
    console.log(`✅ Değerlendirme başarıyla tamamlandı (${sure} saniye)!`);
    console.log(`📄 Rapor 'supervizyon_raporu.md' dosyasına kaydedildi.`);
  } catch (error) {
    console.error("❌ Hata oluştu:", error.message);
  }
}

run();
