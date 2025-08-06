import z from 'zod';
const MSG = 'Email inválido';

export const createPaymentDtoSchema = z.object({
  email: z.email(MSG),
});
