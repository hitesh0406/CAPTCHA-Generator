import express from 'express';
import path from 'path';
import session from 'express-session';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'captchaSecret', resave: false, saveUninitialized: true }));

// Generate CAPTCHA Image
app.get('/captcha', (req, res) => {
    const canvas = createCanvas(200, 60);
    const ctx = canvas.getContext('2d');

    const captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
    req.session.captcha = captchaText;

    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(0, 0, 200, 60);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(captchaText, 50, 40);

    res.set('Content-Type', 'image/png');
    res.send(canvas.toBuffer());
});

app.post('/verify', (req, res) => {
    const { captcha } = req.body;
    if (captcha.toUpperCase() === req.session.captcha) {
        res.send('✅ CAPTCHA Verified!');
    } else {
        res.send('❌ CAPTCHA Failed!');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});