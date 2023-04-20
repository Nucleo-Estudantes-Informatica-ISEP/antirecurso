import { BASE_URL } from "src/services/api";

interface Props {
  token: string;
  currentPage: number;
}

const N_ITEMS_PER_PAGE = 10;

export default async function fetchAnswers({ token, currentPage }: Props) {
  const response = await fetch(`${BASE_URL}/exams?page=${currentPage}&per_page=${N_ITEMS_PER_PAGE}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  const data = await response.json();

  return data;
}
