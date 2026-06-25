"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import PanelEmisor from "./components/PanelEmisor";
import PanelPerfil from "./components/PanelPerfil";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [vista, setVista] = useState<"perfil" | "emitir">("perfil");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-black sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-600 select-none">&gt;_</span>
            <span className="font-mono text-sm font-black text-white tracking-tight uppercase">
              DNIPRO
            </span>
            <span className="border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 uppercase">
              v0.1.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && (
              <>
                <button
                  onClick={() => setVista("perfil")}
                  className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    vista === "perfil"
                      ? "border-lime-400 text-lime-400"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                  }`}
                >
                  Mi perfil
                </button>
                <button
                  onClick={() => setVista("emitir")}
                  className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    vista === "emitir"
                      ? "border-lime-400 text-lime-400"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                  }`}
                >
                  Emitir
                </button>
              </>
            )}

            {isConnected ? (
              <span className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-3 py-1.5">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            ) : (
              <button
                onClick={() => connect({ connector: injected() })}
                className="border border-zinc-700 bg-black px-4 py-1.5 font-mono text-xs text-zinc-500 uppercase tracking-widest hover:border-lime-400 hover:text-lime-400 transition-colors"
              >
                [Conectar wallet]
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {!isConnected ? (
          /* Hero sin wallet */
          <div className="border-l-2 border-lime-400 pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-3">
              identidad_profesional // ERC-721_SBT // web3
            </p>
            <h1 className="font-mono text-4xl sm:text-6xl font-black text-white leading-none tracking-tighter uppercase">
              Tu trayectoria,
              <br />
              <span className="text-lime-400">verificada.</span>
            </h1>
            <p className="mt-6 font-mono text-sm text-zinc-600 max-w-lg leading-relaxed">
              <span className="text-zinc-700">// </span>
              Credenciales académicas, laborales y de proyectos respaldadas por blockchain.
              <br />
              <span className="text-zinc-700">// </span>
              Imposibles de falsificar. Vinculadas a tu identidad.
            </p>
            <button
              onClick={() => connect({ connector: injected() })}
              className="mt-8 bg-lime-400 px-8 py-4 font-mono text-sm font-black text-black uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-[0_4px_0px_0px_#65a30d] active:translate-y-0 active:shadow-none transition-all"
            >
              Conectar wallet →
            </button>
          </div>
        ) : vista === "perfil" ? (
          <PanelPerfil address={address!} />
        ) : (
          <PanelEmisor />
        )}
      </div>
    </main>
  );
}