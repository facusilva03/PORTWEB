"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, TIPOS_CREDENCIAL } from "../../lib/contract";

interface Credencial {
  tokenId: string;
  tipo: number;
  emisor: string;
  emitidaEn: string;
  uri: string;
  revocada: boolean;
}

export default function PanelPerfil({ address }: { address: string }) {
  const client = usePublicClient();
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      if (!client) return;
      setCargando(true);

      try {
        // Leer eventos CredencialEmitida para esta dirección
        const logs = await client.getLogs({
          address: CONTRACT_ADDRESS as `0x${string}`,
          event: {
            type: "event",
            name: "CredencialEmitida",
            inputs: [
              { name: "estudiante", type: "address", indexed: true },
              { name: "tokenId", type: "uint256", indexed: true },
              { name: "tipo", type: "uint8", indexed: false },
              { name: "uri", type: "string", indexed: false },
            ],
          },
          args: { estudiante: address as `0x${string}` },
          fromBlock: "earliest",
          toBlock: "latest",
        });

        const items: Credencial[] = await Promise.all(
          logs.map(async (log) => {
            const tokenId = log.args.tokenId?.toString() ?? "?";
            const tipo = Number(log.args.tipo ?? 0);
            const uri = log.args.uri ?? "";

            // Leer datos del contrato
            const data = await client.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: "credenciales",
              args: [BigInt(tokenId)],
            }) as [string, number, bigint, boolean];

            return {
              tokenId,
              tipo,
              emisor: data[0],
              emitidaEn: new Date(Number(data[2]) * 1000).toISOString().split("T")[0],
              uri,
              revocada: data[3],
            };
          })
        );

        setCredenciales(items.filter((c) => !c.revocada));
      } catch (err) {
        console.error("Error cargando credenciales:", err);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [address, client]);

  const porTipo = [0, 1, 2, 3].map((tipo) => ({
    tipo,
    items: credenciales.filter((c) => c.tipo === tipo),
  }));

  return (
    <div>
      <div className="mb-10 border-l-2 border-lime-400 pl-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
          identidad_on-chain // polygon_amoy
        </p>
        <h2 className="font-mono text-3xl font-black text-white uppercase tracking-tighter">
          {address.slice(0, 8)}...{address.slice(-6)}
        </h2>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/verificar/${address}`);
          }}
          className="mt-2 font-mono text-[10px] text-zinc-600 border border-zinc-800 px-3 py-1.5 uppercase tracking-widest hover:border-lime-400 hover:text-lime-400 transition-colors"
        >
          [Copiar link de verificación]
        </button>
      </div>

      {credenciales.length > 0 && (() => {
        const c = credenciales[0];
        let nombre = c.uri;
        let institucion = c.emisor.slice(0, 8) + "..." + c.emisor.slice(-4);
        try {
          const json = JSON.parse(atob(c.uri.replace("data:application/json;base64,", "")));
          nombre = json.name ?? nombre;
          institucion = json.institution ?? institucion;
        } catch {}
        return (
          <div className="mb-10 border-l-2 border-lime-400 pl-6">
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              {institucion}
            </p>
            <p className="font-mono text-sm font-black text-white mt-1 uppercase leading-tight">
              {nombre}
            </p>
          </div>
        );
      })()}

      {cargando ? (
        <div className="font-mono text-xs text-zinc-600 animate-pulse">
          // Leyendo blockchain...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {porTipo.map(({ tipo, items }) => (
            <section key={tipo} className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                <span className="font-mono text-[10px] text-zinc-700">[0{tipo}]</span>
                <h3 className="font-mono text-xs font-black text-white uppercase tracking-widest">
                  {TIPOS_CREDENCIAL[tipo]}
                </h3>
                <span className="ml-auto font-mono text-[10px] text-zinc-700">
                  {items.length} token(s)
                </span>
              </div>

              {items.length === 0 ? (
                <p className="font-mono text-[10px] text-zinc-700 uppercase">
                  // Sin credenciales aún
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((c) => {
                    let nombre = c.uri;
                    let institucion = c.emisor.slice(0, 8) + "..." + c.emisor.slice(-4);
                    try {
                      const base64 = c.uri.replace("data:application/json;base64,", "");
                      const json = JSON.parse(atob(base64));
                      nombre = json.name ?? nombre;
                      institucion = json.institution ?? institucion;
                    } catch {}

                    return (
                      <div key={c.tokenId}
                        className="border border-zinc-800 p-4 shadow-[2px_2px_0px_0px_rgba(163,230,53,0.08)]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                              {institucion}
                            </p>
                            <p className="font-mono text-sm font-black text-white mt-1 uppercase leading-tight">
                              {nombre}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] text-lime-400 border border-lime-400/30 px-2 py-0.5 shrink-0">
                            #{c.tokenId}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-zinc-600">
                            {c.emitidaEn}
                          </span>
                          <span className="font-mono text-[10px] text-lime-400 uppercase tracking-widest">
                            ✓ soulbound
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}