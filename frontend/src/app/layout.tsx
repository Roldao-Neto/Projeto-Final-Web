import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from '@/components/NavBar';
import Home from '@/components/Home';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokeTeamMaker",
  description: "A Web app for making your own Pokémon Teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <Home />
          <NavBar />
        </header>

        <main>
          {children}
        </main>

        <footer>
          <p>Feito com &hearts; por <a href="https://github.com/Roldao-Neto/Projeto-Final-Web" target="_blank">Roldão Neto</a></p>
        </footer>
      </body>
    </html>
  );
}
