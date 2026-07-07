import { useState } from "react";

interface RecuperarProps {
  onRecuperar: (id: string) => Promise<void>;
  onNavigate: (vista: string) => void;
  dbActive: boolean;
}

export default function Recuperar({ onRecuperar, onNavigate, dbActive }: RecuperarProps) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!id.trim()) {
      setError("Introduce el ID de recuperación.");
      return;
    }

    setLoading(true);
    try {
      await onRecuperar(id.trim());
    } catch (err: any) {
      setError(err?.message || "No se ha encontrado ningún sello con ese ID.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)]">
        <h2 className="font-display font-bold text-lg tracking-wider text-ink uppercase mb-2">
          Recuperar un mensaje
        </h2>
        <p className="text-ink-soft text-sm font-serif mb-4">
          Introduce el ID de recuperación que se te mostró al sellar tu mensaje. Lo traeremos a este dispositivo, todavía sellado.
        </p>

        <div>
          <label htmlFor="r-id" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            ID de recuperación
          </label>
          <input
            id="r-id"
            type="text"
            maxLength={40}
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="p. ej. kh73ks9-ld83hs"
            className="w-full p-3 font-mono text-sm border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze break-all"
          />
        </div>

        {error && <div className="text-wax text-sm font-serif min-h-[1.4em] text-center mt-3">{error}</div>}

        <div className="space-y-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-ink hover:bg-[#3a3b32] text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar mi sello"}
          </button>
          <button
            onClick={() => onNavigate("inicio")}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
          >
            Volver
          </button>
        </div>

        {!dbActive && (
          <p className="text-xs text-center text-bronze mt-4 italic font-serif">
            Sin conexión con la nube: no se pueden buscar IDs externos.
          </p>
        )}
      </div>
    </div>
  );
}
