const fs = require('fs');
const path = require('path');
const https = require('https');

const logosDir = path.join(__dirname, 'public', 'logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const brands = [
  { id: 'apple', url: 'https://logo.clearbit.com/apple.com' },
  { id: 'samsung', url: 'https://logo.clearbit.com/samsung.com' },
  { id: 'xiaomi', url: 'https://logo.clearbit.com/mi.com' },
  { id: 'huawei', url: 'https://logo.clearbit.com/huawei.com' },
  { id: 'oppo', url: 'https://logo.clearbit.com/oppo.com' },
  { id: 'realme', url: 'https://logo.clearbit.com/realme.com' },
  { id: 'tecno', url: 'https://logo.clearbit.com/tecno-mobile.com' },
  { id: 'infinix', url: 'https://logo.clearbit.com/infinixmobility.com' },
  { id: 'vivo', url: 'https://logo.clearbit.com/vivo.com' },
  { id: 'honor', url: 'https://logo.clearbit.com/hihonor.com' },
  { id: 'poco', url: 'https://logo.clearbit.com/po.co' },
  { id: 'reeder', url: 'https://logo.clearbit.com/reeder-akilli-telefon.com' },
  { id: 'generalmobile', url: 'https://logo.clearbit.com/generalmobile.com' },
  { id: 'casper', url: 'https://logo.clearbit.com/casper.com.tr' },
  { id: 'tcl', url: 'https://logo.clearbit.com/tcl.com' },
  { id: 'nothing', url: 'https://logo.clearbit.com/nothing.tech' },
  { id: 'omix', url: 'https://logo.clearbit.com/omix.com.tr' },
  { id: 'hiking', url: 'https://logo.clearbit.com/hiking.com.tr' },
  { id: 'motorola', url: 'https://logo.clearbit.com/motorola.com' }
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        // Fallback to google favicon if clearbit fails
        console.log(`Clearbit failed for ${dest}, trying Google Favicon...`);
        const domain = new URL(url).hostname.replace('logo.clearbit.com', '').replace('/', '');
        const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        https.get(fallbackUrl, (fallbackRes) => {
           if (fallbackRes.statusCode === 200) {
               const file = fs.createWriteStream(dest);
               fallbackRes.pipe(file);
               file.on('finish', () => file.close(resolve));
           } else {
               reject(new Error(`Failed to download ${url} and fallback`));
           }
        }).on('error', reject);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function main() {
  for (const brand of brands) {
    const dest = path.join(logosDir, `${brand.id}.png`);
    try {
      await download(brand.url, dest);
      console.log(`Downloaded ${brand.id}`);
    } catch (err) {
      console.error(`Failed to download ${brand.id}:`, err.message);
    }
  }
}

main();
