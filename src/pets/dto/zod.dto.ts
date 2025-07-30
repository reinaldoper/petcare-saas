import z from 'zod';
const MSG = 'ID inválido';
const DATE_MSG = 'Data inválida';
const NAME_MSG = 'Nome inválido';
const OWNER_NAME_MSG = 'Nome do proprietário inválido';

export const petIdSchema = z.object({
  name: z.string().min(4, NAME_MSG),
  ownerName: z.string().min(4, OWNER_NAME_MSG),
  birthDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: DATE_MSG,
  }),

  species: z
    .string()
    .min(3, MSG)
    .refine((val) => ['CAT', 'DOG'].includes(val), {
      message: `Tipo deve ser um 'CAT' ou 'DOG'`,
    }),
  userId: z.number().int().positive(MSG),
  clinicId: z.number().int().positive(MSG),
});
