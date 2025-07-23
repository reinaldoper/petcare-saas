import z from 'zod';
const MSG = 'Nome inválido';
const DATE_MSG = 'Data inválida';
const TYPE_MSG = 'Tipo inválido';
const QUANTITY_MSG = 'Quantidade inválida';

export const createStockSchema = z.object({
  name: z.string(MSG),
  quantity: z.number().int().positive(QUANTITY_MSG),
  type: z.string(TYPE_MSG),
  validUntil: z.string(DATE_MSG),
});
