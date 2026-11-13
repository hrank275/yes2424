import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import { PageId } from '../types';
import { SafeImage } from './SafeImage';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenLegalModal: (tab: 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegalModal }) => {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant border-t border-brand-border">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-brand-border">
          {/* Brand Summary */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <SafeImage
                src={COMPANY_INFO.logoUrl}
                alt="예스이사"
                className="w-8 h-8 rounded-full object-cover"
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
              철저한 포장, 안심 운송, 친절한 현장 정리정돈을 약속드립니다.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-badge-certified-blue">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                적재물배상책임보험 5억원 가입
              </span>
              <span className="inline-flex items-center gap-1.5 text-secondary">
                <Award className="w-4 h-4 shrink-0" />
                중소벤처기업부 여성기업 인증
              </span>
            </div>
          </div>

          {/* Official Registration Info */}
          <div className="md:col-span-4 flex flex-col gap-2 text-xs text-slate-text-muted leading-relaxed">
            <div className="text-sm text-on-surface font-bold mb-1">
              사업자 등록 및 인허가 정보
            </div>
            <div>
              상호: {COMPANY_INFO.name} ({COMPANY_INFO.englishName}) | 대표:{' '}
              {COMPANY_INFO.ceo}
            </div>
            <div>
              사업자등록번호:{' '}
              <span className="text-on-surface font-semibold tabular-nums">
                {COMPANY_INFO.businessNumber}
              </span>
            </div>
            <div>
              화물자동차운송주선사업허가증:{' '}
              <span className="text-on-surface font-semibold tabular-nums">
                {COMPANY_INFO.freightLicense}
              </span>
            </div>
            <div>주소: {COMPANY_INFO.address}</div>
            <div>인증사항: 중소벤처기업부 공식 여성기업 확인서 보유</div>
          </div>

          {/* Customer Center */}
          <div className="md:col-span-3 flex flex-col justify-start md:items-end gap-2">
            <div className="text-sm text-on-surface font-bold">고객감동 상담센터</div>
            <a
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
          </div>
        </div>

        {/* Bottom Copyright & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-text-muted gap-4">
          <div>
            © {COMPANY_INFO.name} ({COMPANY_INFO.englishName}). All Rights Reserved.
            포항·경주·영덕·울진 통합 직영 서비스망.
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('auspicious-calendar')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              손없는날 달력
            </button>
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
              지사 안내
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
