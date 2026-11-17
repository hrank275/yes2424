import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Calendar,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  COMPANY_INFO,
  COMPARISON_ROWS,
  CORE_FAQS,
  MOVING_SERVICES,
  PROCESS_STEPS,
} from '../data/yesMovingData';
import { BoardCategory, PageId, QuotePrefill } from '../types';
import { SafeImage } from '../components/SafeImage';
import { ServiceIcon } from '../components/ServiceIcon';

interface MovingServicesPageProps {
  onNavigate: (
    page: PageId,
    options?: { prefill?: QuotePrefill; boardTab?: BoardCategory }
  ) => void;
  initialAnchorId?: string;
  onOpenKakao?: () => void;
  onTrackPhone?: () => void;
}

export const MovingServicesPage: React.FC<MovingServicesPageProps> = ({
  onNavigate,
  initialAnchorId,
  onOpenKakao,
  onTrackPhone,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialAnchorId || MOVING_SERVICES[0].anchorId);

  useEffect(() => {
    if (initialAnchorId) {
      setActiveTab(initialAnchorId);
      const timer = setTimeout(() => {
        const el = document.getElementById(initialAnchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialAnchorId]);

  const scrollToService = (anchorId: string) => {
    setActiveTab(anchorId);
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Visual Banner */}
      <section className="w-full bg-surface-container-low py-14 lg:py-20 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                <span className="text-primary">포항·경주·영덕·울진 공식허가 직영</span>
                <span className="text-slate-text-muted">·</span>
                <span className="text-badge-certified-blue inline-flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  적재물배상책임 5억원 가입
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-on-surface font-black tracking-tight leading-tight">
                예스이사 서비스 소개 ·
                <br className="hidden sm:inline" />{' '}
                <span className="text-primary">포장이사·관공서·학교이사</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
                가정 포장이사, 관공서이사·학교이사, 원룸 소형이사, 항온항습 보관이사, 고층 사다리차
                직영까지. 예스이사의 표준 시공 매뉴얼과 국가공인 화물주선면허를 바탕으로 완벽하게
                이전합니다.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  onClick={onTrackPhone}
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-sm transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{COMPANY_INFO.phoneMain} 전화상담</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('instant-quote')}
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-inverse-surface hover:bg-on-background text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>상담 문의하기</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenKakao}
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-on-surface text-sm font-bold transition-colors cursor-pointer"
                >
                  <span>카카오톡 문의</span>
                </button>
              </div>
            </div>

            {/* Quality Metrics Summary Card */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-brand-border flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={COMPANY_INFO.emblemUrl}
                    fallbackSrc={COMPANY_INFO.logoUrl}
                    alt="예스이사 공식 심볼 로고"
                    className="w-14 h-11 rounded-lg object-contain bg-white p-1 border border-brand-border/70"
                  />
                  <div>
                    <div className="text-base font-black text-on-surface">예스이사 품질보증</div>
                    <div className="text-xs text-slate-text-muted">
                      경상북도 동해안권 신속배차 체계
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-badge-certified-blue">100% 실명책임제</span>
              </div>

              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <div className="text-xs text-slate-text-muted mb-1">연간 누적 이사 건수</div>
                  <div className="text-2xl text-primary font-black">12,400+</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <div className="text-xs text-slate-text-muted mb-1">고객 서비스 만족도</div>
                  <div className="text-2xl text-secondary font-black">99.2%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <div className="text-xs text-slate-text-muted mb-1">고층 사다리 보유</div>
                  <div className="text-2xl text-on-surface font-black">2층~25층</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <div className="text-xs text-slate-text-muted mb-1">적재물 화물보험</div>
                  <div className="text-2xl text-badge-certified-blue font-black">5억원 가입</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-1">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>
                  정식 허가증: <strong className="tabular-nums">{COMPANY_INFO.freightLicense}</strong>{' '}
                  인증 안전이사
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Service Category Bar */}
      <section className="w-full bg-surface/95 backdrop-blur-md border-b border-brand-border sticky top-18 sm:top-20 z-30">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {MOVING_SERVICES.map((svc) => {
              const isSelected = activeTab === svc.anchorId;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => scrollToService(svc.anchorId)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {svc.number}. {svc.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Detailed Service Sections */}
      <section className="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 flex flex-col gap-12">
        {MOVING_SERVICES.map((svc, idx) => {
          const isImageLeft = idx % 2 === 1;
          return (
            <div
              key={svc.id}
              id={svc.anchorId}
              className="scroll-mt-36 bg-surface-container-lowest rounded-2xl p-6 sm:p-10 border border-brand-border"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Text Block */}
                <div
                  className={`lg:col-span-7 flex flex-col justify-between gap-6 ${
                    isImageLeft ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                      <span className="font-bold text-badge-certified-blue">{svc.badge}</span>
                      <span className="text-slate-text-muted">·</span>
                      <span className="text-slate-text-muted">{svc.subtitle}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl text-on-surface font-black mb-3">
                      {svc.number}. {svc.title}
                    </h2>

                    <p className="text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed">
                      {svc.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {svc.features.map((feat, fIdx) => (
                        <div
                          key={feat.title}
                          className={`p-4 rounded-xl bg-surface-container-low flex items-start gap-3 ${
                            svc.features.length % 2 === 1 && fIdx === svc.features.length - 1
                              ? 'sm:col-span-2'
                              : ''
                          }`}
                        >
                          <ServiceIcon
                            name={feat.iconName}
                            className={`w-5 h-5 shrink-0 mt-0.5 ${feat.accentColor}`}
                          />
                          <div>
                            <h3 className="text-sm text-on-surface font-bold">{feat.title}</h3>
                            <p className="text-xs text-slate-text-muted mt-0.5 leading-relaxed">
                              {feat.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-brand-border">
                    <span className="text-xs text-slate-text-muted font-medium">
                      {svc.footerNote}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate('instant-quote', {
                          prefill: { movingType: svc.quoteType },
                        })
                      }
                      className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-bold transition-colors cursor-pointer"
                    >
                      <span>이 서비스로 견적 신청</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>
                </div>

                {/* Image Block */}
                <div
                  className={`lg:col-span-5 flex flex-col ${
                    isImageLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative rounded-2xl overflow-hidden h-72 lg:h-full min-h-[280px] border border-brand-border">
                    <SafeImage
                      src={svc.image}
                      fallbackSrc={svc.fallbackImage}
                      alt={svc.imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <div className="text-xs font-semibold text-white/80">{svc.imageTag}</div>
                        <div className="text-lg font-bold mt-0.5">{svc.imageHeadline}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 6-Step Standard Moving Process */}
      <section className="w-full bg-surface-container-low py-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs text-primary font-bold mb-2">표준 시공 매뉴얼</div>
            <h2 className="text-2xl sm:text-3xl text-on-surface font-black mb-3">
              예스이사 진행 6단계 표준 시공 프로세스
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              체계적인 시스템과 엄격한 매뉴얼로 오차 없이 진행되는 안심 이사 절차를 확인해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((st) => (
              <div
                key={st.step}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-brand-border flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-primary tabular-nums">{st.step}</span>
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                      <ServiceIcon name={st.iconName} className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base text-on-surface font-bold mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {st.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-border flex items-center gap-1.5 text-xs text-badge-certified-blue font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{st.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="max-w-[1200px] mx-auto px-4 lg:px-6 py-16 w-full">
        <div className="mb-8">
          <div className="text-xs font-bold text-secondary mb-1">서비스 비교표</div>
          <h2 className="text-2xl sm:text-3xl text-on-surface font-black">
            이사 종류별 서비스 포함 내역 한눈에 보기
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest border border-brand-border">
          <table className="w-full text-left text-sm border-collapse min-w-[780px]">
            <thead>
              <tr className="bg-surface-container-high text-on-surface border-b border-brand-border">
                <th className="py-4 px-6 font-bold w-1/5">서비스 항목</th>
                <th className="py-4 px-4 font-bold text-center text-primary bg-primary/5">
                  프리미엄 포장이사
                </th>
                <th className="py-4 px-4 font-bold text-center text-badge-certified-blue">
                  관공서·학교·기업
                </th>
                <th className="py-4 px-4 font-bold text-center">실속 일반이사</th>
                <th className="py-4 px-4 font-bold text-center">원룸·용달 소형</th>
                <th className="py-4 px-4 font-bold text-center">보관이사</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-on-surface-variant">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.item} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-on-surface">{row.item}</td>
                  <td className="py-3.5 px-4 text-center bg-primary/5 text-primary font-bold">
                    {row.premium}
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs text-badge-certified-blue font-semibold">
                    {row.office}
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs">{row.standard}</td>
                  <td className="py-3.5 px-4 text-center text-xs">{row.oneroom}</td>
                  <td className="py-3.5 px-4 text-center text-xs font-semibold">
                    {row.storage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Service FAQ Summary */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-brand-border">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h3 className="text-lg font-black text-on-surface">
              포장이사·관공서이사·학교이사 자주 묻는 질문
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('board', { boardTab: 'FAQ' })}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              FAQ 10선 전체보기 →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {CORE_FAQS.slice(0, 3).map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl bg-surface-container-lowest border border-brand-border"
              >
                <div className="font-bold text-on-surface mb-1.5">Q. {faq.question}</div>
                <p className="text-slate-text-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full bg-inverse-surface text-white py-14">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="text-xs font-bold text-primary-fixed mb-2">
              방문 견적 무료 · 추가 요금 0원
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              포항·경주·영덕·울진 이사 비용, 1분 만에 무료로 확인하세요
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              포항 본점, 경주, 영덕, 울진 직영 네트워크로 출장비 없이 견적 매니저가 방문하거나
              유선으로 즉시 표준 금액을 안내해 드립니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('instant-quote')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-primary hover:bg-primary-container text-white text-sm font-bold transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4 mr-2" />
              <span>간편 실시간 견적 신청</span>
            </button>
            {onOpenKakao && (
              <button
                type="button"
                onClick={onOpenKakao}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-on-surface text-sm font-bold transition-colors cursor-pointer"
              >
                <span>카카오톡 문의</span>
              </button>
            )}
            <a
              href={`tel:${COMPANY_INFO.phoneMain}`}
              onClick={onTrackPhone}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold transition-colors tabular-nums"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>{COMPANY_INFO.phoneMain} 전화상담</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
