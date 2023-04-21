import PreviousExamResponse from "src/types/PreviousExamResponse";

interface Props {
  token: string;
  fetchUrl: string | null;
}

export default async function fetchAnswers({ token, fetchUrl }: Props): Promise<PreviousExamResponse> {
  if (!fetchUrl) {
    throw new Error("No fetch url provided");
  }
  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  const data = await response.json();

  return data;
}
