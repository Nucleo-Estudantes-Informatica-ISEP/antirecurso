import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Introduza um email válido.'),
  password: z
    .string()
    .min(8, 'A password deve ter no mínimo 3 caracteres.')
    .max(255, 'A password deve ter no máximo 255 caracteres.')
});

export type FormValues = z.infer<typeof schema>;

export default schema;
