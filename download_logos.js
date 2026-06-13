const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'logos');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const logos = [
    { name: 'hero.png', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Hero_Cycles_logo.png' },
    { name: 'trek.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Trek_Bicycle_Corporation_logo.svg' },
    { name: 'giant.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Giant_Bicycles_logo.svg' },
    { name: 'hercules.png', url: 'https://upload.wikimedia.org/wikipedia/en/2/23/Hercules_Cycle_and_Motor_Company_logo.png' },
    { name: 'atlas.png', url: 'https://upload.wikimedia.org/wikipedia/en/9/91/Atlas_Cycles_logo.png' },
    { name: 'raleigh.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Raleigh_Bicycle_Company_logo.svg' }
];

async function downloadSequentially() {
    for (const logo of logos) {
        await new Promise((resolve) => {
            const filePath = path.join(dir, logo.name);
            const file = fs.createWriteStream(filePath);
            const req = https.get(logo.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }, function(response) {
                if(response.statusCode === 200) {
                    response.pipe(file);
                    file.on('finish', function() {
                        file.close();
                        console.log(`Successfully downloaded: ${logo.name}`);
                        setTimeout(resolve, 1500); // 1.5s delay to avoid 429
                    });
                } else {
                    console.log(`Failed ${logo.name}: HTTP ${response.statusCode}`);
                    file.close();
                    resolve();
                }
            }).on('error', function(err) {
                console.error(`Error downloading ${logo.name}: ${err.message}`);
                file.close();
                resolve();
            });
        });
    }
}

downloadSequentially();
