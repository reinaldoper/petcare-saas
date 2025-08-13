import z from 'zod';
const MSG = 'Data inválida';
const REASON_MSG = 'Motivo inválido';
const PET_ID_MSG = 'ID do pet ou clinica inválido';

export const createAppointmentDtoSchema = z.object({
  date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: MSG,
  }),
  reason: z.string().min(5, REASON_MSG),
  petId: z.number().int().positive(PET_ID_MSG),
  clinicId: z.number().int().positive(PET_ID_MSG),
});
