'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, BookOpen, Megaphone, Users, AtSign, Camera, LayoutTemplate, FileText, BarChart3, MapPin, Palette } from 'lucide-react';
import { PUBLIC_SERVICES } from '../lib/service-catalog';

const icons = { Search, BookOpen, Megaphone, Users, AtSign, Camera, LayoutTemplate, FileText, BarChart3, MapPin, Palette };
const goals = [
  { id: 'all', label: '전체 보기', services: PUBLIC_SERVICES.map(s => s.id) as readonly string[] },
  { id: 'search', label: '검색 유입', services: ['place', 'blog', 'cafe-distribution', 'review', 'powercontents', 'naver-ads', 'kakaomap'] },
  { id: 'content', label: '콘텐츠 제작', services: ['photo', 'detail-page', 'sns', 'blog', 'powercontents'] },
  { id: 'opening', label: '개업 준비', services: ['startup', 'photo', 'place', 'kakaomap', 'sns'] },
  { id: 'operation', label: '운영 효율', services: ['studio', 'blog', 'sns', 'naver-ads'] },
];

export default function ServiceFinder() {
  const [goal, setGoal] = useState('all');
  const selected = goals.find(item => item.id === goal)!;
  const services = selected.services.flatMap(id => PUBLIC_SERVICES.filter(service => service.id === id));
  return <div>
    <p className="mb-4 w-body2 text-[var(--w-label-alt)]">지금 필요한 목적을 선택하면 관련 서비스가 모입니다.</p>
    <div role="group" aria-label="필요한 서비스 목적" className="mb-4 flex flex-wrap gap-2">{goals.map(item => <button key={item.id} type="button" aria-pressed={goal === item.id} onClick={() => setGoal(item.id)} className={'min-h-11 rounded-xl border px-4 py-2 w-label1 font-semibold transition-colors ' + (goal === item.id ? 'border-[var(--w-primary)] bg-[var(--w-primary)] text-white' : 'border-[var(--w-line)] bg-[var(--w-bg)] text-[var(--w-label)] hover:bg-[var(--w-bg-alt)]')}>{item.label}</button>)}</div>
    <p role="status" aria-live="polite" className="mb-5 w-caption1 text-[var(--w-label-alt)]">{selected.label} · {services.length}개 품목</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{services.map(service => {
      const Icon = icons[service.icon];
      return <Link key={service.id} href={service.href} className="group flex min-w-0 flex-col rounded-2xl border border-[var(--w-line)] bg-[var(--w-bg)] p-5 shadow-sm transition-colors hover:border-[var(--w-primary)] hover:bg-[var(--w-primary-bg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-primary)]">
        <div className="mb-4 flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--w-primary)] text-white"><Icon size={17} strokeWidth={2} /></span><ArrowRight size={16} className="text-[var(--w-label-assistive)] group-hover:text-[var(--w-primary)]" /></div>
        <h3 className="w-headline1 text-[var(--w-label-strong)]">{service.title}</h3><p className="mt-2 w-body2 text-[var(--w-label-alt)]">{service.desc}</p>
      </Link>;
    })}</div>
  </div>;
}
