import z from 'zod';
const MSG = 'Email inválido';
const NAME = 'Nome invildo';
const ADMIN = 'ADMIN';
const CLIENT = 'CLIENT';

export const createUserSchema = z.object({
  email: z.email(MSG),
  password: z.string().min(6),
  name: z.string().min(4, NAME),
  phone: z.string().optional(),
  role: z
    .string()
    .min(1)
    .default(CLIENT)
    .refine((val) => [ADMIN, CLIENT].includes(val), {
      message: `Role deve ser um ${ADMIN} ou ${CLIENT}`,
    }),
  clinicId: z.number().int().positive('ID da clínica inválido'),
});

export const loginSchema = z.object({
  email: z.email(MSG),
  password: z.string().min(6),
});
