/**
 * 구조화 데이터(JSON-LD) 삽입용 서버 컴포넌트.
 * 클라이언트 페이지에서도 그대로 렌더링 가능하도록 순수 마크업만 반환한다.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
