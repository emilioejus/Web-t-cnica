import { ClientData } from "../services/ocrSrvice";

/**
 * Extrae clientes del texto OCR de un frame.
 * Debe ser tolerante a errores comunes de OCR.
 */
export function extractClientData(text: string): ClientData[] {
  const clients: ClientData[] = [];

  // Normalizar texto: eliminar saltos de línea extra y espacios múltiples
  const normalizedText = text.replace(/\r/g, "").replace(/\n+/g, "\n").trim();

  // Dividir por líneas
  const lines = normalizedText.split("\n").map(l => l.trim()).filter(l => l);

  // Patrón aproximado de cliente: número, nombre, dirección, código postal
  const clientPattern = /(\d{1,4}\s?[A-Z0-9]{0,5})\s+([A-ZÁÉÍÓÚÑ ]{2,})\s+([A-ZÁÉÍÓÚÑ\s,.-]{5,})\s+(\d{4,5})/i;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Buscar patrón en la línea actual o combinando con la siguiente
    let match = clientPattern.exec(line);

    // Si no coincide, intentar combinar con la siguiente línea (OCR a veces separa palabras)
    if (!match && i + 2 < lines.length) {
      const combined = line + " " + lines[i + 1] + " " + lines[i + 2];
      match = clientPattern.exec(combined);
      if (match) i += 2; // saltamos líneas combinadas
    }

    if (match) {
      const client: ClientData = {
        numero: match[1].replace(/\s+/g, ""), // quitar espacios extra
        nombre: match[2].trim(),
        direccion: match[3].trim(),
        codigoPostal: match[4].trim()
      };
      clients.push(client);
    }

    i++;
  }

  return clients;
}

// import { ClientData } from "../services/ocrSrvice";

// /**
//  * Extrae los datos del cliente de un bloque de texto usando regex
//  */
// export function extractClientData(text: string): ClientData[] {
//   const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

//   const clients = lines
//     .map((line) => {
//       const match = line.match(/^(\d+)\s+([A-Za-z\s]+)\s+(.+)\s+(\d{5})$/);
//       if (!match) return null;
//       const [, numero, nombre, direccion, codigoPostal] = match;
//       return { numero, nombre, direccion, codigoPostal };
//     })
//     .filter(Boolean) as ClientData[];

//   return clients;
// }