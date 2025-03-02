function reloadCaptcha() {
    document.getElementById('captchaImg').src = '/captcha?' + Date.now();
}

document.getElementById('captchaForm').onsubmit = async function (e) {
    e.preventDefault();
    const captcha = document.querySelector('input[name="captcha"]').value;

    const response = await fetch('/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captcha })
    });

    const result = await response.text();
    document.getElementById('result').innerText = result;
    reloadCaptcha();
};