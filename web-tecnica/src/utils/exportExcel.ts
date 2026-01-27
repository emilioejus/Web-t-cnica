import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ClientData } from "../services/ocrService";

export async function generateClientsExcel(clients: ClientData[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Clientes");

  sheet.columns = [
    { header: "Número", key: "numero", width: 20 },
    { header: "Nombre", key: "nombre", width: 30 },
    { header: "Dirección", key: "direccion", width: 40 },
    { header: "Código Postal", key: "codigoPostal", width: 15 },
  ];

  clients.forEach(c => sheet.addRow(c));

  // Genera el archivo como buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Descarga usando file-saver
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  saveAs(blob, "clientes.xlsx");
}