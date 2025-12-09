const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto')

const db = path.join(__dirname, 'database', 'banco.json')

const app = express();
const port = 3000;

app.use(cors(
    {origin: 'http://localhost:8888'}
));

app.use(express.json());

app.listen(port, () => {
    console.log(`\n\nServidor rodando na porta ${port}\n\n`);
});


