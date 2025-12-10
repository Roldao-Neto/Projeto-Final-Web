const crypto = require('crypto');

const key = process.env.KEY;

function criptografar(string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), iv);
    let saida_criptografada = cipher.update(string);
    saida_criptografada = Buffer.concat([saida_criptografada, cipher.final()]);
    return iv.toString('hex') + ':' + saida_criptografada.toString('hex');
}

function descriptografar(textoCriptografado) {
    try {
        const textParts = textoCriptografado.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        
        const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(key), iv);
        
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        return null;
    }
}

module.exports = { criptografar, descriptografar };