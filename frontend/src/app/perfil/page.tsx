"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserData {
    username: string;
    profile_character: string;
}

export default function Perfil()
{
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    
    // Novos estados para controlar a janela e os dados do formulário
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        pokemonId: ""
    });
    
    useEffect(() => {
        async function fetchUserData() {
            const token = localStorage.getItem("Token");

            if (!token) {
                router.push("/login");
                return;
            }

            try
            {
                const response = await fetch("http://localhost:3000/api/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    // Preenche o formulário com o nome atual
                    setFormData(prev => ({ ...prev, username: data.username }));
                } else {
                    localStorage.removeItem("Token");
                    router.push("/login");
                }

            }
            catch (error)
            {
                console.error("Erro na conexão", error);
                alert("Erro ao carregar perfil");
            }
        }
        fetchUserData();
    }, [router]);

    // Função para enviar as alterações
    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        const token = localStorage.getItem("Token");

        try {
            const response = await fetch("http://localhost:3000/api/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Perfil atualizado com sucesso!");
                const data = await response.json();
                
                // Atualiza a tela com os novos dados
                setUser(data.user);
                setIsModalOpen(false); // Fecha a janela
                
                // Limpa senha e ID do formulário
                setFormData(prev => ({ ...prev, password: "", pokemonId: "" }));
            } else {
                const msg = await response.text();
                alert("Erro: " + msg);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com o servidor");
        }
    }

    if(!user) return null;

    return (
        <div className="box">
            <h2>Gerencie Seu Perfil</h2>
            
            {/* Imagem do Usuário */}
            <Image 
                src={user.profile_character} 
                alt="Avatar do Treinador" 
                width={120} 
                height={120} 
                style={{ marginBottom: "10px", objectFit: "contain" }}
            />
            
            <div>
                <p><strong>Nome de Usuário:</strong> {user.username}</p>
                
                {/* Botão para Abrir a Janela Lateral */}
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{marginTop: "20px", backgroundColor: "blue"}}
                    >Editar Perfil</button>
                </div>

                {/* Botão de Deletar (Seu código original) */}
                <div>
                    <button
                        onClick={async () =>{
                            const confirmacao = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.");
                            if (!confirmacao) return;

                            const token = localStorage.getItem("Token");

                            try {
                                const response = await fetch("http://localhost:3000/api/delete", {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    }
                                });

                                if (response.ok) {
                                    alert("Sua conta foi excluída com sucesso.");
                                    localStorage.removeItem("Token");
                                    // Forçar recarregamento para limpar header
                                    window.location.href = "/login";
                                } else {
                                    alert("Erro ao excluir conta.");
                                }
                            } catch (error) {
                                console.error("Erro de conexão:", error);
                                alert("Erro ao conectar com o servidor.");
                            }
                        }}
                        style={{marginTop: "20px", backgroundColor: "red"}}
                    >Delete Perfil</button>
                </div>
            </div>

            {/* --- JANELA LATERAL (SIDEBAR) --- */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    {/* stopPropagation evita que o clique dentro da janela a feche */}
                    <div className="side-window" onClick={(e) => e.stopPropagation()}>
                        
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}>✖</button>
                        
                        <h2 style={{ marginBottom: '20px', color: '#333' }}>Editar Dados</h2>
                        
                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            {/* Input Username */}
                            <div>
                                <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Novo Username:</label>
                                <input 
                                    type="text" 
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>

                            {/* Input Senha */}
                            <div>
                                <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Nova Senha:</label>
                                <input 
                                    type="password" 
                                    placeholder="Deixe em branco para manter"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>

                            {/* Input Pokemon ID */}
                            <div>
                                <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Trocar Pokémon (ID 1-1025):</label>
                                <input 
                                    type="number" 
                                    placeholder="Ex: 6 (Charizard)"
                                    min="1"
                                    max="1025"
                                    value={formData.pokemonId}
                                    onChange={(e) => setFormData({...formData, pokemonId: e.target.value})}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                                <small style={{ color: '#666' }}>Deixe vazio se não quiser trocar.</small>
                            </div>

                            <button type="submit" style={{backgroundColor: '#4CAF50', marginTop: '10px'}}>
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}