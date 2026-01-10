"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, LogOut } from "lucide-react";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { AppointmentModal } from "@/components/dashboard/AppointmentModal";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  // Cargar citas
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/appointments");
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
    fetchAppointments();
  }, []);

  // Logout
  const handleLogout = () => {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      router.push("/login");
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Eliminar cita
  const handleDelete = async (id: string) => {
    if (! confirm("¿Estás seguro de eliminar esta cita? ")) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (response. ok) {
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
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard - Consultorio Dental
            </h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Gestión de Citas
          </h2>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </div>

        {/* Lista de citas */}
        <AppointmentList
          appointments={appointments}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal */}
      {isModalOpen && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}