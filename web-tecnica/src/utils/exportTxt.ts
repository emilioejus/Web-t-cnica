import { ClientData } from "../services/ocrSrvice";

export function generateClientsTxt(clients: ClientData[]): string {
  return clients
    .map((client, index) => `
==============================
CLIENTE ${index + 1}
==============================
Número: ${client.numero}
Nombre: ${client.nombre}
Dirección: ${client.direccion}
Código Postal: ${client.codigoPostal}
`.trim())
    .join("\n\n");
}