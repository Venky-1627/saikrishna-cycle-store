const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'logos');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const svgs = {
    'hero.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="transparent" />
    <path d="M20 15 L40 45 L60 15 Z" fill="#D32F2F" />
    <text x="75" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#333" letter-spacing="2">HERO</text>
</svg>`,
    'trek.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="transparent" />
    <path d="M20 45 L35 15 L50 45 L35 35 Z" fill="#1976D2" />
    <text x="65" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#333" letter-spacing="2">TREK</text>
</svg>`,
    'giant.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="transparent" />
    <circle cx="35" cy="30" r="15" fill="none" stroke="#388E3C" stroke-width="6" />
    <text x="65" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#333" letter-spacing="2">GIANT</text>
</svg>`,
    'hercules.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="transparent" />
    <path d="M20 15 L50 15 L50 45 L20 45 Z" fill="none" stroke="#F57C00" stroke-width="6" />
    <text x="65" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#333" letter-spacing="1">HERCULES</text>
</svg>`,
    'atlas.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="transparent" />
    <path d="M35 15 L50 45 L20 45 Z" fill="#7B1FA2" />
    <text x="65" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#333" letter-spacing="2">ATLAS</text>
</svg>`,
    'raleigh.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="transparent" />
    <path d="M20 30 Q35 10 50 30 T80 30" fill="none" stroke="#1976D2" stroke-width="5" />
    <text x="95" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#333" letter-spacing="1">RALEIGH</text>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(dir, filename), content);
    console.log(`Created ${filename}`);
}
