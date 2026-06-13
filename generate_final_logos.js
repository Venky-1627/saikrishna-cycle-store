const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'logos');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const svgs = {
    'mack_cycle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 100">
    <!-- Black Top -->
    <path d="M30 15 L220 15 C235 15 240 25 235 40 L220 60 L15 60 Z" fill="#000000" />
    <!-- Yellow Bottom -->
    <path d="M15 60 L220 60 L205 85 C200 95 185 95 170 95 L20 95 C5 95 5 85 15 60 Z" fill="#FFF200" />
    <!-- Black Base Line -->
    <path d="M20 95 L170 95 C185 95 195 90 200 80 L200 95 C195 100 180 105 160 105 L15 105 Z" fill="#000000" />
    
    <text x="45" y="52" font-family="'Arial Black', sans-serif" font-weight="900" font-style="italic" font-size="42" fill="#FFFFFF" letter-spacing="-1">MACK</text>
    <text x="35" y="92" font-family="'Arial Black', sans-serif" font-weight="900" font-style="italic" font-size="42" fill="#000000" letter-spacing="-1">CYCLE</text>
    
    <text x="180" y="90" font-family="Arial, sans-serif" font-weight="900" font-style="italic" font-size="10" fill="#000000" transform="rotate(-90 180 90)">&amp; FITNESS</text>
    <text x="35" y="102" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" letter-spacing="3">MIAMI, FL &#x2022; SINCE 1957</text>
</svg>`,

    'oster.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 80">
    <rect width="250" height="80" fill="#0A3E1D" rx="4" />
    
    <!-- Three swooshes on the left of O -->
    <path d="M10 45 Q25 55 45 40" fill="none" stroke="#F4D018" stroke-width="6" stroke-linecap="round"/>
    <path d="M5 30 Q20 40 40 25" fill="none" stroke="#F4D018" stroke-width="6" stroke-linecap="round"/>
    
    <text x="40" y="55" font-family="'Arial Black', sans-serif" font-weight="900" font-style="italic" font-size="55" fill="#F4D018" letter-spacing="-2">Oster</text>
    <text x="55" y="70" font-family="Arial, sans-serif" font-weight="bold" font-style="italic" font-size="10" fill="#F4D018" letter-spacing="0.5">Breathe.. Smile . Peddle!</text>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(dir, filename), content);
    console.log("Created " + filename);
}
