import KeywordServicePage from "../../../components/KeywordServicePage";
import ClinicDrafts from "../../../components/ClinicDrafts";
import { ClinicTextFive, ClinicProcess, ClinicSubpages } from "../../../components/ClinicLinks";
import { CLINIC_HOMEPAGE } from "../../../lib/clinic-homepage";
import { Plain, SearchSketch } from "../../../components/PlainBlock";
import { PLAIN_TERMS, CLINIC_PLAIN_TERMS } from "../../../lib/plain-terms";

/* 처음 보는 원장님용 쉬운 풀이 · 문장은 2026-11-12 진우 판정 통과분 그대로다. 글자를 바꾸면 재판정 (C-50) */
const PLAIN = (
  <Plain
    what="진료과목, 의료진, 진료시간, 오시는 길을 환자가 찾기 쉽게 글자로 정리한 병원 홈페이지를 만드는 일입니다. 화면에 들어가는 문구는 의료법 검수를 거친 뒤 원장님 확인을 받아 공개합니다."
    who="개원을 앞두고 홈페이지가 없거나, 지금 홈페이지의 진료 정보가 그림 안에만 들어 있어 검색엔진이 본문으로 읽기 어려운 원장님께 필요합니다."
    terms={[CLINIC_PLAIN_TERMS.structured, PLAIN_TERMS.seo, PLAIN_TERMS.aeo, PLAIN_TERMS.geo]}
  >
    <SearchSketch clinic focus={["site"]} />
  </Plain>
);

// 절 순서는 세팅안 나-2 : 답변 블록 → 포함 → 글자 다섯 → 검수 공정 → 시안 → 과목별 쪽 → 진행 순서 → 비용 → 문답
export default function Page() {
  return (
    <KeywordServicePage d={CLINIC_HOMEPAGE} top={PLAIN}>
      <ClinicTextFive />
      <ClinicProcess />
      <ClinicDrafts title="진료과목별 시안" prefixes={["dental-", "derma-", "skincare-", "plastic-", "oriental-", "clinic-", "tpl-tm-medic-care"]} />
      <ClinicSubpages />
    </KeywordServicePage>
  );
}
