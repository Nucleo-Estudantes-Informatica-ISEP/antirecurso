import { z } from 'zod';

const schema = z
  .object({
    name: z
      .string()
      .min(3, 'O nome deve ter pelo menos 3 caracteres.')
      .max(255, 'O nome deve ter no máximo 255 caracteres.'),
    email: z.string().email('Introduza um email válido.'),
    password: z
      .string()
      .min(8, 'A password deve ter no mínimo 8 caracteres.')
      .max(255, 'A password deve ter no máximo 255 caracteres.'),
    password_confirmation: z
      .string()
      .min(8, 'A password deve ter no mínimo 8 caracteres')
      .max(255, 'A password deve ter no máximo 255 caracteres')
  })
  .refine((value) => value.password === value.password_confirmation, {
    message: 'As passwords não coincidem.',
    path: ['password_confirmation']
  });

export type FormValues = z.infer<typeof schema>;

export default schema;
