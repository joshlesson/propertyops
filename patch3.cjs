const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace(/onClick={e=>e\.target===e\.currentTarget&&onClose\(\)}/g, '');
fs.writeFileSync('src/App.jsx', c);
console.log('done');
