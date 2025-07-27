import z from 'zod';
const MSG = 'Nome inválido';
const ADDRESS_MSG = 'Endereço inválido';

export const createClinicDtoSchema = z.object({
  name: z.string(MSG),
  address: z.string(ADDRESS_MSG),
});
