const https = require('https');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'assets', 'logos', 'tvs.png');

function download(url) {
    https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            download(res.headers.location);
        } else if (res.statusCode === 200) {
            const file = fs.createWriteStream(filePath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Successfully downloaded proper TVS logo.');
            });
        } else {
            console.error(`Failed with status code: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error(err.message);
    });
}

download('https://logo.clearbit.com/tvsmotor.com');
