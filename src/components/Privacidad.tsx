interface PrivacidadProps {
  onNavigate: (vista: string) => void;
  contactoEmail: string;
}

export default function Privacidad({ onNavigate, contactoEmail }: PrivacidadProps) {
  return (
    <div className="animate-fade-in">
      <div className="bg-card border border-stone-2 rounded-md p-6 shadow-[0_2px_8px_rgba(40,38,30,0.06)] space-y-4">
        <h2 className="font-display font-bold text-lg tracking-wider text-ink uppercase mb-2">
          Política de privacidad
        </h2>

        <div className="font-serif text-base text-ink space-y-4 leading-relaxed">
          <p>
            <b>Responsable:</b> Joao &middot; contacto:{" "}
            <a href={`mailto:${contactoEmail}`} className="underline text-bronze hover:text-ink">
              {contactoEmail}
            </a>
            .
          </p>

          <p>
            <b>Qué datos tratamos:</b> si te registras, tu nombre, nombre de usuario, correo, fecha de nacimiento y teléfono (opcional). Si compras, el nombre que indiques, la referencia del Bizum y la fecha. Si vendes o compras un mensaje en el Mercado, el precio, tu número de Bizum de contacto y los nombres de vendedor y comprador.
          </p>

          <p>
            <b>Qué NO podemos ver:</b> el contenido de tus mensajes estoicos. Se cifran localmente en tu propio dispositivo con tu código secreto (PIN) antes de enviarse o guardarse en cualquier base de datos. Nadie &mdash;tampoco nosotros&mdash; puede acceder ni leer su contenido sin poseer tu PIN secreto.
          </p>

          <p>
            <b>Finalidad:</b> gestionar tus compras, verificar los pagos por Bizum, permitirte recuperar tus sellos, o permitir que regales, heredes, vendas o intercambies tus mensajes con total confidencialidad. No usamos tus datos para fines publicitarios ni los cedemos a terceros.
          </p>

          <p>
            <b>Dónde se guardan:</b> en servidores gestionados por Google Firebase (Firestore y Authentication), que aplican altos estándares de seguridad y cifrado.
          </p>

          <p>
            <b>Tus derechos (RGPD):</b> puedes solicitar el acceso, rectificación, limitación o eliminación completa de tus datos en cualquier momento escribiendo al correo de contacto indicado. Al eliminar tu cuenta se destruye tu perfil y se rompe la vinculación con tus sellos guardados.
          </p>
        </div>

        <button
          onClick={() => onNavigate("inicio")}
          className="w-full font-display font-bold tracking-widest text-sm py-4 px-5 bg-transparent border border-stone-2 text-ink-soft hover:bg-stone-2 rounded-md cursor-pointer uppercase transition-colors duration-200 mt-4"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
