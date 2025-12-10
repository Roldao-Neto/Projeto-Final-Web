const fs = require('fs');
const path = require('path');

const bancoPath = path.join(__dirname, '..', '..', 'database', 'banco.json');

function ler_banco() {
    const data = fs.readFileSync(bancoPath);
    if (data.length === 0) return [];
    return JSON.parse(data);
}

function salvar_banco(dados) {
    fs.writeFileSync(bancoPath, JSON.stringify(dados, null, 4));
}

module.exports = { ler_banco, salvar_banco };
