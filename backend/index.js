// Imports:

require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Criptografia e Chave em .env

const key = process.env.KEY

function criptografar(string)
{
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), iv)
    let saida_criptografada = cipher.update(string);
    saida_criptografada = Buffer.concat([saida_criptografada, cipher.final()]);
    return iv.toString('hex') + ':' + saida_criptografada.toString('hex')
}

function descriptografar(textoCriptografado)
{
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

// Banco de Dados:

const banco = path.join(__dirname, 'database', 'banco.json')

function ler_banco()
{
    const data = fs.readFileSync(banco);
    if (data.length === 0) return []
    return JSON.parse(data);
}

function salvar_banco(dados) {
    fs.writeFileSync(banco, JSON.stringify(dados, null, 4));
}

// Inicialização:

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: 'http://localhost:8888'}));
app.use(express.json());

app.listen(port, () => {
    console.log(`\n\nServidor rodando na porta ${port}\n\n`);
});

// Rotas:

app.get("/", (req, res) => {
    console.log(key);
    return res.send("Testing root");
});

app.post("/api/register", async (req, res) =>{
    try
    {
        const {email, username, password} = req.body;

        if(!email || !username || !password) return res.status(400).send("Por Favor Preencher Todos os Campos Obrigatórios");
        if(email == "" || username == "" || password == "") return res.status(400).send("Por Favor Preencher Todos os Campos Obrigatórios");

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email)){
            return res.status(400).send("Email inválido");
        }

        const users = ler_banco();

        const username_utilizado = users.find(user => {
            return (username == user.username);
        });

        const email_utilizado = users.find(user => {
            return (email == descriptografar(user.email));
        });

        if(username_utilizado){
            return res.status(409).send("Username não disponível");
        }

        if(email_utilizado){
            return res.status(409).send("Algo deu Errado");
        }

        const id = crypto.randomUUID();
        const email_criptografado = criptografar(email);
        const senha_hash = await bcrypt.hash(password, (await bcrypt.genSalt(10)));

        const profile_character = Math.floor(Math.random() * 151) + 1;
        let spriteUrl = "";

        try
        {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${profile_character}`)
            if(response.ok)
            {
                const data = await response.json();
                spriteUrl = data.sprites.front_default;
            }
            else
            {
                throw new Error("Falha na PokeAPI");
            }
        }
        catch(e)
        {
            console.error(e);
            spriteUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";
        }

        const User ={
            id: id,
            email: email_criptografado,
            username: username,
            password: senha_hash,
            profile_character: spriteUrl
        };

        users.push(User);
        salvar_banco(users);

        return res.status(201).send("Usuário cadastrado com sucesso")
    }
    catch(e)
    {
        console.error(e);
        return res.status(500).send("Erro interno do servidor.");
    }
});

app.post("/api/login", async (req, res) =>{
    try
    {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("Preencha email e senha.");

        const users = ler_banco();

        const user = users.find(u => {
            return descriptografar(u.email) === email;
        });

        if (!user) return res.status(401).send("Email ou senha incorretos.");

        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) return res.status(401).send("Email ou senha incorretos.");

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            user: {
                id: user.id,
                username: user.username,
                profile_character: user.profile_character
            }
        });
    }
    catch (e)
    {
        console.error(e);
        return res.status(500).send("Erro interno no servidor.");
    }
});

// Rota Desconhecida:

app.use((req, res) => {
    res.status(404).send("Desconheço a Rota");
});
