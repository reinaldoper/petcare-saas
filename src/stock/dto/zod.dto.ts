import z from 'zod';
const MSG = 'Nome inválido';
const DATE_MSG = 'Data inválida';
const TYPE_MSG = 'Tipo inválido';
const QUANTITY_MSG = 'Quantidade inválida';
const CLINIC_ID_MSG = 'ID da clínica inválido';
type StockType = 'PRODUCT' | 'VACCINE';

export const createStockSchema = z.object({
  name: z.string().min(4, MSG),
  quantity: z.number().int().positive(QUANTITY_MSG),
  type: z
    .string()
    .min(1, TYPE_MSG)
    .refine((val) => ['PRODUCT', 'VACCINE'].includes(val as StockType), {
      message: `Tipo deve ser um 'PRODUCT' ou 'VACCINE'`,
    }),
  validUntil: z
    .string()
    .min(10, DATE_MSG)
    .refine((val) => {
      const date = new Date(val).toISOString();
      return date;
    }, DATE_MSG),
  clinicId: z.number().int().positive(CLINIC_ID_MSG),
  price: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: 'Preço deve ser um número positivo ou zero',
    }),
});

export const deleteStockSchema = z.object({
  clinicId: z.number().int().positive(CLINIC_ID_MSG),
});
