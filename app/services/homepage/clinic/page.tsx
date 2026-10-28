import KeywordServicePage from "../../../components/KeywordServicePage";
import ClinicDrafts from "../../../components/ClinicDrafts";
import { ClinicTextFive, ClinicProcess, ClinicSubpages } from "../../../components/ClinicLinks";
import { CLINIC_HOMEPAGE } from "../../../lib/clinic-homepage";

// 절 순서는 세팅안 나-2 : 답변 블록 → 포함 → 글자 다섯 → 검수 공정 → 시안 → 과목별 쪽 → 진행 순서 → 비용 → 문답
export default function Page() {
  return (
    <KeywordServicePage d={CLINIC_HOMEPAGE}>
      <ClinicTextFive />
      <ClinicProcess />
      <ClinicDrafts title="진료과목별 시안" prefixes={["dental-", "derma-", "skincare-", "plastic-", "oriental-", "clinic-", "tpl-tm-medic-care"]} />
      <ClinicSubpages />
    </KeywordServicePage>
  );
}
