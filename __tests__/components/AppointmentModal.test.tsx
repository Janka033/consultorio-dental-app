import { render, screen } from '@testing-library/react';
import { AppointmentModal } from '@/components/dashboard/AppointmentModal';

// Mock de fetch
global.fetch = jest.fn();

describe('AppointmentModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    appointment: null,
    onClose: mockOnClose,
    onSave: mockOnSave
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el modal', () => {
    render(<AppointmentModal {...defaultProps} />);
    expect(screen.getByText('Nueva Cita')).toBeTruthy();
  });

  it('debe mostrar campos básicos del formulario', () => {
    render(<AppointmentModal {...defaultProps} />);
    
    expect(screen.getByLabelText(/nombre del paciente/i)).toBeTruthy();
    expect(screen.getByLabelText(/fecha/i)).toBeTruthy();
    expect(screen.getByLabelText(/hora/i)).toBeTruthy();
  });

  it('debe mostrar título "Editar Cita" cuando se pasa un appointment', () => {
    const appointment = {
      id: '1',
      patientName: 'Juan Pérez',
      date: '2026-01-15',
      time: '10:00:00',
      notes: 'Limpieza',
      status: 'agendada'
    };

    render(<AppointmentModal {...defaultProps} appointment={appointment} />);
    expect(screen.getByText('Editar Cita')).toBeTruthy();
  });

  it('debe prellenar campos cuando se edita una cita', () => {
    const appointment = {
      id: '1',
      patientName: 'Juan Pérez',
      date: '2026-01-15',
      time: '10:00:00',
      notes: 'Limpieza dental',
      status: 'agendada'
    };

    render(<AppointmentModal {...defaultProps} appointment={appointment} />);
    
    const nameInput = screen.getByLabelText(/nombre del paciente/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Juan Pérez');
  });

  it('debe tener botón Cancelar', () => {
    render(<AppointmentModal {...defaultProps} />);
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('debe renderizar el campo de notas', () => {
    render(<AppointmentModal {...defaultProps} />);
    expect(screen.getByLabelText(/notas/i)).toBeTruthy();
  });
});
