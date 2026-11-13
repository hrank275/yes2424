import { useCallback, useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LegalModal } from './components/LegalModal';
import { COMPANY_INFO } from './data/yesMovingData';
import { AuspiciousCalendarPage } from './pages/AuspiciousCalendarPage';
import { CompanyCertificationPage } from './pages/CompanyCertificationPage';
import { HomePage } from './pages/HomePage';
import { InstantQuotePage } from './pages/InstantQuotePage';
import { LocationContactPage } from './pages/LocationContactPage';
import { MovingServicesPage } from './pages/MovingServicesPage';
import { WorkGalleryPage } from './pages/WorkGalleryPage';
import { PageId, QuotePrefill } from './types';

const VALID_PAGES: PageId[] = [
  'home',
  'company-certification',
  'moving-services',
  'auspicious-calendar',
  'work-gallery',
  'location-contact',
  'instant-quote',
];

function parseHashToPage(): PageId {
  const hash = window.location.hash.replace(/^#\/?/, '').trim() as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => parseHashToPage());
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | undefined>(undefined);
  const [serviceAnchorId, setServiceAnchorId] = useState<string | undefined>(undefined);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashToPage();
      setActivePage(next);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback(
    (page: PageId, options?: { prefill?: QuotePrefill; anchorId?: string }) => {
      if (options?.prefill) {
        setQuotePrefill(options.prefill);
      } else if (page !== 'instant-quote') {
        setQuotePrefill(undefined);
      }

      if (options?.anchorId) {
        setServiceAnchorId(options.anchorId);
      } else {
        setServiceAnchorId(undefined);
      }

      setActivePage(page);
      const targetHash = page === 'home' ? '#/' : `#/${page}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }

      if (!options?.anchorId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header activePage={activePage} onNavigate={(p) => handleNavigate(p)} />

      <main className="flex-1 w-full pt-18 sm:pt-20">
        {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {activePage === 'company-certification' && (
          <CompanyCertificationPage onNavigate={(p) => handleNavigate(p)} />
        )}
        {activePage === 'moving-services' && (
          <MovingServicesPage
            onNavigate={handleNavigate}
            initialAnchorId={serviceAnchorId}
          />
        )}
        {activePage === 'auspicious-calendar' && (
          <AuspiciousCalendarPage onNavigate={handleNavigate} />
        )}
        {activePage === 'work-gallery' && (
          <WorkGalleryPage onNavigate={handleNavigate} />
        )}
        {activePage === 'location-contact' && (
          <LocationContactPage onNavigate={(p) => handleNavigate(p)} />
        )}
        {activePage === 'instant-quote' && (
          <InstantQuotePage
            onNavigate={(p) => handleNavigate(p)}
            prefill={quotePrefill}
          />
        )}
      </main>

      <Footer
        onNavigate={(p) => handleNavigate(p)}
        onOpenLegalModal={(tab) => setLegalTab(tab)}
      />

      {/* Desktop Floating Direct Phone Button */}
      <div className="fixed bottom-5 right-5 z-40 hidden md:block">
        <a
          href={`tel:${COMPANY_INFO.phoneMain}`}
          className="px-5 py-3 rounded-full bg-inverse-surface hover:bg-on-background text-white shadow-xl transition-transform hover:scale-105 flex items-center gap-2 tabular-nums"
        >
          <PhoneCall className="w-4 h-4 text-primary-fixed" />
          <span className="text-sm font-bold">전화 견적 {COMPANY_INFO.phoneMain}</span>
        </a>
      </div>

      <LegalModal tab={legalTab} onClose={() => setLegalTab(null)} />
    </div>
  );
}
