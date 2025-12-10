import Link from 'next/link';
import Image from 'next/image';

export default async function NotFound() {
    let spriteUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/404.png";

    try {
    
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/404');
    
        if (response.ok) {
            const data = await response.json();
            spriteUrl = data.sprites.other['official-artwork'].front_default
        }
    } catch (error) {
        console.error("Erro ao carregar imagem do 404", error);
    }

    return (
        <div className="box" style={{ textAlign: 'center', padding: '50px' }}>
            <Image src={spriteUrl} alt="Pokémon 404" width={200} height={200} style={{ objectFit: 'contain' }} />
            
            <h1 style={{ color: 'black', fontSize: '2.5rem', marginTop: '20px' }}>
                404
            </h1>
            
            <h2 style={{ marginBottom: '30px', color: 'black' }}>
                Not Found
            </h2>

            <p style={{ marginBottom: '20px' }}>
                Opa! Parece que esse Pokémon selvagem não existe.
            </p>

            <Link 
                href="/" 
                style={{ 
                backgroundColor: '#3b4cca', 
                color: 'white', 
                padding: '10px 20px', 
                borderRadius: '5px', 
                textDecoration: 'none',
                fontWeight: 'bold'
                }}
            >
                Voltar para o Início
            </Link>
        </div>
    );
}