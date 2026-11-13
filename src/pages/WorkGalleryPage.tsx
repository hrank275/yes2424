import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageSquarePlus,
  Phone,
  Star,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { COMPANY_INFO, GALLERY_CASES, INITIAL_REVIEWS } from '../data/yesMovingData';
import { CustomerReview, GalleryCase, PageId, QuotePrefill } from '../types';
import { SafeImage } from '../components/SafeImage';

interface WorkGalleryPageProps {
  onNavigate: (page: PageId, options?: { prefill?: QuotePrefill }) => void;
}

type CategoryFilter =
  | '전체'
  | '가정포장이사'
  | '원룸·소형이사'
  | '기업·관공서'
  | '보관이사'
  | '사다리차·특수운반';

type RegionFilter = '전체' | '포항시' | '경주시' | '영덕군' | '울진군';

const CATEGORIES: CategoryFilter[] = [
  '전체',
  '가정포장이사',
  '원룸·소형이사',
  '기업·관공서',
  '보관이사',
  '사다리차·특수운반',
];

const REGIONS: RegionFilter[] = ['전체', '포항시', '경주시', '영덕군', '울진군'];

const REVIEWS_STORAGE_KEY = 'yesmoving_customer_reviews_v1';

export const WorkGalleryPage: React.FC<WorkGalleryPageProps> = ({ onNavigate }) => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('전체');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('전체');
  const [selectedCase, setSelectedCase] = useState<GalleryCase | null>(null);

  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revAuthor, setRevAuthor] = useState('');
  const [revRegion, setRevRegion] = useState<'포항시' | '경주시' | '영덕군' | '울진군'>('포항시');
  const [revRoute, setRevRoute] = useState('');
  const [revService, setRevService] = useState('프리미엄 포장이사');
  const [revHeadline, setRevHeadline] = useState('');
  const [revContent, setRevContent] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revNotice, setRevNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CustomerReview[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...INITIAL_REVIEWS]);
        }
      }
    } catch {
      // Ignore storage parse failure
    }
  }, []);

  const filteredCases = useMemo(() => {
    return GALLERY_CASES.filter((item) => {
      const matchCat = categoryFilter === '전체' || item.category === categoryFilter;
      const matchReg = regionFilter === '전체' || item.region === regionFilter;
      return matchCat && matchReg;
    });
  }, [categoryFilter, regionFilter]);

  const filteredReviews = useMemo(() => {
    if (regionFilter === '전체') return reviews;
    return reviews.filter((r) => r.region === regionFilter);
  }, [reviews, regionFilter]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revHeadline.trim() || !revContent.trim()) {
      setRevNotice('작성자명, 한줄 제목, 후기 내용을 모두 입력해 주세요.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(today.getDate()).padStart(2, '0')}`;

    const newReview: CustomerReview = {
      id: `user-rev-${Date.now()}`,
      author: revAuthor.trim(),
      region: revRegion,
      route: revRoute.trim() || `${revRegion} 일대`,
      serviceType: revService,
      headline: `"${revHeadline.trim().replace(/^"|"$/g, '')}"`,
      content: revContent.trim(),
      date: dateStr,
      rating: revRating,
    };

    try {
      const existingRaw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      const existing = existingRaw ? (JSON.parse(existingRaw) as CustomerReview[]) : [];
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify([newReview, ...existing]));
    } catch {
      // Ignore storage errors
    }

    setReviews((prev) => [newReview, ...prev]);
    setRevAuthor('');
    setRevRoute('');
    setRevHeadline('');
    setRevContent('');
    setRevRating(5);
    setShowReviewForm(false);
    setRevNotice('소중한 이용 후기가 등록되었습니다. 감사합니다!');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-container-low py-12 lg:py-16 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-badge-certified-blue mb-2">
                포항 · 경주 · 영덕 · 울진 작업 실사 포트폴리오
              </div>
              <h1 className="text-3xl sm:text-4xl text-on-surface font-black tracking-tight mb-3">
                생생한 작업 현장 갤러리 & 고객 후기
              </h1>
              <p className="text-sm sm:text-base text-slate-text-muted leading-relaxed">
                바닥 이중 보양재 시공부터 대형 가전 포장, 고층 사다리차 양중, 항온항습 보관창고까지
                예스이사 직영팀이 직접 진행한 실제 현장 기록을 확인해 보세요.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-surface-container-lowest p-4 rounded-xl border border-brand-border tabular-nums shrink-0">
              <div>
                <div className="text-xs text-slate-text-muted">누적 시공 건수</div>
                <div className="text-2xl font-black text-on-surface">14,800+</div>
              </div>
              <div className="h-9 w-px bg-brand-border" />
              <div>
                <div className="text-xs text-slate-text-muted">평균 만족도</div>
                <div className="text-2xl font-black text-primary">99.4%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="w-full bg-surface border-b border-brand-border sticky top-18 sm:top-20 z-30">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container-low border border-brand-border shrink-0 overflow-x-auto">
            {REGIONS.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  regionFilter === reg
                    ? 'bg-white text-badge-certified-blue shadow-sm'
                    : 'text-slate-text-muted hover:text-on-surface'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full py-12 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6 text-xs text-slate-text-muted">
            <span>
              검색된 작업 현장 <strong className="text-on-surface tabular-nums">{filteredCases.length}</strong>건
            </span>
            <span>카드를 클릭하면 상세 작업 리포트를 보실 수 있습니다</span>
          </div>

          {filteredCases.length === 0 ? (
            <div className="p-12 rounded-2xl bg-surface-container-lowest border border-brand-border text-center">
              <p className="text-sm text-slate-text-muted mb-4">
                선택하신 조건에 해당하는 작업 현장 사례가 없습니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('전체');
                  setRegionFilter('전체');
                }}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-brand-border hover:shadow-md transition-all flex flex-col cursor-pointer group"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <SafeImage
                      src={item.image}
                      fallbackSrc={item.fallbackImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-4">
                      <span className="text-xs font-bold text-white">
                        {item.category} · {item.region}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-text-muted mb-1 tabular-nums">
                        {item.date} · {item.route}
                      </div>
                      <h2 className="text-base font-extrabold text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-text-muted leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="truncate">{item.truckInfo}</span>
                      <span className="text-primary font-bold shrink-0 ml-2">상세보기</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="w-full py-14 bg-surface-container-low border-t border-brand-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold text-primary mb-1">고객 생생 후기</div>
              <h2 className="text-2xl sm:text-3xl font-black text-on-surface">
                예스이사를 이용하신 고객님들의 이야기
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm((prev) => !prev);
                setRevNotice(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-inverse-surface hover:bg-on-background text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showReviewForm ? '작성 닫기' : '이용 후기 작성하기'}</span>
            </button>
          </div>

          {revNotice && (
            <div className="mb-6 p-4 rounded-xl bg-badge-certified-bg text-badge-certified-blue text-xs font-bold flex items-center justify-between">
              <span>{revNotice}</span>
              <button
                type="button"
                onClick={() => setRevNotice(null)}
                className="text-xs underline cursor-pointer"
              >
                닫기
              </button>
            </div>
          )}

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-6 rounded-2xl bg-surface-container-lowest border border-brand-border grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">작성자 성함 *</label>
                <input
                  type="text"
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  placeholder="예: 김*수 님"
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">지역</label>
                  <select
                    value={revRegion}
                    onChange={(e) =>
                      setRevRegion(
                        e.target.value as '포항시' | '경주시' | '영덕군' | '울진군'
                      )
                    }
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  >
                    <option value="포항시">포항시</option>
                    <option value="경주시">경주시</option>
                    <option value="영덕군">영덕군</option>
                    <option value="울진군">울진군</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">평점</label>
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  >
                    <option value={5}>5점 (매우 만족)</option>
                    <option value={4}>4점 (만족)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">이사 구간 (선택)</label>
                <input
                  type="text"
                  value={revRoute}
                  onChange={(e) => setRevRoute(e.target.value)}
                  placeholder="예: 포항 양덕동 → 장성동"
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">이용 서비스</label>
                <select
                  value={revService}
                  onChange={(e) => setRevService(e.target.value)}
                  className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                >
                  <option value="프리미엄 포장이사">프리미엄 포장이사</option>
                  <option value="실속 일반이사">실속 일반이사</option>
                  <option value="원룸·용달 소형이사">원룸·용달 소형이사</option>
                  <option value="기업·관공서 이사">기업·관공서 이사</option>
                  <option value="안심 보관이사">안심 보관이사</option>
                </select>
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">후기 제목 *</label>
                <input
                  type="text"
                  value={revHeadline}
                  onChange={(e) => setRevHeadline(e.target.value)}
                  placeholder="예: 추가금 없이 정말 꼼꼼하게 정리해주셨습니다"
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">상세 후기 *</label>
                <textarea
                  rows={3}
                  value={revContent}
                  onChange={(e) => setRevContent(e.target.value)}
                  placeholder="이사 진행 과정, 포장 상태, 기사님 친절도 등 경험을 공유해 주세요."
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm resize-none"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2.5 rounded-lg bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-xs font-bold text-white cursor-pointer"
                >
                  후기 등록하기
                </button>
              </div>
            </form>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-text-muted font-medium">
                      {rev.route} · {rev.serviceType}
                    </span>
                    <div className="flex text-tertiary gap-0.5 shrink-0">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-tertiary" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">{rev.headline}</h3>
                  <p className="text-sm text-slate-text-muted leading-relaxed">{rev.content}</p>
                </div>
                <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-text-muted tabular-nums">
                  <span>작성자: {rev.author}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl overflow-hidden border border-brand-border shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-surface-container-low border-b border-brand-border flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-badge-certified-blue">
                  {selectedCase.category} · {selectedCase.region}
                </div>
                <h3 className="text-lg font-black text-on-surface mt-0.5">{selectedCase.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                aria-label="닫기"
                className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5">
              <div className="rounded-xl overflow-hidden h-64 border border-brand-border">
                <SafeImage
                  src={selectedCase.image}
                  fallbackSrc={selectedCase.fallbackImage}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <div className="text-slate-text-muted">이동 구간</div>
                    <div className="font-bold text-on-surface">{selectedCase.route}</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-2">
                  <Truck className="w-4 h-4 text-badge-certified-blue shrink-0" />
                  <div>
                    <div className="text-slate-text-muted">투입 차량</div>
                    <div className="font-bold text-on-surface">{selectedCase.truckInfo}</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary shrink-0" />
                  <div>
                    <div className="text-slate-text-muted">투입 인력</div>
                    <div className="font-bold text-on-surface">{selectedCase.crewInfo}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-on-surface mb-2">주요 시공 체크리스트</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-on-surface-variant">
                  {selectedCase.highlights.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-safety-green shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface">
                <div className="font-bold mb-1">고객 한마디 ({selectedCase.customerName})</div>
                <p className="text-slate-text-muted leading-relaxed">
                  "{selectedCase.customerComment}"
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-brand-border bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
              <a
                href={`tel:${COMPANY_INFO.phoneMain}`}
                className="inline-flex items-center gap-1.5 text-sm font-black text-primary tabular-nums"
              >
                <Phone className="w-4 h-4" />
                <span>{COMPANY_INFO.phoneMain} 전화상담</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSelectedCase(null);
                  onNavigate('instant-quote');
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold cursor-pointer"
              >
                <span>비슷한 조건으로 견적 신청</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
