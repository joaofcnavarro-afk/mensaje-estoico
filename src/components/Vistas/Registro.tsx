import { useState } from "react";

interface RegistroProps {
  onRegistrarCliente: (datos: {
    nombre: string;
    usuario: string;
    nacimiento: string;
    telefono: string;
    email: string;
    pass: string;
  }) => Promise<void>;
  onNavigate: (vista: string) => void;
  dbActive: boolean;
}

export default function Registro({ onRegistrarCliente, onNavigate, dbActive }: RegistroProps) {
  const [nombre, setNombre] = useState("");
  const [usuarioInput, setUsuarioInput] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSimular = () => {
    const filosofos = [
      { nombre: "Séneca de Córdoba", usuario: "seneca_estoico", nacio: "1985-04-12", tel: "611222333" },
      { nombre: "Marco Aurelio Antonino", usuario: "marco_aurelio", nacio: "1970-04-26", tel: "622333444" },
      { nombre: "Epicteto de Hierápolis", usuario: "epicteto_libertad", nacio: "1995-10-05", tel: "633444555" },
      { nombre: "Zenón de Citio", usuario: "zenon_fundador", nacio: "1992-02-18", tel: "644555666" }
    ];
    const escogido = filosofos[Math.floor(Math.random() * filosofos.length)];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    
    setNombre(escogido.nombre);
    setUsuarioInput(escogido.usuario + "_" + randomSuffix);
    setNacimiento(escogido.nacio);
    setTelefono(escogido.tel);
    setEmail(`${escogido.usuario}.${randomSuffix}@gmail.com`);
    setPass("estoico123");
    setPass2("estoico123");
    setAcepto(true);
  };

  const handleSubmit = async () => {
    setError("");

    if (!dbActive) {
      setError("El registro requiere conexión con la nube.");
      return;
    }
    if (!nombre.trim()) {
      setError("Escribe tu nombre completo.");
      return;
    }
    const cleanUsuario = usuarioInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!/^[a-z0-9_\.]{3,20}$/.test(cleanUsuario)) {
      setError("Nombre de usuario: de 3 a 20 caracteres (letras, números, punto o guion bajo).");
      return;
    }
    if (!nacimiento) {
      setError("Indica tu fecha de nacimiento.");
      return;
    }
    const edad = (Date.now() - new Date(nacimiento).getTime()) / 31557600000;
    if (edad < 14) {
      setError("Debes tener al menos 14 años para registrarte.");
      return;
    }
    if (!email.trim()) {
      setError("Escribe tu correo.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (pass !== pass2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!acepto) {
      setError("Debes aceptar la política de privacidad para continuar.");
      return;
    }

    setLoading(true);
    try {
      await onRegistrarCliente({
        nombre: nombre.trim(),
        usuario: cleanUsuario,
        nacimiento,
        telefono: telefono.trim(),
        email: email.trim(),
        pass,
      });
      onNavigate("inicio");
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al registrar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
        <h2 className="font-display font-bold text-lg tracking-wider text-ink uppercase mb-2">
          Registro de cliente
        </h2>
        <p className="text-ink-soft text-sm font-serif leading-relaxed">
          Crea tu perfil de cliente estoico. Con él, tus sellos te acompañarán en cualquier dispositivo y podrás publicar y comerciar tus mensajes con otros filósofos en el Mercado.
        </p>

        {/* Botón de simulación para facilidad de pruebas */}
        <div className="bg-stone/5 p-4 rounded-md border border-stone-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-ink-soft font-serif leading-relaxed">
            <span className="font-semibold text-ink block mb-0.5">💡 Simulación de Cliente</span>
            ¿Quieres probar rápido? Genera datos aleatorios de un filósofo estoico para registrarte con un clic.
          </div>
          <button
            type="button"
            onClick={handleSimular}
            className="w-full sm:w-auto whitespace-nowrap font-display text-xs font-bold tracking-wider py-2 px-3.5 bg-card border border-bronze text-bronze hover:bg-bronze/5 rounded cursor-pointer uppercase transition-colors"
          >
            ✨ Simular Cliente
          </button>
        </div>

        <div>
          <label htmlFor="g-nombre" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Nombre completo
          </label>
          <input
            id="g-nombre"
            type="text"
            maxLength={50}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="p. ej. Marc Riera"
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="g-usuario" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Nombre de usuario
          </label>
          <input
            id="g-usuario"
            type="text"
            maxLength={20}
            value={usuarioInput}
            onChange={(e) => setUsuarioInput(e.target.value)}
            placeholder="p. ej. marc_estoico"
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="g-nac" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Fecha de nacimiento
          </label>
          <input
            id="g-nac"
            type="date"
            value={nacimiento}
            onChange={(e) => setNacimiento(e.target.value)}
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="g-tel" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Teléfono (opcional - necesario para vender)
          </label>
          <input
            id="g-tel"
            type="tel"
            maxLength={15}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="6XX XXX XXX"
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="g-email" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Correo
          </label>
          <input
            id="g-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="g-pass" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Contraseña (mínimo 6 caracteres)
          </label>
          <input
            id="g-pass"
            type="password"
            autoComplete="new-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div>
          <label htmlFor="g-pass2" className="block text-xs tracking-wider text-ink-soft uppercase mb-1.5 font-display font-medium">
            Repite la contraseña
          </label>
          <input
            id="g-pass2"
            type="password"
            autoComplete="new-password"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            className="w-full p-3 font-serif text-lg border border-stone-2 rounded-md bg-[#FBFAF7] text-ink focus:outline-2 focus:outline-bronze"
          />
        </div>

        <div className="flex gap-2 items-start mt-4 font-serif text-[15px] text-ink-soft">
          <input
            id="g-acepto"
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
            className="w-auto mt-1 cursor-pointer"
          />
          <label htmlFor="g-acepto" className="cursor-pointer">
            Acepto la <u onClick={(e) => { e.preventDefault(); onNavigate("privacidad"); }} className="underline hover:text-ink">política de privacidad</u>: mis datos de perfil se guardan de forma segura para gestionar mis interacciones. Mis mensajes seguirán cifrados con mi código y nadie en la base de datos podrá leerlos.
          </label>
        </div>

        {error && <div className="text-wax text-sm font-serif min-h-[1.4em] text-center mt-3">{error}</div>}

        <div className="space-y-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-wax hover:bg-wax-dark text-card border-none rounded-md cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Creando perfil..." : "Crear mi perfil"}
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
