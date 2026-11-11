import { getPortfolio } from "../../lib/portfolio";
import { Section } from "./Sian";
import s from "./sian.module.css";

/**
 * 업종 페이지의 실제 진행 사례 사진 네 장 · content/portfolio.json(하랑 블로그 사례)에서만 온다.
 * 글자뿐이던 업종 페이지에 실제 사진을 놓으려고 넣었다 (2026-11-12 대표 「너무 허접해」).
 * 사진이 있는 사례가 없으면 절 자체를 그리지 않는다.
 */
export default function CaseShots({ slug, label }: { slug: string; label: string }) {
  const cases = (getPortfolio().industries.find((i) => i.slug === slug)?.cases ?? [])
    .filter((c) => c.image)
    .slice(0, 4);
  if (cases.length === 0) return null;
  return (
    <Section
      title={`${label} 진행 사례`}
      desc="하랑 블로그에 올린 실제 진행 기록입니다. 사진을 누르면 원문으로 갑니다."
      more={{ href: "/portfolio", label: "업종별 사례 더 보기" }}
    >
      <ul className={s.shots}>
        {cases.map((c) => (
          <li key={c.logNo}>
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              <img src={c.image!} alt="" width={480} height={360} loading="lazy" decoding="async" />
              <span>{c.title}</span>
              <small>{c.date}</small>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
