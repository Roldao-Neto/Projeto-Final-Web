"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserData {
  username: string;
  profile_character: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUserData() {
      try {
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
      } catch (error) {
        console.error("Erro na conexão", error);
        alert("Erro ao carregar perfil");
      }
    }

    fetchUserData();
  }, [router]);

  if (!user) return null;

  return (
    <div className="box">
      <Image src={user.profile_character} alt="Avatar do Treinador" width={120} height={120} style={{ marginBottom: "10px" }}/>
      
      <h1 style={{ fontSize: '1.8rem', color: '#333', textTransform: 'capitalize' }}>
        Olá, {user.username}!
      </h1>
      
      <p style={{ margin: '10px 0', color: '#666' }}>
        Bem-vindo de volta à sua jornada Pokémon.
      </p>

      <button
        onClick={() => {
          localStorage.removeItem("Token");
          router.push("/login");
        }}
        style={{ marginTop: '20px', backgroundColor: '#d32f2f' }}
      >
        Sair (Logout)
      </button>
    </div>
  );
}