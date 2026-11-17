import React from 'react';
import { Award, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';
import { BRANCH_LOCATIONS, COMPANY_INFO } from '../data/yesMovingData';
import { BoardCategory, PageId } from '../types';
import { SafeImage } from './SafeImage';

interface FooterProps {
  onNavigate: (page: PageId, options?: { boardTab?: BoardCategory }) => void;
  onOpenLegalModal: (tab: 'terms' | 'privacy') => void;
  onOpenKakao: () => void;
  onTrackPhone: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegalModal,
  onOpenKakao,
  onTrackPhone,
}) => {
  const hq = BRANCH_LOCATIONS[0];
  const boardLinks: BoardCategory[] = ['공지사항', '고객후기', 'FAQ', '칼럼', '자료실'];

  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant border-t border-brand-border pb-20 md:pb-10">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-brand-border">
          {/* Brand Summary */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <SafeImage
                src={COMPANY_INFO.logoUrl}
                alt="예스이사 공식 로고"
                className="h-10 w-auto rounded-lg object-contain bg-white px-1.5 py-0.5 border border-brand-border/70"
                fallbackLabel="예스이사"
              />
              <span className="text-xl text-primary font-black tracking-tight">
                {COMPANY_INFO.name}
              </span>
              <span className="text-xs font-semibold text-badge-certified-blue">
                · 포항·경주·영덕·울진 직영
              </span>
            </div>
            <p className="text-xs text-slate-text-muted leading-relaxed">
              정부 공식 화물자동차운송주선사업 허가 및 5억원 적재물배상책임보험 가입 업체로서
              포장이사, 관공서이사, 학교이사, 보관이사를 100% 직영으로 책임집니다.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 text-badge-certified-blue">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                5억원 적재물배상보험
              </span>
              <span className="inline-flex items-center gap-1 text-secondary">
                <Award className="w-4 h-4 shrink-0" />
                중기부 여성기업 인증
              </span>
            </div>
          </div>

          {/* Official Registration Info */}
          <div className="md:col-span-3 flex flex-col gap-1.5 text-xs text-slate-text-muted leading-relaxed">
            <div className="text-sm text-on-surface font-bold mb-1">
              사업자 등록 및 인허가 정보
            </div>
            <div>
              상호: {COMPANY_INFO.name} | 대표: {COMPANY_INFO.ceo}
            </div>
            <div>
              사업자등록번호:{' '}
              <span className="text-on-surface font-semibold tabular-nums">
                {COMPANY_INFO.businessNumber}
              </span>
            </div>
            <div>
              관허번호:{' '}
              <span className="text-on-surface font-semibold tabular-nums">
                {COMPANY_INFO.freightLicense}
              </span>
            </div>
            <div>주소: {COMPANY_INFO.address}</div>
            <div className="flex flex-wrap items-center gap-3 pt-1.5">
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(hq.naverMapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-safety-green hover:underline"
              >
                <span>네이버플레이스</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  hq.googleMapQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-badge-certified-blue hover:underline"
              >
                <span>구글지도</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Menu & 5 Boards */}
          <div className="md:col-span-2 flex flex-col gap-1.5 text-xs text-slate-text-muted">
            <div className="text-sm text-on-surface font-bold mb-1">서비스 · 5대 게시판</div>
            <button
              type="button"
              onClick={() => onNavigate('company-certification')}
              className="text-left hover:text-primary transition-colors cursor-pointer"
            >
              회사소개 · 인허가
            </button>
            <button
              type="button"
              onClick={() => onNavigate('moving-services')}
              className="text-left hover:text-primary transition-colors cursor-pointer"
            >
              서비스 소개 · 예약하기
            </button>
            <button
              type="button"
              onClick={() => onNavigate('auspicious-calendar')}
              className="text-left hover:text-primary transition-colors cursor-pointer"
            >
              손없는날 예약 달력
            </button>
            <div className="pt-1 flex flex-wrap gap-x-2.5 gap-y-1">
              {boardLinks.map((bTab) => (
                <button
                  key={bTab}
                  type="button"
                  onClick={() => onNavigate('board', { boardTab: bTab })}
                  className="text-left font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {bTab}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Center */}
          <div className="md:col-span-3 flex flex-col justify-start md:items-end gap-2">
            <div className="text-sm text-on-surface font-bold">고객감동 전화·카톡 상담</div>
            <a
              onClick={onTrackPhone}
              className="text-2xl text-primary font-black tracking-tight tabular-nums hover:text-primary-container transition-colors"
              href={`tel:${COMPANY_INFO.phoneMain}`}
            >
              {COMPANY_INFO.phoneMain}
            </a>
            <div className="flex flex-col text-xs md:text-right text-slate-text-muted gap-1 tabular-nums">
              <span>직통 직영: {COMPANY_INFO.phoneDirect}</span>
              <span>사무실 유선: {COMPANY_INFO.phoneOffice}</span>
              <span>업무시간: {COMPANY_INFO.hours}</span>
            </div>
            <button
              type="button"
              onClick={onOpenKakao}
              className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-on-surface text-xs font-bold cursor-pointer transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>카카오톡 상담하기</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-text-muted gap-4">
          <div>
            © {COMPANY_INFO.name} ({COMPANY_INFO.englishName}). All Rights Reserved.
            포항·경주·영덕·울진 통합 직영 서비스망.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              이용약관
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-primary transition-colors font-semibold text-on-surface cursor-pointer"
            >
              개인정보처리방침
            </button>
            <button
              type="button"
              onClick={() => onNavigate('location-contact')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              오시는 길
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              관리자 운영
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
