import { Anuncio } from "../../types";
import SelloSvg from "../SelloSvg";

interface MercadoProps {
  anuncios: Anuncio[];
  usuario: any;
  onSelectAnuncio: (id: string) => void;
  onNavigate: (vista: string) => void;
  loading: boolean;
  dbActive: boolean;
}

export default function Mercado({
  anuncios,
  usuario,
  onSelectAnuncio,
  onNavigate,
  loading,
  dbActive,
}: MercadoProps) {
  const getFormatPrecio = (p: number) => {
    return `${p.toFixed(2).replace(".", ",")} €`;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center py-4">
        <h1 className="font-display font-medium text-3xl leading-snug tracking-wide text-ink">
          El Mercado
        </h1>
        <p className="mt-2 text-ink-soft text-base font-serif max-w-[500px] mx-auto">
          Sellos que otros clientes han puesto a la venta. Cada uno guarda un mensaje único que su dueño nunca llegó a revelar.
        </p>
      </div>

      {!dbActive ? (
        <div className="text-center py-8 font-serif text-wax">
          El Mercado requiere conexión con la nube.
        </div>
      ) : loading ? (
        <div className="text-center py-8 font-serif text-ink-soft italic">
          Cargando el Mercado&hellip;
        </div>
      ) : anuncios.length === 0 ? (
        <div className="text-center py-8 font-serif text-ink-soft italic">
          El Mercado está vacío por ahora. Sé el primero en publicar un sello.
        </div>
      ) : (
        <div className="space-y-3">
          {anuncios.map((a) => {
            const esMio = usuario && a.vendedorUid === usuario.uid;
            return (
              <div
                key={a.mensajeId}
                role="button"
                tabIndex={0}
                onClick={() => onSelectAnuncio(a.mensajeId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectAnuncio(a.mensajeId);
                  }
                }}
                className="flex items-center gap-4 bg-card border border-stone-2 rounded-md p-3.5 hover:shadow-md cursor-pointer transition-shadow duration-200"
              >
                <SelloSvg mini />
                <div className="flex-1 min-w-0">
                  <b className="font-serif font-medium text-ink block truncate">
                    Sello de {a.vendedor} {esMio && <span className="text-xs text-bronze italic font-serif">· tuyo</span>}
                  </b>
                  <small className="text-ink-soft text-sm font-serif">
                    Publicado el {a.fecha}
                  </small>
                </div>
                <div className="font-display font-bold text-lg text-ink whitespace-nowrap">
                  {getFormatPrecio(a.precio)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => onNavigate("inicio")}
        className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
      >
        Volver
      </button>
    </div>
  );
}
