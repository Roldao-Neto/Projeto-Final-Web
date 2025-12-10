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
  const [timburrImage, setTimburrImage] = useState<string | null>(null);

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

    async function getTimburr() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/532");
      const data = await response.json();
      setTimburrImage(data.sprites.other['official-artwork'].front_default);
    } catch (error) {
      console.error("Erro ao buscar Timburr", error);
    }
  }

    getTimburr();
    fetchUserData();
  }, [router]);

  if (!user) return null;

  const imagem = timburrImage || user.profile_character;

  return (
    <div className="box">
      <Image src={imagem} alt="Avatar do Treinador" width={240} height={240}/>
      
      <h1 style={{ fontSize: '1.8rem', color: '#333', textTransform: 'capitalize' }}>
        Olá, {user.username}!
      </h1>
      
      <p style={{ margin: '25px 0', color: '#666', fontSize: '1.1rem', maxWidth: '500px', textAlign: 'left' }}>
        Ainda estou trabalhando na feature de montar seu time de Pokémon. Fique ligado para mais atualizações em breve!
      </p>
    </div>
  );
}