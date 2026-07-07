import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocFromServer,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { db, auth, handleFirestoreError, OperationType } from "./lib/firebase";
import { Mensaje, Cliente, Anuncio, TextoAbierto } from "./types";
import { cifrar, descifrar } from "./utils/crypto";
import { generarMensajeLocal } from "./utils/localGenerator";

// Views
import Inicio from "./components/Vistas/Inicio";
import Comprar from "./components/Vistas/Comprar";
import Escribiendo from "./components/Vistas/Escribiendo";
import Abrir from "./components/Vistas/Abrir";
import MensajeVista from "./components/Vistas/Mensaje";
import Recuperar from "./components/Vistas/Recuperar";
import Cambiar from "./components/Vistas/Cambiar";
import Cambiado from "./components/Vistas/Cambiado";
import Cuenta from "./components/Vistas/Cuenta";
import Registro from "./components/Vistas/Registro";
import Mercado from "./components/Vistas/Mercado";
import AnuncioVista from "./components/Vistas/Anuncio";
import Privacidad from "./components/Privacidad";
import Sidebar from "./components/Sidebar";

// Icons
import { Menu } from "lucide-react";

const CONFIG = {
  bizumTelefono: "612 20 14 39",
  precio: "1,50 €",
  contactoEmail: "joaofc.navarro@gmail.com",
};

const KEY_CACHE = "mensajes-estoicos-cache-v2";

export default function App() {
  const [vista, setVista] = useState<string>("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [actualId, setActualId] = useState<string | null>(null);
  const [textoAbierto, setTextoAbierto] = useState<TextoAbierto | null>(null);

  // Auth & Profile state
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Cliente | null>(null);
  const [dbActive, setDbActive] = useState(true);

  // Marketplace states
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [anuncioActual, setAnuncioActual] = useState<Anuncio | null>(null);
  const [loadingMercado, setLoadingMercado] = useState(false);

  // Transfer states
  const [modoCambio, setModoCambio] = useState<"regalar" | "vender" | "mercado">("regalar");
  const [nuevoId, setNuevoId] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState(0);

  // Load local cache initially
  useEffect(() => {
    try {
      const cached = localStorage.getItem(KEY_CACHE);
      if (cached) {
        setMensajes(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Error reading cache", e);
    }
  }, []);

  // Sync cache helper
  const saveToCache = useCallback((lista: Mensaje[]) => {
    try {
      localStorage.setItem(KEY_CACHE, JSON.stringify(lista));
    } catch (e) {
      console.error("Error writing cache", e);
    }
  }, []);

  // Validate Firestore Connection on start as per guidelines
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
        setDbActive(true);
      } catch (error: any) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.error("Please check your Firebase configuration.");
          setDbActive(false);
        }
      }
    }
    testConnection();
  }, []);

  // Handle Auth state changes and real-time syncing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUsuario(u);
      if (u) {
        // Fetch or listen to profile
        const profileRef = doc(db, "clientes", u.uid);
        onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            setPerfil(snap.data() as Cliente);
          } else {
            setPerfil(null);
          }
        }, (error) => {
          console.warn("Error listening to profile:", error);
        });

        // Real-time listen to user's claimed messages
        const q = query(collection(db, "mensajes"), where("uid", "==", u.uid));
        onSnapshot(q, (snap) => {
          const userMessages: Mensaje[] = [];
          snap.forEach((d) => {
            userMessages.push(d.data() as Mensaje);
          });

          // Merge with any local unclaimed messages from state
          setMensajes((prev) => {
            const localUnclaimed = prev.filter(m => m.uid === null);
            const combined = [...localUnclaimed];
            userMessages.forEach((um) => {
              const idx = combined.findIndex(x => x.id === um.id);
              if (idx >= 0) {
                combined[idx] = um;
              } else {
                combined.push(um);
              }
            });
            saveToCache(combined);
            return combined;
          });
        }, (error) => {
          console.error("Error syncing user messages:", error);
        });
      } else {
        setPerfil(null);
      }
    });

    return () => unsubscribe();
  }, [saveToCache]);

  // Load Marketplace postings
  const loadMarketplace = useCallback(async () => {
    if (!dbActive) return;
    setLoadingMercado(true);
    const path = "mercado";
    try {
      const q = query(collection(db, path), orderBy("creado", "desc"), limit(30));
      const snap = await getDocs(q);
      const listings: Anuncio[] = [];
      snap.forEach((d) => {
        listings.push(d.data() as Anuncio);
      });
      setAnuncios(listings);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    } finally {
      setLoadingMercado(false);
    }
  }, [dbActive]);

  // Handle active navigation
  const handleNavigate = (target: string) => {
    setVista(target);
    if (target === "inicio") {
      setTextoAbierto(null);
    } else if (target === "mercado") {
      loadMarketplace();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Claim any unclaimed local messages once logged in
  useEffect(() => {
    if (usuario && mensajes.length > 0) {
      const claim = async () => {
        const path = "mensajes";
        for (const m of mensajes) {
          if (m.uid === null) {
            try {
              const updated = { ...m, uid: usuario.uid };
              await setDoc(doc(db, path, m.id), updated);
              setMensajes(prev => {
                const next = prev.map(x => x.id === m.id ? updated : x);
                saveToCache(next);
                return next;
              });
            } catch (e) {
              console.warn("Couldn't claim message to user profile:", e);
            }
          }
        }
      };
      claim();
    }
  }, [usuario, mensajes, saveToCache]);

  // Handle purchasing and generating new Stoic message
  const handleComprar = async (datos: { nombre: string; ref: string; tema: string; pin: string }) => {
    setVista("escribiendo");

    try {
      let rawResult: { texto: string; firma: string };

      try {
        // Call our Express server endpoint to invoke the Gemini API
        const response = await fetch("/api/generate-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: datos.nombre,
            tema: datos.tema,
          }),
        });

        if (!response.ok) {
          throw new Error("No se pudo conectar con el filósofo de guardia.");
        }

        rawResult = await response.json();
        if (!rawResult || !rawResult.texto) {
          throw new Error("No se pudo generar el mensaje.");
        }
      } catch (err) {
        console.warn("API generation failed, falling back to local generator:", err);
        // Fallback to local generator
        rawResult = generarMensajeLocal(datos.nombre, datos.tema);
      }

      // Encrypt the content client-side with PBKDF2 + AES-GCM using PIN
      const textToEncrypt = JSON.stringify({
        texto: rawResult.texto,
        firma: rawResult.firma,
      });

      const encrypted = await cifrar(textToEncrypt, datos.pin);

      const nuevoSello: Mensaje = {
        id: Math.random().toString(36).substring(2, 9) + "-" + Date.now().toString(36).substring(3, 8),
        nombre: datos.nombre,
        ref: datos.ref,
        fecha: new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        creado: Date.now(),
        uid: usuario ? usuario.uid : null,
        ...encrypted,
      };

      // Persist locally
      setMensajes((prev) => {
        const next = [nuevoSello, ...prev];
        saveToCache(next);
        return next;
      });

      // Persist to Cloud Firestore if connected
      if (dbActive) {
        const path = "mensajes";
        try {
          await setDoc(doc(db, path, nuevoSello.id), nuevoSello);
        } catch (error) {
          console.warn("Couldn't sync to Firestore:", error);
        }
      }

      setActualId(nuevoSello.id);
      setVista("abrir");
    } catch (err: any) {
      setVista("comprar");
      throw err;
    }
  };

  // Decrypt and open active seal
  const handleAbrir = async (pin: string): Promise<boolean> => {
    const m = mensajes.find(x => x.id === actualId);
    if (!m) return false;

    try {
      const decryptedStr = await descifrar(m.salt, m.iv, m.datos, pin);
      const content = JSON.parse(decryptedStr) as TextoAbierto;
      setTextoAbierto(content);
      return true;
    } catch (e) {
      console.error("PIN incorrecto o descifrado fallido", e);
      return false;
    }
  };

  // Recover encrypted message from Firestore via recovery ID
  const handleRecuperar = async (id: string) => {
    if (mensajes.some(x => x.id === id)) {
      setActualId(id);
      handleNavigate("abrir");
      return;
    }

    if (!dbActive) {
      throw new Error("Sin conexión con la nube en este momento.");
    }

    const path = `mensajes/${id}`;
    try {
      const snap = await getDoc(doc(db, "mensajes", id));
      if (!snap.exists()) {
        throw new Error("No se ha encontrado ningún sello con ese ID.");
      }

      const recovered = snap.data() as Mensaje;
      // Claim the recovered seal if signed in and unclaimed
      if (usuario && !recovered.uid) {
        recovered.uid = usuario.uid;
        await updateDoc(doc(db, "mensajes", id), { uid: usuario.uid });
      }

      setMensajes((prev) => {
        const next = [...prev, recovered];
        saveToCache(next);
        return next;
      });

      setActualId(id);
      handleNavigate("abrir");
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("No se ha encontrado")) {
        throw error;
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  // Gift/Sell or list on Marketplace
  const handlePrepareCambiar = (modo: "regalar" | "vender" | "mercado") => {
    setModoCambio(modo);
    handleNavigate("cambiar");
  };

  // Complete re-encryption & transfer
  const handleConfirmarCambio = async (datos: {
    nombre: string;
    precio: number;
    bizum: string;
    pin: string;
  }) => {
    const orig = mensajes.find(x => x.id === actualId);
    if (!orig || !textoAbierto) {
      throw new Error("Error: contenido original no disponible.");
    }

    const esVenta = modoCambio === "vender";
    const esMercado = modoCambio === "mercado";

    // Cifrar con el nuevo pin de entrega/regalo
    const stringified = JSON.stringify(textoAbierto);
    const encrypted = await cifrar(stringified, datos.pin);

    const transferId = Math.random().toString(36).substring(2, 9) + "-" + Date.now().toString(36).substring(3, 8);
    const nuevoSello: Mensaje = {
      id: transferId,
      nombre: datos.nombre,
      ref: esMercado ? "mercado" : esVenta ? "venta" : "regalo",
      origen: `Sello original de ${orig.nombre}`,
      fecha: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      creado: Date.now(),
      uid: null, // Ownership starts at null for the transferee to claim
      ...encrypted,
    };

    // 1) Guardar el nuevo mensaje en Firestore/Local
    if (dbActive) {
      await setDoc(doc(db, "mensajes", transferId), nuevoSello);
    }

    // 2) Si es venta o mercado, registrar metadatos de ventas/anuncios
    if (esVenta && dbActive) {
      await setDoc(doc(db, "ventas", transferId), {
        mensajeId: transferId,
        precio: datos.precio,
        vendedorUid: usuario ? usuario.uid : null,
        vendedorNombre: perfil ? perfil.nombre : orig.nombre,
        comprador: datos.nombre,
        fecha: nuevoSello.fecha,
        creado: Date.now(),
      });
    }

    if (esMercado && dbActive && usuario) {
      await setDoc(doc(db, "mercado", transferId), {
        mensajeId: transferId,
        precio: datos.precio,
        bizum: datos.bizum,
        vendedorUid: usuario.uid,
        vendedor: perfil?.usuario ? `@${perfil.usuario}` : (perfil?.nombre || "vendedor"),
        fecha: nuevoSello.fecha,
        creado: Date.now(),
      });
    }

    // 3) Eliminar sello original
    if (dbActive) {
      await deleteDoc(doc(db, "mensajes", orig.id));
    }

    setMensajes((prev) => {
      const filtered = prev.filter(x => x.id !== orig.id);
      saveToCache(filtered);
      return filtered;
    });

    setNuevoId(transferId);
    setNuevoNombre(datos.nombre);
    setNuevoPrecio(datos.precio);
    handleNavigate("cambiado");
  };

  // Remove message locally
  const handleEliminarActual = async () => {
    if (!actualId) return;
    if (!confirm("¿Quitar este mensaje de este dispositivo? Podrás recuperarlo con su ID mientras exista en la nube.")) return;

    setMensajes((prev) => {
      const filtered = prev.filter(x => x.id !== actualId);
      saveToCache(filtered);
      return filtered;
    });

    setActualId(null);
    setTextoAbierto(null);
    handleNavigate("inicio");
  };

  // Auth helper: Email/Pass Login
  const handleEntrar = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // Auth helper: Email/Pass Register
  const handleRegistrar = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  // Register Customer Profile (Firestore)
  const handleRegistrarCliente = async (datos: {
    nombre: string;
    usuario: string;
    nacimiento: string;
    telefono: string;
    email: string;
    pass: string;
  }) => {
    await createUserWithEmailAndPassword(auth, datos.email, datos.pass);
    // Wait for auth to settle
    await new Promise(r => setTimeout(r, 450));
    const curr = auth.currentUser;
    if (!curr) throw new Error("Error de inicio de sesión tras crear la cuenta.");

    const clientData: Cliente = {
      nombre: datos.nombre,
      usuario: datos.usuario,
      email: datos.email,
      nacimiento: datos.nacimiento,
      telefono: datos.telefono || null,
      creado: Date.now(),
    };

    await setDoc(doc(db, "clientes", curr.uid), clientData);
    setPerfil(clientData);
  };

  // Sign out
  const handleSalir = async () => {
    await signOut(auth);
    setPerfil(null);
    setMensajes(prev => {
      const localOnly = prev.filter(m => m.uid === null);
      saveToCache(localOnly);
      return localOnly;
    });
    handleNavigate("inicio");
  };

  // Marketplace selection and purchase
  const handleSelectAnuncio = (id: string) => {
    const ad = anuncios.find(x => x.mensajeId === id);
    if (ad) {
      setAnuncioActual(ad);
      handleNavigate("anuncio");
    }
  };

  // Buy listed marketplace item (Pulls to device)
  const handleComprarAnuncio = async () => {
    if (!anuncioActual) return;
    const id = anuncioActual.mensajeId;

    if (mensajes.some(x => x.id === id)) {
      setActualId(id);
      handleNavigate("abrir");
      return;
    }

    const snap = await getDoc(doc(db, "mensajes", id));
    if (!snap.exists()) {
      throw new Error("El mensaje ya no está disponible o ha sido retirado.");
    }

    const recovered = snap.data() as Mensaje;
    if (usuario && !recovered.uid) {
      recovered.uid = usuario.uid;
      await updateDoc(doc(db, "mensajes", id), { uid: usuario.uid });
    }

    setMensajes((prev) => {
      const next = [...prev, recovered];
      saveToCache(next);
      return next;
    });

    setActualId(recovered.id);
    handleNavigate("abrir");
  };

  // Remove listed ad
  const handleMarcarVendido = async () => {
    if (!anuncioActual) return;
    await deleteDoc(doc(db, "mercado", anuncioActual.mensajeId));
    setAnuncios(prev => prev.filter(x => x.mensajeId !== anuncioActual.mensajeId));
    setAnuncioActual(null);
  };

  return (
    <div className="min-h-screen bg-stone/20 pb-16">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        usuario={usuario}
        perfil={perfil}
        onNavigate={handleNavigate}
      />

      {/* Main Container */}
      <div className="max-w-[620px] mx-auto px-5">
        <header className="relative text-center pt-8 pb-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            className="absolute left-0 top-8 bg-none border-none cursor-pointer p-2 hover:opacity-80 transition-opacity"
            id="menu-toggle-btn"
          >
            <Menu className="w-6 h-6 text-ink" />
          </button>
          <div className="font-display font-bold tracking-[0.28em] text-[20px] text-ink">
            MENSAJE <span className="text-wax">ESTOICO</span>
          </div>
          <div className="text-[15px] text-ink-soft italic mt-0.5">
            Una palabra antigua, sellada solo para ti
          </div>
          <div className="w-16 h-[1px] bg-bronze mx-auto mt-4.5 relative after:content-[''] after:absolute after:left-1/2 after:top-[-3px] after:w-[7px] after:h-[7px] after:bg-bronze after:translate-x-[-50%] after:rotate-45" />
        </header>

        <main className="mt-4">
          {vista === "inicio" && (
            <Inicio
              mensajes={mensajes}
              precio={CONFIG.precio}
              onNavigate={handleNavigate}
              usuario={usuario}
              onSelectMensaje={(id) => {
                setActualId(id);
                handleNavigate("abrir");
              }}
            />
          )}

          {vista === "comprar" && (
            <Comprar
              precio={CONFIG.precio}
              bizumTelefono={CONFIG.bizumTelefono}
              onComprar={handleComprar}
              onNavigate={handleNavigate}
              perfil={perfil}
            />
          )}

          {vista === "escribiendo" && <Escribiendo />}

          {vista === "abrir" && (
            <Abrir
              mensaje={mensajes.find(x => x.id === actualId) || null}
              onAbrir={handleAbrir}
              onNavigate={handleNavigate}
            />
          )}

          {vista === "mensaje" && (
            <MensajeVista
              mensaje={mensajes.find(x => x.id === actualId) || null}
              textoAbierto={textoAbierto}
              onNavigate={handleNavigate}
              onPrepareCambiar={handlePrepareCambiar}
              onEliminarActual={handleEliminarActual}
            />
          )}

          {vista === "recuperar" && (
            <Recuperar
              onRecuperar={handleRecuperar}
              onNavigate={handleNavigate}
              dbActive={dbActive}
            />
          )}

          {vista === "cambiar" && (
            <Cambiar
              mensaje={mensajes.find(x => x.id === actualId) || null}
              modoCambio={modoCambio}
              perfil={perfil}
              usuario={usuario}
              onConfirmar={handleConfirmarCambio}
              onNavigate={handleNavigate}
              dbActive={dbActive}
            />
          )}

          {vista === "cambiado" && (
            <Cambiado
              nuevoId={nuevoId}
              modoCambio={modoCambio}
              nombre={nuevoNombre}
              precio={nuevoPrecio}
              onNavigate={handleNavigate}
            />
          )}

          {vista === "cuenta" && (
            <Cuenta
              usuario={usuario}
              perfil={perfil}
              mensajes={mensajes}
              onEntrar={handleEntrar}
              onRegistrar={handleRegistrar}
              onSalir={handleSalir}
              onNavigate={handleNavigate}
              onSelectMensaje={(id) => {
                setActualId(id);
                handleNavigate("abrir");
              }}
              dbActive={dbActive}
            />
          )}

          {vista === "registro" && (
            <Registro
              onRegistrarCliente={handleRegistrarCliente}
              onNavigate={handleNavigate}
              dbActive={dbActive}
            />
          )}

          {vista === "mercado" && (
            <Mercado
              anuncios={anuncios}
              usuario={usuario}
              onSelectAnuncio={handleSelectAnuncio}
              onNavigate={handleNavigate}
              loading={loadingMercado}
              dbActive={dbActive}
            />
          )}

          {vista === "anuncio" && (
            <AnuncioVista
              anuncio={anuncioActual}
              usuario={usuario}
              onComprarAnuncio={handleComprarAnuncio}
              onMarcarVendido={handleMarcarVendido}
              onNavigate={handleNavigate}
            />
          )}

          {vista === "privacidad" && (
            <Privacidad
              contactoEmail={CONFIG.contactoEmail}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        <footer className="text-center mt-14 text-ink-soft text-sm tracking-wider font-serif">
          MENSAJE ESTOICO &middot; MMXXVI
          <div>
            <button
              onClick={() => handleNavigate("privacidad")}
              className="mt-1.5 text-sm italic underline bg-none border-none cursor-pointer font-serif text-ink-soft/85"
            >
              Política de privacidad
            </button>
          </div>
          <div id="estado-nube" className="text-xs mt-1.5 text-bronze font-serif font-medium">
            {dbActive ? "☁ Nube conectada" : "Solo este dispositivo"}
          </div>
        </footer>
      </div>
    </div>
  );
}
