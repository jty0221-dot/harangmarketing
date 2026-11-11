import { subjectMetadata, SubjectPage } from "../subject";

export const metadata = subjectMetadata("plastic");

export default function Page() {
  return <SubjectPage k="plastic" />;
}
