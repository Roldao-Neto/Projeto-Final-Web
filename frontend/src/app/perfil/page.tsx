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

    if(!user) return null;

    return (
        <div className="box">
            <h2>Gerencie Seu Perfil</h2>
            <Image src={user.profile_character} alt="Avatar do Treinador" width={120} height={120} style={{ marginBottom: "10px" }}/>
            <div>
                <p><strong>Nome de Usuário:</strong> {user.username}</p>
                <div>
                    <button
                        onClick={() =>{
                            
                        }}
                        style={{marginTop: "20px", backgroundColor: "blue"}}
                    >Editar Perfil</button>
                </div>
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
                                    router.push("/login");
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
            
        </div>
    );
}
