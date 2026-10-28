import { subjectMetadata, SubjectPage } from "../subject";

export const metadata = subjectMetadata("derma");

export default function Page() {
  return <SubjectPage k="derma" />;
}
