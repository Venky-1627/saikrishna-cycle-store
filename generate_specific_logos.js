const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'logos');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const svgs = {
    'ceat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <text x="40" y="45" font-family="Arial, sans-serif" font-weight="900" font-size="40" fill="#005A9C">C</text>
    <text x="70" y="45" font-family="Arial, sans-serif" font-weight="900" font-size="40" fill="#005A9C">E</text>
    <!-- The Orange A (3 horizontal bars) -->
    <rect x="100" y="17" width="22" height="6" fill="#F47B20" />
    <rect x="100" y="27" width="22" height="6" fill="#F47B20" />
    <rect x="100" y="37" width="22" height="6" fill="#F47B20" />
    <text x="130" y="45" font-family="Arial, sans-serif" font-weight="900" font-size="40" fill="#005A9C">T</text>
</svg>`,
    'ralco.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <text x="20" y="35" font-family="Arial, sans-serif" font-weight="900" font-style="italic" font-size="32" fill="#E31837" letter-spacing="1">RALCO</text>
    <text x="25" y="52" font-family="Arial, sans-serif" font-weight="900" font-style="italic" font-size="14" fill="#000000">TYRES</text>
    <text x="75" y="51" font-family="Arial, sans-serif" font-weight="bold" font-style="italic" font-size="8" fill="#000000" letter-spacing="2">TREAD NEW PATHS</text>
    <line x1="70" y1="44" x2="65" y2="52" stroke="#000000" stroke-width="1" />
</svg>`,
    'hero_cycles.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <!-- Blue circle badge -->
    <circle cx="35" cy="20" r="12" fill="none" stroke="#1A2645" stroke-width="4" />
    <text x="35" y="25" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#D31224" text-anchor="middle">H</text>
    <text x="35" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="#D31224" text-anchor="middle">HERO</text>
    <!-- HERO Text -->
    <text x="60" y="35" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#D31224" letter-spacing="-1">HERO</text>
    <text x="60" y="50" font-family="Arial, sans-serif" font-weight="900" font-style="italic" font-size="12" fill="#D31224">CYCLES</text>
    <text x="115" y="50" font-family="cursive, Arial, sans-serif" font-weight="bold" font-style="italic" font-size="12" fill="#1A2645">World 1</text>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(dir, filename), content);
    console.log("Created " + filename);
}
