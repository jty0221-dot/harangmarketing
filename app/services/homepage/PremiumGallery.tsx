"use client";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Monitor, Smartphone, Search } from "lucide-react";
import { HP_GROUPS } from "../../lib/homepage-portfolio";
type Design={slug:string;group:string;title:string;subtitle:string;url:string;image:string;variant?:boolean};
const DESIGN_FLOW:Record<string,{flow:string;tags:string[]}>= {
 home:{flow:"불편 증상을 먼저 고르고 작업 범위를 이해한 뒤 현장 문의를 준비합니다",tags:["증상 탐색","범위 안내","현장 문의"]},
 "home-project":{flow:"공사 사례와 진행 과정을 먼저 살펴본 뒤 원하는 공사 조건을 정리합니다",tags:["사례 중심","공정 비교","공사 범위"]},
 food:{flow:"메뉴와 좌석 분위기를 둘러보고 영업·위치 등 방문 정보를 확인합니다",tags:["메뉴 안내","좌석 분위기","방문 준비"]},
 "food-roastery":{flow:"선호하는 맛을 선택하고 커피를 비교한 뒤 취향 질문으로 이어집니다",tags:["맛 선택","커피 비교","취향 질문"]},
 beauty:{flow:"원하는 스타일을 보고 손질 습관과 취향을 정리해 상담을 준비합니다",tags:["스타일 탐색","손질 조건","취향 상담"]},
 stay:{flow:"객실 사진과 이용 조건을 비교하고 인원·일정에 맞는 질문을 정리합니다",tags:["객실 비교","이용 조건","일정 준비"]},
 b2b:{flow:"제작 사양과 검토 자료를 먼저 확인하고 도면·납기 조건을 협의합니다",tags:["사양 확인","도면 준비","납기 협의"]},
 clean:{flow:"공간 유형을 선택하고 구역별 작업 범위와 견적 준비 항목을 확인합니다",tags:["공간 선택","구역별 범위","견적 준비"]},
 medical:{flow:"진료 항목과 처음 방문할 때의 순서를 확인한 뒤 위치·준비사항을 살핍니다",tags:["진료 안내","첫 방문 순서","위치·준비"]},
 edu:{flow:"학습 대상과 과정을 고르고 강좌·시간표를 살핀 뒤 상담 질문을 정리합니다",tags:["과정 필터","강좌·시간표","학습 상담"]},
 fitness:{flow:"운동 경험에 맞는 프로그램을 선택하고 주간 일정과 첫 방문 준비를 확인합니다",tags:["경험별 선택","주간 일정","체험 준비"]},
 car:{flow:"차량 증상을 먼저 선택하고 점검 범위와 입고 전 설명할 내용을 확인합니다",tags:["증상 선택","점검 범위","입고 준비"]},
 pro:{flow:"상담 분야를 구분하고 필요한 서류와 검토 조건을 정리합니다",tags:["분야 구분","준비 서류","검토 조건"]},
 retail:{flow:"선물·공간별 상품을 걸러 보고 구성·수령 조건을 확인해 주문을 준비합니다",tags:["컬렉션 필터","구성 비교","수령 조건"]},
 leisure:{flow:"모임 목적과 인원을 기준으로 공간을 비교하고 시설·입실 조건을 확인합니다",tags:["목적·인원","공간 비교","이용 규정"]},
};
const premiumLabel=(key:string)=>key==="retail"?"상점 · 상품":HP_GROUPS.find(g=>g.key===key)?.label||key;
export default function PremiumGallery({onBrowseArchive}:{onBrowseArchive?:(query:string)=>void}){
 const [rows,setRows]=useState<Design[]>([]),[failed,setFailed]=useState(false),[group,setGroup]=useState("all"),[query,setQuery]=useState(""),[mobile,setMobile]=useState(false);
 useEffect(()=>{let live=true;fetch("/sian/premium/catalog.json").then(r=>{if(!r.ok)throw new Error();return r.json()}).then(x=>{if(live)setRows(x)}).catch(()=>{if(live)setFailed(true)});const q=new URLSearchParams(window.location.search);if(q.get("group"))setGroup(q.get("group")!);if(q.get("q"))setQuery(q.get("q")!.slice(0,40));return()=>{live=false}},[]);
 const visible=useMemo(()=>rows.filter(r=>(group==="all"||r.group===group)&&(!query.trim()||[r.title,r.subtitle,premiumLabel(r.group)].join(" ").toLowerCase().includes(query.trim().toLowerCase()))),[rows,group,query]);
 return <section aria-label="업종별 프리미엄 홈페이지 시안" className="mb-12">
 <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="w-caption-1 font-bold" style={{color:"var(--w-primary)"}}>새로운 프리미엄 디자인 컬렉션</p><h3 className="w-heading-3 mt-2">고객이 찾는 정보부터 다르게</h3><p className="w-body-2 mt-2" style={{color:"var(--w-label-alt)"}}>업종별 구성과 이용 목적을 비교해 보세요. 설비와 카페는 서로 다른 두 방향을 함께 볼 수 있습니다</p></div><div className="flex gap-1" aria-label="캡처 기기"><button type="button" onClick={()=>setMobile(false)} aria-pressed={!mobile} className="w-btn w-btn-sm min-h-[44px]" style={{background:!mobile?"var(--w-label-strong)":"var(--w-bg)",color:!mobile?"#fff":"var(--w-label-alt)"}}><Monitor size={15}/>PC</button><button type="button" onClick={()=>setMobile(true)} aria-pressed={mobile} className="w-btn w-btn-sm min-h-[44px]" style={{background:mobile?"var(--w-label-strong)":"var(--w-bg)",color:mobile?"#fff":"var(--w-label-alt)"}}><Smartphone size={15}/>모바일</button></div></div>
 <div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="relative min-w-0 flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="프리미엄 시안 검색" placeholder="업종이나 구성 방향 검색" className="w-input w-full" style={{paddingLeft:44}}/></div><div className="w-full sm:w-48 sm:shrink-0"><select value={group} onChange={e=>{if(e.target.value==="pet"){setQuery("반려동물");setGroup("all");onBrowseArchive?.("반려동물")}else setGroup(e.target.value)}} aria-label="프리미엄 업종 선택" className="w-input min-h-[44px]" style={{width:"100%"}}><option value="all">모든 업종</option>{HP_GROUPS.map(g=><option value={g.key} key={g.key}>{premiumLabel(g.key)}</option>)}<option value="pet">반려동물 · 기존 시안 6개</option></select></div></div>
 <p className="w-caption-1 mb-4" aria-live="polite" style={{color:"var(--w-label-alt)"}}>{failed?"시안을 불러오지 못했습니다. 새로고침해 주세요":rows.length?`${visible.length}개 디자인 · 실제 PC·모바일 페이지 캡처`:"시안 불러오는 중"}</p>
 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map(r=><a key={r.slug} href={r.url} target="_blank" rel="noopener noreferrer" className="w-card group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--w-shadow-md)]"><div className={mobile?"relative flex h-[280px] items-center justify-center overflow-hidden":"relative aspect-[8/5] overflow-hidden"} style={{background:"var(--w-cn-98)",textAlign:"center"}}>{/* eslint-disable-next-line @next/next/no-img-element */}<img key={r.slug+String(mobile)} src={`/sian/premium/thumbs/${r.slug}-${mobile?375:1440}.webp`} alt={`${r.title} 실제 ${mobile?"모바일":"PC"} 시안 화면`} width={mobile?375:1440} height={mobile?812:900} loading="lazy" className={mobile?"h-full w-auto max-w-full object-contain":"h-full w-full object-contain"}/></div><div className="flex flex-1 flex-col p-5"><div className="mb-2 flex flex-wrap gap-1.5"><span className="w-chip w-chip-blue">{premiumLabel(r.group)||r.group}</span>{(r.group==="home"||r.group==="food")&&<span className="w-chip w-chip-neutral">같은 업종 두 방향</span>}</div><h4 className="w-label-1 font-bold">{r.title}</h4><p className="w-caption-1 mt-2" style={{color:"var(--w-label-alt)"}}>{r.subtitle}</p><p className="w-caption-1 mt-3 flex-1" style={{color:"var(--w-label-alt)",lineHeight:1.8}}>{DESIGN_FLOW[r.slug]?.flow}</p><div className="mt-3 flex flex-wrap gap-1">{DESIGN_FLOW[r.slug]?.tags.map(tag=><span key={tag} className="w-chip w-chip-neutral">{tag}</span>)}</div><span className="w-caption-1 mt-4 inline-flex items-center gap-1 font-bold" style={{color:"var(--w-primary)"}}>실제 시안 둘러보기<ExternalLink size={12}/></span></div></a>)}</div>
 {rows.length>0&&visible.length===0&&<p className="py-12 text-center w-body-2">조건에 맞는 프리미엄 시안이 없습니다. 검색어나 업종을 바꿔 주세요{/(반려|펫|애견|동물|pet|vet)/i.test(query)&&<button type="button" className="w-btn w-btn-secondary mt-4 mx-auto" onClick={()=>onBrowseArchive?.("반려동물")}>반려동물 시안 6개 보기</button>}</p>}
 </section>
}
