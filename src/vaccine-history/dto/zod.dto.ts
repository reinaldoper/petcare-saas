import z from 'zod';

const MSG = 'Vacina inválida';
const DATE_MSG = 'Data inválida';

export const createVaccineSchema = z.object({
  vaccine: z.string(MSG),
  appliedAt: z.string(DATE_MSG),
  petId: z.number().int().positive(),
});
