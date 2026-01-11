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
 * Exporta citas a formato CSV
 * @param appointments - Array de citas a exportar
 * @param filename - Nombre del archivo (sin extensión)
 */
export function exportToCSV(appointments: Appointment[], filename: string = "citas") {
  // Definir encabezados
  const headers = ["ID", "Paciente", "Fecha", "Hora", "Estado", "Notas"];
  
  // Formatear datos
  const rows = appointments.map((apt) => {
    const dateFormatted = apt.date.split('T')[0].split('-').reverse().join('/');
    const statusLabel = getStatusLabel(apt.status);
    const notes = apt.notes ? `"${apt.notes.replace(/"/g, '""')}"` : "";
    
    return [
      apt.id,
      `"${apt.patientName}"`,
      dateFormatted,
      apt.time,
      statusLabel,
      notes
    ].join(",");
  });

  // Combinar encabezados y filas
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Agregar BOM para compatibilidad con Excel en español
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Descargar archivo
  downloadFile(blob, `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`);
}

/**
 * Exporta citas a formato PDF
 * @param appointments - Array de citas a exportar
 * @param filename - Nombre del archivo (sin extensión)
 */
export function exportToPDF(appointments: Appointment[], filename: string = "citas") {
  // Crear documento HTML para impresión
  const printWindow = window.open("", "_blank");
  
  if (!printWindow) {
    alert("Por favor permite las ventanas emergentes para exportar a PDF");
    return;
  }

  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Citas</title>
      <style>
        @media print {
          @page { margin: 2cm; }
          body { margin: 0; }
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #1e40af;
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        
        .header p {
          color: #64748b;
          margin: 5px 0;
          font-size: 14px;
        }
        
        .summary {
          background: #f1f5f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .summary-item {
          display: inline-block;
          margin-right: 30px;
          font-size: 14px;
        }
        
        .summary-label {
          font-weight: bold;
          color: #334155;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        th {
          background-color: #2563eb;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
        }
        
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }
        
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        
        tr:hover {
          background-color: #f1f5f9;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-agendada {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .status-finalizada {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-cancelada {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        
        .no-appointments {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Reporte de Citas</h1>
        <p><strong>Consultorio Dental Dr. García</strong></p>
        <p>Generado el ${today}</p>
      </div>
      
      <div class="summary">
        <div class="summary-item">
          <span class="summary-label">Total de citas:</span> ${appointments.length}
        </div>
        <div class="summary-item">
          <span class="summary-label">Agendadas:</span> ${appointments.filter(a => a.status === "agendada").length}
        </div>
        <div class="summary-item">
          <span class="summary-label">Finalizadas:</span> ${appointments.filter(a => a.status === "finalizada").length}
        </div>
        <div class="summary-item">
          <span class="summary-label">Canceladas:</span> ${appointments.filter(a => a.status === "cancelada").length}
        </div>
      </div>
      
      ${appointments.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map((apt) => {
              const dateFormatted = apt.date.split('T')[0].split('-').reverse().join('/');
              const statusLabel = getStatusLabel(apt.status);
              const statusClass = `status-${apt.status}`;
              
              return `
                <tr>
                  <td><strong>${apt.patientName}</strong></td>
                  <td>${dateFormatted}</td>
                  <td>${apt.time}</td>
                  <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                  <td>${apt.notes || "-"}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      ` : `
        <div class="no-appointments">
          <p>No hay citas para mostrar</p>
        </div>
      `}
      
      <div class="footer">
        <p>Consultorio Dental Dr. García | © 2026 Todos los derechos reservados</p>
        <p>Sistema de Gestión de Citas Odontológicas</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        };
        
        window.onafterprint = function() {
          window.close();
        };
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
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
