import { useState, useEffect } from "react";
import { Cliente } from "../../types";

interface ComprarProps {
  precio: string;
  bizumTelefono: string;
  onComprar: (datos: { nombre: string; ref: string; tema: string; pin: string }) => Promise<void>;
  onNavigate: (vista: string) => void;
  perfil: Cliente | null;
}

export default function Comprar({ precio, bizumTelefono, onComprar, onNavigate, perfil }: ComprarProps) {
  const [nombre, setNombre] = useState("");
  const [ref, setRef] = useState("");
  const [tema, setTema] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [simulado, setSimulado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Prefill name if registered profile exists
  useEffect(() => {
    if (perfil) {
      setNombre(perfil.nombre);
    }
  }, [perfil]);

  const handleSimularCompra = () => {
    if (perfil) {
      setNombre(perfil.nombre);
    } else {
      setNombre("Cliente Simulado");
    }
    const randRef = "SIM-" + Math.floor(1000 + Math.random() * 9000);
    setRef(randRef);
    setPin("1234");
    setPin2("1234");
    setSimulado(true);
    setShowPin(true); // Auto-reveal PIN when simulating
  };

  const handleCopiarPin = () => {
    navigator.clipboard.writeText("1234");
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setError("");

    if (!ref.trim()) {
      setError("Indica la referencia del Bizum o últimos 4 dígitos de tu teléfono.");
      return;
    }
    if (!nombre.trim()) {
      setError("Escribe tu nombre.");
      return;
    }
    if (!pin) {
      setError("El código secreto es obligatorio.");
      return;
    }
    if (!/^\d{4,8}$/.test(pin)) {
      setError("El código debe tener entre 4 y 8 dígitos numéricos.");
      return;
    }
    if (pin !== pin2) {
      setError("Los códigos no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await onComprar({ nombre: nombre.trim(), ref: ref.trim(), tema, pin });
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al procesar la compra.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Botón de simulación para facilidad de pruebas */}
      <div className="bg-stone/5 p-4 rounded-md border border-stone-2 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-ink-soft font-serif leading-relaxed">
            <span className="font-semibold text-ink block mb-0.5">✨ Simular Compra (Prueba Rápida)</span>
            {perfil ? (
              <span>Autocompleta los datos con tu perfil registrado de <b>{perfil.nombre}</b> para simular la compra.</span>
            ) : (
              <span>Rellena los datos ficticios automáticamente para probar el flujo de compra.</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSimularCompra}
            className="w-full sm:w-auto whitespace-nowrap font-display text-xs font-bold tracking-wider py-2 px-3.5 bg-card border border-bronze text-bronze hover:bg-bronze/5 rounded cursor-pointer uppercase transition-colors"
          >
            💳 Simular Datos
          </button>
        </div>
        {simulado && (
          <div className="bg-stone-2/30 p-2.5 rounded border border-stone-2 text-xs flex items-center justify-between gap-2 animate-fade-in">
            <span className="font-serif text-ink-soft">
              🔑 Código secreto simulado para pruebas: <strong className="font-mono text-sm text-bronze font-bold select-all bg-card px-1.5 py-0.5 rounded border border-stone-2/50">1234</strong>
            </span>
            <button
              type="button"
              onClick={handleCopiarPin}
              className="text-[10px] text-bronze font-bold tracking-wider uppercase hover:underline cursor-pointer bg-card px-2 py-1 rounded border border-stone-2 hover:bg-stone transition-colors"
            >
              {copiado ? "✅ ¡Copiado!" : "📋 Copiar Código"}
            </button>
          </div>
        )}
      </div>

      {/* CARD I - Pago */}
      <div className="bg-card border border-stone-2 rounded-md p-[26px] shadow-[0_2px_8px_rgba(40,38,30,0.06)]">
        <h2 className="font-display font-bold text-[17px] tracking-widest text-ink uppercase mb-4">
          I · El pago
        </h2>
        <div className="bg-stone border border-dashed border-bronze rounded-md p-4 text-center">
          <small className="text-ink-soft text-sm block">Envía un Bizum de <b className="font-bold text-ink">{precio}</b> al número</small>
          <div className="font-display font-bold text-2xl tracking-widest text-ink my-1">
            {bizumTelefono}
          </div>
          <small className="text-ink-soft text-sm block">Concepto: <b className="font-bold text-ink">MENSAJE</b></small>
        </div>

        <div className="mt-4">
          <label htmlFor="c-ref" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Referencia del Bizum (o últimos 4 dígitos de tu teléfono)
          </label>
          <input
            id="c-ref"
            type="text"
            maxLength={20}
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="p. ej. 4821"
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>
      </div>

      {/* CARD II - Para quién */}
      <div className="bg-card border border-stone-2 rounded-md p-[26px] shadow-[0_2px_8px_rgba(40,38,30,0.06)]">
        <h2 className="font-display font-bold text-[17px] tracking-widest text-ink uppercase mb-4">
          II · Para quién
        </h2>
        <div>
          <label htmlFor="c-nombre" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Tu nombre
          </label>
          <input
            id="c-nombre"
            type="text"
            maxLength={30}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="p. ej. Marc"
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="c-tema" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            ¿Sobre qué necesitas oír algo? (opcional)
          </label>
          <select
            id="c-tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          >
            <option value="">Que el filósofo elija</option>
            <option value="la serenidad ante lo que no controlas">Serenidad</option>
            <option value="la adversidad y cómo atravesarla">Adversidad</option>
            <option value="la disciplina y el trabajo diario">Disciplina</option>
            <option value="una pérdida o despedida">Pérdida</option>
            <option value="encontrar propósito y dirección">Propósito</option>
            <option value="el miedo al futuro">Miedo al futuro</option>
          </select>
        </div>
      </div>

      {/* CARD III - Tu código secreto */}
      <div className="bg-card border border-stone-2 rounded-md p-[26px] shadow-[0_2px_8px_rgba(40,38,30,0.06)]">
        <h2 className="font-display font-bold text-[17px] tracking-widest text-ink uppercase mb-4">
          III · Tu código secreto
        </h2>
        <p className="text-ink-soft text-sm font-serif mb-3">
          Entre 4 y 8 dígitos. Es la única llave: si lo pierdes, el mensaje quedará sellado para siempre.
        </p>
        <div>
          <label htmlFor="c-pin" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Código
          </label>
          <div className="relative">
            <input
              id="c-pin"
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 pr-20 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-bronze font-bold hover:underline cursor-pointer uppercase tracking-wider"
            >
              {showPin ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="c-pin2" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Repite el código
          </label>
          <div className="relative">
            <input
              id="c-pin2"
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={8}
              value={pin2}
              onChange={(e) => setPin2(e.target.value)}
              className="w-full p-3 pr-20 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-bronze font-bold hover:underline cursor-pointer uppercase tracking-wider"
            >
              {showPin ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-wax text-sm font-serif min-h-[1.4em] text-center mt-3">{error}</div>}

      <div className="space-y-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? "Generando mensaje..." : "He pagado · Escribir y sellar"}
        </button>
        <button
          onClick={() => onNavigate("inicio")}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
