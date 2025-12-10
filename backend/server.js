require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:8888' }));
app.use(express.json());

app.use('/api', authRoutes);

app.use((req, res) => {
    res.status(404).send("Not Found");
});

app.listen(port, () => {
    console.log(`\n\nServidor rodando na porta ${port}\n\n`);
});
