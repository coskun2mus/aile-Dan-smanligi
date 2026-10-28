// Terminalden n değerini al (örn: node topla 20), eğer değer verilmezse varsayılan olarak 10 al
const n = parseInt(process.argv[2]) || 10;

let toplam = 0;

// 1'den n'e kadar döngü ile sayıları topla
for (let i = 1; i <= n; i++) {
    toplam += i;
}

console.log(`1'den ${n}'e kadar olan sayıların toplamı: ${toplam}`);
