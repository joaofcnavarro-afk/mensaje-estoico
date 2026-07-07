export interface Mensaje {
  id: string;
  nombre: string;
  ref: string;
  origen?: string;
  fecha: string;
  creado: number;
  uid: string | null;
  salt: string;
  iv: string;
  datos: string;
}

export interface TextoAbierto {
  texto: string;
  firma: string;
}

export interface Cliente {
  nombre: string;
  usuario: string;
  email: string;
  nacimiento: string;
  telefono?: string | null;
  creado: number;
}

export interface Anuncio {
  mensajeId: string;
  precio: number;
  bizum: string;
  vendedorUid: string;
  vendedor: string;
  fecha: string;
  creado: number;
}

export interface Venta {
  mensajeId: string;
  precio: number;
  vendedorUid: string;
  vendedorNombre: string;
  comprador: string;
  fecha: string;
  creado: number;
}
