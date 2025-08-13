import z from 'zod';

const MSG = 'Vacina inválida';
const DATE_MSG = 'Data inválida';

export const createVaccineSchema = z.object({
  vaccine: z.string(MSG),
  appliedAt: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: DATE_MSG,
  }),
  petId: z.number().int().positive(),
  clinicId: z.number().int().positive(),
});

export const createVaccineHistoryDtoSchema = z.object({
  petId: z.number().int().positive(),
  clinicId: z.number().int().positive(),
});
