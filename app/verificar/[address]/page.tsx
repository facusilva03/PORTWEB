"use client";

import { useParams } from "next/navigation";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI, TIPOS_CREDENCIAL } from "../../../lib/contract";

interface Credencial {
  tokenId: string;
  tipo: number;
  emisor: string;
  emitidaEn: string;
  uri: string;
}

export default function VistaVerificador() {
  const { address } = useParams();
  const client = usePublicClient();
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      if (!client || !address) return;
      setCargando(true);
      try {
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
          fromBlock: 0n,
          toBlock: "latest",
        });

        const items: Credencial[] = await Promise.all(
          logs.map(async (log) => {
            const tokenId = log.args.tokenId?.toString() ?? "?";
            const data = await client.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: "credenciales",
              args: [BigInt(tokenId)],
            }) as [string, number, bigint, boolean];

            return {
              tokenId,
              tipo: Number(log.args.tipo ?? 0),
              emisor: data[0],
              emitidaEn: new Date(Number(data[2]) * 1000).toISOString().split("T")[0],
              uri: log.args.uri ?? "",
            };
          })
        );

        setCredenciales(items.filter((_, i) => {
          const data = items[i];
          return data !== null;
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [address, client]);

  function parsear(uri: string) {
    try {
      const json = JSON.parse(atob(uri.replace("data:application/json;base64,", "")));
      return { nombre: json.name ?? uri, institucion: json.institution ?? "—" };
    } catch {
      return { nombre: uri, institucion: "—" };
    }
  }

  const addr = Array.isArray(address) ? address[0] : address;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="border-b border-zinc-800 sticky top-0 z-10 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="font-mono text-sm font-black uppercase">DNIPRO</span>
          <span className="font-mono text-[10px] text-zinc-600 border border-zinc-800 px-3 py-1.5 uppercase tracking-widest">
            Vista verificador // solo lectura
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Encabezado del perfil */}
        <div className="mb-10 border-l-2 border-lime-400 pl-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
            verificación_on-chain // polygon_amoy
          </p>
          <h1 className="font-mono text-3xl font-black text-white uppercase tracking-tighter">
            {addr?.slice(0, 8)}...{addr?.slice(-6)}
          </h1>
          <p className="font-mono text-xs mt-1">
            {cargando ? (
              <span className="text-zinc-600 animate-pulse">// Verificando en blockchain...</span>
            ) : (
              <span className="text-lime-400">
                ✓ {credenciales.length} credencial(es) verificada(s) on-chain
              </span>
            )}
          </p>
        </div>

        {/* Credenciales */}
        {!cargando && (
          <div className="grid gap-6 lg:grid-cols-2">
            {[0, 1, 2, 3].map((tipo) => {
              const items = credenciales.filter((c) => c.tipo === tipo);
              return (
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
                    <p className="font-mono text-[10px] text-zinc-700">// Sin credenciales</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((c) => {
                        const { nombre, institucion } = parsear(c.uri);
                        return (
                          <div key={c.tokenId} className="border border-zinc-800 p-4">
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
                              <span className="font-mono text-[10px] text-zinc-600">{c.emitidaEn}</span>
                              <span className="font-mono text-[10px] text-lime-400 uppercase tracking-widest">
                                ✓ verificado on-chain
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* Link de verificación */}
        {!cargando && credenciales.length > 0 && (
          <div className="mt-8 border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">
              // Contrato verificado
            </p>
            <p className="font-mono text-[10px] text-zinc-500 break-all">
              {CONTRACT_ADDRESS}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
