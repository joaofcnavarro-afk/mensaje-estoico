const enc = new TextEncoder();
const dec = new TextDecoder();

function aB64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function deB64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

async function derivarClave(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const km = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 150000,
      hash: "SHA-256",
    },
    km,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export interface CifradoResultado {
  salt: string;
  iv: string;
  datos: string;
}

export async function cifrar(texto: string, pin: string): Promise<CifradoResultado> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const clave = await derivarClave(pin, salt);
  const datos = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    clave,
    enc.encode(texto)
  );
  return {
    salt: aB64(salt),
    iv: aB64(iv),
    datos: aB64(datos),
  };
}

export async function descifrar(
  saltB64: string,
  ivB64: string,
  datosB64: string,
  pin: string
): Promise<string> {
  const salt = deB64(saltB64);
  const iv = deB64(ivB64);
  const datos = deB64(datosB64);
  const clave = await derivarClave(pin, salt);
  const plano = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    clave,
    datos
  );
  return dec.decode(plano);
}
