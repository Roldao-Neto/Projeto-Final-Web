"use client";

import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    return (
        <div>
            <button onClick={() => {
                router.push("/");
            }}
            >Principal</button>
        </div>
    )
}
