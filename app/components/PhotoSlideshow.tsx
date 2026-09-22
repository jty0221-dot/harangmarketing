'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { PortfolioImage } from '../lib/photo-portfolios';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
const serverMotion = () => false;
const serverVisible = () => true;
const readMotion = () => window.matchMedia(motionQuery).matches;
const readVisible = () => document.visibilityState === 'visible';

export default function PhotoSlideshow({ name, images }: { name: string; images: PortfolioImage[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const visible = useSyncExternalStore(subscribeVisibility, readVisible, serverVisible);
  const canPlay = images.length > 1;
  const rotating = canPlay && playing && !hovered && !reduceMotion && visible;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % images.length), 4500);
    return () => window.clearInterval(timer);
  }, [rotating, images.length]);

  useEffect(() => {
    const button = thumbnails.current[index];
    if (!button || !button.parentElement) return;
    const strip = button.parentElement;
    strip.scrollTo({ left: button.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + button.clientWidth / 2, behavior: reduceMotion ? 'instant' : 'smooth' });
  }, [index, reduceMotion]);

  function select(next: number) {
    setPlaying(false);
    setIndex((next + images.length) % images.length);
  }
  const current = images[index];
  const control = 'inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--w-line)] bg-[var(--w-bg)] text-[var(--w-label)] hover:bg-[var(--w-bg-alt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w-primary)]';

  return <section aria-label={name + ' 촬영 사진'} aria-roledescription="슬라이드 쇼" className="min-w-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={(event) => { if (!(event.target as HTMLElement).closest('[data-autoplay]') && !event.currentTarget.contains(event.relatedTarget as Node | null)) setPlaying(false); }} onKeyDown={(event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); select(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); select(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); select(0); }
    if (event.key === 'End') { event.preventDefault(); select(images.length - 1); }
  }}>
    <div tabIndex={0} aria-label="사진 영역. 좌우 방향키로 사진을 넘길 수 있습니다" className="relative flex aspect-[4/3] touch-pan-y items-center justify-center overflow-hidden rounded-2xl bg-[var(--w-bg-alt)] outline-offset-4 md:aspect-[16/10] md:max-h-[72vh]" onPointerDown={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; }} onPointerCancel={() => { pointer.current = null; }} onPointerUp={(event) => {
      const start = pointer.current;
      pointer.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) select(index + (dx < 0 ? 1 : -1));
    }}>
      <Image key={current.src} src={current.src} unoptimized={current.src.endsWith('.gif')} alt={name + ' 촬영 사진 ' + (index + 1)} width={current.width} height={current.height} sizes="(max-width: 1152px) 100vw, 1152px" className="h-full w-full object-contain" draggable={false} preload={index === 0} />
    </div>
    <div className="my-4 flex flex-wrap items-center justify-between gap-3">
      <p aria-live={rotating ? 'off' : 'polite'} aria-atomic="true" className="w-label1 tabular-nums text-[var(--w-label-alt)]"><span className="font-semibold text-[var(--w-label)]">{String(index + 1).padStart(2, '0')}</span> / {String(images.length).padStart(2, '0')}</p>
      {canPlay && <div className="flex gap-2"><button type="button" aria-label="이전 사진" onClick={() => select(index - 1)} className={control}><ChevronLeft size={20} /></button>{!reduceMotion && <button type="button" aria-label={playing ? '자동 넘김 일시정지' : '자동 넘김 재생'} data-autoplay aria-pressed={playing} onClick={() => setPlaying((value) => !value)} className={control + ' gap-2 px-3'}>{playing ? <Pause size={16} /> : <Play size={16} />}<span className="w-caption1">{playing ? '일시정지' : '자동 넘김'}</span></button>}<button type="button" aria-label="다음 사진" onClick={() => select(index + 1)} className={control}><ChevronRight size={20} /></button></div>}
    </div>
    {canPlay && <div className="relative flex gap-2 overflow-x-auto pb-3" aria-label="사진 선택">{images.map((image, number) => <button key={image.src} ref={(element) => { thumbnails.current[number] = element; }} type="button" aria-label={(number + 1) + '번 사진 보기'} aria-current={number === index ? 'true' : undefined} onClick={() => select(number)} className={'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 md:h-20 md:w-28 ' + (number === index ? 'border-[var(--w-primary)]' : 'border-transparent opacity-60 hover:opacity-100')}><Image src={image.src} unoptimized={image.src.endsWith('.gif')} alt="" fill sizes="112px" className="object-cover" /></button>)}</div>}
  </section>;
}
