"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cadastro()
{
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const router = useRouter();

    async function handleCadastro(e: React.FormEvent) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return alert("Senhas não conferem!");

        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password
            }),
        });

        if (response.ok) {
            alert("Sucesso! Faça login.");
            router.push("/login");
        }
        else
        {
            const msg = await response.text();
            alert("Erro: " + msg);
        }
    }

    return (
        <div className="box">
            <h2>Criar Nova Conta</h2>
            <form onSubmit={handleCadastro}>
                <input type="text" placeholder="User" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Senha" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <input type="password" placeholder="Confirmar Senha" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                <button type="submit">Cadastrar</button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>Já tem conta? <Link href="/login" style={{ color: '#3b4cca' }}>Faça Login</Link></p>
        </div>
    );
}
