import { appointmentSchema } from '@/lib/validations/appointment';

describe('Validación de Citas', () => {
  describe('appointmentSchema', () => {
    it('debe validar correctamente una cita válida', () => {
      const validAppointment = {
        patientName: 'Juan Pérez',
        date: '2026-02-15',
        time: '10:00',
        notes: 'Limpieza dental',
        status: 'agendada' as const
      };

      const result = appointmentSchema.safeParse(validAppointment);
      expect(result.success).toBe(true);
    });

    it('debe rechazar una cita sin nombre de paciente', () => {
      const invalidAppointment = {
        patientName: '',
        date: '2026-02-15',
        time: '10:00',
        notes: 'Limpieza dental',
        status: 'agendada' as const
      };

      const result = appointmentSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    it('debe rechazar nombre muy corto', () => {
      const invalidAppointment = {
        patientName: 'ab',
        date: '2026-02-15',
        time: '10:00',
        notes: 'Limpieza dental',
        status: 'agendada' as const
      };

      const result = appointmentSchema.safeParse(invalidAppointment);
      expect(result.success).toBe(false);
    });

    it('debe aceptar estados válidos', () => {
      const statuses: Array<'agendada' | 'finalizada' | 'cancelada'> = ['agendada', 'finalizada', 'cancelada'];
      
      statuses.forEach(status => {
        const appointment = {
          patientName: 'Juan Pérez',
          date: '2026-02-15',
          time: '10:00',
          notes: 'Limpieza dental',
          status
        };

        const result = appointmentSchema.safeParse(appointment);
        expect(result.success).toBe(true);
      });
    });

    it('debe rechazar formato de fecha inválido', () => {
      const appointment = {
        patientName: 'Juan Pérez',
        date: '15/02/2026', // Formato incorrecto
        time: '10:00',
        notes: 'Limpieza dental',
        status: 'agendada' as const
      };

      const result = appointmentSchema.safeParse(appointment);
      expect(result.success).toBe(false);
    });

    it('debe rechazar formato de hora inválido', () => {
      const appointment = {
        patientName: 'Juan Pérez',
        date: '2026-02-15',
        time: '10:00:00', // Debería ser HH:MM
        notes: 'Limpieza dental',
        status: 'agendada' as const
      };

      const result = appointmentSchema.safeParse(appointment);
      expect(result.success).toBe(false);
    });

    it('debe validar notas opcionales', () => {
      const appointmentWithoutNotes = {
        patientName: 'Juan Pérez',
        date: '2026-02-15',
        time: '10:00',
        status: 'agendada' as const
      };

      const result = appointmentSchema.safeParse(appointmentWithoutNotes);
      expect(result.success).toBe(true);
    });

    it('debe validar status opcional', () => {
      const appointmentWithoutStatus = {
        patientName: 'Juan Pérez',
        date: '2026-02-15',
        time: '10:00',
        notes: 'Limpieza dental'
      };

      const result = appointmentSchema.safeParse(appointmentWithoutStatus);
      expect(result.success).toBe(true);
    });
  });
});
