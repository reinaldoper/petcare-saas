import z from 'zod';
const MSG = 'Nome inválido';
const ADDRESS_MSG = 'Endereço inválido';
const CNPJ_MSG = 'CNPJ inválido';

export const createClinicDtoSchema = z.object({
  name: z.string().min(4, MSG),
  address: z.string().min(10, ADDRESS_MSG),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, CNPJ_MSG)
    .transform((cnpj) =>
      cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'),
    ),
  razaoSocial: z.string().min(4, 'Razão social inválida'),
});

export const nameSchema = z.object({
  name: z.string().min(4, MSG),
});
