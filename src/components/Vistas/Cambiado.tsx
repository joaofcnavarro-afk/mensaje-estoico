import SelloSvg from "../SelloSvg";

interface CambiadoProps {
  nuevoId: string;
  modoCambio: "regalar" | "vender" | "mercado";
  nombre: string;
  precio: number;
  onNavigate: (vista: string) => void;
}

export default function Cambiado({ nuevoId, modoCambio, nombre, precio, onNavigate }: CambiadoProps) {
  const esVenta = modoCambio === "vender";
  const esMercado = modoCambio === "mercado";

  const getTitulo = () => {
    const precioTxt = precio > 0 ? ` · ${precio.toFixed(2).replace(".", ",")} €` : "";
    if (esMercado) return `Publicado en el Mercado${precioTxt}`;
    if (esVenta) return `En venta para ${nombre}${precioTxt}`;
    return `Sellado de nuevo para ${nombre}`;
  };

  const getInstr = () => {
    if (esMercado) return "Este es el ID de tu sello (aparece también en el anuncio):";
    if (esVenta) return "Cuando recibas el Bizum del comprador, comparte con él este ID de recuperación:";
    return "Comparte este ID de recuperación con esa persona:";
  };

  const getNota = () => {
    if (esMercado) {
      return "Cuando alguien lo compre, te enviará el Bizum a tu número y te escribirá para pedirte el <b>código de entrega</b>. Compruébalo en tu banco, envíale el código, y retira el anuncio desde el Mercado con &laquo;Marcar como vendido&raquo;.";
    }
    if (esVenta) {
      return "No compartas el ID hasta haber cobrado. El comprador entrará en la app, pulsará &laquo;Ya tengo un mensaje&raquo;, pondrá el ID y abrirá el sello con el código de entrega. Después podrá volver a sellarlo con un código solo suyo.";
    }
    return "Ella entrará en la app, pulsará &laquo;Ya tengo un mensaje&raquo;, pondrá este ID y abrirá el sello con el código de entrega que hayáis pactado. Después podrá volver a sellarlo con un código solo suyo desde &laquo;Regalar&raquo;.";
  };

  return (
    <div className="animate-fade-in text-center py-5">
      <div className="flex justify-center py-6">
        <SelloSvg />
      </div>

      <h1 className="font-display font-medium text-2xl leading-snug tracking-wide text-ink">
        {getTitulo()}
      </h1>

      <p className="font-serif text-[15px] text-ink-soft/80 mt-3 max-w-[450px] mx-auto">
        {getInstr()}
      </p>

      <div className="font-mono text-base tracking-wider bg-stone border border-stone-2 rounded-md p-3 mt-3 select-all break-all text-ink max-w-[450px] mx-auto font-bold">
        {nuevoId}
      </div>

      <p
        className="text-xs text-ink-soft mt-5 text-center font-serif leading-relaxed max-w-[480px] mx-auto px-4"
        dangerouslySetInnerHTML={{ __html: getNota() }}
      />

      <button
        onClick={() => onNavigate("inicio")}
        className="block w-full max-w-[200px] mx-auto font-display font-bold tracking-widest text-sm py-4 px-5 mt-8 bg-ink hover:bg-[#3a3b32] text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200"
      >
        Hecho
      </button>
    </div>
  );
}
