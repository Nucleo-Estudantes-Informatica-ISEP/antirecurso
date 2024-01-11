import { z } from 'zod';

const schema = z.object({
  code: z.string().length(6, 'O código deve ter 6 caracteres.')
});

export type FormValues = z.infer<typeof schema>;

export default schema;
