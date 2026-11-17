import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  Smartphone,
  Train,
  Warehouse,
} from 'lucide-react';
import { BRANCH_LOCATIONS, COMPANY_INFO, CORE_FAQS, LOCAL_IMAGES } from '../data/yesMovingData';
import { BoardCategory, BranchInfo, PageId, QuoteSubmission, RegionName } from '../types';
import { SafeImage } from '../components/SafeImage';

interface LocationContactPageProps {
  onNavigate: (page: PageId, options?: { boardTab?: BoardCategory }) => void;
  onOpenKakao?: () => void;
  onTrackPhone?: () => void;
  onSubmitCallback?: (submission: QuoteSubmission) => void;
}

const QUOTES_STORAGE_KEY = 'yesmoving_quote_submissions_v1';

export const LocationContactPage: React.FC<LocationContactPageProps> = ({
  onNavigate,
  onOpenKakao,
  onTrackPhone,
  onSubmitCallback,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<BranchInfo['id']>('pohang');
  const [copied, setCopied] = useState(false);

  // Quick Visit / Callback Form
  const [reqName, setReqName] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqRegion, setReqRegion] = useState('포항시');
  const [reqMethod, setReqMethod] = useState<'방문실측' | '전화상담'>('방문실측');
  const [reqMessage, setReqMessage] = useState('');
  const [reqConsent, setReqConsent] = useState(true);
  const [reqSubmitted, setReqSubmitted] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);

  const selectedBranch =
    BRANCH_LOCATIONS.find((b) => b.id === selectedBranchId) || BRANCH_LOCATIONS[0];

  const handleCopyAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqPhone.trim()) {
      setReqError('성함과 연락처를 입력해 주세요.');
      return;
    }
    if (!reqConsent) {
      setReqError('상담 예약을 위해 개인정보 수집·이용에 동의해 주세요.');
      return;
    }
    setReqError(null);

    const mappedRegion: RegionName =
      reqRegion === '경주시'
        ? '경주시'
        : reqRegion === '영덕군'
        ? '영덕군'
        : reqRegion === '울진군'
        ? '울진군'
        : '포항시 북구';

    const newSubmission: QuoteSubmission = {
      id: `V-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('ko-KR'),
      status: '접수대기',
      source: '방문상담예약',
      movingType: '가정포장이사',
      startRegion: mappedRegion,
      startDetail: `${reqRegion} (${reqMethod})`,
      startHousing: '아파트',
      startFloor: '-',
      startTransport: '엘리베이터',
      endRegion: mappedRegion,
      endDetail: '방문실측 시 확인',
      endHousing: '아파트',
      endFloor: '-',
      endTransport: '엘리베이터',
      homeSize: '20~30평대',
      movingDate: '상담 시 조율',
      movingTime: '상담 시 협의',
      customerName: reqName.trim(),
      customerPhone: reqPhone.trim(),
      specialItems: [],
      memo: reqMessage.trim() || `${reqMethod} 희망`,
      estimatedRange: '무료 방문 실측 안내',
      recommendedTruck: '맞춤 배차',
    };

    if (onSubmitCallback) {
      onSubmitCallback(newSubmission);
    } else {
      try {
        const existingRaw = localStorage.getItem(QUOTES_STORAGE_KEY);
        const existing = existingRaw ? (JSON.parse(existingRaw) as QuoteSubmission[]) : [];
        localStorage.setItem(
          QUOTES_STORAGE_KEY,
          JSON.stringify([newSubmission, ...existing].slice(0, 30))
        );
      } catch {
        // Ignore storage error
      }
    }

    setReqSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner */}
      <section className="w-full bg-surface-container-low py-12 lg:py-16 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                <MapPin className="w-4 h-4" />
                <span>포항 본사 · 경주 · 영덕 · 울진 통합 직영 네트워크</span>
              </div>
              <h1 className="text-3xl sm:text-4xl text-on-surface font-black tracking-tight mb-3">
                예스이사 오시는 길 · 포항 본사 및 직영지사
              </h1>
              <p className="text-sm sm:text-base text-slate-text-muted leading-relaxed">
                포항시 북구 흥해읍 본사 및 전용 차고지·보관 창고를 거점으로 경주, 영덕, 울진
                전역에 중간 알선 없는 본사 직영 차량과 무료 방문 견적 팀장을 배차합니다.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-brand-border flex items-center gap-4 shrink-0">
              <div>
                <div className="text-xs text-slate-text-muted">포항 본사 주소</div>
                <div className="text-sm font-bold text-on-surface">{COMPANY_INFO.address}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAddress(COMPANY_INFO.address)}
                className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-safety-green" />
                    <span className="text-safety-green">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-primary" />
                    <span>주소복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Regional Network + Branch Selector */}
      <section className="w-full py-12 lg:py-16 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          {/* 4 Branch Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {BRANCH_LOCATIONS.map((branch) => {
              const isSelected = branch.id === selectedBranchId;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-brand-border text-on-surface'
                  }`}
                >
                  <div
                    className={`text-[11px] font-bold mb-1 ${
                      isSelected ? 'text-white/80' : 'text-badge-certified-blue'
                    }`}
                  >
                    {branch.badge}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold">{branch.name}</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive East-Coast Corridor Map Visual */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 border border-brand-border flex flex-col justify-between gap-5">
              <div>
                <h2 className="text-base font-black text-on-surface mb-1">
                  경북 동해안 7번 국도 직영 배차망
                </h2>
                <p className="text-xs text-slate-text-muted">
                  지도 위 거점을 클릭하시면 해당 권역 출동 정보를 바로 확인할 수 있습니다.
                </p>
              </div>

              {/* Stylized Interactive Corridor Map */}
              <div className="relative rounded-xl bg-gradient-to-b from-badge-certified-bg via-surface-container-low to-surface-container p-5 border border-brand-border min-h-[300px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-slate-text-muted">
                  <span className="font-bold text-badge-certified-blue">동해안 7번 국도 축</span>
                  <span>출장비 0원 직영권역</span>
                </div>

                <div className="relative my-4 flex flex-col gap-4">
                  {/* Vertical Route Line */}
                  <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-badge-certified-blue/30" />

                  {[
                    { id: 'uljin' as const, label: '울진 직영출장소', sub: '울진읍 · 죽변 · 후포' },
                    { id: 'yeongdeok' as const, label: '영덕 직영출장소', sub: '영덕읍 · 강구 · 영해' },
                    {
                      id: 'pohang' as const,
                      label: '포항 본사 직영센터 (HQ)',
                      sub: '흥해읍 달전로 24 · 포항IC',
                    },
                    { id: 'gyeongju' as const, label: '경주 직영지사', sub: '황성 · 용강 · 안강 · 외동' },
                  ].map((node) => {
                    const active = selectedBranchId === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedBranchId(node.id)}
                        className={`relative z-10 flex items-center gap-3.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-white border-primary shadow-sm'
                            : 'bg-white/75 border-brand-border hover:bg-white'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            active
                              ? 'bg-primary text-white'
                              : node.id === 'pohang'
                              ? 'bg-badge-certified-blue text-white'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-on-surface truncate">
                            {node.label}
                          </div>
                          <div className="text-[11px] text-slate-text-muted truncate">
                            {node.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* External Map App Links */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(
                      selectedBranch.naverMapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-lg bg-safety-green text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <span>네이버플레이스</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <a
                    href={`https://map.kakao.com/?q=${encodeURIComponent(
                      selectedBranch.kakaoMapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-lg bg-amber-400 text-on-surface text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <span>카카오맵</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedBranch.googleMapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-lg bg-badge-certified-blue text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <span>구글지도</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Selected Branch Detail Card */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <div className="text-xs font-bold text-badge-certified-blue mb-1">
                      {selectedBranch.badge}
                    </div>
                    <h2 className="text-2xl font-black text-on-surface">{selectedBranch.name}</h2>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {selectedBranch.dispatchTime}
                  </span>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed my-5">
                  {selectedBranch.description}
                </p>

                {/* Address & Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-5">
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <div className="text-slate-text-muted mb-1">관할 거점 위치</div>
                    <div className="font-bold text-on-surface text-sm">
                      {selectedBranch.address}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <div className="text-slate-text-muted mb-1">상담 및 배차 연락처</div>
                    <div className="font-bold text-primary text-sm tabular-nums">
                      {selectedBranch.phone} / {selectedBranch.directPhone}
                    </div>
                  </div>
                </div>

                {/* Coverage & Facilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <div className="text-xs font-bold text-on-surface mb-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>주요 출동 관할구역</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant">
                      {selectedBranch.coverage.map((cov) => (
                        <li key={cov} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-safety-green shrink-0 mt-0.5" />
                          <span>{cov}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <div className="text-xs font-bold text-on-surface mb-2 flex items-center gap-1.5">
                      <Warehouse className="w-4 h-4 text-badge-certified-blue" />
                      <span>보유 장비 및 특화 설비</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant">
                      {selectedBranch.facilities.map((fac) => (
                        <li key={fac} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-badge-certified-blue shrink-0 mt-0.5" />
                          <span>{fac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Directions */}
                <div className="space-y-2 text-xs text-on-surface-variant bg-surface-container-low p-4 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-on-surface">자차 방문 시: </strong>
                      {selectedBranch.directionsCar}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Train className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-on-surface">대중교통 / 출장 실측: </strong>
                      {selectedBranch.directionsTransit}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border">
                <div className="flex items-center gap-2 text-xs text-slate-text-muted">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{selectedBranch.hours}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('instant-quote')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  <span>해당 권역 무료견적 신청</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Visual + Quick Visit / Callback Form */}
      <section className="w-full py-12 lg:py-16 bg-surface-container-low border-t border-brand-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Facility Showcase */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl overflow-hidden border border-brand-border flex flex-col">
              <div className="h-64 w-full overflow-hidden">
                <SafeImage
                  src={LOCAL_IMAGES.officeStorage}
                  alt="예스이사 포항 본사 실내 항온항습 컨테이너 보관창고"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-badge-certified-blue mb-1">
                    본사 전용 차고지 & 보관 센터
                  </div>
                  <h3 className="text-xl font-black text-on-surface mb-2">
                    직영 차량 기지 및 항온항습 실내 창고 운영
                  </h3>
                  <p className="text-sm text-slate-text-muted leading-relaxed">
                    예스이사 포항 본사(달전로 24)에는 1톤·2.5톤·5톤 최신 탑차 및 직영 사다리차
                    차고지와 함께, 인테리어 공사나 입주 대기 고객을 위한 단독 밀폐 컨테이너 보관
                    창고를 직접 운영하고 있습니다. 사전 연락 후 방문하시면 보관 시설을 직접
                    확인하실 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-3 border-t border-brand-border text-xs font-bold text-on-surface tabular-nums">
                  <a
                    href={`tel:${COMPANY_INFO.phoneMain}`}
                    onClick={onTrackPhone}
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    대표전화 {COMPANY_INFO.phoneMain}
                  </a>
                  <a
                    href={`tel:${COMPANY_INFO.phoneDirect}`}
                    onClick={onTrackPhone}
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <Smartphone className="w-4 h-4 text-secondary" />
                    직통 {COMPANY_INFO.phoneDirect}
                  </a>
                  {onOpenKakao && (
                    <button
                      type="button"
                      onClick={onOpenKakao}
                      className="px-3 py-1 rounded-lg bg-amber-400 text-on-surface font-bold cursor-pointer"
                    >
                      카카오톡 문의
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Quick Callback / Visit Request Form */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border">
              <div className="mb-6">
                <div className="text-xs font-bold text-primary mb-1">빠른 상담 예약</div>
                <h3 className="text-xl font-black text-on-surface">
                  방문 실측 또는 전화 상담 바로 신청
                </h3>
                <p className="text-xs text-slate-text-muted mt-1">
                  연락처를 남겨주시면 포항 본사 전담 팀장이 5분 이내 연락드립니다.
                </p>
              </div>

              {reqSubmitted ? (
                <div className="p-6 rounded-xl bg-badge-certified-bg text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-badge-certified-blue" />
                  <h4 className="text-base font-black text-on-surface">
                    상담 예약이 접수되었습니다!
                  </h4>
                  <p className="text-xs text-slate-text-muted leading-relaxed">
                    <strong>{reqName}</strong> 님 ({reqPhone}) · {reqRegion} {reqMethod} 요청이
                    배차실에 전달되었습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setReqSubmitted(false);
                      setReqName('');
                      setReqPhone('');
                      setReqMessage('');
                    }}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer mt-1"
                  >
                    추가 문의하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  {reqError && (
                    <div className="p-3 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {reqError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface">성함 *</label>
                      <input
                        type="text"
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        placeholder="예: 홍길동"
                        className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface">연락처 *</label>
                      <input
                        type="tel"
                        value={reqPhone}
                        onChange={(e) => setReqPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface">상담 희망 지역</label>
                      <select
                        value={reqRegion}
                        onChange={(e) => setReqRegion(e.target.value as RegionName)}
                        className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                      >
                        <option value="포항시 북구">포항시 북구</option>
                        <option value="포항시 남구">포항시 남구</option>
                        <option value="경주시">경주시 전지역</option>
                        <option value="영덕군">영덕군 전지역</option>
                        <option value="울진군">울진군 전지역</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface">상담 방식</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['방문실측', '전화상담'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setReqMethod(m)}
                            className={`py-2.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                              reqMethod === m
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface-container-low text-on-surface border-brand-border'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">문의 메모 (선택)</label>
                    <textarea
                      rows={3}
                      value={reqMessage}
                      onChange={(e) => setReqMessage(e.target.value)}
                      placeholder="방문 희망 시간이나 이사 예정일, 궁금한 점을 남겨주세요."
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-2 text-xs text-slate-text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reqConsent}
                      onChange={(e) => setReqConsent(e.target.checked)}
                      className="accent-primary w-4 h-4 mt-0.5"
                    />
                    <span>
                      <strong className="text-on-surface">[필수]</strong> 무료 방문실측 및 전화
                      상담을 위한 개인정보 수집·이용에 동의합니다.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    무료 방문실측 · 전화상담 신청하기
                  </button>
                </form>
              )}
            </div>
          </div>
          {/* Compact Regional Location FAQ */}
          <div className="mt-8 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <div className="text-xs font-bold text-badge-certified-blue mb-1">
                  출동 권역 · 상담 안내 FAQ
                </div>
                <h2 className="text-xl font-black text-on-surface">
                  포항·경주·영덕·울진 직영 출동 자주 묻는 질문
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('board', { boardTab: 'FAQ' })}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                FAQ 전체보기 →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CORE_FAQS.filter((f) => f.id === 'faq-3' || f.id === 'faq-9').map((faq) => (
                <div key={faq.id} className="p-4 rounded-xl bg-surface-container-low">
                  <h3 className="text-sm font-bold text-on-surface mb-1.5">Q. {faq.question}</h3>
                  <p className="text-xs text-slate-text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
