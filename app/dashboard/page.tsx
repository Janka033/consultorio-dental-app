"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, LogOut, Search, List, CalendarDays, FileText, Activity } from "lucide-react";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { AppointmentModal } from "@/components/dashboard/AppointmentModal";
import { exportToPDF } from "@/lib/export";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

type ViewMode = "list" | "calendar";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [prefilledDate, setPrefilledDate] = useState<string>("");

  // Verificar autenticación con NextAuth
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Cargar citas con filtros
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (filterDate) params.append("date", filterDate);
      if (searchTerm) params.append("patientName", searchTerm);
      
      const url = `/api/appointments${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAppointments();
    }
  }, [status, searchTerm, filterDate]);

  // Logout con NextAuth
  const handleLogout = () => {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
      signOut({ callbackUrl: "/login" });
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedAppointment(null);
    setPrefilledDate("");
    setIsModalOpen(true);
  };

  // Abrir modal para crear con fecha preseleccionada
  const handleCreateForDate = (date: string) => {
    setSelectedAppointment(null);
    setPrefilledDate(date);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPrefilledDate("");
    setIsModalOpen(true);
  };

  // Eliminar cita
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAppointments();
        alert("Cita eliminada correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      alert("Error al eliminar cita");
    }
  };

  // Guardar cita (crear o editar)
  const handleSave = async () => {
    await fetchAppointments();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard - Consultorio Dental
              </h1>
              {session?.user?.email && (
                <p className="text-sm text-gray-500">{session.user.email}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/audit-logs")}
              title="Ver logs de auditoría"
            >
              <Activity className="mr-2 h-4 w-4" />
              Auditoría
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Gestión de Citas
          </h2>
          <div className="flex flex-wrap gap-2">
            {appointments.length > 0 && (
              <Button
                variant="outline"
                onClick={async () => await exportToPDF(appointments)}
                title="Exportar a PDF"
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            )}
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Filtros y toggle de vista */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="mr-2 h-4 w-4" />
                Lista
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendario
              </Button>
            </div>
          </div>

          {viewMode === "list" && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por paciente
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Nombre del paciente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por fecha
                  </label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>
              {(searchTerm || filterDate) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterDate("");
                  }}
                  className="mt-4"
                >
                  Limpiar filtros
                </Button>
              )}
            </>
          )}
        </div>

        {/* Vista de lista o calendario */}
        {viewMode === "list" ? (
          <AppointmentList
            appointments={appointments}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CalendarView
            appointments={appointments}
            onEdit={handleEdit}
            onCreateForDate={handleCreateForDate}
          />
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <AppointmentModal
          appointment={selectedAppointment}
          prefilledDate={prefilledDate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}