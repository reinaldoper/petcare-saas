import z from 'zod';
const MSG = 'Data inválida';
const REASON_MSG = 'Motivo inválido';
const PET_ID_MSG = 'ID do pet inválido';

export const createAppointmentDtoSchema = z.object({
  date: z.string(MSG),
  reason: z.string(REASON_MSG),
  petId: z.number().int().positive(PET_ID_MSG),
});
