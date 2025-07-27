import z from 'zod';
const MSG = 'Nome inválido';
const ADDRESS_MSG = 'Endereço inválido';

export const createClinicDtoSchema = z.object({
  name: z.string().min(4, MSG),
  address: z.string().min(10, ADDRESS_MSG),
});
