/**
 * 광고 착지 화면의 순위 사례 스위치.
 *
 * 광고 글이 닿는 화면 (/services · /free-check · /contact) 의 순위 사례 블록을
 * 이 한 줄로 같이 켜고 끈다. 공개 동의가 확인된 매장분만 켠다.
 * 근거 문서는 저장소 밖에 둔다.
 *
 * true 로 바꾸기 전에 할 일
 *   1) 공개 동의가 확인된 매장만 고르는 거름을 scripts/place-rank/rank_records.py 와
 *      build_cases.py 에 먼저 넣는다. 거름 없이 true 로 돌리면 숨긴 줄이 그대로 돌아온다.
 *   2) 화면 문구가 바뀌는 일이라 배포 전에 결재를 받는다.
 *
 * /cases/place-rank 와 /services/place 의 순위 기록은 이 스위치가 덮지 않는다.
 */
export const LANDING_RANK_PROOF = false;
