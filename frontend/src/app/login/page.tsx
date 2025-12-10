"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try
        {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("Token", data.token);
                router.push("/");
            }
            else
            {
                alert("Email ou senha incorretos");
            }
        }
        catch(error)
        {
            console.error("Erro ao conectar", error);
        }
    }

    return (
        <div className="box">
            <h2>Acessar Sistema</h2>
            
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Entrar</button>
            </form>

            <p style={{marginTop: '15px', fontSize: '0.9rem'}}>Não tem conta? <Link href="/cadastro" style={{color: '#3b4cca'}}>Cadastre-se</Link></p>
        </div>
    );
}
