import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  FileText,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { INITIAL_BOARD_POSTS } from '../data/boardData';
import { INITIAL_REVIEWS, LOCAL_IMAGES } from '../data/yesMovingData';
import {
  BoardCategory,
  BoardPost,
  CustomerReview,
  InquiryStatus,
  PageId,
  QuoteSubmission,
} from '../types';

interface AdminPageProps {
  onNavigate: (page: PageId, options?: { boardTab?: BoardCategory }) => void;
}

const QUOTES_STORAGE_KEY = 'yesmoving_quote_submissions_v1';
const BOARD_STORAGE_KEY = 'yesmoving_board_posts_v1';
const REVIEWS_STORAGE_KEY = 'yesmoving_customer_reviews_v1';
const METRICS_STORAGE_KEY = 'yesmoving_conversion_metrics_v1';

interface ConversionMetrics {
  phoneClicks: number;
  kakaoClicks: number;
}

const STATUS_OPTIONS: InquiryStatus[] = [
  '접수대기',
  '상담완료',
  '방문실측예정',
  '계약확정',
];

function normalizeQuotes(items: Partial<QuoteSubmission>[]): QuoteSubmission[] {
  return items.map((item, idx) => ({
    id: item.id || `Q-LEG-${idx}`,
    createdAt: item.createdAt || '최근 접수',
    status: item.status || '접수대기',
    source: item.source || '견적신청',
    movingType: item.movingType || '가정포장이사',
    startRegion: item.startRegion || '포항시 북구',
    startDetail: item.startDetail || '-',
    startHousing: item.startHousing || '아파트',
    startFloor: item.startFloor || '-',
    startTransport: item.startTransport || '엘리베이터',
    endRegion: item.endRegion || '포항시 남구',
    endDetail: item.endDetail || '-',
    endHousing: item.endHousing || '아파트',
    endFloor: item.endFloor || '-',
    endTransport: item.endTransport || '엘리베이터',
    homeSize: item.homeSize || '20~30평대',
    movingDate: item.movingDate || '-',
    movingTime: item.movingTime || '상담 시 협의',
    customerName: item.customerName || '미입력',
    customerPhone: item.customerPhone || '-',
    specialItems: Array.isArray(item.specialItems) ? item.specialItems : [],
    memo: item.memo || '',
    estimatedRange: item.estimatedRange || '방문 실측 후 확정',
    recommendedTruck: item.recommendedTruck || '맞춤 배차',
  }));
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'boards'>('inquiries');

  // Inquiries State
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'전체' | InquiryStatus>('전체');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Board Posts State
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>(INITIAL_BOARD_POSTS);
  const [boardFilter, setBoardFilter] = useState<'전체' | BoardCategory>('전체');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [postBoardType, setPostBoardType] = useState<BoardCategory>('공지사항');
  const [postCategory, setPostCategory] = useState('배차안내');
  const [postTitle, setPostTitle] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postKeywords, setPostKeywords] = useState('포항이사, 이사 상담, 이사 추천');
  const [postBody, setPostBody] = useState('');
  const [postNotice, setPostNotice] = useState<string | null>(null);

  // Reviews & Conversion Metrics
  const [reviewsCount, setReviewsCount] = useState(INITIAL_REVIEWS.length);
  const [metrics, setMetrics] = useState<ConversionMetrics>({ phoneClicks: 0, kakaoClicks: 0 });

  useEffect(() => {
    try {
      const qRaw = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (qRaw) {
        const parsed = JSON.parse(qRaw) as Partial<QuoteSubmission>[];
        if (Array.isArray(parsed)) setQuotes(normalizeQuotes(parsed));
      }
    } catch {
      // Ignore
    }

    try {
      const bRaw = localStorage.getItem(BOARD_STORAGE_KEY);
      if (bRaw) {
        const parsed = JSON.parse(bRaw) as BoardPost[];
        if (Array.isArray(parsed) && parsed.length > 0) setBoardPosts(parsed);
      }
    } catch {
      // Ignore
    }

    try {
      const rRaw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (rRaw) {
        const parsed = JSON.parse(rRaw) as CustomerReview[];
        if (Array.isArray(parsed)) setReviewsCount(INITIAL_REVIEWS.length + parsed.length);
      }
    } catch {
      // Ignore
    }

    try {
      const mRaw = localStorage.getItem(METRICS_STORAGE_KEY);
      if (mRaw) {
        const parsed = JSON.parse(mRaw) as Partial<ConversionMetrics>;
        setMetrics({
          phoneClicks: parsed.phoneClicks || 0,
          kakaoClicks: parsed.kakaoClicks || 0,
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistQuotes = (next: QuoteSubmission[]) => {
    setQuotes(next);
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const persistBoards = (next: BoardPost[]) => {
    setBoardPosts(next);
    try {
      localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const handleUpdateStatus = (id: string, nextStatus: InquiryStatus) => {
    const next = quotes.map((q) => (q.id === id ? { ...q, status: nextStatus } : q));
    persistQuotes(next);
  };

  const handleDeleteQuote = (id: string) => {
    persistQuotes(quotes.filter((q) => q.id !== id));
  };

  const handleTogglePublish = (id: string) => {
    const next = boardPosts.map((p) =>
      p.id === id ? { ...p, isPublished: !p.isPublished } : p
    );
    persistBoards(next);
  };

  const handleDeletePost = (id: string) => {
    persistBoards(boardPosts.filter((p) => p.id !== id));
  };

  const handleResetBoards = () => {
    persistBoards(INITIAL_BOARD_POSTS);
    setPostNotice('기본 공지·후기·SEO 칼럼·자료실 콘텐츠로 초기화되었습니다.');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postSummary.trim() || !postBody.trim()) {
      setPostNotice('제목, 요약 설명, 본문 내용을 모두 입력해 주세요.');
      return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const newPost: BoardPost = {
      id: `custom-${Date.now()}`,
      boardType: postBoardType,
      category: postCategory.trim() || postBoardType,
      title: postTitle.trim(),
      summary: postSummary.trim(),
      content: postBody
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      image:
        postBoardType === '자료실'
          ? LOCAL_IMAGES.officeStorage
          : LOCAL_IMAGES.heroPohang,
      date: dateStr,
      author: '예스이사 관리자',
      seoKeywords: postKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      isPublished: true,
    };

    persistBoards([newPost, ...boardPosts]);
    setPostTitle('');
    setPostSummary('');
    setPostBody('');
    setShowNewPostForm(false);
    setPostNotice(`[${postBoardType}] 새 게시글이 즉시 공개 발행되었습니다.`);
  };

  const filteredQuotes = useMemo(() => {
    if (statusFilter === '전체') return quotes;
    return quotes.filter((q) => q.status === statusFilter);
  }, [quotes, statusFilter]);

  const filteredBoards = useMemo(() => {
    if (boardFilter === '전체') return boardPosts;
    return boardPosts.filter((p) => p.boardType === boardFilter);
  }, [boardPosts, boardFilter]);

  const pendingCount = quotes.filter((q) => q.status === '접수대기').length;
  const confirmedCount = quotes.filter((q) => q.status === '계약확정').length;
  const publishedSeoCount = boardPosts.filter(
    (p) => p.isPublished && p.boardType === '칼럼'
  ).length;

  return (
    <div className="flex flex-col w-full bg-surface-container-low min-h-[80vh]">
      {/* Header Banner */}
      <section className="w-full bg-surface border-b border-brand-border py-10 lg:py-12">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-primary mb-1">
                예스이사 운영 · 전환 · 콘텐츠 관리 콘솔
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                관리자 운영 대시보드
              </h1>
              <p className="text-xs sm:text-sm text-slate-text-muted mt-1">
                고객 문의·방문 실측 예약 상태 관리, 5대 게시판 및 SEO/GEO 칼럼 발행을 실시간으로
                제어합니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('board', { boardTab: '칼럼' })}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
              >
                공개 게시판 미리보기
              </button>
              <button
                type="button"
                onClick={() => onNavigate('instant-quote')}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
              >
                견적 신청 페이지
              </button>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 tabular-nums">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-brand-border">
              <div className="text-xs text-slate-text-muted mb-1">누적 상담·견적 접수</div>
              <div className="text-2xl font-black text-on-surface">{quotes.length}건</div>
              <div className="text-[11px] text-primary font-semibold mt-1">
                접수대기 {pendingCount}건 · 계약확정 {confirmedCount}건
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-brand-border">
              <div className="text-xs text-slate-text-muted mb-1">전화 · 카톡 상담 클릭</div>
              <div className="text-2xl font-black text-badge-certified-blue">
                {metrics.phoneClicks + metrics.kakaoClicks}회
              </div>
              <div className="text-[11px] text-slate-text-muted mt-1">
                전화 {metrics.phoneClicks}회 · 카톡 {metrics.kakaoClicks}회
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-brand-border">
              <div className="text-xs text-slate-text-muted mb-1">발행 SEO 칼럼 / 게시판</div>
              <div className="text-2xl font-black text-safety-green">
                {publishedSeoCount} / {boardPosts.filter((p) => p.isPublished).length}개
              </div>
              <div className="text-[11px] text-slate-text-muted mt-1">
                포항·영덕·울진 SEO 콘텐츠 운영중
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-brand-border">
              <div className="text-xs text-slate-text-muted mb-1">등록된 고객 후기</div>
              <div className="text-2xl font-black text-on-surface">{reviewsCount}건</div>
              <div className="text-[11px] text-tertiary font-semibold mt-1">
                평균 만족도 99.4% 유지
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Tabs & Content */}
      <section className="max-w-[1200px] mx-auto w-full px-4 lg:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-inverse-surface text-white'
                : 'bg-surface-container-lowest border border-brand-border text-on-surface hover:bg-surface-container'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>상담·견적 접수 관리 ({quotes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('boards')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
              activeTab === 'boards'
                ? 'bg-inverse-surface text-white'
                : 'bg-surface-container-lowest border border-brand-border text-on-surface hover:bg-surface-container'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>게시판 · SEO 콘텐츠 관리 ({boardPosts.length})</span>
          </button>
        </div>

        {activeTab === 'inquiries' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['전체', ...STATUS_OPTIONS] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                      statusFilter === st
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-lowest border border-brand-border text-on-surface'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-text-muted">
                견적신청, 방문상담, 카카오톡 빠른상담 내역이 통합 관리됩니다.
              </span>
            </div>

            {filteredQuotes.length === 0 ? (
              <div className="p-12 rounded-2xl bg-surface-container-lowest border border-brand-border text-center space-y-3">
                <p className="text-sm text-slate-text-muted">
                  해당 상태의 접수 내역이 아직 없습니다. 견적신청 또는 간편상담을 통해 테스트 접수를
                  진행해 보세요.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('instant-quote')}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
                >
                  견적신청 폼 열기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuotes.map((q) => {
                  const isExpanded = expandedId === q.id;
                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl bg-surface-container-lowest border border-brand-border p-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-black text-primary tabular-nums">{q.id}</span>
                            <span className="text-slate-text-muted">·</span>
                            <span className="font-bold text-badge-certified-blue">{q.source}</span>
                            <span className="text-slate-text-muted">·</span>
                            <span className="text-slate-text-muted tabular-nums">
                              접수: {q.createdAt}
                            </span>
                          </div>
                          <div className="text-base font-extrabold text-on-surface">
                            {q.customerName} 님 ·{' '}
                            <a
                              href={`tel:${q.customerPhone}`}
                              className="text-primary hover:underline tabular-nums inline-flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {q.customerPhone}
                            </a>
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            {q.movingType} ({q.homeSize}) · {q.startRegion} → {q.endRegion} ·
                            희망일{' '}
                            <span className="font-bold tabular-nums">{q.movingDate}</span> · 예상{' '}
                            <span className="font-bold text-primary tabular-nums">
                              {q.estimatedRange}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <select
                            value={q.status}
                            onChange={(e) =>
                              handleUpdateStatus(q.id, e.target.value as InquiryStatus)
                            }
                            aria-label="상담 상태 변경"
                            className="px-3 py-2 rounded-lg bg-surface-container-low border border-brand-border text-xs font-bold text-on-surface"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : q.id)}
                            className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
                          >
                            {isExpanded ? '상세닫기' : '상세보기'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuote(q.id)}
                            aria-label="삭제"
                            className="p-2 rounded-lg bg-surface-container hover:bg-primary/10 text-slate-text-muted hover:text-primary cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-on-surface-variant">
                          <div className="p-3 rounded-xl bg-surface-container-low">
                            <div className="font-bold text-on-surface mb-1">출발지 상세</div>
                            <div>
                              {q.startRegion} {q.startDetail}
                            </div>
                            <div className="text-slate-text-muted mt-0.5">
                              {q.startHousing} · {q.startFloor} · {q.startTransport}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-surface-container-low">
                            <div className="font-bold text-on-surface mb-1">도착지 상세</div>
                            <div>
                              {q.endRegion} {q.endDetail}
                            </div>
                            <div className="text-slate-text-muted mt-0.5">
                              {q.endHousing} · {q.endFloor} · {q.endTransport}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-surface-container-low">
                            <div className="font-bold text-on-surface mb-1">추천 배차 · 메모</div>
                            <div>차량: {q.recommendedTruck}</div>
                            {q.specialItems.length > 0 && (
                              <div className="text-primary mt-0.5">
                                특수품목: {q.specialItems.join(', ')}
                              </div>
                            )}
                            {q.memo && <div className="text-slate-text-muted mt-0.5">{q.memo}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {postNotice && (
              <div className="p-4 rounded-xl bg-badge-certified-bg text-badge-certified-blue text-xs font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {postNotice}
                </span>
                <button
                  type="button"
                  onClick={() => setPostNotice(null)}
                  className="underline cursor-pointer"
                >
                  닫기
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['전체', '공지사항', '고객후기', '칼럼', '자료실'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBoardFilter(b)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                      boardFilter === b
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-lowest border border-brand-border text-on-surface'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetBoards}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-brand-border text-xs font-bold text-slate-text-muted hover:text-on-surface cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>기본 데이터 복원</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showNewPostForm ? '작성 닫기' : '새 게시글 · SEO 칼럼 발행'}</span>
                </button>
              </div>
            </div>

            {showNewPostForm && (
              <form
                onSubmit={handleCreatePost}
                className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">게시판 구분</label>
                  <select
                    value={postBoardType}
                    onChange={(e) => setPostBoardType(e.target.value as BoardCategory)}
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  >
                    <option value="공지사항">공지사항</option>
                    <option value="고객후기">고객후기</option>
                    <option value="칼럼">칼럼 (SEO/GEO)</option>
                    <option value="자료실">자료실</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">세부 말머리</label>
                  <input
                    type="text"
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    placeholder="예: 포항이사 가이드, 배차안내"
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">게시글 제목 *</label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="예: [포항이사] 봄 성수기 포장이사 사전 예약 할인 안내"
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">핵심 요약 *</label>
                  <input
                    type="text"
                    value={postSummary}
                    onChange={(e) => setPostSummary(e.target.value)}
                    placeholder="목록 카드 및 메타 요약에 노출될 1~2문장을 입력하세요."
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    SEO 키워드 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={postKeywords}
                    onChange={(e) => setPostKeywords(e.target.value)}
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    본문 내용 (줄바꿈으로 문단 구분) *
                  </label>
                  <textarea
                    rows={4}
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    placeholder="상세 본문 내용을 입력하세요."
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-sm resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-4 py-2.5 rounded-lg bg-surface-container text-xs font-bold cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                  >
                    즉시 발행하기
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {filteredBoards.map((post) => (
                <div
                  key={post.id}
                  className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-badge-certified-blue">{post.boardType}</span>
                      <span className="text-slate-text-muted">·</span>
                      <span className="text-on-surface-variant">{post.category}</span>
                      <span className="text-slate-text-muted">·</span>
                      <span className="text-slate-text-muted tabular-nums">{post.date}</span>
                      <span className="text-slate-text-muted">·</span>
                      <span
                        className={`font-bold ${
                          post.isPublished ? 'text-safety-green' : 'text-slate-text-muted'
                        }`}
                      >
                        {post.isPublished ? '공개중' : '비공개'}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-on-surface truncate">
                      {post.title}
                    </div>
                    <div className="text-xs text-slate-text-muted truncate">{post.summary}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(post.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
                    >
                      {post.isPublished ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-text-muted" />
                          <span>비공개 전환</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-safety-green" />
                          <span>공개 전환</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      aria-label="삭제"
                      className="p-2 rounded-lg bg-surface-container hover:bg-primary/10 text-slate-text-muted hover:text-primary cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
