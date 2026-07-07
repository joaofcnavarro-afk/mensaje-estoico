import { Cliente } from "../types";
import { User } from "firebase/auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: User | null;
  perfil: Cliente | null;
  onNavigate: (vista: string) => void;
}

export default function Sidebar({ isOpen, onClose, usuario, perfil, onNavigate }: SidebarProps) {
  const getIniciales = (nombre: string) => {
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0])
      .join("")
      .toUpperCase() || "?";
  };

  const getProfileName = () => {
    if (perfil) return perfil.nombre;
    if (usuario) return usuario.email || "Usuario";
    return "Invitado";
  };

  const getProfileHandle = () => {
    if (perfil) return `@${perfil.usuario}`;
    if (usuario) return "Registrado";
    return "Sin registrar";
  };

  const menuItems = [
    { num: "I", label: "Inicio", target: "inicio" },
    { num: "II", label: "Comprar mensaje", target: "comprar" },
    { num: "III", label: "Recuperar mensaje", target: "recuperar" },
    { num: "IV", label: "Registro de cliente", target: "registro" },
    { num: "V", label: "Mercado", target: "mercado" },
    { num: "VI", label: usuario ? "Mi cuenta" : "Mi cuenta · entrar", target: "cuenta" },
    { num: "VII", label: "Política de privacidad", target: "privacidad" },
  ];

  return (
    <>
      {/* Background overlay (Velo) */}
      <div
        id="velo"
        className={`fixed inset-0 bg-black/45 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slideout Drawer */}
      <nav
        id="drawer"
        aria-label="Menú principal"
        className={`fixed top-0 left-0 bottom-0 w-[290px] max-w-[85vw] bg-card border-r border-stone-2 z-50 overflow-y-auto py-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-[6px_0_24px_rgba(40,38,30,0.2)]" : "-translate-x-full"
        }`}
      >
        <div className="font-display font-bold tracking-[0.2em] text-[15px] px-[22px] pb-[18px] border-b border-stone-2">
          MENSAJE <span className="text-wax">ESTOICO</span>
        </div>

        {/* Profile details */}
        <div className="flex items-center gap-3 px-[22px] py-4 border-b border-stone-2">
          <div className="w-[46px] h-[46px] rounded-full bg-wax text-[#E8C9A0] font-display font-bold text-lg flex items-center justify-center flex-shrink-0">
            {getIniciales(getProfileName())}
          </div>
          <div className="truncate">
            <b className="block font-medium truncate text-ink">{getProfileName()}</b>
            <small className="text-ink-soft text-sm">{getProfileHandle()}</small>
          </div>
        </div>

        {/* Navigation items */}
        <div className="mt-2">
          {menuItems.map(item => (
            <button
              key={item.target}
              onClick={() => {
                onNavigate(item.target);
                onClose();
              }}
              className="w-full text-left font-serif text-lg text-ink px-[22px] py-[14px] border-b border-stone/30 hover:bg-stone transition-colors duration-200 cursor-pointer"
            >
              <span className="font-display font-bold text-bronze inline-block w-[30px] text-[15px]">
                {item.num}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
