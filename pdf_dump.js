const fs = require('fs');
const zlib = require('zlib');

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node pdf_dump.js <invoice.pdf>');
    process.exit(1);
  }
  const text = extractText(filePath);
  console.log(text);
}

function extractText(filePath) {
  const data = fs.readFileSync(filePath);
  const endToken = Buffer.from('endstream');
  let idx = 0;
  const decoded = [];
  while (true) {
    const streamPos = data.indexOf(Buffer.from('stream'), idx);
    if (streamPos === -1) break;
    const newlineIdx = data.indexOf(0x0a, streamPos);
    if (newlineIdx === -1) break;
    const start = newlineIdx + 1;
    const end = data.indexOf(endToken, start);
    if (end === -1) break;
    const chunk = data.slice(start, end);
    idx = end + endToken.length;
    try {
      const result = zlib.inflateSync(chunk).toString('utf8');
      const matches = [...result.matchAll(/<([0-9A-F]+)>\s*Tj/gi)];
      matches.forEach(match => {
        const hex = match[1];
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
        }
        if (str.trim()) decoded.push(str.trim());
      });
    } catch (err) {
      continue;
    }
  }
  return decoded.join('\n');
}

module.exports = { extractText };
