import { useState } from "react";
import { Cliente, Mensaje } from "../../types";
import SelloSvg from "../SelloSvg";

interface CuentaProps {
  usuario: any;
  perfil: Cliente | null;
  mensajes: Mensaje[];
  onEntrar: (email: string, pass: string) => Promise<void>;
  onRegistrar: (email: string, pass: string) => Promise<void>;
  onSalir: () => Promise<void>;
  onNavigate: (vista: string) => void;
  onSelectMensaje: (id: string) => void;
  dbActive: boolean;
}

export default function Cuenta({
  usuario,
  perfil,
  mensajes,
  onEntrar,
  onRegistrar,
  onSalir,
  onNavigate,
  onSelectMensaje,
  dbActive,
}: CuentaProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (tipo: "entrar" | "registrar") => {
    setError("");
    if (!dbActive) {
      setError("La cuenta requiere conexión con la nube.");
      return;
    }
    if (!email.trim() || !pass) {
      setError("Rellena correo y contraseña.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (tipo === "entrar") {
        await onEntrar(email.trim(), pass);
      } else {
        await onRegistrar(email.trim(), pass);
      }
      setPass("");
      onNavigate("inicio");
    } catch (err: any) {
      setError(err?.message || "Error al autenticar. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  // Filter messages belonging to the current logged-in user
  const misMensajes = usuario ? mensajes.filter((m) => m.uid === usuario.uid) : [];

  const getIniciales = (nombre: string) => {
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0])
      .join("")
      .toUpperCase() || "?";
  };

  return (
    <div className="animate-fade-in space-y-6">
      {!usuario ? (
        <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
          <h2 className="font-display font-bold text-lg tracking-wider text-ink uppercase mb-2">
            Tu cuenta
          </h2>
          <p className="text-ink-soft text-sm font-serif leading-relaxed">
            Con una cuenta, tus sellos te acompañan: entra en cualquier dispositivo y aparecerán solos, sin necesidad de IDs. Tus mensajes siguen cifrados con tu código secreto.
          </p>

          <div>
            <label htmlFor="u-email" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
              Correo
            </label>
            <input
              id="u-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
          </div>

          <div>
            <label htmlFor="u-pass" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
              Contraseña (mínimo 6 caracteres)
            </label>
            <input
              id="u-pass"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
            />
          </div>

          {error && <div className="text-wax text-sm font-serif min-h-[1.4em] text-center mt-3">{error}</div>}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleAction("entrar")}
              disabled={loading}
              className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Comprobando..." : "Entrar"}
            </button>
            <button
              onClick={() => handleAction("registrar")}
              disabled={loading}
              className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-ink hover:bg-[#3a3b32] text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50"
            >
              Crear cuenta
            </button>
            <button
              onClick={() => onNavigate("inicio")}
              className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PROFILE DETAIL CARD */}
          <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)]">
            <h2 className="font-display font-bold text-xs tracking-[0.14em] text-ink-soft uppercase mb-4 text-center">
              Perfil de Cliente Estoico
            </h2>

            {perfil ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-stone/20 p-4 rounded border border-stone-2">
                  <div className="w-[52px] h-[52px] rounded-full bg-wax text-[#E8C9A0] font-display font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {getIniciales(perfil.nombre)}
                  </div>
                  <div className="truncate text-left">
                    <b className="block text-lg font-medium text-ink truncate">{perfil.nombre}</b>
                    <span className="text-bronze text-sm font-semibold">@{perfil.usuario}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-serif text-sm">
                  <div className="bg-[#FBFAF7] p-3 rounded border border-stone-2/50">
                    <span className="block text-xs font-display font-medium text-ink-soft uppercase tracking-wider mb-0.5">Correo electrónico</span>
                    <span className="text-ink break-all font-mono">{perfil.email}</span>
                  </div>
                  <div className="bg-[#FBFAF7] p-3 rounded border border-stone-2/50">
                    <span className="block text-xs font-display font-medium text-ink-soft uppercase tracking-wider mb-0.5">Teléfono (Bizum)</span>
                    <span className="text-ink font-mono">{perfil.telefono || "No especificado"}</span>
                  </div>
                  <div className="bg-[#FBFAF7] p-3 rounded border border-stone-2/50">
                    <span className="block text-xs font-display font-medium text-ink-soft uppercase tracking-wider mb-0.5">Fecha de nacimiento</span>
                    <span className="text-ink">{new Date(perfil.nacimiento).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="bg-[#FBFAF7] p-3 rounded border border-stone-2/50">
                    <span className="block text-xs font-display font-medium text-ink-soft uppercase tracking-wider mb-0.5">Miembro desde</span>
                    <span className="text-ink">{new Date(perfil.creado).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-wax/5 border border-bronze/30 p-5 rounded text-center space-y-3">
                <p className="text-ink-soft text-sm font-serif">
                  Has iniciado sesión con el correo <strong className="font-mono">{usuario.email}</strong>, pero aún no has registrado tu perfil de cliente estoico.
                </p>
                <p className="text-xs text-ink-soft/80 font-serif italic">
                  Es necesario registrar tu perfil para poder comerciar y recibir Bizums en el Mercado.
                </p>
                <button
                  onClick={() => onNavigate("registro")}
                  className="w-full sm:w-auto font-display text-xs font-bold tracking-widest py-2.5 px-4 bg-bronze hover:bg-bronze-dark text-card border-none rounded cursor-pointer uppercase transition-colors"
                >
                  📝 Crear mi perfil de cliente
                </button>
              </div>
            )}
          </div>

          {/* INVENTORY / SALES MANAGEMENT */}
          <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
            <h3 className="font-display font-bold text-xs tracking-[0.14em] text-ink-soft uppercase text-center">
              Gestión de Venta de tus Mensajes
            </h3>

            <p className="text-ink-soft text-xs font-serif text-center leading-relaxed max-w-[48ch] mx-auto">
              Aquí tienes tus mensajes sellados. Para **vender un mensaje** o **publicarlo en el mercado**, selecciona el mensaje para romper el sello. Una vez descifrado con tu código secreto, podrás re-encriptarlo para entregárselo a un comprador.
            </p>

            {misMensajes.length > 0 ? (
              <div className="space-y-3 pt-2">
                {misMensajes.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FBFAF7] border border-stone-2 rounded-md p-4 hover:shadow-sm transition-shadow text-left"
                  >
                    <div className="flex items-center gap-3">
                      <SelloSvg mini />
                      <div>
                        <b className="font-serif font-medium text-ink block">Para {m.nombre}</b>
                        <span className="block text-[11px] text-ink-soft font-mono">ID: {m.id}</span>
                        <span className="block text-xs text-ink-soft font-serif">Creado el {m.fecha}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectMensaje(m.id)}
                      className="w-full sm:w-auto whitespace-nowrap font-display text-xs font-bold tracking-widest py-2 px-4 bg-wax hover:bg-wax-dark text-card border-none rounded cursor-pointer uppercase transition-colors"
                    >
                      🔑 Vender o Regalar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-stone-2 rounded bg-stone/5">
                <p className="text-ink-soft text-sm font-serif italic">No tienes ningún mensaje sellado en esta cuenta.</p>
                <button
                  onClick={() => onNavigate("comprar")}
                  className="mt-3 font-display text-xs font-bold tracking-widest py-2 px-4 bg-transparent border border-stone-2 text-ink hover:bg-stone rounded cursor-pointer uppercase transition-colors"
                >
                  🛒 Comprar un mensaje
                </button>
              </div>
            )}
          </div>

          {/* LOGOUT / BACK BUTTONS */}
          <div className="space-y-3">
            <button
              onClick={onSalir}
              className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
            >
              Salir de la cuenta
            </button>
            <button
              onClick={() => onNavigate("inicio")}
              className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
