import { useCallback, useEffect, useState } from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { KakaoConsultModal } from './components/KakaoConsultModal';
import { LegalModal } from './components/LegalModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { COMPANY_INFO } from './data/yesMovingData';
import { AdminPage } from './pages/AdminPage';
import { AuspiciousCalendarPage } from './pages/AuspiciousCalendarPage';
import { BoardPage } from './pages/BoardPage';
import { CompanyCertificationPage } from './pages/CompanyCertificationPage';
import { HomePage } from './pages/HomePage';
import { InstantQuotePage } from './pages/InstantQuotePage';
import { LocationContactPage } from './pages/LocationContactPage';
import { MovingServicesPage } from './pages/MovingServicesPage';
import { WorkGalleryPage } from './pages/WorkGalleryPage';
import { BoardCategory, PageId, QuotePrefill, QuoteSubmission } from './types';

const METRICS_STORAGE_KEY = 'yesmoving_conversion_metrics_v1';
const QUOTES_STORAGE_KEY = 'yesmoving_quote_submissions_v1';

const VALID_PAGES: PageId[] = [
  'home',
  'company-certification',
  'moving-services',
  'auspicious-calendar',
  'work-gallery',
  'board',
  'location-contact',
  'instant-quote',
  'admin',
];

const HASH_ALIASES: Record<string, { page: PageId; boardTab?: BoardCategory }> = {
  메인: { page: 'home' },
  회사소개: { page: 'company-certification' },
  '서비스-소개': { page: 'moving-services' },
  예약하기: { page: 'auspicious-calendar' },
  상담신청: { page: 'instant-quote' },
  갤러리: { page: 'work-gallery' },
  고객후기: { page: 'board', boardTab: '고객후기' },
  게시판: { page: 'board', boardTab: '공지사항' },
  공지사항: { page: 'board', boardTab: '공지사항' },
  FAQ: { page: 'board', boardTab: 'FAQ' },
  칼럼: { page: 'board', boardTab: '칼럼' },
  자료실: { page: 'board', boardTab: '자료실' },
  '오시는-길': { page: 'location-contact' },
  관리자: { page: 'admin' },
};

const PAGE_SEO: Record<PageId, { title: string; description: string }> = {
  home: {
    title: '포항 경주 영덕 울진 이사 · 포장이사 관공서이사 학교이사 | 예스이사',
    description:
      '예스이사는 포항 경주 영덕 울진 대상 포장이사·관공서이사·학교이사 전문 허가업체로 투명한 이사 비용 안내와 신속한 전화 상담으로 바로 연결해 드립니다.',
  },
  'company-certification': {
    title: '예스이사 회사소개 · 정식관허·여성기업·5억 배상보험 | 포항이사',
    description:
      '화물자동차운송주선사업 허가 제5020000-2006-03-04019호, 중소벤처기업부 여성기업 인증, 5억원 적재물배상책임보험 원본 서류를 투명하게 공개합니다.',
  },
  'moving-services': {
    title: '포장이사 · 관공서이사 · 학교이사 · 보관이사 서비스 안내 | 예스이사',
    description:
      '가정 포장이사, 관공서·학교·기업 이전, 일반이사, 원룸 용달이사, 항온항습 보관이사, 25층 직영 사다리차 서비스 비교 및 이사 비용 안내.',
  },
  'auspicious-calendar': {
    title: '손없는날 달력 & 이사 예약하기 | 포항 경주 영덕 울진 예스이사',
    description:
      '음력 기반 2026~2027년 손없는날 길일 달력과 알뜰 평일 이사 추천 일정을 확인하고 즉시 무료 방문 견적을 예약하세요.',
  },
  'work-gallery': {
    title: '포항·경주·영덕·울진 이사 작업 현장 갤러리 | 예스이사',
    description:
      '신축 아파트 바닥 이중 보양, 고층 사다리차 양중, 관공서·학교 이전 등 실제 작업 현장 사례와 이용 후기를 확인하세요.',
  },
  board: {
    title: '고객후기 · 공지사항 · FAQ · 이사 칼럼 · 자료실 | 예스이사',
    description:
      '포항이사·영덕이사·울진이사 선택 전 체크포인트 칼럼 10선, 실제 고객후기, FAQ 10선, 이사 준비 체크리스트 자료실을 제공합니다.',
  },
  'location-contact': {
    title: '오시는 길 · 포항 본사 및 경주·영덕·울진 직영 지사 | 예스이사',
    description:
      '경상북도 포항시 북구 흥해읍 달전로 24 본사 위치, 네이버플레이스·카카오맵·구글지도 안내 및 무료 방문실측 예약.',
  },
  'instant-quote': {
    title: '1분 실시간 무료 견적 및 이사 상담신청 | 예스이사 1688-0450',
    description:
      '출발지·도착지·평형대 선택만으로 예상 이사 비용을 즉시 확인하고 추가금 0원 무료 방문견적을 신청하세요.',
  },
  admin: {
    title: '관리자 운영 콘솔 · 상담 및 SEO 게시판 관리 | 예스이사',
    description: '예스이사 상담·견적 접수 관리, 전환 통계 및 5대 게시판 SEO 콘텐츠 운영 대시보드.',
  },
};

function parseHashToRoute(): { page: PageId; boardTab?: BoardCategory } {
  const raw = decodeURIComponent(window.location.hash.replace(/^#\/?/, '').trim());
  if (!raw) return { page: 'home' };
  if (HASH_ALIASES[raw]) return HASH_ALIASES[raw];
  if (VALID_PAGES.includes(raw as PageId)) return { page: raw as PageId };
  return { page: 'home' };
}

export default function App() {
  const initialRoute = parseHashToRoute();
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [boardTab, setBoardTab] = useState<BoardCategory>(initialRoute.boardTab || '공지사항');
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | undefined>(undefined);
  const [serviceAnchorId, setServiceAnchorId] = useState<string | undefined>(undefined);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | null>(null);
  const [kakaoOpen, setKakaoOpen] = useState(false);

  const trackMetric = useCallback((type: 'phoneClicks' | 'kakaoClicks') => {
    try {
      const raw = localStorage.getItem(METRICS_STORAGE_KEY);
      const curr = raw ? (JSON.parse(raw) as { phoneClicks?: number; kakaoClicks?: number }) : {};
      const next = {
        phoneClicks: (curr.phoneClicks || 0) + (type === 'phoneClicks' ? 1 : 0),
        kakaoClicks: (curr.kakaoClicks || 0) + (type === 'kakaoClicks' ? 1 : 0),
      };
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  }, []);

  const handleTrackPhone = useCallback(() => {
    trackMetric('phoneClicks');
  }, [trackMetric]);

  const handleOpenKakao = useCallback(() => {
    trackMetric('kakaoClicks');
    setKakaoOpen(true);
  }, [trackMetric]);

  const handleSubmitKakaoInquiry = useCallback((name: string, phone: string, note: string) => {
    const newSubmission: QuoteSubmission = {
      id: `K-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('ko-KR'),
      status: '접수대기',
      source: '간편상담',
      movingType: '가정포장이사',
      startRegion: '포항시 북구',
      startDetail: '카카오톡 간편상담',
      startHousing: '아파트',
      startFloor: '-',
      startTransport: '엘리베이터',
      endRegion: '포항시 남구',
      endDetail: '상담 시 확인',
      endHousing: '아파트',
      endFloor: '-',
      endTransport: '엘리베이터',
      homeSize: '20~30평대',
      movingDate: '상담 시 조율',
      movingTime: '상담 시 협의',
      customerName: name,
      customerPhone: phone,
      specialItems: [],
      memo: note || '카카오톡 채널/사진 견적 문의',
      estimatedRange: '유선/카톡 맞춤 안내',
      recommendedTruck: '맞춤 배차',
    };

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
  }, []);

  useEffect(() => {
    const seo = PAGE_SEO[activePage] || PAGE_SEO.home;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashToRoute();
      setActivePage(next.page);
      if (next.boardTab) setBoardTab(next.boardTab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback(
    (
      page: PageId,
      options?: { prefill?: QuotePrefill; anchorId?: string; boardTab?: BoardCategory }
    ) => {
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

      if (options?.boardTab) {
        setBoardTab(options.boardTab);
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
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        onTrackPhone={handleTrackPhone}
      />

      <main className="flex-1 w-full pt-16 sm:pt-20">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'company-certification' && (
          <CompanyCertificationPage
            onNavigate={handleNavigate}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'moving-services' && (
          <MovingServicesPage
            onNavigate={handleNavigate}
            initialAnchorId={serviceAnchorId}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'auspicious-calendar' && (
          <AuspiciousCalendarPage
            onNavigate={handleNavigate}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'work-gallery' && (
          <WorkGalleryPage
            onNavigate={handleNavigate}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'board' && (
          <BoardPage
            initialTab={boardTab}
            onNavigate={handleNavigate}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'location-contact' && (
          <LocationContactPage
            onNavigate={handleNavigate}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'instant-quote' && (
          <InstantQuotePage
            onNavigate={handleNavigate}
            prefill={quotePrefill}
            onOpenLegalModal={(tab) => setLegalTab(tab)}
            onOpenKakao={handleOpenKakao}
            onTrackPhone={handleTrackPhone}
          />
        )}
        {activePage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenLegalModal={(tab) => setLegalTab(tab)}
        onOpenKakao={handleOpenKakao}
        onTrackPhone={handleTrackPhone}
      />

      {/* Desktop Floating Direct Call & KakaoTalk Stack */}
      <div className="fixed bottom-5 right-5 z-40 hidden md:flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleOpenKakao}
          className="px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-on-surface shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 text-xs font-extrabold cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>카카오톡 문의</span>
        </button>
        <a
          href={`tel:${COMPANY_INFO.phoneMain}`}
          onClick={handleTrackPhone}
          className="px-5 py-3 rounded-full bg-inverse-surface hover:bg-on-background text-white shadow-xl transition-transform hover:scale-105 flex items-center gap-2 tabular-nums"
        >
          <PhoneCall className="w-4 h-4 text-primary-fixed" />
          <span className="text-sm font-bold">전화상담 {COMPANY_INFO.phoneMain}</span>
        </a>
      </div>

      {/* Mobile Bottom Sticky CTA Bar */}
      <MobileStickyBar
        onNavigate={(p) => handleNavigate(p)}
        onOpenKakao={handleOpenKakao}
        onTrackPhone={handleTrackPhone}
      />

      <KakaoConsultModal
        open={kakaoOpen}
        onClose={() => setKakaoOpen(false)}
        onNavigate={(p) => handleNavigate(p)}
        onSubmitQuickInquiry={handleSubmitKakaoInquiry}
      />

      <LegalModal tab={legalTab} onClose={() => setLegalTab(null)} />
    </div>
  );
}
