import { $Enums } from '@prisma/client';
import z from 'zod';

const type = $Enums.PlanType;
const CLINIC_ID_MSG = 'ID da clínica inválido';
const TYPE_MSG = 'Tipo inválido';

export const createPlanDtoSchema = z.object({
  type: z
    .string()
    .min(4)
    .refine((val) => val in type, {
      message: TYPE_MSG,
    })
    .optional(),
  clinicId: z.number().int().positive(CLINIC_ID_MSG),
});
