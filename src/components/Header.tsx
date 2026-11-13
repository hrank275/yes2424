import React, { useState } from 'react';
import { Calculator, Menu, Phone, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import { PageId } from '../types';
import { SafeImage } from './SafeImage';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'company-certification', label: '회사소개·공식인허가' },
  { id: 'moving-services', label: '이사서비스안내' },
  { id: 'auspicious-calendar', label: '손없는날 달력' },
  { id: 'work-gallery', label: '갤러리·작업현장' },
  { id: 'location-contact', label: '오시는길' },
];

export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-brand-border/70">
      <div className="h-18 sm:h-20 max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Clean Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 shrink-0 text-left focus-visible:outline-2 focus-visible:outline-primary rounded-lg cursor-pointer"
        >
          <SafeImage
            src={COMPANY_INFO.logoUrl}
            alt="예스이사 공식 로고"
            className="w-9 h-9 rounded-full object-cover shadow-sm"
            fallbackLabel="예스이사"
          />
          <span className="text-xl font-black text-primary tracking-tight whitespace-nowrap shrink-0">
            {COMPANY_INFO.name}
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="주 메뉴"
          className="hidden lg:flex items-center gap-5 xl:gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-2 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-primary font-bold border-primary'
                    : 'text-on-surface-variant font-medium border-transparent hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Drawer Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`tel:${COMPANY_INFO.phoneMain}`}
            className="hidden xl:inline-flex items-center gap-1.5 text-sm font-extrabold text-on-surface hover:text-primary transition-colors whitespace-nowrap shrink-0 tabular-nums mr-1"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span>{COMPANY_INFO.phoneMain}</span>
          </a>

          <button
            type="button"
            onClick={() => handleNavClick('instant-quote')}
            className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-sm ${
              activePage === 'instant-quote'
                ? 'bg-primary-container text-on-primary'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            <Calculator className="w-4 h-4 mr-1.5 shrink-0" />
            <span>실시간 무료견적</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile/Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-brand-border shadow-lg">
          <nav className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="mt-3 pt-3 border-t border-brand-border flex items-center justify-between px-2">
              <span className="text-xs text-slate-text-muted">365일 무료 방문견적 상담</span>
              <a
                href={`tel:${COMPANY_INFO.phoneMain}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container text-sm font-extrabold text-primary tabular-nums"
              >
                <Phone className="w-4 h-4" />
                <span>{COMPANY_INFO.phoneMain}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
