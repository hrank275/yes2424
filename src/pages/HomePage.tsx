import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  PhoneCall,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Wrench,
} from 'lucide-react';
import {
  COMPANY_INFO,
  GALLERY_CASES,
  INITIAL_REVIEWS,
  LOCAL_IMAGES,
  MOVING_SERVICES,
} from '../data/yesMovingData';
import { HomeSize, MovingType, PageId, QuotePrefill, RegionName } from '../types';
import { SafeImage } from '../components/SafeImage';

interface HomePageProps {
  onNavigate: (page: PageId, options?: { prefill?: QuotePrefill; anchorId?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [quickType, setQuickType] = useState<MovingType>('가정포장이사');
  const [quickStart, setQuickStart] = useState<RegionName>('포항시 북구');
  const [quickEnd, setQuickEnd] = useState<RegionName>('포항시 남구');
  const [quickSize, setQuickSize] = useState<HomeSize>('20~30평대');

  const featuredCase = GALLERY_CASES[0];
  const topReviews = INITIAL_REVIEWS.slice(0, 3);

  const handleQuickEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('instant-quote', {
      prefill: {
        movingType: quickType,
        startRegion: quickStart,
        endRegion: quickEnd,
        homeSize: quickSize,
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-12 lg:py-20 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-badge-certified-blue">
                  <BadgeCheck className="w-4 h-4 shrink-0" />
                  <span>경북 동해안권 정식 관허 {COMPANY_INFO.freightLicense}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-on-surface font-black tracking-tight leading-[1.18] max-w-2xl">
                  포항·경주·영덕·울진
                  <br />
                  <span className="text-primary">약속을 지키는 안심이사</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-text-muted leading-relaxed max-w-xl">
                  100% 본사 직영 베테랑 크루, 최대 5억원 적재물배상책임보험, 투명한 방문
                  견적. 소중한 우리 가족의 새 출발을 공인허가업체{' '}
                  <strong className="text-on-surface font-bold">예스이사</strong>가
                  책임집니다.
                </p>
              </div>

              {/* 3 Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">정식 관허업체</div>
                    <div className="text-xs text-slate-text-muted">무허가 피해 제로</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-badge-certified-blue shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">적재물 보험</div>
                    <div className="text-xs text-slate-text-muted tabular-nums">최대 5억원 보장</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border flex items-center gap-3">
                  <Users className="w-6 h-6 text-safety-green shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">100% 직영팀</div>
                    <div className="text-xs text-slate-text-muted">외주 없는 베테랑</div>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('instant-quote')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-base font-bold shadow-md transition-colors cursor-pointer"
                >
                  <span>1분 실시간 무료견적 신청</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-surface-container-lowest border border-brand-border hover:bg-surface-container-low text-on-surface text-base font-extrabold transition-colors tabular-nums"
                >
                  <PhoneCall className="w-5 h-5 text-primary" />
                  <span>{COMPANY_INFO.phoneMain}</span>
                </a>
                <span className="w-full text-xs text-slate-text-muted pt-1">
                  현장 직통 {COMPANY_INFO.phoneDirect} · 방문 견적비용 0원 · 당일 일정 확인 가능
                </span>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-brand-border flex-1 min-h-[280px]">
                <SafeImage
                  src={LOCAL_IMAGES.heroPohang}
                  alt="예스이사 전문 포장팀의 거실 바닥 보양 및 가구 보호 작업 현장"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6">
                  <div className="text-xs font-semibold text-white/80 mb-1">
                    포항 본사 직영 · 경북 동해안 전지역
                  </div>
                  <div className="text-lg font-bold text-white leading-snug">
                    바닥 보양재 · 위생 덧신 · 피톤치드 살균까지 원스톱 시공
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Quick Quote Launcher Bar */}
          <form
            onSubmit={handleQuickEstimate}
            className="mt-10 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-brand-border shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">이사 종류</label>
              <select
                value={quickType}
                onChange={(e) => setQuickType(e.target.value as MovingType)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-sm font-medium text-on-surface border border-brand-border focus:outline-2 focus:outline-primary"
              >
                <option value="가정포장이사">가정이사 (포장)</option>
                <option value="일반이사">일반이사</option>
                <option value="원룸소형이사">원룸 / 소형이사</option>
                <option value="기업관공서이사">사무실 / 관공서</option>
                <option value="보관이사">보관이사 (컨테이너)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">출발 지역</label>
              <select
                value={quickStart}
                onChange={(e) => setQuickStart(e.target.value as RegionName)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-sm font-medium text-on-surface border border-brand-border focus:outline-2 focus:outline-primary"
              >
                <option value="포항시 북구">포항시 북구</option>
                <option value="포항시 남구">포항시 남구</option>
                <option value="경주시">경주시</option>
                <option value="영덕군">영덕군</option>
                <option value="울진군">울진군</option>
                <option value="타지역">기타 전국 지역</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">도착 지역</label>
              <select
                value={quickEnd}
                onChange={(e) => setQuickEnd(e.target.value as RegionName)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-sm font-medium text-on-surface border border-brand-border focus:outline-2 focus:outline-primary"
              >
                <option value="포항시 남구">포항시 남구</option>
                <option value="포항시 북구">포항시 북구</option>
                <option value="경주시">경주시</option>
                <option value="영덕군">영덕군</option>
                <option value="울진군">울진군</option>
                <option value="타지역">기타 전국 지역</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">주거 평형대</label>
              <select
                value={quickSize}
                onChange={(e) => setQuickSize(e.target.value as HomeSize)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-sm font-medium text-on-surface border border-brand-border focus:outline-2 focus:outline-primary"
              >
                <option value="10평 이하">10평 이하 (원룸)</option>
                <option value="10~20평대">10~20평대</option>
                <option value="20~30평대">20~30평대</option>
                <option value="30~40평대">30~40평대</option>
                <option value="40평대 이상">40평대 이상</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-inverse-surface hover:bg-on-background text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              예상 견적 계산하기
            </button>
          </form>
        </div>
      </section>

      {/* 2. 4 TRUST GUARANTEES */}
      <section className="w-full py-16 bg-surface-container-lowest">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-badge-certified-blue mb-1">
                공식 인증 · 법적 보증 시스템
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                예스이사만의 4대 안심 보증
              </h2>
            </div>
            <p className="text-sm text-slate-text-muted max-w-md">
              무허가 불법 이사로 인한 이삿짐 분실·파손·웃돈 요구 걱정 없이 공인된 인증과
              제도적 보호 아래 안전하게 진행됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              type="button"
              onClick={() => onNavigate('company-certification')}
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-badge-certified-bg text-badge-certified-blue flex items-center justify-center mb-4">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-badge-certified-blue mb-1">
                  공식 관허 증명
                </div>
                <h3 className="text-lg text-on-surface font-bold mb-2">정부공식 허가업체</h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  화물자동차운송주선사업 정식 허가({COMPANY_INFO.freightLicense})를 득하여
                  법적 보호를 받습니다.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-brand-border flex items-center text-xs text-badge-certified-blue font-bold">
                <span>허가증 원본 확인하기</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('company-certification')}
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-primary mb-1">배상보험 100%</div>
                <h3 className="text-lg text-on-surface font-bold mb-2">적재물 배상책임보험</h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  운송 및 상하차 중 발생하는 만일의 파손이나 훼손 사고에 대해 최대 5억원 한도
                  보상 체계를 가동합니다.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-brand-border flex items-center text-xs text-primary font-bold">
                <span>책임보상 기준 확인</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('company-certification')}
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-secondary mb-1">중기부 확인서</div>
                <h3 className="text-lg text-on-surface font-bold mb-2">공인 여성기업 인증</h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  중소벤처기업부 인증 여성기업으로 섬세한 정리수납과 냉장고 스팀살균까지
                  세밀하게 챙깁니다.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-brand-border flex items-center text-xs text-secondary font-bold">
                <span>여성기업 확인서 보기</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('moving-services')}
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-text-muted mb-1">
                  본사 직영 배차
                </div>
                <h3 className="text-lg text-on-surface font-bold mb-2">베테랑 인력 & 사다리차</h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  외주 없이 10년 이상 호흡을 맞춘 본사 직영팀과 최신 고층 사다리차를 직접
                  배차하여 지연이 없습니다.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-brand-border flex items-center text-xs text-on-surface font-bold">
                <span>보유 장비 및 서비스 보기</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 3. MOVING SERVICES OVERVIEW */}
      <section className="w-full py-16 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-primary mb-1">맞춤형 이사 솔루션</div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                공간과 상황에 맞춘 예스이사 서비스
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('moving-services')}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline cursor-pointer"
            >
              <span>전체 서비스 상세 비교</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOVING_SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden border border-brand-border flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <SafeImage
                    src={svc.image}
                    fallbackSrc={svc.fallbackImage}
                    alt={svc.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <div className="text-xs font-bold text-white">
                      {svc.number}. {svc.badge} · {svc.subtitle}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                  <div>
                    <h3 className="text-lg text-on-surface font-bold mb-2">{svc.title}</h3>
                    <p className="text-sm text-slate-text-muted leading-relaxed mb-4">
                      {svc.description}
                    </p>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant">
                      {svc.features.slice(0, 3).map((feat) => (
                        <li key={feat.title} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-safety-green shrink-0" />
                          <span>{feat.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate('moving-services', { anchorId: svc.anchorId })
                      }
                      className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
                    >
                      상세안내
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate('instant-quote', {
                          prefill: { movingType: svc.quoteType },
                        })
                      }
                      className="flex-1 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-xs font-bold text-on-primary transition-colors cursor-pointer"
                    >
                      견적신청
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE GALLERY & REAL REVIEWS */}
      <section className="w-full py-16 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold text-badge-certified-blue mb-1">
                현장 사례 및 고객 후기
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                생생한 작업 현장 & 실제 이용 후기
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('work-gallery')}
              className="inline-flex items-center gap-1 text-sm text-primary font-bold hover:underline cursor-pointer"
            >
              <span>현장 갤러리 전체보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            {/* Highlight Field Story */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 border border-brand-border flex flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-text-muted">
                  <span className="font-bold text-badge-certified-blue">
                    {featuredCase.route}
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">{featuredCase.date} 완료</span>
                  <span>·</span>
                  <span>{featuredCase.truckInfo}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-tertiary font-bold tabular-nums">
                  <Star className="w-4 h-4 fill-tertiary" />
                  <span>{featuredCase.rating.toFixed(1)} 만점</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-lg overflow-hidden h-52">
                  <SafeImage
                    src={LOCAL_IMAGES.heroPohang}
                    alt="포항 아파트 거실 바닥 보양 작업 현장"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 text-white text-xs font-medium rounded">
                    거실 바닥 이중 보양
                  </span>
                </div>
                <div className="relative rounded-lg overflow-hidden h-52">
                  <SafeImage
                    src={LOCAL_IMAGES.ladderTruck}
                    alt="포항 고층 아파트 사다리차 양중 작업"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 text-white text-xs font-medium rounded">
                    직영 사다리차 안전 양중
                  </span>
                </div>
              </div>

              <div className="text-sm text-on-surface-variant leading-relaxed">
                "{featuredCase.customerComment}"
                <span className="block text-xs text-slate-text-muted mt-1.5 font-semibold">
                  - {featuredCase.title} ({featuredCase.customerName})
                </span>
              </div>
            </div>

            {/* Satisfaction Breakdown */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 border border-brand-border flex flex-col justify-between gap-5">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <SafeImage
                    src={COMPANY_INFO.logoUrl}
                    alt="예스이사"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-lg text-on-surface font-black">예스이사 만족도</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low text-center mb-5">
                  <div className="text-4xl text-primary font-black tabular-nums leading-none">
                    99.4%
                  </div>
                  <div className="flex justify-center text-tertiary my-2 gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className="w-4 h-4 fill-tertiary" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-text-muted tabular-nums">
                    포항·경주·영덕·울진 누적 14,800건+ 진행
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-on-surface mb-1">
                      <span>작업 친절도 및 시간 준수</span>
                      <span className="font-bold text-primary tabular-nums">100%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container">
                      <div className="h-2 rounded-full bg-primary w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-on-surface mb-1">
                      <span>무사고 안전 운송 이행률</span>
                      <span className="font-bold text-badge-certified-blue tabular-nums">
                        99.8%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container">
                      <div className="h-2 rounded-full bg-badge-certified-blue w-[99.8%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-on-surface mb-1">
                      <span>지인 추천 및 재이용 의향</span>
                      <span className="font-bold text-safety-green tabular-nums">98.9%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container">
                      <div className="h-2 rounded-full bg-safety-green w-[98.9%]" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('auspicious-calendar')}
                className="w-full py-3 px-4 rounded-xl bg-badge-certified-bg hover:bg-secondary-fixed text-badge-certified-blue text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                <span>이번 달 손없는날 달력 확인하기</span>
              </button>
            </div>
          </div>

          {/* 3 Customer Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-xl bg-surface-container-lowest border border-brand-border flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-slate-text-muted">{rev.route}</span>
                    <div className="flex text-tertiary gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-tertiary" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">{rev.headline}</h3>
                  <p className="text-sm text-slate-text-muted leading-relaxed">{rev.content}</p>
                </div>
                <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-text-muted tabular-nums">
                  <span>작성자: {rev.author}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. REGIONAL DIRECT NETWORK BANNER */}
      <section className="w-full py-14 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="bg-surface-container-lowest rounded-2xl p-8 lg:p-10 border border-brand-border flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-badge-certified-blue">
                <MapPin className="w-4 h-4" />
                <span>동해안 4대 권역 당일 방문 실측 지원</span>
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                어디서 출발하시든 직영차량이 즉시 달려갑니다
              </h2>
              <p className="text-sm text-slate-text-muted leading-relaxed">
                포항 본점(북구/남구)을 중심으로 경주지사, 영덕·울진 출장소를 유기적으로 운영하여
                중간 알선 마진 없는 합리적 운임을 제공합니다.
              </p>
              <div className="text-xs font-bold text-on-surface pt-1">
                포항 남구/북구 전역 · 경주시 전역(황성·안강·외동) · 영덕군 전역(강구·영해) · 울진군
                전역(울진읍·후포)
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href={`tel:${COMPANY_INFO.phoneMain}`}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-base font-bold text-center flex items-center justify-center gap-2 transition-colors tabular-nums"
              >
                <Phone className="w-5 h-5" />
                <span>{COMPANY_INFO.phoneMain} 즉시 전화</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate('location-contact')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-base font-bold text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-primary" />
                <span>본점·지사 위치 확인</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
