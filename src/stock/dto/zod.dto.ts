import z from 'zod';
const MSG = 'Nome inválido';
const DATE_MSG = 'Data inválida';
const TYPE_MSG = 'Tipo inválido';
const QUANTITY_MSG = 'Quantidade inválida';
type StockType = 'PRODUCT' | 'VACCINE';

export const createStockSchema = z.object({
  name: z.string(MSG),
  quantity: z.number().int().positive(QUANTITY_MSG),
  type: z
    .string()
    .min(1, TYPE_MSG)
    .refine((val) => ['PRODUCT', 'VACCINE'].includes(val as StockType), {
      message: `Tipo deve ser um 'PRODUCT' ou 'VACCINE'`,
    }),
  validUntil: z.string(DATE_MSG),
});
