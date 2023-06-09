import Answer from "src/types/Answer";
import PreviousExamResponseMetadata from "./PreviousExamResponseMetadata";

export default interface PreviousExamResponse {
  data: Answer[];
  meta: PreviousExamResponseMetadata;
  total: number;
}
