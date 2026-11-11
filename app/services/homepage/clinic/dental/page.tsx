import { subjectMetadata, SubjectPage } from "../subject";

export const metadata = subjectMetadata("dental");

export default function Page() {
  return <SubjectPage k="dental" />;
}
