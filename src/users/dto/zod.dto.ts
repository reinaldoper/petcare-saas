import z from 'zod';
const MSG = 'Email inválido';

export const createUserSchema = z.object({
  email: z.email(MSG),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(MSG),
  password: z.string().min(6),
});
