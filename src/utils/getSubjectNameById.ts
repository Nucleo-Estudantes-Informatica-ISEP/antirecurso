import { BASE_URL } from 'src/services/api';

export default async function getSubjectNameById(id: number) {
  const res = await fetch(`${BASE_URL}/subjects/${id}`);
  const { name } = await res.json();
  return name;
}
