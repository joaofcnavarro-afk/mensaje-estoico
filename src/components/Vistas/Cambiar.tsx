import { useState, useEffect } from "react";
import { Mensaje, Cliente } from "../../types";

interface CambiarProps {
  mensaje: Mensaje | null;
  modoCambio: "regalar" | "vender" | "mercado";
  perfil: Cliente | null;
  usuario: any;
  onConfirmar: (datos: {
    nombre: string;
    precio: number;
    bizum: string;
    pin: string;
  }) => Promise<void>;
  onNavigate: (vista: string) => void;
  dbActive: boolean;
}

export default function Cambiar({
  mensaje,
  modoCambio,
  perfil,
  usuario,
  onConfirmar,
  onNavigate,
  dbActive,
}: CambiarProps) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [bizum, setBizum] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (perfil?.telefono) {
      setBizum(perfil.telefono);
    }
  }, [perfil]);

  if (!mensaje) {
    return (
      <div className="text-center py-8">
        <p className="text-wax font-serif">Sello no seleccionado.</p>
        <button onClick={() => onNavigate("inicio")} className="btn ghost mt-4">
          Volver
        </button>
      </div>
    );
  }

  const esVenta = modoCambio === "vender";
  const esMercado = modoCambio === "mercado";

  const getTitulo = () => {
    if (esMercado) return "Publicar en el Mercado";
    if (esVenta) return "Vender mensaje";
    return "Regalar mensaje";
  };

  const getIntro = () => {
    if (esMercado) {
      return `Tu mensaje de <b>${mensaje.nombre}</b> se sellará de nuevo y aparecerá en el Mercado con tu precio. Quien lo compre te enviará un Bizum a tu número y te pedirá el <b>código de entrega</b> a ese mismo número.`;
    }
    if (esVenta) {
      return `Tu mensaje de <b>${mensaje.nombre}</b> se volverá a sellar a nombre del comprador, con un <b>código de entrega</b> que pactéis. Él te paga por Bizum; cuando cobres, le pasas el ID.`;
    }
    return `Tu mensaje de <b>${mensaje.nombre}</b> se volverá a sellar a nombre de otra persona, con un <b>código de entrega</b> que pactéis entre vosotros. Si esa persona hace lo mismo con el suyo, habréis intercambiado mensajes.`;
  };

  const handleSubmit = async () => {
    setError("");

    if (esMercado) {
      if (!usuario) {
        setError("Para publicar en el Mercado necesitas una cuenta (Registro de cliente).");
        return;
      }
      if (!dbActive) {
        setError("El Mercado requiere conexión con la nube.");
        return;
      }
      if (!/^\d[\d\s]{7,14}$/.test(bizum.trim())) {
        setError("Indica un número de Bizum válido.");
        return;
      }
    } else {
      if (!nombre.trim()) {
        setError(esVenta ? "Escribe el nombre del comprador." : "Escribe el nombre de la otra persona.");
        return;
      }
    }

    let numPrecio = 0;
    if (esVenta || esMercado) {
      numPrecio = parseFloat(precio);
      if (isNaN(numPrecio) || numPrecio <= 0) {
        setError("Indica un precio de venta válido.");
        return;
      }
    }

    if (!/^\d{4,8}$/.test(pin)) {
      setError("El código debe tener entre 4 y 8 dígitos.");
      return;
    }
    if (pin !== pin2) {
      setError("Los códigos no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await onConfirmar({
        nombre: esMercado ? "el Mercado" : nombre.trim(),
        precio: numPrecio,
        bizum: bizum.trim(),
        pin,
      });
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al procesar el cambio.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
        <h2 className="font-display font-bold text-lg tracking-wider text-ink uppercase mb-2">
          {getTitulo()}
        </h2>
        <p
          className="text-ink-soft text-sm font-serif leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getIntro() }}
        />

        {/* Recipient Name Field */}
        {!esMercado && (
          <div>
            <label htmlFor="x-nombre" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
              Nombre de la otra persona
            </label>
            <input
              id="x-nombre"
              type="text"
              maxLength={30}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="p. ej. Marta"
              className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
          </div>
        )}

        {/* Price Field */}
        {(esVenta || esMercado) && (
          <div>
            <label htmlFor="x-precio" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
              Precio de venta (€)
            </label>
            <input
              id="x-precio"
              type="number"
              min="0"
              step="0.50"
              inputMode="decimal"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="p. ej. 2.00"
              className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
            <p className="text-xs text-ink-soft mt-1 italic font-serif">
              {esMercado
                ? "Fija un precio justo: el comprador te paga por Bizum directamente a ti."
                : "El comprador te paga por Bizum directamente a ti. Cobra antes de compartir el ID."}
            </p>
          </div>
        )}

        {/* Bizum Field */}
        {esMercado && (
          <div>
            <label htmlFor="x-bizum" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
              Tu número de Bizum (se mostrará en el anuncio)
            </label>
            <input
              id="x-bizum"
              type="tel"
              maxLength={15}
              inputMode="numeric"
              value={bizum}
              onChange={(e) => setBizum(e.target.value)}
              placeholder="6XX XXX XXX"
              className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
          </div>
        )}

        {/* New PIN Fields */}
        <div>
          <label htmlFor="x-pin" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Código de entrega (4-8 dígitos)
          </label>
          <input
            id="x-pin"
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="x-pin2" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Repite el código de entrega
          </label>
          <input
            id="x-pin2"
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin2}
            onChange={(e) => setPin2(e.target.value)}
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
          <p className="text-xs text-ink-soft mt-1 italic font-serif">
            Pactad el código en persona o por otro canal: no lo enviéis junto al ID.
          </p>
        </div>

        {error && <div className="text-wax text-sm font-serif min-h-[1.4em] text-center mt-3">{error}</div>}

        <div className="space-y-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50"
          >
            {loading
              ? "Procesando..."
              : esMercado
              ? "Publicar en el Mercado"
              : esVenta
              ? "Sellar para el comprador"
              : "Sellar para esta persona"}
          </button>
          <button
            onClick={() => onNavigate("mensaje")}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
