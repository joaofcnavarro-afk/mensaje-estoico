import { useState } from "react";
import SelloSvg from "../SelloSvg";
import { Anuncio as AnuncioType } from "../../types";

interface AnuncioProps {
  anuncio: AnuncioType | null;
  usuario: any;
  onComprarAnuncio: () => Promise<void>;
  onMarcarVendido: () => Promise<void>;
  onNavigate: (vista: string) => void;
}

export default function Anuncio({
  anuncio,
  usuario,
  onComprarAnuncio,
  onMarcarVendido,
  onNavigate,
}: AnuncioProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!anuncio) {
    return (
      <div className="text-center py-8">
        <p className="text-wax font-serif">Anuncio no seleccionado.</p>
        <button onClick={() => onNavigate("mercado")} className="btn ghost mt-4">
          Volver
        </button>
      </div>
    );
  }

  const esMio = usuario && anuncio.vendedorUid === usuario.uid;
  const precioFormatted = `${anuncio.precio.toFixed(2).replace(".", ",")} €`;

  const handleComprar = async () => {
    setError("");
    setLoading(true);
    try {
      await onComprarAnuncio();
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al traer el sello. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetirar = async () => {
    if (!confirm("¿Retirar este anuncio del Mercado?")) return;
    setError("");
    setLoading(true);
    try {
      await onMarcarVendido();
      onNavigate("mercado");
    } catch (err: any) {
      setError(err?.message || "No se pudo retirar el anuncio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center py-4">
        <div className="flex justify-center py-4">
          <SelloSvg />
        </div>
        <h1 className="font-display font-medium text-2xl leading-snug tracking-wide text-ink">
          Sello de {anuncio.vendedor}
        </h1>
        <p className="mt-1 text-ink-soft text-sm font-serif">
          Publicado el {anuncio.fecha} · ID {anuncio.mensajeId}
        </p>
        <div className="font-display font-bold text-3xl text-wax mt-4 tracking-wider">
          {precioFormatted}
        </div>
      </div>

      {esMio ? (
        <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
          <h2 className="font-display font-bold text-[17px] tracking-widest text-ink uppercase">
            Tu anuncio
          </h2>
          <p className="text-ink-soft text-sm font-serif leading-relaxed">
            Este sello es tuyo. Cuando recibas el Bizum del comprador, compruébalo en tu cuenta de banco, envíale el código de entrega acordado y márcalo como vendido para retirarlo.
          </p>
          {error && <div className="text-wax text-sm font-serif text-center mt-3">{error}</div>}
          <button
            onClick={handleRetirar}
            disabled={loading}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200"
          >
            {loading ? "Procesando..." : "Marcar como vendido · retirar del Mercado"}
          </button>
        </div>
      ) : (
        <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
          <h2 className="font-display font-bold text-[17px] tracking-widest text-ink uppercase">
            Cómo comprarlo
          </h2>

          <div className="flex gap-4 items-start py-4 border-t border-stone-2">
            <span className="font-display font-bold text-bronze text-lg min-w-[34px]">I</span>
            <div>
              <b className="font-serif font-medium tracking-wide text-ink">Envía el Bizum</b>
              <small className="block text-ink-soft text-[15px] font-serif mt-1">
                Envía {precioFormatted} por Bizum al <b className="text-ink">{anuncio.bizum}</b> con concepto <b className="text-ink">SELLO</b>.
              </small>
            </div>
          </div>

          <div className="flex gap-4 items-start py-4 border-t border-stone-2">
            <span className="font-display font-bold text-bronze text-lg min-w-[34px]">II</span>
            <div>
              <b className="font-serif font-medium tracking-wide text-ink">Tráete el sello</b>
              <small className="block text-ink-soft text-[15px] font-serif mt-1">
                Pulsa el botón de abajo: el sello sellado llegará a este dispositivo.
              </small>
            </div>
          </div>

          <div className="flex gap-4 items-start py-4 border-t border-b border-stone-2">
            <span className="font-display font-bold text-bronze text-lg min-w-[34px]">III</span>
            <div>
              <b className="font-serif font-medium tracking-wide text-ink">Pide el código de entrega</b>
              <small className="block text-ink-soft text-[15px] font-serif mt-1">
                Escríbele al <b className="text-ink">{anuncio.bizum}</b> (el vendedor) para que te dé el código de entrega acordado para romper el sello.
              </small>
            </div>
          </div>

          {error && <div className="text-wax text-sm font-serif text-center mt-3">{error}</div>}

          <button
            onClick={handleComprar}
            disabled={loading}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200"
          >
            {loading ? "Cargando sello..." : "He pagado · Traer mi sello"}
          </button>
        </div>
      )}

      <button
        onClick={() => onNavigate("mercado")}
        className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
      >
        Volver al Mercado
      </button>
    </div>
  );
}
