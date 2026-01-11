import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

/**
 * Exporta citas a formato PDF usando jsPDF
 * @param appointments - Array de citas a exportar
 * @param filename - Nombre del archivo (sin extensión)
 */
export async function exportToPDF(appointments: Appointment[], filename: string = "citas") {
  // Importar jsPDF y autoTable solo en el cliente
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  
  const doc = new jsPDF();
  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  
  // Título
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175); // Color azul
  doc.text("Reporte de Citas", 105, 20, { align: "center" });
  
  // Subtítulo
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text("Consultorio Dental Dr. Garcia", 105, 28, { align: "center" });
  doc.text(`Generado el ${today}`, 105, 34, { align: "center" });
  
  // Resumen
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const totalCitas = appointments.length;
  const agendadas = appointments.filter(a => a.status === "agendada").length;
  const finalizadas = appointments.filter(a => a.status === "finalizada").length;
  const canceladas = appointments.filter(a => a.status === "cancelada").length;
  
  doc.text(`Total: ${totalCitas} | Agendadas: ${agendadas} | Finalizadas: ${finalizadas} | Canceladas: ${canceladas}`, 105, 42, { align: "center" });
  
  // Preparar datos para la tabla
  const tableData = appointments.map((apt) => {
    const dateFormatted = apt.date.split('T')[0].split('-').reverse().join('/');
    const statusLabel = getStatusLabel(apt.status);
    return [
      apt.patientName,
      dateFormatted,
      apt.time,
      statusLabel,
      apt.notes || "-"
    ];
  });
  
  // Crear tabla
  autoTable(doc, {
    startY: 48,
    head: [["Paciente", "Fecha", "Hora", "Estado", "Notas"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235], // Azul
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
      halign: "left"
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
      textColor: [0, 0, 0] // Negro para todas las celdas por defecto
    },
    columnStyles: {
      0: { cellWidth: 45 }, // Paciente
      1: { cellWidth: 28 }, // Fecha
      2: { cellWidth: 23 }, // Hora
      3: { cellWidth: 28 }, // Estado
      4: { cellWidth: "auto" } // Notas
    },
    didParseCell: (data: any) => {
      // Colorear solo el texto de estado según el valor (sin fondo)
      if (data.column.index === 3 && data.section === "body") {
        const status = appointments[data.row.index]?.status;
        if (status === "agendada") {
          data.cell.styles.textColor = [30, 64, 175]; // text-blue-800
          data.cell.styles.fontStyle = "bold";
        } else if (status === "finalizada") {
          data.cell.styles.textColor = [22, 101, 52]; // text-green-800
          data.cell.styles.fontStyle = "bold";
        } else if (status === "cancelada") {
          data.cell.styles.textColor = [153, 27, 27]; // text-red-800
          data.cell.styles.fontStyle = "bold";
        }
      }
    }
  });
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      "Consultorio Dental Dr. Garcia | (c) 2026 Todos los derechos reservados",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  
  // Descargar
  doc.save(`${filename}_${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

/**
 * Obtener etiqueta de estado en español
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case "agendada":
      return "Agendada";
    case "cancelada":
      return "Cancelada";
    case "finalizada":
      return "Finalizada";
    default:
      return status;
  }
}
