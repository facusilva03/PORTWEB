"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, TIPOS_CREDENCIAL } from "../../lib/contract";

const esAddressValida = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);

export default function PanelEmisor() {
  const [form, setForm] = useState({
    wallet: "",
    tipo: "0",
    institucion: "",
    titulo: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleEmitir(e: React.MouseEvent) {
    e.preventDefault();
    if (!form.wallet || !form.institucion || !form.titulo) return;

    const uri = `data:application/json;base64,${btoa(JSON.stringify({
  name: form.titulo,
  institution: form.institucion,
  type: TIPOS_CREDENCIAL[Number(form.tipo)],
  date: form.fecha,
}))}`;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "emitirCredencial",
      args: [form.wallet as `0x${string}`, uri, Number(form.tipo)],
    });
  }

  const estado = isSuccess ? "ok" : isConfirming ? "confirmando" : isPending ? "loading" : "idle";

  return (
    <div className="max-w-xl">
      <div className="mb-8 border-l-2 border-lime-400 pl-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
          panel_emisor // emitirCredencial()
        </p>
        <h2 className="font-mono text-3xl font-black text-white uppercase tracking-tighter">
          Emitir credencial
        </h2>
      </div>

      <div className="border border-zinc-700 bg-zinc-950 p-6 space-y-5">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1.5">
            Wallet del estudiante
          </label>
          <input name="wallet" value={form.wallet} onChange={handleChange}
            placeholder="0x..."
            className="w-full border border-zinc-700 bg-black px-4 py-3 font-mono text-sm text-white placeholder-zinc-800 outline-none focus:border-lime-400 transition-colors" />
          {form.wallet && !esAddressValida(form.wallet) && (
            <p className="font-mono text-[10px] text-red-400 mt-1">
              ✗ Dirección Ethereum inválida
            </p>
          )}
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1.5">
            Tipo de credencial
          </label>
          <select name="tipo" value={form.tipo} onChange={handleChange}
            className="w-full border border-zinc-700 bg-black px-4 py-3 font-mono text-sm text-white outline-none focus:border-lime-400 transition-colors">
            {TIPOS_CREDENCIAL.map((t, i) => (
              <option key={i} value={i}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1.5">
            Institución / Organización
          </label>
          <input name="institucion" value={form.institucion} onChange={handleChange}
            placeholder="Universidad Blockchain"
            className="w-full border border-zinc-700 bg-black px-4 py-3 font-mono text-sm text-white placeholder-zinc-800 outline-none focus:border-lime-400 transition-colors" />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1.5">
            Nombre de la credencial
          </label>
          <input name="titulo" value={form.titulo} onChange={handleChange}
            placeholder="Licenciatura en Ingeniería de Software"
            className="w-full border border-zinc-700 bg-black px-4 py-3 font-mono text-sm text-white placeholder-zinc-800 outline-none focus:border-lime-400 transition-colors" />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1.5">
            Fecha de emisión
          </label>
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange}
            className="w-full border border-zinc-700 bg-black px-4 py-3 font-mono text-sm text-white outline-none focus:border-lime-400 transition-colors" />
        </div>

        <button onClick={handleEmitir}
          disabled={estado !== "idle" || !esAddressValida(form.wallet) || !form.institucion || !form.titulo}
          className="w-full bg-lime-400 px-6 py-4 font-mono text-sm font-black text-black uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-[0_4px_0px_0px_#65a30d] active:translate-y-0 active:shadow-none transition-all disabled:opacity-25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none">
          {estado === "loading" ? "Esperando firma..." :
           estado === "confirmando" ? "Confirmando en blockchain..." :
           estado === "ok" ? "✓ Credencial emitida" :
           "Emitir SBT →"}
        </button>

        {estado === "ok" && txHash && (
          <div className="border-l-2 border-lime-400 border border-zinc-800 px-4 py-3 space-y-1">
            <p className="font-mono text-[10px] text-lime-400 uppercase tracking-widest">
              ▶ Token minted · Soulbound · Non-transferable
            </p>
            <p className="font-mono text-[10px] text-zinc-600 break-all">
              tx: {txHash}
            </p>
          </div>
        )}

        {error && (
          <div className="border-l-2 border-red-500 border border-zinc-800 px-4 py-3">
            <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">
              ✗ Error: {error.message.split("\n")[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}