import { Mensaje as MensajeType, TextoAbierto } from "../../types";

interface MensajeProps {
  mensaje: MensajeType | null;
  textoAbierto: TextoAbierto | null;
  onNavigate: (vista: string) => void;
  onPrepareCambiar: (modo: "regalar" | "vender" | "mercado") => void;
  onEliminarActual: () => void;
}

export default function Mensaje({
  mensaje,
  textoAbierto,
  onNavigate,
  onPrepareCambiar,
  onEliminarActual,
}: MensajeProps) {
  if (!mensaje || !textoAbierto) {
    return (
      <div className="text-center py-8">
        <p className="text-wax font-serif">Error de descifrado o contenido no disponible.</p>
        <button onClick={() => onNavigate("inicio")} className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200 mt-4">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Parchment (Pergamino) container */}
      <div className="bg-gradient-to-b from-[#F7F4EC] to-[#EFEADD] border border-[#D8D0BC] rounded-md px-7 py-9 shadow-[0_4px_14px_rgba(40,38,30,0.12)] relative">
        {/* Top/bottom decorative ripples/dashed borders */}
        <div className="absolute left-0 right-0 top-2 h-1.5 bg-[repeating-linear-gradient(90deg,transparent_0_6px,#D8D0BC_6px_7px)] opacity-50" />
        <div className="absolute left-0 right-0 bottom-2 h-1.5 bg-[repeating-linear-gradient(90deg,transparent_0_6px,#D8D0BC_6px_7px)] opacity-50" />

        <div className="font-display font-medium text-xs tracking-[0.2em] text-bronze text-center uppercase mb-[18px]">
          Para {mensaje.nombre} · {mensaje.fecha}
        </div>

        <div className="font-serif text-[20px] leading-[1.7] text-ink whitespace-pre-wrap">
          {textoAbierto.texto}
        </div>

        <div className="mt-[22px] text-right font-serif italic text-ink-soft text-[17px]">
          {textoAbierto.firma}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={() => onNavigate("inicio")}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-ink hover:bg-[#3a3b32] text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Volver a sellar
        </button>
        <button
          onClick={() => onPrepareCambiar("regalar")}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Regalar a otra persona
        </button>
        <button
          onClick={() => onPrepareCambiar("vender")}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Vender este mensaje
        </button>
        <button
          onClick={() => onPrepareCambiar("mercado")}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Publicar en el Mercado
        </button>
        <button
          onClick={onEliminarActual}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Quitar de este dispositivo
        </button>
      </div>

      <p className="text-ink-soft text-sm mt-3.5 text-center font-serif italic">
        Al salir, el mensaje vuelve a quedar sellado con tu código.
      </p>
    </div>
  );
}
