import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  Megaphone,
  MessageCircle,
  MessageSquarePlus,
  Phone,
  Search,
  Star,
} from 'lucide-react';
import { INITIAL_BOARD_POSTS } from '../data/boardData';
import { COMPANY_INFO, CORE_FAQS, INITIAL_REVIEWS } from '../data/yesMovingData';
import { BoardCategory, BoardPost, CustomerReview, FaqItem, PageId } from '../types';
import { SafeImage } from '../components/SafeImage';

interface BoardPageProps {
  initialTab?: BoardCategory;
  onNavigate: (page: PageId) => void;
  onOpenKakao: () => void;
  onTrackPhone: () => void;
}

const BOARD_STORAGE_KEY = 'yesmoving_board_posts_v1';
const REVIEWS_STORAGE_KEY = 'yesmoving_customer_reviews_v1';

const BOARD_TABS: {
  id: BoardCategory;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: '공지사항',
    label: '공지사항',
    desc: '배차 · 관공서·학교 이전 · 계절별 안전 시공 안내',
    icon: <Megaphone className="w-4 h-4" />,
  },
  {
    id: '고객후기',
    label: '고객후기',
    desc: '포항·경주·영덕·울진 실제 이용 고객 후기 및 사례 리포트',
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: 'FAQ',
    label: '자주 묻는 질문 (FAQ)',
    desc: '이사 상담·비용·지역·예약 전 핵심 궁금증 10선',
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    id: '칼럼',
    label: '이사 가이드 칼럼',
    desc: '포항이사·영덕이사·울진이사 실패 없는 선택 체크포인트 10선',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: '자료실',
    label: '자료실',
    desc: '이사 D-30 체크리스트 · 관공서·학교 인허가 요약서 다운로드',
    icon: <FileText className="w-4 h-4" />,
  },
];

const FAQ_CATEGORIES: ('전체' | FaqItem['category'])[] = [
  '전체',
  '상담/견적',
  '이사 비용',
  '서비스/지역',
  '예약/준비',
];

export const BoardPage: React.FC<BoardPageProps> = ({
  initialTab = '공지사항',
  onNavigate,
  onOpenKakao,
  onTrackPhone,
}) => {
  const [activeTab, setActiveTab] = useState<BoardCategory>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // FAQ Interactive State
  const [faqCategory, setFaqCategory] = useState<'전체' | FaqItem['category']>('전체');
  const [openFaqId, setOpenFaqId] = useState<string | null>(CORE_FAQS[0]?.id || null);

  // Custom posts from Admin (localStorage)
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>(INITIAL_BOARD_POSTS);

  // Customer Reviews (for 고객후기 tab)
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
    setActiveTab(initialTab);
    setSelectedPostId(null);
  }, [initialTab]);

  useEffect(() => {
    try {
      const savedPostsRaw = localStorage.getItem(BOARD_STORAGE_KEY);
      if (savedPostsRaw) {
        const parsed = JSON.parse(savedPostsRaw) as BoardPost[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBoardPosts(parsed);
        }
      }
    } catch {
      // Keep INITIAL_BOARD_POSTS
    }

    try {
      const savedRevRaw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (savedRevRaw) {
        const parsed = JSON.parse(savedRevRaw) as CustomerReview[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...INITIAL_REVIEWS]);
        }
      }
    } catch {
      // Keep INITIAL_REVIEWS
    }
  }, []);

  const currentTabPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return boardPosts
      .filter((p) => p.isPublished && p.boardType === activeTab)
      .filter((p) => {
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.seoKeywords.some((k) => k.toLowerCase().includes(q))
        );
      });
  }, [boardPosts, activeTab, searchQuery]);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CORE_FAQS.filter((faq) => {
      const matchCat = faqCategory === '전체' || faq.category === faqCategory;
      const matchQ =
        !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [faqCategory, searchQuery]);

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.headline.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q) ||
        r.route.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q)
    );
  }, [reviews, searchQuery]);

  const selectedPost = useMemo(
    () => currentTabPosts.find((p) => p.id === selectedPostId) || null,
    [currentTabPosts, selectedPostId]
  );

  const selectedPostIndex = useMemo(
    () => (selectedPost ? currentTabPosts.findIndex((p) => p.id === selectedPost.id) : -1),
    [currentTabPosts, selectedPost]
  );

  const prevPost = selectedPostIndex > 0 ? currentTabPosts[selectedPostIndex - 1] : null;
  const nextPost =
    selectedPostIndex >= 0 && selectedPostIndex < currentTabPosts.length - 1
      ? currentTabPosts[selectedPostIndex + 1]
      : null;

  const activeTabMeta = BOARD_TABS.find((t) => t.id === activeTab) || BOARD_TABS[0];

  const handleDownloadText = (post: BoardPost) => {
    const text =
      post.downloadText ||
      `${post.title}\n\n${post.summary}\n\n${post.content.join('\n\n')}\n\n문의: ${
        COMPANY_INFO.name
      } (${COMPANY_INFO.phoneMain})`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${post.id}_yesmoving.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
      // Ignore storage error
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
      {/* Header Banner */}
      <section className="w-full bg-surface-container-low py-12 lg:py-16 border-b border-brand-border/60">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-badge-certified-blue mb-2">
                포항 · 경주 · 영덕 · 울진 고객 정보 센터
              </div>
              <h1 className="text-3xl sm:text-4xl text-on-surface font-black tracking-tight mb-3">
                예스이사 커뮤니티 · 고객후기 · 이사 정보
              </h1>
              <p className="text-sm sm:text-base text-slate-text-muted leading-relaxed">
                공지사항, 실제 이용 고객후기, 자주 묻는 질문(FAQ 10선), 포항이사·영덕이사·울진이사
                선택 가이드 칼럼과 준비 체크리스트 자료실을 한곳에서 확인하세요.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full lg:w-80 relative shrink-0">
              <Search className="w-4 h-4 text-slate-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedPostId(null);
                }}
                placeholder="포항이사, 비용, 후기 등 검색..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-brand-border text-sm text-on-surface focus:outline-2 focus:outline-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5 Board Tabs Bar */}
      <section className="w-full bg-surface border-b border-brand-border sticky top-16 sm:top-20 z-30">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {BOARD_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedPostId(null);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Board Body */}
      <section className="w-full py-10 lg:py-14 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          {/* Active Tab Header */}
          {!selectedPost && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-brand-border">
              <div>
                <h2 className="text-2xl font-black text-on-surface">{activeTabMeta.label}</h2>
                <p className="text-xs sm:text-sm text-slate-text-muted mt-1">
                  {activeTabMeta.desc}
                </p>
              </div>
              {activeTab === '고객후기' && (
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
              )}
            </div>
          )}

          {/* DETAIL VIEW FOR SELECTED ARTICLE */}
          {selectedPost ? (
            <article className="bg-surface-container-lowest rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-brand-border bg-surface-container-low/60">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPostId(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface hover:text-primary cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{activeTab} 목록으로 돌아가기</span>
                  </button>
                  <div className="text-xs text-slate-text-muted tabular-nums">
                    {selectedPost.category} · {selectedPost.date} · {selectedPost.author}
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-on-surface leading-snug">
                  {selectedPost.title}
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
                  {selectedPost.summary}
                </p>

                {selectedPost.seoKeywords.length > 0 && (
                  <div className="mt-4 text-xs font-semibold text-badge-certified-blue">
                    관련 키워드: {selectedPost.seoKeywords.join(' · ')}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="rounded-xl overflow-hidden max-h-[420px] border border-brand-border">
                  <SafeImage
                    src={selectedPost.image}
                    fallbackSrc={selectedPost.fallbackImage}
                    alt={selectedPost.title}
                    className="w-full h-full max-h-[420px] object-cover"
                  />
                </div>

                <div className="space-y-4 text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {selectedPost.content.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Resource Download Box for 자료실 or posts with downloadText */}
                {selectedPost.downloadText && (
                  <div className="p-5 rounded-xl bg-badge-certified-bg border border-badge-certified-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-on-surface">
                        첨부 자료 파일 다운로드 (.txt)
                      </div>
                      <div className="text-xs text-slate-text-muted mt-0.5">
                        체크리스트 및 공식 안내문을 텍스트 문서로 즉시 내려받으실 수 있습니다.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadText(selectedPost)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-badge-certified-blue hover:opacity-90 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>자료 파일 다운로드</span>
                    </button>
                  </div>
                )}

                {/* Conversion CTA Banner Inside Article */}
                <div className="p-6 rounded-2xl bg-surface-container-low border border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
                  <div>
                    <div className="text-xs font-bold text-primary mb-1">
                      포항 · 경주 · 영덕 · 울진 직영 상담
                    </div>
                    <div className="text-base sm:text-lg font-black text-on-surface">
                      이사 일정·비용이 궁금하시다면 바로 상담받아 보세요
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <a
                      href={`tel:${COMPANY_INFO.phoneMain}`}
                      onClick={onTrackPhone}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold tabular-nums"
                    >
                      <Phone className="w-4 h-4" />
                      <span>전화상담 {COMPANY_INFO.phoneMain}</span>
                    </a>
                    <button
                      type="button"
                      onClick={onOpenKakao}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 text-on-surface text-xs font-bold cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>카카오톡 문의</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('instant-quote')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-inverse-surface text-white text-xs font-bold cursor-pointer"
                    >
                      <span>상담 문의하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prev / Next Navigation */}
                <div className="pt-6 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {prevPost ? (
                    <button
                      type="button"
                      onClick={() => setSelectedPostId(prevPost.id)}
                      className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border text-left cursor-pointer transition-colors"
                    >
                      <div className="text-slate-text-muted flex items-center gap-1 mb-1">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>이전 글</span>
                      </div>
                      <div className="font-bold text-on-surface line-clamp-1">{prevPost.title}</div>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-container-low/50 border border-brand-border/50 text-slate-text-muted">
                      이전 글이 없습니다.
                    </div>
                  )}

                  {nextPost ? (
                    <button
                      type="button"
                      onClick={() => setSelectedPostId(nextPost.id)}
                      className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-brand-border text-right cursor-pointer transition-colors"
                    >
                      <div className="text-slate-text-muted inline-flex items-center justify-end gap-1 mb-1 w-full">
                        <span>다음 글</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-bold text-on-surface line-clamp-1">{nextPost.title}</div>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-container-low/50 border border-brand-border/50 text-slate-text-muted text-right">
                      다음 글이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </article>
          ) : activeTab === 'FAQ' ? (
            /* FAQ TAB */
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFaqCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      faqCategory === cat
                        ? 'bg-inverse-surface text-white'
                        : 'bg-surface-container-lowest border border-brand-border text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="p-12 rounded-2xl bg-surface-container-lowest border border-brand-border text-center text-sm text-slate-text-muted">
                  검색 조건에 맞는 질문이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-2xl bg-surface-container-lowest border border-brand-border overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          aria-expanded={isOpen}
                          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <span className="text-xs font-black text-primary tabular-nums shrink-0 mt-0.5 sm:mt-0">
                              Q{String(idx + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <span className="text-[11px] font-bold text-badge-certified-blue block sm:inline sm:mr-2">
                                {faq.category}
                              </span>
                              <span className="text-sm sm:text-base font-bold text-on-surface">
                                {faq.question}
                              </span>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-text-muted shrink-0 transition-transform ${
                              isOpen ? 'rotate-180 text-primary' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-on-surface-variant leading-relaxed border-t border-brand-border/60 bg-surface-container-low/40">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ARTICLE CARD LIST (+ Review Section when activeTab === '고객후기') */
            <div className="space-y-12">
              {activeTab === '고객후기' && (
                <div className="space-y-6">
                  {revNotice && (
                    <div className="p-4 rounded-xl bg-badge-certified-bg text-badge-certified-blue text-xs font-bold flex items-center justify-between">
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

                  {showReviewForm && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border grid grid-cols-1 md:grid-cols-2 gap-4"
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
                        <label className="text-xs font-bold text-on-surface">이사 구간</label>
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
                          <option value="관공서·학교·기업 이사">관공서·학교·기업 이사</option>
                          <option value="실속 일반이사">실속 일반이사</option>
                          <option value="원룸·용달 소형이사">원룸·용달 소형이사</option>
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
                          placeholder="작업 과정과 친절도, 만족하신 점을 남겨주세요."
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

                  {/* Quick Customer Reviews Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-6 rounded-2xl bg-surface-container-lowest border border-brand-border flex flex-col justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-3">
                            <span className="text-slate-text-muted font-semibold">
                              {rev.route} · {rev.serviceType}
                            </span>
                            <div className="flex text-tertiary gap-0.5 shrink-0">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-tertiary" />
                              ))}
                            </div>
                          </div>
                          <h3 className="text-base font-bold text-on-surface mb-2">
                            {rev.headline}
                          </h3>
                          <p className="text-sm text-slate-text-muted leading-relaxed">
                            {rev.content}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-text-muted tabular-nums">
                          <span>작성자: {rev.author}</span>
                          <span>{rev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Board Post Cards */}
              {currentTabPosts.length === 0 ? (
                <div className="p-12 rounded-2xl bg-surface-container-lowest border border-brand-border text-center text-sm text-slate-text-muted">
                  등록된 게시글이 없거나 검색 조건에 맞는 글이 없습니다.
                </div>
              ) : (
                <div>
                  {activeTab === '고객후기' && (
                    <h3 className="text-xl font-black text-on-surface mb-5">
                      상세 이사 사례 후기 리포트
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTabPosts.map((post) => (
                      <article
                        key={post.id}
                        onClick={() => setSelectedPostId(post.id)}
                        className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-brand-border hover:shadow-md transition-all flex flex-col cursor-pointer group"
                      >
                        <div className="relative h-44 w-full overflow-hidden">
                          <SafeImage
                            src={post.image}
                            fallbackSrc={post.fallbackImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-4">
                            <span className="text-xs font-bold text-white">
                              {post.isPinned ? '★ 주요안내 · ' : ''}
                              {post.category}
                            </span>
                            <span className="text-[11px] text-white/85 tabular-nums">
                              {post.date}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <h3 className="text-base font-extrabold text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-xs text-slate-text-muted leading-relaxed line-clamp-3">
                              {post.summary}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                            <span className="text-slate-text-muted truncate max-w-[180px]">
                              {post.seoKeywords.slice(0, 2).join(' · ')}
                            </span>
                            <span className="text-primary font-bold inline-flex items-center gap-1 shrink-0">
                              <span>{post.downloadText ? '열람·다운로드' : '상세보기'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
