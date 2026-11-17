import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Send,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Wrench,
} from 'lucide-react';
import { INITIAL_BOARD_POSTS } from '../data/boardData';
import {
  BRANCH_LOCATIONS,
  COMPANY_INFO,
  CORE_FAQS,
  GALLERY_CASES,
  INITIAL_REVIEWS,
  LOCAL_IMAGES,
  MOVING_SERVICES,
  PROCESS_STEPS,
} from '../data/yesMovingData';
import {
  BoardCategory,
  FaqItem,
  HomeSize,
  MovingType,
  PageId,
  QuotePrefill,
  QuoteSubmission,
  RegionName,
} from '../types';
import { SafeImage } from '../components/SafeImage';
import { ServiceIcon } from '../components/ServiceIcon';

interface HomePageProps {
  onNavigate: (
    page: PageId,
    options?: { prefill?: QuotePrefill; anchorId?: string; boardTab?: BoardCategory }
  ) => void;
  onOpenKakao: () => void;
  onTrackPhone: () => void;
}

const QUOTES_STORAGE_KEY = 'yesmoving_quote_submissions_v1';

const PROBLEM_POINTS = [
  {
    problem: '무허가 알선·당일 웃돈 요구 불안',
    detail: '온라인 중개 플랫폼에서 저렴한 견적만 보고 계약했다가 당일 사다리·수고비 등 추가금을 요구받는 사례가 많습니다.',
    solution: '정식 화물주선 허가(제5020000-2006-03-04019호) & 표준계약서 추가금 0원 명문화',
  },
  {
    problem: '신축 입주 마루·가전 스크래치 우려',
    detail: '일용직 알바 인력이 투입되거나 바닥 보양 없이 작업해 고가 냉장고, 원목 마루, 엘리베이터가 훼손될 수 있습니다.',
    solution: '10년+ 직영 정직원 팀 · 전 구역 롤 바닥 보양재 · 최대 5억원 적재물배상책임보험',
  },
  {
    problem: '관공서·학교·장거리 이전 일정 지연',
    detail: '공공기관 서류·전산 장비 파손이나 영덕·울진 등 외곽 지역 출장비 가중으로 예산·업무 공백이 발생합니다.',
    solution: '여성기업 확인서·관허 입찰 증빙 완비 · 포항·경주·영덕·울진 직영망 출장비 0원',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenKakao,
  onTrackPhone,
}) => {
  // Quick Estimator Launcher State
  const [quickType, setQuickType] = useState<MovingType>('가정포장이사');
  const [quickStart, setQuickStart] = useState<RegionName>('포항시 북구');
  const [quickEnd, setQuickEnd] = useState<RegionName>('포항시 남구');
  const [quickSize, setQuickSize] = useState<HomeSize>('20~30평대');

  // Section 7: 10 FAQ Accordion State
  const [faqFilter, setFaqFilter] = useState<'전체' | FaqItem['category']>('전체');
  const [openFaqId, setOpenFaqId] = useState<string | null>(CORE_FAQS[0]?.id || null);

  // Section 8: Inline Lead Capture Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadRegion, setLeadRegion] = useState<RegionName>('포항시 북구');
  const [leadType, setLeadType] = useState<MovingType>('가정포장이사');
  const [leadMemo, setLeadMemo] = useState('');
  const [leadConsent, setLeadConsent] = useState(true);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSubmittedId, setLeadSubmittedId] = useState<string | null>(null);

  const featuredCase = GALLERY_CASES[0];
  const topReviews = INITIAL_REVIEWS.slice(0, 3);
  const featuredColumns = INITIAL_BOARD_POSTS.filter((p) => p.boardType === '칼럼').slice(0, 3);
  const hq = BRANCH_LOCATIONS[0];

  const visibleFaqs = useMemo(() => {
    if (faqFilter === '전체') return CORE_FAQS;
    return CORE_FAQS.filter((f) => f.category === faqFilter);
  }, [faqFilter]);

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

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      setLeadError('성함과 연락처를 입력해 주세요.');
      return;
    }
    if (!leadConsent) {
      setLeadError('개인정보 수집·이용에 동의해 주세요.');
      return;
    }
    setLeadError(null);

    const id = `S-${Date.now().toString().slice(-6)}`;
    const submission: QuoteSubmission = {
      id,
      createdAt: new Date().toLocaleString('ko-KR'),
      status: '접수대기',
      source: '간편상담',
      movingType: leadType,
      startRegion: leadRegion,
      startDetail: '홈페이지 빠른 상담',
      startHousing: '아파트',
      startFloor: '-',
      startTransport: '엘리베이터',
      endRegion: leadRegion,
      endDetail: '상담 시 확인',
      endHousing: '아파트',
      endFloor: '-',
      endTransport: '엘리베이터',
      homeSize: '20~30평대',
      movingDate: '상담 시 조율',
      movingTime: '상담 시 협의',
      customerName: leadName.trim(),
      customerPhone: leadPhone.trim(),
      specialItems: [],
      memo: leadMemo.trim(),
      estimatedRange: '유선/방문 실측 안내',
      recommendedTruck: '맞춤 배차',
    };

    try {
      const existingRaw = localStorage.getItem(QUOTES_STORAGE_KEY);
      const existing = existingRaw ? (JSON.parse(existingRaw) as QuoteSubmission[]) : [];
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify([submission, ...existing].slice(0, 30)));
    } catch {
      // Ignore storage error
    }

    setLeadSubmittedId(id);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-10 lg:py-18 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-7">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-badge-certified-blue">
                  <BadgeCheck className="w-4 h-4 shrink-0" />
                  <span>포항·경주·영덕·울진 정식 관허 {COMPANY_INFO.freightLicense}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[46px] text-on-surface font-black tracking-tight leading-[1.18] max-w-2xl">
                  포항·경주·영덕·울진
                  <br />
                  <span className="text-primary">포장이사·관공서·학교이사 전문</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-text-muted leading-relaxed max-w-xl">
                  100% 본사 직영 베테랑 크루, 최대 5억원 적재물배상책임보험, 여성기업 인증.
                  투명한 무료 방문견적과 추가금 0원 계약으로{' '}
                  <strong className="text-on-surface font-bold">예스이사</strong>가 가장 안전한
                  새 출발을 약속합니다.
                </p>
              </div>

              {/* 3 Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">정식 관허업체</div>
                    <div className="text-xs text-slate-text-muted">무허가·웃돈 0원</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-badge-certified-blue shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">적재물 배상보험</div>
                    <div className="text-xs text-slate-text-muted tabular-nums">최대 5억원 보장</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border flex items-center gap-3">
                  <Award className="w-6 h-6 text-safety-green shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">여성기업 · 직영팀</div>
                    <div className="text-xs text-slate-text-muted">피톤치드 스팀살균</div>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('instant-quote')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm sm:text-base font-bold shadow-md transition-colors cursor-pointer"
                >
                  <span>무료 상담·견적 신청</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  onClick={onTrackPhone}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-surface-container-lowest border border-brand-border hover:bg-surface-container-low text-on-surface text-sm sm:text-base font-extrabold transition-colors tabular-nums"
                >
                  <PhoneCall className="w-5 h-5 text-primary" />
                  <span>전화상담 {COMPANY_INFO.phoneMain}</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenKakao}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-on-surface text-sm font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>카카오톡 문의</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('location-contact')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-badge-certified-blue" />
                  <span>오시는 길</span>
                </button>
                <span className="w-full text-xs text-slate-text-muted pt-1 tabular-nums">
                  현장 직통 {COMPANY_INFO.phoneDirect} · 365일 연중무휴 08:00~20:00 · 방문 실측
                  비용 0원
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
                <option value="가정포장이사">가정이사 (포장이사)</option>
                <option value="기업관공서이사">관공서 / 학교 / 기업</option>
                <option value="일반이사">실속 일반이사</option>
                <option value="원룸소형이사">원룸 / 용달 소형</option>
                <option value="보관이사">안심 보관이사</option>
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
              예상 이사 비용 확인
            </button>
          </form>
        </div>
      </section>

      {/* 2. PROBLEM EMPATHY SECTION */}
      <section className="w-full py-14 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold text-primary mb-1">이사 전 가장 큰 걱정 3가지</div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                이사 비용·파손·추가금 걱정, 왜 예스이사를 선택할까요?
              </h2>
            </div>
            <p className="text-sm text-slate-text-muted max-w-md">
              포항이사·영덕이사·울진이사 고객들이 가장 불편해하는 3대 문제를 계약 단계부터
              제도적으로 차단했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEM_POINTS.map((item) => (
              <div
                key={item.problem}
                className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>고객 불안 요인</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-on-surface mb-2">{item.problem}</h3>
                  <p className="text-xs sm:text-sm text-slate-text-muted leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-border text-xs font-bold text-badge-certified-blue flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-safety-green shrink-0 mt-0.5" />
                  <span>{item.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES SHOWCASE */}
      <section className="w-full py-16 bg-surface-container-low border-t border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-primary mb-1">맞춤형 이사 서비스</div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                포장이사·관공서이사·학교이사 전문 솔루션
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4">
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

      {/* 4. DIFFERENTIATION / 4 TRUST GUARANTEES */}
      <section className="w-full py-16 bg-surface-container-lowest border-t border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-badge-certified-blue mb-1">
                공식 인증 · 법적 보증 시스템
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                차별화된 예스이사 4대 안심 보증
              </h2>
            </div>
            <p className="text-sm text-slate-text-muted max-w-md">
              관공서·학교·가정이사를 막론하고 공인된 인허가와 여성기업 인증, 배상책임보험으로
              투명하게 책임집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              type="button"
              onClick={() => onNavigate('company-certification')}
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border transition-colors flex flex-col justify-between cursor-pointer"
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
                  화물자동차운송주선사업 정식 허가({COMPANY_INFO.freightLicense})를 득하여 법적
                  보호를 받습니다.
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
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-primary mb-1">배상보험 100%</div>
                <h3 className="text-lg text-on-surface font-bold mb-2">적재물 배상책임보험</h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  운송 및 상하차 중 발생하는 만일의 파손이나 훼손 사고에 대해 최대 5억원 한도 보상
                  체계를 가동합니다.
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
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-secondary mb-1">중기부 확인서</div>
                <h3 className="text-lg text-on-surface font-bold mb-2">공인 여성기업 인증</h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  중소벤처기업부 인증 여성기업으로 섬세한 정리수납과 관공서·학교 계약 증빙을
                  지원합니다.
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
              className="text-left p-6 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border transition-colors flex flex-col justify-between cursor-pointer"
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
                  배차합니다.
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

      {/* 5. 6-STEP STANDARD MOVING PROCESS */}
      <section className="w-full py-16 bg-surface border-t border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-primary mb-1">예스이사 표준 시공 절차</div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                상담부터 정리·살균까지 6단계 진행 과정
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('auspicious-calendar')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-badge-certified-blue hover:underline cursor-pointer"
            >
              <CalendarDays className="w-4 h-4" />
              <span>손없는날 예약 달력 확인</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS_STEPS.map((st) => (
              <div
                key={st.step}
                className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-primary tabular-nums">{st.step}</span>
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                      <ServiceIcon name={st.iconName} className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-text-muted leading-relaxed">
                    {st.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-border text-xs font-bold text-badge-certified-blue">
                  · {st.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. REVIEWS, FIELD CASES & SEO COLUMNS PREVIEW */}
      <section className="w-full py-16 bg-surface-container-low border-t border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold text-badge-certified-blue mb-1">
                현장 사례 및 실제 이사 후기
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                생생한 작업 현장 & 고객 추천 후기
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('work-gallery')}
                className="inline-flex items-center gap-1 text-sm text-primary font-bold hover:underline cursor-pointer"
              >
                <span>현장 갤러리</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('board', { boardTab: '고객후기' })}
                className="inline-flex items-center gap-1 text-sm text-badge-certified-blue font-bold hover:underline cursor-pointer"
              >
                <span>고객후기 게시판</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
                    alt="예스이사 공식 로고"
                    className="h-10 w-auto rounded-lg object-contain bg-white px-1.5 py-0.5 border border-brand-border/70"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

          {/* Latest Regional SEO Guide Columns Preview */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm font-black text-on-surface">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>포항이사 · 영덕이사 · 울진이사 선택 전 체크 칼럼</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('board', { boardTab: '칼럼' })}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                이사 칼럼 10선 전체보기 →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredColumns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onNavigate('board', { boardTab: '칼럼' })}
                  className="text-left p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-badge-certified-blue mb-1">
                    {col.category} · {col.date}
                  </div>
                  <div className="text-sm font-bold text-on-surface line-clamp-2 mb-1.5">
                    {col.title}
                  </div>
                  <div className="text-xs text-slate-text-muted line-clamp-2">{col.summary}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ 10 ITEMS ACCORDION */}
      <section className="w-full py-16 bg-surface border-t border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>자주 묻는 질문 (FAQ 10선)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                이사 상담·비용·지역 궁금증 한눈에 해결
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['전체', '상담/견적', '이사 비용', '서비스/지역', '예약/준비'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFaqFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      faqFilter === cat
                        ? 'bg-inverse-surface text-white'
                        : 'bg-surface-container-lowest border border-brand-border text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {visibleFaqs.map((faq, idx) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-surface-container-lowest border border-brand-border overflow-hidden self-start"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-black text-primary tabular-nums shrink-0 mt-0.5">
                        Q{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold text-on-surface leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-text-muted shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-brand-border/60 bg-surface-container-low/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CONSULTATION / RESERVATION CONVERSION SECTION */}
      <section className="w-full py-16 bg-surface-container-low border-t border-brand-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Regional Direct Channels & Map Links */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-badge-certified-blue">
                  <MapPin className="w-4 h-4" />
                  <span>동해안 4대 권역 당일 방문 실측 지원</span>
                </div>
                <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                  포항·경주·영덕·울진 어디든 직영차량이 즉시 달려갑니다
                </h2>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  포항시 북구 흥해읍 본사({COMPANY_INFO.address})를 거점으로 경주지사, 영덕·울진
                  출장소를 직접 운영하여 알선 마진 없는 정직한 비용을 제공합니다.
                </p>
                <div className="text-xs font-bold text-on-surface pt-1">
                  포항 남구/북구 전역 · 경주시 전역 · 영덕군 전역 · 울진군 전역 (방문실측 0원)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  onClick={onTrackPhone}
                  className="py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4" />
                  <span>전화상담 {COMPANY_INFO.phoneMain}</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenKakao}
                  className="py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-on-surface text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>카카오톡 문의</span>
                </button>
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(hq.naverMapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-safety-green text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <span>네이버플레이스 보기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    hq.googleMapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>구글지도 보기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Quick Lead Capture Form */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border">
              <div className="mb-5">
                <div className="text-xs font-bold text-primary mb-1">
                  간편 상담 신청 · 5분 내 해피콜
                </div>
                <h3 className="text-xl font-black text-on-surface">
                  상담 문의하기 (방문견적 예약)
                </h3>
                <p className="text-xs text-slate-text-muted mt-1">
                  연락처만 남겨주시면 희망 일자 배차 가능 여부와 예상 비용을 바로 안내해 드립니다.
                </p>
              </div>

              {leadSubmittedId ? (
                <div className="p-6 rounded-xl bg-badge-certified-bg text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-badge-certified-blue mx-auto" />
                  <div className="text-base font-black text-on-surface">
                    상담 신청이 접수되었습니다 ({leadSubmittedId})
                  </div>
                  <p className="text-xs text-slate-text-muted leading-relaxed">
                    <strong>{leadName}</strong> 님 ({leadPhone}) · {leadRegion} {leadType} 문의를
                    배차실로 전달했습니다. 곧 연락드리겠습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadSubmittedId(null);
                      setLeadName('');
                      setLeadPhone('');
                      setLeadMemo('');
                    }}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                  >
                    추가 문의하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  {leadError && (
                    <div className="p-3 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {leadError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="성함 *"
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                    />
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="연락처 (010-0000-0000) *"
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm tabular-nums"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={leadRegion}
                      onChange={(e) => setLeadRegion(e.target.value as RegionName)}
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                    >
                      <option value="포항시 북구">포항시 북구</option>
                      <option value="포항시 남구">포항시 남구</option>
                      <option value="경주시">경주시</option>
                      <option value="영덕군">영덕군</option>
                      <option value="울진군">울진군</option>
                      <option value="타지역">기타 지역</option>
                    </select>
                    <select
                      value={leadType}
                      onChange={(e) => setLeadType(e.target.value as MovingType)}
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                    >
                      <option value="가정포장이사">가정 포장이사</option>
                      <option value="기업관공서이사">관공서 / 학교 / 기업</option>
                      <option value="일반이사">실속 일반이사</option>
                      <option value="원룸소형이사">원룸 / 용달 소형</option>
                      <option value="보관이사">항온항습 보관이사</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={leadMemo}
                    onChange={(e) => setLeadMemo(e.target.value)}
                    placeholder="희망 날짜, 평형대 등 메모 (선택)"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  />
                  <label className="flex items-start gap-2 text-xs text-slate-text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadConsent}
                      onChange={(e) => setLeadConsent(e.target.checked)}
                      className="accent-primary w-4 h-4 mt-0.5"
                    />
                    <span>
                      <strong className="text-on-surface">[필수]</strong> 무료 방문견적 및 유선
                      상담 안내를 위한 개인정보 수집·이용에 동의합니다.
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-inverse-surface hover:bg-on-background text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>무료 상담 문의하기</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
