import type { Metadata } from 'next';
import { ArrowDownToLine, ArrowUpRight, Check, Monitor } from 'lucide-react';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '하랑 조달스튜디오',
  description: '프로그램 설치부터 업무 시작까지, 네 단계로 준비하세요.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const steps = [
  ['프로그램 받기', '아래 버튼에서 최신 Windows 설치 파일을 받으세요.'],
  ['실행 · 처음 설정', '회사 정보와 지역을 고르고, 필요한 서류를 선택하세요.'],
  ['로그인', '프로그램에서 기관 홈페이지를 열고 로그인 상태를 확인하세요.'],
  ['업무 시작', '전체 순서 실행을 누르고, 진행 상황을 확인하세요.'],
];

export default function ProcurementPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className='w-headline1'>HARANG</span>
          <span className={`${styles.badge} w-label1`}><Check size={16} aria-hidden='true' />현재 무료 · 무제한</span>
        </header>
        <section className={styles.hero} aria-labelledby='procurement-title'>
          <span className={`${styles.eyebrow} w-headline1`}>매일 하는 조달 업무, 한곳에서</span>
          <h1 id='procurement-title' className='w-display2'>하랑 조달스튜디오</h1>
          <p className='w-heading2'>처음에는 설정하고,<br />다음부터는 실행하세요.</p>
          <div className={styles.actions}>
            <a className={`${styles.primary} w-headline1`} href='https://harang-procurement-trial.harangmarketing.chatgpt.site' target='_blank' rel='noopener noreferrer'>
              <ArrowDownToLine size={22} aria-hidden='true' />Windows 받기<ArrowUpRight size={18} aria-hidden='true' />
            </a>
            <a className={`${styles.secondary} w-headline1`} href='http://127.0.0.1:8876/' target='_blank' rel='noopener noreferrer'>
              <Monitor size={22} aria-hidden='true' />설치한 프로그램 열기
            </a>
          </div>
          <p className={`${styles.support} w-body1`}>Windows PC에서 사용하세요. 프로그램을 먼저 실행해야 열립니다.</p>
        </section>
        <section aria-labelledby='start-title' className={styles.guide}>
          <h2 id='start-title' className='w-heading1'>이 순서로 시작하세요</h2>
          <ol className={styles.steps}>
            {steps.map(([title, text], index) => (
              <li key={title} className={styles.step}>
                <span className={`${styles.number} w-heading1`} aria-hidden='true'>{index + 1}</span>
                <div><h3 className='w-heading1'>{title}</h3><p className='w-body1'>{text}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <aside className={`${styles.note} w-body1`}>
          <p>인증이나 확인이 필요하면 프로그램에 안내가 표시됩니다.</p>
          <p>아이디 · 비밀번호 · 인증서는 이 홈페이지에 입력하지 않습니다.</p>
        </aside>
        <details className={`${styles.footer} w-body1`}><summary>페이지 안내</summary><p>메뉴와 검색에 표시하지 않는 안내 페이지입니다. 주소를 아는 사람은 접속할 수 있습니다.</p></details>
      </div>
    </main>
  );
}
