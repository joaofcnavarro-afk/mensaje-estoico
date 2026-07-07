import { useState } from "react";
import SelloSvg from "../SelloSvg";
import { Mensaje } from "../../types";

interface AbrirProps {
  mensaje: Mensaje | null;
  onAbrir: (pin: string) => Promise<boolean>;
  onNavigate: (vista: string) => void;
}

export default function Abrir({ mensaje, onAbrir, onNavigate }: AbrirProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [roto, setRoto] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!mensaje) {
    return (
      <div className="text-center py-8">
        <p className="text-wax font-serif">Sello no seleccionado o inexistente.</p>
        <button onClick={() => onNavigate("inicio")} className="btn ghost mt-4">
          Volver
        </button>
      </div>
    );
  }

  const handleAbrir = async () => {
    setError("");
    if (!pin) {
      setError("Introduce tu código secreto.");
      return;
    }

    setLoading(true);
    try {
      const success = await onAbrir(pin);
      if (success) {
        setRoto(true);
        setTimeout(() => {
          setLoading(false);
          onNavigate("mensaje");
        }, 1200);
      } else {
        setError("El sello no cede: código incorrecto.");
        setLoading(false);
      }
    } catch (err) {
      setError("El sello no cede: código incorrecto.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center py-5">
        <div className="flex justify-center py-6">
          <SelloSvg roto={roto} />
        </div>
        <h1 className="font-display font-medium text-2xl leading-snug tracking-wide text-ink">
          Mensaje sellado para {mensaje.nombre}
        </h1>
        <p className="mt-1 text-ink-soft text-base font-serif">
          Sellado el {mensaje.fecha}
        </p>
        <p className="text-[14px] text-ink-soft/80 mt-4 font-serif">
          ID de recuperación (guárdalo para abrirlo en otro dispositivo):
        </p>
        <div className="font-mono text-sm tracking-wider bg-stone border border-stone-2 rounded-md p-2 mt-2 select-all break-all text-ink">
          {mensaje.id}
        </div>
      </div>

      <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] mt-4">
        <label htmlFor="a-pin" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
          Tu código secreto
        </label>
        <input
          id="a-pin"
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          disabled={loading || roto}
        />
        {error && <div className="text-wax text-sm font-serif min-h-[1.4em] text-center mt-3">{error}</div>}

        <div className="space-y-3 mt-4">
          <button
            onClick={handleAbrir}
            disabled={loading || roto}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Comprobando..." : "Romper el sello"}
          </button>
          <button
            onClick={() => onNavigate("inicio")}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
