import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Home,
  MapPin,
  Package,
  Phone,
  Shield,
  Sparkles,
  Truck,
  Warehouse,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import {
  HomeSize,
  MovingType,
  PageId,
  QuotePrefill,
  QuoteSubmission,
  RegionName,
  TransportMethod,
} from '../types';
import { getLunarDateInfo } from '../utils/lunarCalendar';

interface InstantQuotePageProps {
  onNavigate: (page: PageId) => void;
  prefill?: QuotePrefill;
}

const QUOTES_STORAGE_KEY = 'yesmoving_quote_submissions_v1';

const MOVING_TYPE_CARDS: {
  value: MovingType;
  title: string;
  desc: string;
  icon: React.ReactNode;
  wide?: boolean;
}[] = [
  {
    value: '가정포장이사',
    title: '가정이사 (포장)',
    desc: '포장부터 청소·정리정돈 원스톱',
    icon: <Home className="w-6 h-6" />,
  },
  {
    value: '일반이사',
    title: '일반이사',
    desc: '고객 직접 포장 후 대형가구 운송',
    icon: <Package className="w-6 h-6" />,
  },
  {
    value: '원룸소형이사',
    title: '원룸 / 소형이사',
    desc: '1톤 트럭 특화 오피스텔 맞춤',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    value: '기업관공서이사',
    title: '사무실 / 관공서',
    desc: '서류·OA기기 특화 시스템 이전',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    value: '보관이사',
    title: '보관이사 (전용 컨테이너)',
    desc: '인테리어 공사, 입주 시기 불일치 시 항온·항습 전용창고 보관',
    icon: <Warehouse className="w-6 h-6" />,
    wide: true,
  },
];

const SPECIAL_OPTIONS = [
  '에어컨 탈부착',
  '벽걸이 TV / 사운드바',
  '업라이트 / 그랜드 피아노',
  '돌침대 / 흙침대 / 금고',
];

function getDefaultMovingDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export const InstantQuotePage: React.FC<InstantQuotePageProps> = ({
  onNavigate,
  prefill,
}) => {
  const [movingType, setMovingType] = useState<MovingType>(
    prefill?.movingType || '가정포장이사'
  );
  const [startRegion, setStartRegion] = useState<RegionName>(
    prefill?.startRegion || '포항시 북구'
  );
  const [startDetail, setStartDetail] = useState('');
  const [startHousing, setStartHousing] = useState('아파트');
  const [startFloor, setStartFloor] = useState('');
  const [startTransport, setStartTransport] = useState<TransportMethod>('엘리베이터');

  const [endRegion, setEndRegion] = useState<RegionName>(
    prefill?.endRegion || '포항시 남구'
  );
  const [endDetail, setEndDetail] = useState('');
  const [endHousing, setEndHousing] = useState('아파트');
  const [endFloor, setEndFloor] = useState('');
  const [endTransport, setEndTransport] = useState<TransportMethod>('엘리베이터');

  const [homeSize, setHomeSize] = useState<HomeSize>(prefill?.homeSize || '20~30평대');
  const [movingDate, setMovingDate] = useState<string>(
    prefill?.movingDate || getDefaultMovingDate()
  );
  const [movingTime, setMovingTime] = useState<string>('오전 (07:30 ~ 08:30)');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialItems, setSpecialItems] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteSubmission | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<QuoteSubmission[]>([]);

  useEffect(() => {
    if (prefill?.movingType) setMovingType(prefill.movingType);
    if (prefill?.movingDate) setMovingDate(prefill.movingDate);
    if (prefill?.startRegion) setStartRegion(prefill.startRegion);
    if (prefill?.endRegion) setEndRegion(prefill.endRegion);
    if (prefill?.homeSize) setHomeSize(prefill.homeSize);
  }, [prefill]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (raw) {
        setSavedQuotes(JSON.parse(raw) as QuoteSubmission[]);
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  // Lunar & Auspicious Day Status for selected movingDate
  const dateLunarInfo = useMemo(() => {
    const parts = movingDate.split('-').map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      return getLunarDateInfo(parts[0], parts[1], parts[2]);
    }
    return null;
  }, [movingDate]);

  // Dynamic Real-time Estimate Calculator
  const estimate = useMemo(() => {
    let baseMin = 60;
    let baseMax = 75;
    let truck = '5톤 전용 탑차 1대';
    let crew = '정직원 베테랑 3~4명';

    if (movingType === '원룸소형이사') {
      baseMin = 15;
      baseMax = 30;
      truck = '1톤 리프트 탑차 1대';
      crew = '기사님 1명 (+고객 동반 또는 반포장)';
    } else if (movingType === '일반이사') {
      baseMin = 40;
      baseMax = 55;
      truck = '5톤 탑차 1대';
      crew = '전문 운송기사 2~3명';
    } else if (movingType === '기업관공서이사') {
      baseMin = 110;
      baseMax = 160;
      truck = '5톤 탑차 2대 이상 (실측 확정)';
      crew = '기업전담 PM + 전문인력 6명+';
    } else if (movingType === '보관이사') {
      baseMin = 90;
      baseMax = 120;
      truck = '5톤 탑차 + 전용 컨테이너 보관';
      crew = '입출고 포장팀 4명';
    }

    // Adjust by Home Size (if not one-room)
    if (movingType !== '원룸소형이사') {
      if (homeSize === '10평 이하') {
        baseMin = Math.max(25, baseMin - 20);
        baseMax = Math.max(38, baseMax - 20);
        truck = '1톤 ~ 2.5톤 탑차';
        crew = '전문인력 2명';
      } else if (homeSize === '10~20평대') {
        baseMin = Math.max(40, baseMin - 10);
        baseMax = Math.max(55, baseMax - 10);
        truck = '2.5톤 ~ 5톤 탑차';
        crew = '전문인력 3명';
      } else if (homeSize === '30~40평대') {
        baseMin += 25;
        baseMax += 35;
        truck = '5톤 탑차 + 1톤 보조';
        crew = '정직원 4명 (주방정리 포함)';
      } else if (homeSize === '40평대 이상') {
        baseMin += 55;
        baseMax += 75;
        truck = '5톤 탑차 2대';
        crew = '정직원 5~6명 (주방정리 2명)';
      }
    }

    // Distance factor
    if (startRegion !== endRegion) {
      if (startRegion === '타지역' || endRegion === '타지역') {
        baseMin += 30;
        baseMax += 45;
      } else if (
        startRegion === '울진군' ||
        endRegion === '울진군' ||
        startRegion === '영덕군' ||
        endRegion === '영덕군'
      ) {
        baseMin += 12;
        baseMax += 18;
      } else {
        baseMin += 5;
        baseMax += 10;
      }
    }

    // Ladder truck factor
    let ladderCount = 0;
    if (startTransport === '사다리차') ladderCount++;
    if (endTransport === '사다리차') ladderCount++;
    if (ladderCount > 0) {
      baseMin += ladderCount * 10;
      baseMax += ladderCount * 13;
    }

    // Special items factor
    if (specialItems.length > 0) {
      baseMin += specialItems.length * 5;
      baseMax += specialItems.length * 8;
    }

    // Auspicious day surcharge note
    if (dateLunarInfo?.isAuspicious) {
      baseMin += 5;
      baseMax += 10;
    }

    return {
      rangeText: `${baseMin.toLocaleString()}만원 ~ ${baseMax.toLocaleString()}만원`,
      truck,
      crew,
      ladderCount,
    };
  }, [
    movingType,
    homeSize,
    startRegion,
    endRegion,
    startTransport,
    endTransport,
    specialItems,
    dateLunarInfo,
  ]);

  const toggleSpecialItem = (item: string) => {
    setSpecialItems((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('고객 성함과 휴대전화번호를 반드시 입력해 주세요.');
      return;
    }
    if (!privacyConsent) {
      setFormError('견적 상담을 위해 개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    setFormError(null);

    const submission: QuoteSubmission = {
      id: `Q-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('ko-KR'),
      movingType,
      startRegion,
      startDetail: startDetail.trim() || '상세주소 상담 시 안내',
      startHousing,
      startFloor: startFloor.trim() || '층수 미기재',
      startTransport,
      endRegion,
      endDetail: endDetail.trim() || '상세주소 상담 시 안내',
      endHousing,
      endFloor: endFloor.trim() || '층수 미기재',
      endTransport,
      homeSize,
      movingDate,
      movingTime,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      specialItems,
      memo: memo.trim(),
      estimatedRange: estimate.rangeText,
      recommendedTruck: estimate.truck,
    };

    try {
      const nextList = [submission, ...savedQuotes].slice(0, 5);
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(nextList));
      setSavedQuotes(nextList);
    } catch {
      // Ignore storage error
    }

    setSubmittedQuote(submission);
  };

  return (
    <div className="w-full bg-surface-container-low py-10 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-brand-border mb-8">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-badge-certified-blue">
              <BadgeCheck className="w-4 h-4" />
              <span>국토교통부 공식 관허 {COMPANY_INFO.freightLicense}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl text-on-surface tracking-tight font-black">
              1분 완성 실시간 무료 견적 신청
            </h1>
            <p className="text-sm sm:text-base text-slate-text-muted leading-relaxed">
              포항 · 경주 · 영덕 · 울진 전지역 직영 서비스.{' '}
              <strong className="text-primary">방문 견적 추가 비용 0원</strong>과 5억원
              적재물배상책임보험으로 안심 이사를 약속드립니다.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-brand-border shrink-0">
            <Phone className="w-7 h-7 text-primary shrink-0" />
            <div>
              <div className="text-xs text-slate-text-muted">365일 신속 유선 접수</div>
              <a
                className="text-2xl text-primary font-black tabular-nums hover:text-primary-container transition-colors"
                href={`tel:${COMPANY_INFO.phoneMain}`}
              >
                {COMPANY_INFO.phoneMain}
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {formError && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-bold">
                  {formError}
                </div>
              )}

              {/* Step 1: Moving Type */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 border border-brand-border">
                <div className="flex items-center justify-between pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold tabular-nums">
                      1
                    </span>
                    <h2 className="text-lg text-on-surface font-bold">이사 종류 선택</h2>
                  </div>
                  <span className="text-xs text-slate-text-muted">필수 항목</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MOVING_TYPE_CARDS.map((card) => {
                    const active = movingType === card.value;
                    return (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => setMovingType(card.value)}
                        className={`text-left flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${
                          card.wide ? 'lg:col-span-2' : ''
                        } ${
                          active
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-surface-container-low border-brand-border hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={active ? 'text-primary' : 'text-secondary'}>
                            {card.icon}
                          </span>
                          <CheckCircle2
                            className={`w-5 h-5 ${
                              active ? 'text-primary' : 'text-surface-container-highest'
                            }`}
                          />
                        </div>
                        <span className="text-sm font-bold text-on-surface">{card.title}</span>
                        <span className="text-xs text-slate-text-muted mt-1">{card.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Step 2: Origin & Destination & Home Size */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 border border-brand-border">
                <div className="flex items-center justify-between pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold tabular-nums">
                      2
                    </span>
                    <h2 className="text-lg text-on-surface font-bold">
                      출발지 · 도착지 및 평형 정보
                    </h2>
                  </div>
                  <span className="text-xs text-slate-text-muted">정확한 차량 배차용</span>
                </div>

                {/* Home Size Selection */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-on-surface mb-2">
                    현재 거주 평형대 (짐량 기준)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(
                      [
                        '10평 이하',
                        '10~20평대',
                        '20~30평대',
                        '30~40평대',
                        '40평대 이상',
                      ] as HomeSize[]
                    ).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setHomeSize(size)}
                        className={`py-2.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          homeSize === size
                            ? 'bg-inverse-surface text-white border-inverse-surface'
                            : 'bg-surface-container-low text-on-surface border-brand-border hover:bg-surface-container'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Origin */}
                  <div className="flex flex-col gap-3.5 p-5 rounded-xl bg-surface-container-low border border-brand-border">
                    <div className="flex items-center gap-2 text-primary text-sm font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>출발지 (현재 거주지)</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-on-surface">지역 선택</label>
                      <select
                        value={startRegion}
                        onChange={(e) => setStartRegion(e.target.value as RegionName)}
                        className="w-full bg-white px-3.5 py-2.5 rounded-lg text-sm border border-brand-border"
                      >
                        <option value="포항시 북구">경상북도 포항시 북구</option>
                        <option value="포항시 남구">경상북도 포항시 남구</option>
                        <option value="경주시">경상북도 경주시</option>
                        <option value="영덕군">경상북도 영덕군</option>
                        <option value="울진군">경상북도 울진군</option>
                        <option value="타지역">기타 전국 지역</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-on-surface">
                        상세 주소 (읍·면·동 / 단지명)
                      </label>
                      <input
                        type="text"
                        value={startDetail}
                        onChange={(e) => setStartDetail(e.target.value)}
                        placeholder="예: 흥해읍 달전리 삼도드림뷰"
                        className="w-full bg-white px-3.5 py-2.5 rounded-lg text-sm border border-brand-border"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-on-surface">주거 형태</label>
                        <select
                          value={startHousing}
                          onChange={(e) => setStartHousing(e.target.value)}
                          className="w-full bg-white px-3 py-2.5 rounded-lg text-sm border border-brand-border"
                        >
                          <option>아파트</option>
                          <option>빌라/연립</option>
                          <option>오피스텔</option>
                          <option>단독주택</option>
                          <option>상가/사무실</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-on-surface">해당 층수</label>
                        <input
                          type="text"
                          value={startFloor}
                          onChange={(e) => setStartFloor(e.target.value)}
                          placeholder="예: 7층"
                          className="w-full bg-white px-3 py-2.5 rounded-lg text-sm border border-brand-border"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-on-surface">운반 방식</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['엘리베이터', '사다리차', '계단수작업'] as TransportMethod[]).map(
                          (m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setStartTransport(m)}
                              className={`py-2 px-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                                startTransport === m
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-white text-on-surface border-brand-border'
                              }`}
                            >
                              {m === '엘리베이터' ? 'E/V 가능' : m === '계단수작업' ? '계단운반' : m}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex flex-col gap-3.5 p-5 rounded-xl bg-surface-container-low border border-brand-border">
                    <div className="flex items-center gap-2 text-badge-certified-blue text-sm font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>도착지 (이사 갈 곳)</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-on-surface">지역 선택</label>
                      <select
                        value={endRegion}
                        onChange={(e) => setEndRegion(e.target.value as RegionName)}
                        className="w-full bg-white px-3.5 py-2.5 rounded-lg text-sm border border-brand-border"
                      >
                        <option value="포항시 북구">경상북도 포항시 북구</option>
                        <option value="포항시 남구">경상북도 포항시 남구</option>
                        <option value="경주시">경상북도 경주시</option>
                        <option value="영덕군">경상북도 영덕군</option>
                        <option value="울진군">경상북도 울진군</option>
                        <option value="타지역">기타 전국 지역</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-on-surface">
                        상세 주소 (미확정 시 동까지만)
                      </label>
                      <input
                        type="text"
                        value={endDetail}
                        onChange={(e) => setEndDetail(e.target.value)}
                        placeholder="예: 지곡동 효자그린 1단지"
                        className="w-full bg-white px-3.5 py-2.5 rounded-lg text-sm border border-brand-border"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-on-surface">주거 형태</label>
                        <select
                          value={endHousing}
                          onChange={(e) => setEndHousing(e.target.value)}
                          className="w-full bg-white px-3 py-2.5 rounded-lg text-sm border border-brand-border"
                        >
                          <option>아파트</option>
                          <option>빌라/연립</option>
                          <option>오피스텔</option>
                          <option>단독주택</option>
                          <option>상가/사무실</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-on-surface">해당 층수</label>
                        <input
                          type="text"
                          value={endFloor}
                          onChange={(e) => setEndFloor(e.target.value)}
                          placeholder="예: 12층"
                          className="w-full bg-white px-3 py-2.5 rounded-lg text-sm border border-brand-border"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-on-surface">운반 방식</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['엘리베이터', '사다리차', '계단수작업'] as TransportMethod[]).map(
                          (m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setEndTransport(m)}
                              className={`py-2 px-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                                endTransport === m
                                  ? 'bg-badge-certified-blue text-white border-badge-certified-blue'
                                  : 'bg-white text-on-surface border-brand-border'
                              }`}
                            >
                              {m === '엘리베이터' ? 'E/V 가능' : m === '계단수작업' ? '계단운반' : m}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 3: Date & Time */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 border border-brand-border">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold tabular-nums">
                      3
                    </span>
                    <h2 className="text-lg text-on-surface font-bold">이사 희망 날짜 및 시간</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('auspicious-calendar')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-badge-certified-blue hover:underline cursor-pointer"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>손없는날 달력에서 고르기</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-on-surface">이사 예정일 선택</label>
                      {dateLunarInfo && (
                        <span
                          className={`font-bold tabular-nums ${
                            dateLunarInfo.isAuspicious
                              ? 'text-primary'
                              : 'text-badge-certified-blue'
                          }`}
                        >
                          음력 {dateLunarInfo.lunarMonth}.{dateLunarInfo.lunarDay} ·{' '}
                          {dateLunarInfo.isAuspicious ? '★ 손없는날' : '예약 가능일'}
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      value={movingDate}
                      onChange={(e) => setMovingDate(e.target.value)}
                      className="w-full bg-surface-container-low px-4 py-3 rounded-lg border border-brand-border text-sm font-semibold text-on-surface tabular-nums"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">
                      선호 작업 시작 시간대
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: '오전 추천', sub: '07:30~08:30', value: '오전 (07:30 ~ 08:30)' },
                        { label: '오후 시작', sub: '13:00 이후', value: '오후 (13:00 이후)' },
                        { label: '시간 조율', sub: '상담 시 협의', value: '시간 협의 가능' },
                      ].map((t) => {
                        const active = movingTime === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setMovingTime(t.value)}
                            className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                              active
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface-container-low text-on-surface border-brand-border'
                            }`}
                          >
                            <div className="text-xs font-bold">{t.label}</div>
                            <div
                              className={`text-[10px] mt-0.5 tabular-nums ${
                                active ? 'text-white/80' : 'text-slate-text-muted'
                              }`}
                            >
                              {t.sub}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 4: Contact & Special Items */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 border border-brand-border flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold tabular-nums">
                      4
                    </span>
                    <h2 className="text-lg text-on-surface font-bold">
                      고객 연락처 및 상담 요청사항
                    </h2>
                  </div>
                  <span className="text-xs text-slate-text-muted">신속 배정</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">
                      고객 성함 <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="예: 홍길동"
                      className="w-full bg-surface-container-low px-4 py-3 rounded-lg border border-brand-border text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">
                      휴대전화번호 <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      className="w-full bg-surface-container-low px-4 py-3 rounded-lg border border-brand-border text-sm tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface">
                    특수 화물 및 부가 서비스 체크 (선택)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SPECIAL_OPTIONS.map((opt) => {
                      const checked = specialItems.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleSpecialItem(opt)}
                          className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors text-left ${
                            checked
                              ? 'bg-primary/10 border-primary text-primary font-bold'
                              : 'bg-surface-container-low border-brand-border text-on-surface'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              checked ? 'text-primary' : 'text-slate-text-muted/50'
                            }`}
                          />
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    기타 요청사항 및 가전/가구 메모
                  </label>
                  <textarea
                    rows={3}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 양문형 냉장고 스팀살균 희망, 드럼세탁기 건조기 직렬설치 여부 등 특이사항을 적어주세요."
                    className="w-full bg-surface-container-low p-4 rounded-lg border border-brand-border text-sm resize-none"
                  />
                </div>

                <label className="p-4 rounded-xl bg-surface-container-low border border-brand-border flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-0.5"
                  />
                  <div className="text-xs text-slate-text-muted leading-relaxed">
                    <span className="font-bold text-on-surface block mb-0.5">
                      [필수] 무료 방문 및 실시간 유선 견적 상담을 위한 개인정보 수집·이용에
                      동의합니다.
                    </span>
                    수집항목: 성명, 연락처, 주소 | 이용목적: 이사 견적 산출 및 방문일정 확정 |
                    보유기간: 상담 완료 후 1년 이내 폐기
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full py-4.5 rounded-xl bg-primary hover:bg-primary-container text-white text-base sm:text-lg font-black shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-5 h-5" />
                  <span>무료 견적 신청 완료하기 (비용 0원 보증)</span>
                </button>
              </section>
            </form>

            {/* Recent Submitted Quotes in Session */}
            {savedQuotes.length > 0 && (
              <section className="bg-surface-container-lowest rounded-2xl p-6 border border-brand-border">
                <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-badge-certified-blue" />
                  <span>최근 접수된 무료 견적 내역 ({savedQuotes.length}건)</span>
                </h3>
                <div className="space-y-2.5">
                  {savedQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-on-surface">
                          {q.movingType} ({q.homeSize})
                        </span>
                        <span className="text-slate-text-muted mx-1.5">·</span>
                        <span className="text-on-surface-variant">
                          {q.startRegion} → {q.endRegion}
                        </span>
                        <span className="text-slate-text-muted mx-1.5">·</span>
                        <span className="tabular-nums text-badge-certified-blue font-semibold">
                          {q.movingDate}
                        </span>
                      </div>
                      <div className="font-bold text-primary tabular-nums">{q.estimatedRange}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sticky Estimator & Promises Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Dynamic Live Estimator Box */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-primary/25 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>실시간 예상 견적 가이드</span>
                </span>
                <span className="text-[11px] text-slate-text-muted">선택 조건 자동 반영</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low">
                <div className="text-xs text-slate-text-muted mb-1">
                  예상 표준 견적 범위 ({movingType})
                </div>
                <div className="text-2xl font-black text-primary tabular-nums">
                  {estimate.rangeText}
                </div>
                <div className="text-[11px] text-slate-text-muted mt-1">
                  * 짐량 및 작업 동선에 따라 무료 방문 실측 후 최종 확정
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-brand-border">
                  <span className="text-slate-text-muted">추천 배차 차량</span>
                  <span className="font-bold text-on-surface">{estimate.truck}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-brand-border">
                  <span className="text-slate-text-muted">추천 투입 인력</span>
                  <span className="font-bold text-on-surface">{estimate.crew}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-brand-border">
                  <span className="text-slate-text-muted">이동 권역</span>
                  <span className="font-bold text-on-surface">
                    {startRegion} → {endRegion}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-text-muted">사다리차 지원</span>
                  <span className="font-bold text-badge-certified-blue tabular-nums">
                    {estimate.ladderCount > 0 ? `${estimate.ladderCount}곳 적용` : '엘리베이터/협의'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Call Box */}
            <div className="bg-primary text-white rounded-2xl p-6 flex flex-col gap-4">
              <div className="text-xs font-bold text-white/85">실시간 긴급 유선상담</div>
              <div>
                <div className="text-xs text-white/80">입력이 번거로우신가요?</div>
                <div className="text-3xl font-black tracking-tight tabular-nums mt-0.5">
                  {COMPANY_INFO.phoneMain}
                </div>
              </div>
              <p className="text-xs text-white/85 leading-relaxed">
                전화 주시면 전문 배차 플래너가 평수, 짐의 양, 층수를 확인 후 1분 만에 정확한 표준
                금액을 안내해 드립니다.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  className="w-full py-3 rounded-xl bg-white text-primary hover:bg-surface-container-low text-sm font-black text-center transition-colors"
                >
                  대표전화 바로 연결
                </a>
                <a
                  href={`tel:${COMPANY_INFO.phoneDirect}`}
                  className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold text-center transition-colors tabular-nums"
                >
                  야간 / 휴일 직통: {COMPANY_INFO.phoneDirect}
                </a>
              </div>
            </div>

            {/* 5 Promises Compact List */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-brand-border flex flex-col gap-4">
              <h3 className="text-sm text-on-surface font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>예스이사 공식 5대 안심 서약</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-text-muted">
                <li className="flex items-start gap-2">
                  <BadgeCheck className="w-4 h-4 text-badge-certified-blue shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-on-surface">정식 화물주선 인허가:</strong> 경북도
                    정식 인허가 직영 사업자
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-badge-certified-blue shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-on-surface">5억원 적재물배상보험:</strong> 운송 중
                    파손·분실 전액 보상
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-badge-certified-blue shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-on-surface">추가 부당 요금 0원:</strong> 식대·수고비
                    요구 일체 금지
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Confirmation Modal */}
      {submittedQuote && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSubmittedQuote(null)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-brand-border flex flex-col items-center text-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-badge-certified-bg text-badge-certified-blue flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-on-surface">무료 견적 접수 완료!</h3>
            <p className="text-sm text-slate-text-muted leading-relaxed">
              예스이사 포항 본사 배차실로 정상 전달되었습니다.
              <br />
              전문 상담 플래너가 기재해주신 연락처로{' '}
              <strong className="text-on-surface">5분 이내 전화 안내</strong>를 드립니다.
            </p>
            <div className="w-full p-4 rounded-xl bg-surface-container-low border border-brand-border flex flex-col gap-1.5 text-xs text-left">
              <div>
                <strong>접수 번호:</strong>{' '}
                <span className="tabular-nums">{submittedQuote.id}</span>
              </div>
              <div>
                <strong>신청 고객:</strong> {submittedQuote.customerName} 님 (
                <span className="tabular-nums">{submittedQuote.customerPhone}</span>)
              </div>
              <div>
                <strong>이사 종류:</strong> {submittedQuote.movingType} ({submittedQuote.homeSize})
              </div>
              <div>
                <strong>출발 / 도착:</strong> {submittedQuote.startRegion} →{' '}
                {submittedQuote.endRegion}
              </div>
              <div>
                <strong>희망 일시:</strong>{' '}
                <span className="tabular-nums">{submittedQuote.movingDate}</span> ·{' '}
                {submittedQuote.movingTime}
              </div>
              <div>
                <strong>예상 견적 가이드:</strong>{' '}
                <span className="text-primary font-bold tabular-nums">
                  {submittedQuote.estimatedRange}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmittedQuote(null)}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-white text-sm font-bold transition-colors cursor-pointer"
            >
              확인 (닫기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
