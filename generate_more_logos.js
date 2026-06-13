const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'logos');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const svgs = {
    'bedrock.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 60">
    <!-- Red triangle and B -->
    <path d="M10 15 L40 30 L10 45 Z" fill="none" stroke="#E31837" stroke-width="2" />
    <circle cx="18" cy="30" r="7" fill="none" stroke="#E31837" stroke-width="2" />
    <text x="18" y="34" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#E31837" text-anchor="middle">B</text>
    
    <!-- BEDROCK text -->
    <text x="50" y="38" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#E31837" letter-spacing="1">BEDROCK</text>
    
    <!-- Subtitle -->
    <text x="50" y="52" font-family="Arial, sans-serif" font-weight="bold" font-size="10" fill="#000000" letter-spacing="1">TYRES &#x2022; TUBES &#x2022; RIMS &#x2022; CHAINS</text>
</svg>`,
    'tvs.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <!-- Stylized Horse -->
    <path d="M40 30 C55 10 75 15 90 5 C105 10 115 5 125 15 C140 25 150 40 140 35 C125 30 110 40 85 40 C60 40 40 50 25 45 C35 40 40 40 40 30 Z" fill="#E31837" />
    <!-- TVS text -->
    <text x="85" y="58" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-style="italic" font-size="22" fill="#0033A0" text-anchor="middle" letter-spacing="1">TVS</text>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(dir, filename), content);
    console.log("Created " + filename);
}
