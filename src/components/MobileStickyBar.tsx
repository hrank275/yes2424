import React from 'react';
import { Calculator, MessageCircle, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import { PageId } from '../types';

interface MobileStickyBarProps {
  onNavigate: (page: PageId) => void;
  onOpenKakao: () => void;
  onTrackPhone: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  onNavigate,
  onOpenKakao,
  onTrackPhone,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-surface-container-lowest/95 backdrop-blur-md border-t border-brand-border px-2 flex items-center gap-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <a
        href={`tel:${COMPANY_INFO.phoneMain}`}
        onClick={onTrackPhone}
        className="flex-1 h-10 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <Phone className="w-4 h-4 shrink-0" />
        <span>전화상담</span>
      </a>
      <button
        type="button"
        onClick={onOpenKakao}
        className="flex-1 h-10 rounded-lg bg-amber-400 text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        <span>카카오톡 문의</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate('instant-quote')}
        className="flex-1 h-10 rounded-lg bg-inverse-surface text-white text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
      >
        <Calculator className="w-4 h-4 shrink-0" />
        <span>상담 문의하기</span>
      </button>
    </div>
  );
};
