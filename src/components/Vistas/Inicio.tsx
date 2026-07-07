import SelloSvg from "../SelloSvg";
import { Mensaje } from "../../types";

interface InicioProps {
  mensajes: Mensaje[];
  precio: string;
  onNavigate: (vista: string) => void;
  onSelectMensaje: (id: string) => void;
  usuario: any;
}

export default function Inicio({ mensajes, precio, onNavigate, onSelectMensaje, usuario }: InicioProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center py-8">
        <div className="flex justify-center py-6">
          <SelloSvg onClick={() => onNavigate("comprar")} />
        </div>
        <h1 className="font-display font-medium text-3xl leading-snug tracking-wide text-ink">
          Un mensaje único,<br />escrito solo para ti
        </h1>
        <p className="mt-4 mx-auto max-w-[44ch] text-ink-soft text-lg font-serif">
          Al comprarlo, un filósofo escribe unas palabras que nadie más leerá. Quedan selladas con tu código secreto: ni siquiera nosotros podemos abrirlas.
        </p>
        <div className="font-display font-bold text-xl mt-5 tracking-wider text-ink">
          {precio} · pago por Bizum
        </div>
        <button
          onClick={() => onNavigate("comprar")}
          className="block w-full font-display font-bold tracking-widest text-sm py-4 px-5 mt-6 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Comprar mi mensaje
        </button>
        <button
          onClick={() => onNavigate("recuperar")}
          className="block w-full text-center mt-5 text-ink-soft text-sm italic underline bg-none border-none cursor-pointer font-serif"
        >
          Ya tengo un mensaje · recuperarlo en este dispositivo
        </button>
        {!usuario && (
          <button
            onClick={() => onNavigate("cuenta")}
            className="block w-full text-center mt-3 text-ink-soft text-sm italic underline bg-none border-none cursor-pointer font-serif"
          >
            Crear cuenta o entrar
          </button>
        )}
      </div>

      {/* Dynamic list of existing messages */}
      {mensajes.length > 0 && (
        <div className="mt-8">
          <div className="mt-8 border-t border-stone-2 pt-6">
            <h2 className="font-display text-xs font-bold tracking-[0.14em] text-ink-soft text-center uppercase mb-4">
              Tus mensajes sellados
            </h2>
          </div>
          <div className="space-y-3">
            {mensajes.map(m => (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectMensaje(m.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectMensaje(m.id);
                  }
                }}
                className="flex items-center gap-4 bg-card border border-stone-2 rounded-md p-3 hover:shadow-md cursor-pointer transition-shadow duration-200"
              >
                <SelloSvg mini />
                <div className="truncate">
                  <b className="font-serif font-medium text-ink block">Para {m.nombre}</b>
                  <small className="text-ink-soft text-sm font-serif">Sellado el {m.fecha}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps section */}
      <div className="mt-12 space-y-4">
        <div className="flex gap-4 items-start py-4 border-t border-stone-2">
          <span className="font-display font-bold text-bronze text-lg min-w-[34px]">I</span>
          <div>
            <b className="font-serif font-medium tracking-wide text-ink">Envía el Bizum</b>
            <small className="block text-ink-soft text-[15px] font-serif">Al número indicado, con el importe exacto.</small>
          </div>
        </div>
        <div className="flex gap-4 items-start py-4 border-t border-stone-2">
          <span className="font-display font-bold text-bronze text-lg min-w-[34px]">II</span>
          <div>
            <b className="font-serif font-medium tracking-wide text-ink">Se escribe tu mensaje</b>
            <small className="block text-ink-soft text-[15px] font-serif">Único, irrepetible, pensado para ti en este momento por la IA estoica.</small>
          </div>
        </div>
        <div className="flex gap-4 items-start py-4 border-t border-b border-stone-2">
          <span className="font-display font-bold text-bronze text-lg min-w-[34px]">III</span>
          <div>
            <b className="font-serif font-medium tracking-wide text-ink">Séllalo con tu código</b>
            <small className="block text-ink-soft text-[15px] font-serif">Solo tú podrás romper el sello y leerlo, cuando quieras.</small>
          </div>
        </div>
      </div>
    </div>
  );
}
