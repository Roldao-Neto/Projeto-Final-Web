"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
    const [logado, setLogado] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("Token");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLogado(!!token);
    }, [pathname]);

    function handleLogout() {
        localStorage.removeItem("Token");
        setLogado(false);
        router.push("/login");
    }

    if(logado)
    {
        return (
            <nav>
                <button onClick={() => {
                    router.push("/perfil");
                }}>Gerenciar Perfil</button>

                <button onClick={handleLogout}>Sair (Logout)</button>
            </nav>
        );
    }
    else
    {
        return (
            <nav>
                <button onClick={() => {
                    router.push("/login");
                }}>Login</button>
                <button onClick={() => {
                    router.push("/cadastro");
                }}>Criar Conta</button>
            </nav>
        );
    }
}
