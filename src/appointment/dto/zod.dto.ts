import z from 'zod';
const MSG = 'Data inválida';
const REASON_MSG = 'Motivo inválido';
const PET_ID_MSG = 'ID do pet ou clinica inválido';

export const createAppointmentDtoSchema = z.object({
  date: z
    .string()
    .min(10, MSG)
    .refine((val) => {
      const date = new Date(val).toISOString();
      return date;
    }, MSG),
  reason: z.string().min(5, REASON_MSG),
  petId: z.number().int().positive(PET_ID_MSG),
  clinicId: z.number().int().positive(PET_ID_MSG),
  priority: z.boolean().optional(),
  price: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: 'Preço deve ser um número positivo ou zero',
    }),
});

export const deleteAppointmentDtoSchema = z.object({
  clinicId: z.number().int().positive(PET_ID_MSG),
});
