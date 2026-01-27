import Tesseract from "tesseract.js";

export interface ClientData {
  numero: string;
  nombre: string;
  direccion: string;
  codigoPostal: string;
}

/**
 * Ejecuta OCR sobre un archivo de imagen
 */
export async function ocrImage(file: File): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(file, "spa", {
      logger: m => console.log(m),
      // tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑabcdefghijklmnopqrstuvwxyz0123456789,.-"
  });
  // const { data: { text } } = await Tesseract.recognize(file, "spa", {
  //   logger: (m) => console.log(m),
  // });
  return text;
}