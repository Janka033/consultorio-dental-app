import { format } from "date-fns";
import { es } from "date-fns/locale";
import html2pdf from "html2pdf.js";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

/**
 * Exporta citas a formato CSV compatible con Excel
 * @param appointments - Array de citas a exportar
 * @param filename - Nombre del archivo (sin extensión)
 */
export function exportToCSV(appointments: Appointment[], filename: string = "citas") {
  // Definir encabezados - usando punto y coma para Excel en español
  const headers = ["ID", "Paciente", "Fecha", "Hora", "Estado", "Notas"];
  
  // Formatear datos - escapar comillas y usar punto y coma como delimitador
  const rows = appointments.map((apt) => {
    const dateFormatted = apt.date.split('T')[0].split('-').reverse().join('/');
    const statusLabel = getStatusLabel(apt.status);
    
    // Escapar comillas dobles y agregar comillas alrededor de cada campo
    const escapeCSV = (value: string) => `"${value.replace(/"/g, '""')}"`;
    
    return [
      escapeCSV(apt.id),
      escapeCSV(apt.patientName),
      escapeCSV(dateFormatted),
      escapeCSV(apt.time),
      escapeCSV(statusLabel),
      escapeCSV(apt.notes || "")
    ].join(";"); // Punto y coma para Excel en español
  });

  // Combinar encabezados y filas
  const csvContent = [headers.map(h => `"${h}"`).join(";"), ...rows].join("\r\n");

  // Agregar BOM (Byte Order Mark) para que Excel detecte UTF-8 correctamente
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Descargar archivo
  downloadFile(blob, `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`);
}

/**
 * Exporta citas a formato PDF (descarga directa)
 * @param appointments - Array de citas a exportar
 * @param filename - Nombre del archivo (sin extensión)
 */
export function exportToPDF(appointments: Appointment[], filename: string = "citas") {
  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  
  // Crear elemento HTML temporal para convertir a PDF
  const element = document.createElement("div");
  element.style.padding = "20px";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.color = "#000";
  
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
      <h1 style="color: #1e40af; margin: 0 0 10px 0; font-size: 28px;">📋 Reporte de Citas</h1>
      <p style="color: #64748b; margin: 5px 0; font-size: 14px;"><strong>Consultorio Dental Dr. García</strong></p>
      <p style="color: #64748b; margin: 5px 0; font-size: 14px;">Generado el ${today}</p>
    </div>
    
    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        <div style="margin: 5px 0;">
          <span style="font-weight: bold; color: #334155;">Total de citas:</span> ${appointments.length}
        </div>
        <div style="margin: 5px 0;">
          <span style="font-weight: bold; color: #334155;">Agendadas:</span> ${appointments.filter(a => a.status === "agendada").length}
        </div>
        <div style="margin: 5px 0;">
          <span style="font-weight: bold; color: #334155;">Finalizadas:</span> ${appointments.filter(a => a.status === "finalizada").length}
        </div>
        <div style="margin: 5px 0;">
          <span style="font-weight: bold; color: #334155;">Canceladas:</span> ${appointments.filter(a => a.status === "cancelada").length}
        </div>
      </div>
    </div>
    
    ${appointments.length > 0 ? `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #2563eb;">
            <th style="color: white; padding: 12px 8px; text-align: left; font-size: 14px;">Paciente</th>
            <th style="color: white; padding: 12px 8px; text-align: left; font-size: 14px;">Fecha</th>
            <th style="color: white; padding: 12px 8px; text-align: left; font-size: 14px;">Hora</th>
            <th style="color: white; padding: 12px 8px; text-align: left; font-size: 14px;">Estado</th>
            <th style="color: white; padding: 12px 8px; text-align: left; font-size: 14px;">Notas</th>
          </tr>
        </thead>
        <tbody>
          ${appointments.map((apt, index) => {
            const dateFormatted = apt.date.split('T')[0].split('-').reverse().join('/');
            const statusLabel = getStatusLabel(apt.status);
            const bgColor = index % 2 === 0 ? "#ffffff" : "#f8fafc";
            
            let statusStyle = "";
            if (apt.status === "agendada") {
              statusStyle = "background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block;";
            } else if (apt.status === "finalizada") {
              statusStyle = "background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block;";
            } else if (apt.status === "cancelada") {
              statusStyle = "background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block;";
            }
            
            return `
              <tr style="background-color: ${bgColor};">
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;"><strong>${apt.patientName}</strong></td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${dateFormatted}</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${apt.time}</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;"><span style="${statusStyle}">${statusLabel}</span></td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${apt.notes || "-"}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    ` : `
      <div style="text-align: center; padding: 40px; color: #64748b;">
        <p>No hay citas para mostrar</p>
      </div>
    `}
    
    <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <p>Consultorio Dental Dr. García | © 2026 Todos los derechos reservados</p>
      <p>Sistema de Gestión de Citas Odontológicas</p>
    </div>
  `;
  
  // Configuración de html2pdf
  const options = {
    margin: [15, 10],
    filename: `${filename}_${format(new Date(), "yyyy-MM-dd")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };
  
  // Generar y descargar PDF directamente
  html2pdf().set(options).from(element).save();
}

/**
 * Función auxiliar para descargar archivos
 */
function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar memoria
  setTimeout(() => URL.revokeObjectURL(url), 100);
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
