const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ler_banco, salvar_banco } = require('../utils/database');
const { criptografar, descriptografar } = require('../utils/crypto');

jwtSecret = process.env.JWT_SECRET

const verificarToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) return res.status(403).send("Token não fornecido.");
    const token = tokenHeader.split(' ')[1] || tokenHeader;

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) return res.status(401).send("Token inválido.");
        req.userId = decoded.id;
        next();
    });
};

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) return res.status(400).send("Por Favor Preencher Todos os Campos Obrigatórios");
        if (email === "" || username === "" || password === "") return res.status(400).send("Por Favor Preencher Todos os Campos Obrigatórios");

        const users = ler_banco();

        const username_utilizado = users.find(user => user.username === username);
        const email_utilizado = users.find(user => descriptografar(user.email) === email);

        if (username_utilizado) return res.status(409).send("Username não disponível");
        if (email_utilizado) return res.status(409).send("Algo deu Errado");

        const id = crypto.randomUUID();
        const email_criptografado = criptografar(email);
        const senha_hash = await bcrypt.hash(password, (await bcrypt.genSalt(10)));

        const profile_character = Math.floor(Math.random() * 151) + 1;
        let spriteUrl = "";

        try
        {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${profile_character}`);
            if (response.ok) {
                const data = await response.json();
                spriteUrl = data.sprites.front_default;
            } else {
                throw new Error("Falha na PokeAPI");
            }
        }
        catch(e)
        {
            console.error("Erro ao buscar imagem:", e.message);
        }

        const User = {
            id: id,
            email: email_criptografado,
            username: username,
            password: senha_hash,
            profile_character: spriteUrl
        };

        users.push(User);
        salvar_banco(users);

        return res.status(201).send("Usuário cadastrado com sucesso");
    }catch(e) {
        console.error(e);
        return res.status(500).send("Erro");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("Preencha email e senha.");

        const users = ler_banco();

        const user = users.find(u => descriptografar(u.email) === email);

        if (!user) return res.status(401).send("Email ou senha incorretos.");

        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) return res.status(401).send("Email ou senha incorretos.");

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                profile_character: user.profile_character
            }
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send("Erro interno no servidor.");
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, password, pokemonId } = req.body;
        const users = ler_banco();
        const index = users.findIndex(u => u.id === req.userId);
        
        if (index === -1) return res.status(404).send("User não encontrado");
        
        const user = users[index];

        if (username && username !== user.username) {
            if(users.find(u => u.username === username)) return res.status(409).send("Username em uso");
            user.username = username;
        }
        if (password) user.password = await bcrypt.hash(password, (await bcrypt.genSalt(10)));
        
        if (pokemonId) {
            try {
                const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                if(resp.ok) {
                    const data = await resp.json();
                    user.profile_character = data.sprites.front_default;
                }
            } catch(e) {
                res.status(400).send("Erro ao buscar Pokémon.");
            }
        }

        users[index] = user;
        salvar_banco(users);
        
        return res.status(200).json({ message: "Atualizado", user: { id: user.id, username: user.username, profile_character: user.profile_character }});
    } catch(e) {
        return res.status(500).send("Erro ao atualizar");
    }
};

const getProfile = (req, res) => {
    try {
        const users = ler_banco();
        const user = users.find(u => u.id === req.userId);

        if (!user) {
            return res.status(404).send("Usuário não encontrado.");
        }

        return res.status(200).json({
            id: user.id,
            username: user.username,
            profile_character: user.profile_character
        });

    } catch (e) {
        console.error(e);
        return res.status(500).send("Erro ao buscar perfil.");
    }
};

const deleteProfile = async (req, res) => {
    try {
        let users = ler_banco();
        
        const initialLength = users.length;

        const newUsers = users.filter(user => user.id !== req.userId);

        if (newUsers.length === initialLength) {
            return res.status(404).send("Usuário não encontrado.");
        }

        salvar_banco(newUsers);

        return res.status(200).send("Conta deletada com sucesso.");

    } catch (e) {
        console.error(e);
        return res.status(500).send("Erro ao deletar conta.");
    }
};

module.exports = { register, login, updateProfile, verificarToken, getProfile, deleteProfile};