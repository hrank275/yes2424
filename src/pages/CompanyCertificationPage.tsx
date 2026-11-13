import React, { useState } from 'react';
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  Gavel,
  Layers,
  Lock,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Users,
  X,
  ZoomIn,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import { PageId } from '../types';
import { SafeImage } from '../components/SafeImage';

interface CompanyCertificationPageProps {
  onNavigate: (page: PageId) => void;
}

interface DocumentPreview {
  title: string;
  subtitle: string;
  imageUrl: string;
  details: string[];
}

export const CompanyCertificationPage: React.FC<CompanyCertificationPageProps> = ({
  onNavigate,
}) => {
  const [zoomedDoc, setZoomedDoc] = useState<DocumentPreview | null>(null);

  return (
    <div className="flex flex-col w-full">
      {/* Top Certification Banner */}
      <section className="w-full bg-surface-container-low py-14 lg:py-20 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col items-start gap-5 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-badge-certified-blue">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>포항·경주·영덕·울진 관허 {COMPANY_INFO.freightLicense}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-on-surface font-black tracking-tight leading-tight">
              정식 관허 · 보험가입 · 여성기업 인증,
              <br className="hidden sm:inline" /> 믿을 수 있는{' '}
              <span className="text-primary">예스이사</span>입니다.
            </h1>

            <p className="text-base sm:text-lg text-slate-text-muted leading-relaxed max-w-2xl">
              무허가 불법 이사 업체의 난립 속에서 고객님의 소중한 보금자리와 재산을 투명한 계약,
              철저한 법적 보증, 숙련된 정직원 팀워크로 완벽히 지켜드립니다.
            </p>

            {/* 3 Core Certification Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-brand-border">
                <div className="w-11 h-11 rounded-lg bg-badge-certified-bg text-badge-certified-blue flex items-center justify-center shrink-0">
                  <Gavel className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-text-muted">경상북도 포항시 정식허가</div>
                  <div className="text-base text-on-surface font-bold">화물주선사업 정식인증</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-brand-border">
                <div className="w-11 h-11 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-text-muted">파손·분실 완벽 대비</div>
                  <div className="text-base text-on-surface font-bold tabular-nums">
                    5억원 적재물배상책임
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-brand-border">
                <div className="w-11 h-11 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-text-muted">중소벤처기업부 공식확인</div>
                  <div className="text-base text-on-surface font-bold">여성기업 공식 확인등록</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Greetings & Philosophy */}
      <section className="w-full py-16 lg:py-20 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Philosophy Card + Key Stats */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="rounded-2xl bg-surface-container p-7 sm:p-8 border border-brand-border">
                <div className="flex items-center gap-4 mb-6">
                  <SafeImage
                    src={COMPANY_INFO.emblemUrl}
                    fallbackSrc={COMPANY_INFO.logoUrl}
                    alt="예스이사 공식 엠블럼"
                    className="w-14 h-14 rounded-xl object-contain bg-surface-container-lowest p-2 border border-brand-border"
                  />
                  <div>
                    <div className="text-xs text-primary font-bold">Yes Moving Company</div>
                    <div className="text-xl font-black text-on-surface">예스이사 경영철학</div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-sm text-slate-text-muted leading-relaxed">
                  <p className="text-on-surface font-bold text-base">
                    "이사는 단순한 짐의 이동이 아닌, 새로운 삶의 시작을 여는 가장 설레는
                    순간이어야 합니다."
                  </p>
                  <p>
                    20여 년간 포항, 경주, 영덕, 울진 지역 주민 여러분과 함께 호흡해 온 예스이사는
                    처음 맺은 신뢰를 소중히 간직하며 성장해 왔습니다.
                  </p>
                  <p>
                    외주 용역이 아닌 본사 직영 시스템, 투명한 관허 체계와 책임 보상 제도를
                    뿌리내려 고객님께 감동을 전해드립니다.
                  </p>
                </div>

                <div className="mt-6 bg-surface-container-lowest p-4 rounded-xl border border-brand-border flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-text-muted">고객만족 책임경영</div>
                    <div className="text-lg font-black text-on-surface">
                      대표이사 {COMPANY_INFO.ceo}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">공식 서약 완료</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border text-center">
                  <span className="text-2xl text-primary font-black block tabular-nums">20년+</span>
                  <span className="text-xs text-slate-text-muted">동해권 축적 경력</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border text-center">
                  <span className="text-2xl text-on-surface font-black block tabular-nums">
                    99.8%
                  </span>
                  <span className="text-xs text-slate-text-muted">무사고 안전 이행</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border text-center">
                  <span className="text-2xl text-badge-certified-blue font-black block tabular-nums">
                    5억원
                  </span>
                  <span className="text-xs text-slate-text-muted">책임보험 한도</span>
                </div>
              </div>
            </div>

            {/* Right CEO Greeting Text & 3 Practical Promises */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="text-xs text-primary font-bold">대표이사 인사말</div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black leading-snug">
                정직한 견적과 안전한 시공으로
                <br />
                가장 든든한 동반자가 되겠습니다.
              </h2>

              <div className="space-y-4 text-on-surface-variant text-sm sm:text-base leading-relaxed">
                <p>
                  안녕하십니까. 예스이사 대표{' '}
                  <strong className="text-on-surface font-bold">{COMPANY_INFO.ceo}</strong>
                  입니다.
                </p>
                <p>
                  많은 분들이 이사를 앞두고 걱정하시는 첫 번째는 '믿을 수 있는 업체인가?'이며, 두
                  번째는 '현장에서 예상치 못한 추가 비용을 요구하거나 짐이 훼손되지는 않을까?'
                  하는 불안감일 것입니다.
                </p>
                <p>
                  예스이사는 이러한 현장의 불합리함을 없애기 위해 관할 행정청의 정식
                  화물자동차운송주선사업 허가증을 보유하고 있으며, 만일의 사태에도 완벽히 고객
                  권익을 지켜드리는 적재물배상책임보험 5억 원을 항시 유지하고 있습니다.
                </p>
                <p>
                  또한, 중소벤처기업부로부터 꼼꼼함과 신뢰를 검증받은 여성기업 인증을 획득하여
                  주방 정리, 침구 살균, 마루 이중 보양에 이르기까지 가족의 이사를 돕는 섬세한
                  마음으로 현장을 지휘하고 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    <span>정직한 원칙</span>
                  </div>
                  <p className="text-xs text-slate-text-muted leading-relaxed">
                    계약서 명시 항목 외 어떠한 수고비나 식대 등 추가 요금을 일체 요구하지 않습니다.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Shield className="w-4 h-4" />
                    <span>철저한 안전</span>
                  </div>
                  <p className="text-xs text-slate-text-muted leading-relaxed">
                    가구·가전별 맞춤 항균 포장재와 바닥 전용 롤보양재로 잔기스를 원천 차단합니다.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>위생적 꼼꼼함</span>
                  </div>
                  <p className="text-xs text-slate-text-muted leading-relaxed">
                    냉장고 내부 고온 스팀살균 및 피톤치드 연무 분사로 바로 생활 가능한 상태를
                    구축합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official License & Certificate Showcase (with Lightbox Zoom) */}
      <section className="w-full py-16 lg:py-20 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-badge-certified-blue mb-1">
                정부 공식 인허가 검증 서류
              </div>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight">
                눈으로 직접 확인하는 공식 인허가 원본 서류
              </h2>
              <p className="text-sm text-slate-text-muted mt-1">
                서류 이미지를 클릭하면 원본 크기로 확대하여 상세 내용을 확인하실 수 있습니다.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-badge-certified-blue">
              <CheckCircle2 className="w-4 h-4" />
              <span>실시간 유효 상태 확인 완료</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Document 1 */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-brand-border flex flex-col">
              <div className="p-5 bg-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-primary text-on-primary rounded-lg">
                    <ClipboardCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-base font-bold text-on-surface">
                      사업자등록증 & 화물주선허가증
                    </div>
                    <div className="text-xs text-slate-text-muted">
                      포항시 관허 정식 승인 및 국세청 등록 서류
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-badge-certified-blue">인허가 완료</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setZoomedDoc({
                    title: '사업자등록증 & 화물자동차운송주선사업허가증',
                    subtitle: `사업자번호 ${COMPANY_INFO.businessNumber} · 허가번호 ${COMPANY_INFO.freightLicense}`,
                    imageUrl: COMPANY_INFO.businessLicenseDocUrl,
                    details: [
                      '관할 세무서: 포항세무서 공식 등록',
                      '인가 기관: 경상북도 포항시장 인가',
                      '적재물배상책임보험: 사고당 최대 5억원 전 차량 적용',
                    ],
                  })
                }
                className="relative bg-surface-container p-4 flex items-center justify-center overflow-hidden group cursor-zoom-in text-left"
              >
                <SafeImage
                  src={COMPANY_INFO.businessLicenseDocUrl}
                  alt="예스이사 사업자등록증 및 화물자동차운송주선사업허가증 공인 서류"
                  className="w-full h-[380px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  fallbackLabel="사업자등록증 및 화물자동차운송주선사업허가증 (제5020000-2006-03-04019호)"
                />
                <span className="absolute bottom-5 right-5 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4" />
                  <span>크게 보기</span>
                </span>
              </button>

              <div className="p-6 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">사업자등록번호</div>
                    <div className="font-bold text-on-surface text-sm tabular-nums mt-0.5">
                      {COMPANY_INFO.businessNumber}
                    </div>
                    <div className="text-[11px] text-badge-certified-blue mt-0.5">
                      포항세무서 공식 등록
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">화물자동차운송주선사업허가</div>
                    <div className="font-bold text-on-surface text-sm tabular-nums mt-0.5">
                      {COMPANY_INFO.freightLicense}
                    </div>
                    <div className="text-[11px] text-badge-certified-blue mt-0.5">
                      경상북도 포항시장 인가
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">적재물배상책임보험</div>
                    <div className="font-bold text-on-surface text-sm tabular-nums mt-0.5">
                      사고당 최대 5억원 보장
                    </div>
                    <div className="text-[11px] text-safety-green mt-0.5">
                      전 차량 및 작업원 100% 적용
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">등록 업태 / 종목</div>
                    <div className="font-bold text-on-surface text-sm mt-0.5">
                      서비스 / 이사화물운송주선
                    </div>
                    <div className="text-[11px] text-slate-text-muted mt-0.5">
                      가정·보관·사무실 포장이사 전문
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document 2 */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-brand-border flex flex-col">
              <div className="p-5 bg-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-secondary text-on-secondary rounded-lg">
                    <FileCheck2 className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-base font-bold text-on-surface">
                      중소벤처기업부 여성기업 확인서
                    </div>
                    <div className="text-xs text-slate-text-muted">
                      여성기업지원에 관한 법률 제9조 의거 공식 확인
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">국가공인인증</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setZoomedDoc({
                    title: '중소벤처기업부 여성기업 확인서',
                    subtitle: '대구·경북지방중소벤처기업청 공식 발급',
                    imageUrl: COMPANY_INFO.womanEnterpriseDocUrl,
                    details: [
                      '발급기관: 대구·경북지방중소벤처기업청',
                      '인증분류: 여성기업 확인 등록 (법률 제9조)',
                      '관공서·학교·공공기관 이전 계약 시 공식 증빙 활용',
                    ],
                  })
                }
                className="relative bg-surface-container p-4 flex items-center justify-center overflow-hidden group cursor-zoom-in text-left"
              >
                <SafeImage
                  src={COMPANY_INFO.womanEnterpriseDocUrl}
                  alt="중소벤처기업부 여성기업 확인서 원본 서류"
                  className="w-full h-[380px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  fallbackLabel="중소벤처기업부 여성기업 확인서 (대구·경북지방중소벤처기업청)"
                />
                <span className="absolute bottom-5 right-5 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4" />
                  <span>크게 보기</span>
                </span>
              </button>

              <div className="p-6 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">확인서 발급기관</div>
                    <div className="font-bold text-on-surface text-sm mt-0.5">
                      대구·경북지방중소벤처기업청
                    </div>
                    <div className="text-[11px] text-secondary mt-0.5">중소벤처기업부 장관 명의</div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">기업 구분 및 분류</div>
                    <div className="font-bold text-on-surface text-sm mt-0.5">
                      여성기업 확인 등록
                    </div>
                    <div className="text-[11px] text-secondary mt-0.5">
                      여성기업지원에 관한 법률 시행령
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">서비스 특장점</div>
                    <div className="font-bold text-on-surface text-sm mt-0.5">
                      주방·정리수납·청결 특화
                    </div>
                    <div className="text-[11px] text-badge-certified-blue mt-0.5">
                      친환경 세척 및 살균 포장
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <div className="text-slate-text-muted">본사 소재지</div>
                    <div className="font-bold text-on-surface text-sm mt-0.5">
                      포항시 북구 흥해읍
                    </div>
                    <div className="text-[11px] text-slate-text-muted mt-0.5">
                      달전로 24 본사 직접 관할
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Principles */}
      <section className="w-full py-16 lg:py-20 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs text-primary font-bold mb-2">예스이사 행동 강령</div>
            <h2 className="text-2xl sm:text-3xl text-on-surface font-black tracking-tight mb-3">
              불안을 감동으로 바꾸는 예스이사 5대 절대 원칙
            </h2>
            <p className="text-sm text-slate-text-muted">
              계약서에 명문화하고 현장에서 한 치의 어긋남 없이 이행하는 예스이사만의 엄격한
              원칙입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-brand-border flex flex-col justify-between gap-5">
              <div>
                <div className="w-11 h-11 rounded-xl bg-badge-certified-bg text-badge-certified-blue flex items-center justify-center mb-4">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div className="text-xs text-badge-certified-blue font-bold mb-1">
                  01. 안심 원칙
                </div>
                <h3 className="text-lg text-on-surface font-extrabold mb-2">
                  무허가 불법 알선 0%
                </h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  수수료만 챙기고 하청 업체로 넘기는 중개 플랫폼과 다릅니다. 정식 허가받은 본사에서
                  상담부터 현장 투입까지 100% 직영 책임집니다.
                </p>
              </div>
              <div className="text-xs font-semibold text-badge-certified-blue pt-3 border-t border-brand-border">
                불법 도급·하청 절대 금지 서약
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-brand-border flex flex-col justify-between gap-5">
              <div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-xs text-primary font-bold mb-1">02. 투명 원칙</div>
                <h3 className="text-lg text-on-surface font-extrabold mb-2">
                  추가 부당 요금 요구 0원 보증
                </h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  이사 당일 점심값, 수고비, 계단 작업비 명목의 어떠한 부당 추가금도 요구하지
                  않습니다. 사전 견적서에 명시된 금액 그대로만 결제됩니다.
                </p>
              </div>
              <div className="text-xs font-semibold text-primary pt-3 border-t border-brand-border">
                견적 계약서 100% 준수 보장
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-brand-border flex flex-col justify-between gap-5">
              <div>
                <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-xs text-secondary font-bold mb-1">03. 인력 원칙</div>
                <h3 className="text-lg text-on-surface font-extrabold mb-2">
                  100% 직영 베테랑 & 팀장 책임제
                </h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  일용직이나 초보자 투입 없이, 수년간 손발을 맞춘 숙련 정규 베테랑과 현장 전문
                  팀장이 배치되어 책임지고 안전하게 조율합니다.
                </p>
              </div>
              <div className="text-xs font-semibold text-secondary pt-3 border-t border-brand-border">
                10년 이상 경력 팀장 직접 배정
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-brand-border flex flex-col justify-between gap-5 lg:col-span-2">
              <div>
                <div className="w-11 h-11 rounded-xl bg-surface-container text-on-surface flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-xs text-slate-text-muted font-bold mb-1">04. 시공 원칙</div>
                <h3 className="text-lg text-on-surface font-extrabold mb-2">
                  바닥·벽면·엘리베이터 완벽 이중 보양
                </h3>
                <p className="text-sm text-slate-text-muted leading-relaxed max-w-2xl">
                  이사 시작 전 거실, 복도, 현관 바닥에 충격 완화 롤 플로어 패드를 전면 설치합니다.
                  가구 모서리 완충재와 엘리베이터 전용 보호 커버링으로 새 집 인테리어의 잔기스
                  발생을 원천 차단합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant pt-3 border-t border-brand-border">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-safety-green" /> 덧신 착용 의무화
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-safety-green" /> 바닥 전용 PP보양재
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-safety-green" /> 도어 및 몰딩 보호대 적용
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-brand-border flex flex-col justify-between gap-5">
              <div>
                <div className="w-11 h-11 rounded-xl bg-safety-green/10 text-safety-green flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xs text-safety-green font-bold mb-1">05. 청결 원칙</div>
                <h3 className="text-lg text-on-surface font-extrabold mb-2">
                  스팀 살균 및 피톤치드 탈취 케어
                </h3>
                <p className="text-sm text-slate-text-muted leading-relaxed">
                  짐 정리 후 바닥 청소는 물론, 냉장고 내부 고온 스팀 살균 소독과 피톤치드 연무
                  분사로 바로 편안하게 쉴 수 있는 클린 공간을 완성합니다.
                </p>
              </div>
              <div className="text-xs font-semibold text-safety-green pt-3 border-t border-brand-border">
                무상 클린 프리미엄 마무리
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Contact Summary & Direct CTA */}
      <section className="w-full py-16 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-primary font-bold">포항 본사 직영센터</div>
                  <h2 className="text-2xl font-black text-on-surface mt-1">
                    예스이사 본사 정보 및 상담 채널
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('location-contact')}
                  className="px-3.5 py-2 rounded-lg bg-badge-certified-bg text-badge-certified-blue text-xs font-bold hover:bg-secondary-fixed transition-colors cursor-pointer"
                >
                  오시는길 상세보기
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-text-muted">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>본사 등록 주소</span>
                  </div>
                  <span className="font-bold text-on-surface text-sm">{COMPANY_INFO.address}</span>
                  <span className="text-slate-text-muted">포항IC 인근, 전용 차고지 완비</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-text-muted">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>고객센터 운영시간</span>
                  </div>
                  <span className="font-bold text-on-surface text-sm">{COMPANY_INFO.hours}</span>
                  <span className="text-slate-text-muted">주말·공휴일 실시간 현장 배차</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-text-muted">
                    <Phone className="w-4 h-4 text-badge-certified-blue" />
                    <span>대표 유선 상담</span>
                  </div>
                  <span className="font-bold text-on-surface text-sm tabular-nums">
                    {COMPANY_INFO.phoneMain} / {COMPANY_INFO.phoneOffice}
                  </span>
                  <span className="text-badge-certified-blue">무료 방문 견적 예약 직통</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-text-muted">
                    <Smartphone className="w-4 h-4 text-secondary" />
                    <span>현장 총괄 직통</span>
                  </div>
                  <span className="font-bold text-on-surface text-sm tabular-nums">
                    {COMPANY_INFO.phoneDirect}
                  </span>
                  <span className="text-secondary">긴급 이사 및 당일 현장 조율</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-primary text-on-primary p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-bold text-white/80 mb-2">
                  동해안권 공식 인허가 이사 파트너
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
                  지금 전화 한 통으로 정확한 관허 무료견적을 받아보세요.
                </h3>
                <div className="space-y-2 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>방문 견적 후 계약을 강요하지 않습니다.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>100% 관허 계약서 작성 및 5억 보험증권 교부</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  className="w-full py-3.5 px-5 rounded-xl bg-white text-primary hover:bg-surface-container-low text-base font-black flex items-center justify-center gap-2 transition-colors tabular-nums"
                >
                  <Phone className="w-5 h-5" />
                  <span>{COMPANY_INFO.phoneMain} 전화 즉시 상담</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('instant-quote')}
                  className="w-full py-3 px-5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  온라인 1분 무료 견적 신청하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zoomable Document Modal */}
      {zoomedDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomedDoc(null)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-brand-border max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-surface-container-low border-b border-brand-border flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-on-surface">{zoomedDoc.title}</h3>
                <p className="text-xs text-slate-text-muted mt-0.5">{zoomedDoc.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedDoc(null)}
                aria-label="닫기"
                className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto bg-surface-container flex-1 flex flex-col items-center gap-4">
              <SafeImage
                src={zoomedDoc.imageUrl}
                alt={zoomedDoc.title}
                className="w-full max-h-[60vh] object-contain rounded-lg bg-white"
              />
              <ul className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-on-surface bg-surface-container-lowest p-4 rounded-xl border border-brand-border">
                {zoomedDoc.details.map((d) => (
                  <li key={d} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-badge-certified-blue shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
