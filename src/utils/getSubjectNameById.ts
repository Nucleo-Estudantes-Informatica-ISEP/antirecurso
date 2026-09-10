import { apiRequest } from '@/services/apiClient';

export default async function getSubjectNameById(id: number) {
  const { name } = await apiRequest<{ name: string }>(`subjects/${id}`);
  return name;
}
