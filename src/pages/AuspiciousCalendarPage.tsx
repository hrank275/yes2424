import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Info,
  Phone,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import { PageId, QuotePrefill } from '../types';
import {
  formatSolarDateKey,
  getKoreanWeekdayLabel,
  getLunarDateInfo,
  getMonthCalendarCells,
  LunarDateInfo,
} from '../utils/lunarCalendar';

interface AuspiciousCalendarPageProps {
  onNavigate: (page: PageId, options?: { prefill?: QuotePrefill }) => void;
}

type CalendarFilter = 'all' | 'auspicious' | 'economy';

export const AuspiciousCalendarPage: React.FC<AuspiciousCalendarPageProps> = ({
  onNavigate,
}) => {
  const now = new Date();
  const [viewYear, setViewYear] = useState<number>(now.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(now.getMonth() + 1);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    formatSolarDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );
  const [filterMode, setFilterMode] = useState<CalendarFilter>('all');

  const cells = useMemo(() => getMonthCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const auspiciousList = useMemo(
    () => cells.filter((c): c is LunarDateInfo => c !== null && c.isAuspicious),
    [cells]
  );

  const economyList = useMemo(
    () => cells.filter((c): c is LunarDateInfo => c !== null && c.isEconomyRecommended),
    [cells]
  );

  const selectedInfo: LunarDateInfo = useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    if (y && m && d) {
      return getLunarDateInfo(y, m, d);
    }
    return getLunarDateInfo(viewYear, viewMonth, 1);
  }, [selectedDateStr, viewYear, viewMonth]);

  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const quickMonths = useMemo(() => {
    const list: { year: number; month: number; label: string }[] = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      list.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
      });
    }
    return list;
  }, []);

  const selectDateAndSyncMonth = (info: LunarDateInfo) => {
    setSelectedDateStr(info.solarDateStr);
    setViewYear(info.year);
    setViewMonth(info.month);
  };

  const availabilityLabel = (status: LunarDateInfo['availability']) => {
    if (status === 'almost_full') return '배차 마감임박';
    if (status === 'popular') return '인기 예약일';
    return '여유 · 배차가능';
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner */}
      <section className="w-full bg-surface-container-low py-12 lg:py-16 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                <CalendarIcon className="w-4 h-4" />
                <span>전통 음력 기반 2026~2027 실시간 길일 안내</span>
              </div>
              <h1 className="text-3xl sm:text-4xl text-on-surface font-black tracking-tight mb-3">
                손없는날 달력 & 이사 길일 예약
              </h1>
              <p className="text-sm sm:text-base text-slate-text-muted leading-relaxed">
                음력 끝자리가 <strong className="text-on-surface">9일과 0일</strong>인 날은 악귀가
                동서남북 어느 방향으로도 다니지 않는 길일입니다. 원하는 날짜를 선택해 배차 여유를
                확인하고 바로 견적을 신청하세요.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {quickMonths.map((qm) => {
                const active = qm.year === viewYear && qm.month === viewMonth;
                return (
                  <button
                    key={qm.label}
                    type="button"
                    onClick={() => {
                      setViewYear(qm.year);
                      setViewMonth(qm.month);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest border border-brand-border text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {qm.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Calendar + Selected Date Inspector */}
      <section className="w-full py-10 lg:py-14 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Calendar Grid */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-5 sm:p-7 border border-brand-border">
              {/* Calendar Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPrevMonth}
                    aria-label="이전 달"
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black text-on-surface tabular-nums min-w-[130px] text-center">
                    {viewYear}년 {viewMonth}월
                  </h2>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    aria-label="다음 달"
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Mode Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container-low border border-brand-border">
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-white text-on-surface shadow-sm'
                        : 'text-slate-text-muted hover:text-on-surface'
                    }`}
                  >
                    전체 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('auspicious')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      filterMode === 'auspicious'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-text-muted hover:text-on-surface'
                    }`}
                  >
                    손없는날 강조
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('economy')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      filterMode === 'economy'
                        ? 'bg-safety-green text-white shadow-sm'
                        : 'text-slate-text-muted hover:text-on-surface'
                    }`}
                  >
                    알뜰 평일추천
                  </button>
                </div>
              </div>

              {/* Weekday Header */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-xs font-bold">
                {['일', '월', '화', '수', '목', '금', '토'].map((w, idx) => (
                  <div
                    key={w}
                    className={`py-2 ${
                      idx === 0
                        ? 'text-primary'
                        : idx === 6
                        ? 'text-badge-certified-blue'
                        : 'text-slate-text-muted'
                    }`}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {cells.map((cell, idx) => {
                  if (!cell) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="h-20 sm:h-24 rounded-xl bg-surface-container-low/40"
                      />
                    );
                  }

                  const isSelected = cell.solarDateStr === selectedDateStr;
                  const isSundayOrHoliday = cell.dayOfWeek === 0 || Boolean(cell.holidayName);
                  const isSaturday = cell.dayOfWeek === 6 && !cell.holidayName;

                  const dimmed =
                    (filterMode === 'auspicious' && !cell.isAuspicious) ||
                    (filterMode === 'economy' && !cell.isEconomyRecommended);

                  return (
                    <button
                      key={cell.solarDateStr}
                      type="button"
                      onClick={() => setSelectedDateStr(cell.solarDateStr)}
                      className={`h-20 sm:h-24 p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/25 bg-primary/5'
                          : cell.isAuspicious
                          ? 'border-primary/35 bg-primary-fixed/25 hover:bg-primary-fixed/40'
                          : cell.isEconomyRecommended && filterMode === 'economy'
                          ? 'border-safety-green/40 bg-safety-green/10'
                          : 'border-brand-border bg-surface-container-lowest hover:bg-surface-container-low'
                      } ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <div className="flex items-start justify-between gap-1 w-full">
                        <span
                          className={`text-sm sm:text-base font-extrabold tabular-nums leading-none ${
                            isSundayOrHoliday
                              ? 'text-primary'
                              : isSaturday
                              ? 'text-badge-certified-blue'
                              : 'text-on-surface'
                          }`}
                        >
                          {cell.day}
                        </span>
                        <span className="text-[10px] text-slate-text-muted tabular-nums hidden sm:inline">
                          음 {cell.lunarMonth}.{cell.lunarDay}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                        {cell.holidayName && (
                          <span className="text-[10px] font-bold text-primary truncate">
                            {cell.holidayName}
                          </span>
                        )}
                        {cell.isAuspicious ? (
                          <span className="text-[10px] sm:text-[11px] font-black text-primary truncate">
                            ★ 손없는날
                          </span>
                        ) : cell.isEconomyRecommended ? (
                          <span className="text-[10px] font-bold text-safety-green truncate hidden sm:inline">
                            알뜰이사추천
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-brand-border flex flex-wrap items-center gap-5 text-xs text-slate-text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-primary-fixed border border-primary/40 inline-block" />
                  <span className="font-semibold text-on-surface">손없는날 (음력 9·0일)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-safety-green/20 border border-safety-green/50 inline-block" />
                  <span>알뜰 평일 추천일 (비용 절감)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border-2 border-primary inline-block" />
                  <span>현재 선택된 날짜</span>
                </div>
              </div>
            </div>

            {/* Right Selected Date Detail Panel */}
            <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="bg-surface-container-lowest rounded-2xl p-6 border border-brand-border flex flex-col gap-5">
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-brand-border">
                  <div>
                    <div className="text-xs font-bold text-slate-text-muted mb-1">
                      선택 날짜 상세 정보
                    </div>
                    <div className="text-2xl font-black text-on-surface tabular-nums">
                      {selectedInfo.year}년 {selectedInfo.month}월 {selectedInfo.day}일 (
                      {getKoreanWeekdayLabel(selectedInfo.dayOfWeek)})
                    </div>
                    <div className="text-xs text-slate-text-muted mt-1 tabular-nums">
                      음력 {selectedInfo.isLeapMonth ? '윤' : ''}
                      {selectedInfo.lunarMonth}월 {selectedInfo.lunarDay}일
                      {selectedInfo.holidayName ? ` · ${selectedInfo.holidayName}` : ''}
                    </div>
                  </div>
                  {selectedInfo.isAuspicious && (
                    <span className="px-2.5 py-1 rounded-md bg-primary text-white text-xs font-bold shrink-0">
                      손없는날
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-badge-certified-blue shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-on-surface">전통 방위 안내</div>
                      <div className="text-slate-text-muted mt-0.5">
                        {selectedInfo.directionLabel}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-on-surface">예스이사 배차 현황</div>
                      <div className="text-slate-text-muted mt-0.5">
                        현재 상태:{' '}
                        <strong
                          className={
                            selectedInfo.availability === 'almost_full'
                              ? 'text-primary'
                              : selectedInfo.availability === 'popular'
                              ? 'text-tertiary'
                              : 'text-safety-green'
                          }
                        >
                          {availabilityLabel(selectedInfo.availability)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {selectedInfo.isEconomyRecommended && (
                    <div className="p-3.5 rounded-xl bg-safety-green/10 flex items-start gap-2.5">
                      <PiggyBank className="w-4 h-4 text-safety-green shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-safety-green">평일 알뜰이사 추천일</div>
                        <div className="text-on-surface-variant mt-0.5">
                          손없는날·주말 대비 여유로운 배차와 합리적인 비성수기 요금이 적용됩니다.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate('instant-quote', {
                      prefill: { movingDate: selectedInfo.solarDateStr },
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>이 날짜로 무료견적 바로 신청</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${COMPANY_INFO.phoneMain}`}
                  className="w-full py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-2 transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{COMPANY_INFO.phoneMain} 전화로 배차 문의</span>
                </a>
              </div>

              {/* Monthly Auspicious Quick-Pick Summary */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 border border-brand-border">
                <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center justify-between">
                  <span>{viewMonth}월 손없는날 빠른 선택</span>
                  <span className="text-xs text-primary tabular-nums">
                    총 {auspiciousList.length}일
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {auspiciousList.map((item) => {
                    const active = item.solarDateStr === selectedDateStr;
                    return (
                      <button
                        key={item.solarDateStr}
                        type="button"
                        onClick={() => selectDateAndSyncMonth(item)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer tabular-nums ${
                          active
                            ? 'bg-primary text-white border-primary font-bold'
                            : 'bg-surface-container-low hover:bg-surface-container border-brand-border text-on-surface'
                        }`}
                      >
                        <div className="font-bold">
                          {item.month}/{item.day} ({getKoreanWeekdayLabel(item.dayOfWeek)})
                        </div>
                        <div
                          className={`text-[11px] ${
                            active ? 'text-white/80' : 'text-slate-text-muted'
                          }`}
                        >
                          음력 {item.lunarMonth}.{item.lunarDay}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Guide Cards: 손없는날 vs 알뜰 평일 이사 */}
      <section className="w-full py-12 bg-surface-container-low border-t border-brand-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                <Info className="w-4 h-4" />
                <span>손없는날이란 무엇인가요?</span>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-3">
                예스이사 손없는날 사전 예약 안내
              </h3>
              <p className="text-sm text-slate-text-muted leading-relaxed mb-4">
                민속 신앙에서 '손'은 날수에 따라 동서남북 사방을 옮겨 다니며 사람에게 해를 끼치는
                악귀를 뜻합니다. 음력 9일, 10일, 19일, 20일, 29일, 30일은 어느 방향으로도 손이
                활동하지 않아 예로부터 이사·혼례·개업에 가장 좋은 길일로 꼽힙니다.
              </p>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>손없는날과 주말이 겹칠 경우 최소 3~4주 전 사전 예약을 권장합니다.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>사다리차 및 엘리베이터 예약도 관리사무소와 미리 조율해 드립니다.</span>
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-brand-border">
              <div className="flex items-center gap-2 text-safety-green font-bold text-sm mb-2">
                <PiggyBank className="w-4 h-4" />
                <span>이사 비용을 줄이는 현명한 팁</span>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-3">
                평일 알뜰이사 추천 ({economyList.length}일)
              </h3>
              <p className="text-sm text-slate-text-muted leading-relaxed mb-4">
                날짜에 크게 구애받지 않으신다면 화·수·목요일 등 평일 일반 날짜를 선택해 보세요.
                성수기 손없는날·월말 대비 더욱 여유로운 팀 배정과 실속 있는 견적 혜택을 받으실 수
                있습니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {economyList.slice(0, 6).map((item) => (
                  <button
                    key={item.solarDateStr}
                    type="button"
                    onClick={() => selectDateAndSyncMonth(item)}
                    className="px-3 py-1.5 rounded-lg bg-safety-green/10 hover:bg-safety-green/20 text-safety-green text-xs font-bold tabular-nums cursor-pointer transition-colors"
                  >
                    {item.month}월 {item.day}일 ({getKoreanWeekdayLabel(item.dayOfWeek)})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
