import React, { useState } from 'react';
import { Check, Copy, MessageCircle, Phone, Send, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';
import { PageId } from '../types';

interface KakaoConsultModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onSubmitQuickInquiry: (name: string, phone: string, note: string) => void;
}

export const KakaoConsultModal: React.FC<KakaoConsultModalProps> = ({
  open,
  onClose,
  onNavigate,
  onSubmitQuickInquiry,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY_INFO.phoneDirect);
    } catch {
      // Fallback
    }
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      setError('성함과 연락처를 입력해 주세요.');
      return;
    }
    setError(null);
    onSubmitQuickInquiry(quickName.trim(), quickPhone.trim(), quickNote.trim());
    setSent(true);
  };

  const handleClose = () => {
    setSent(false);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-brand-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-amber-400 text-on-surface flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h2 className="text-base font-black">카카오톡 · 직통 간편 상담</h2>
              <p className="text-xs font-medium opacity-85">
                사진 견적 및 365일 실시간 배차 문의
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Direct Kakao/Phone Number Copy Box */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-brand-border space-y-2.5">
            <div className="text-xs font-bold text-slate-text-muted">
              카카오톡 전화번호 추가 / 직통 사진 전송
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-lg font-black text-on-surface tabular-nums">
                  {COMPANY_INFO.phoneDirect}
                </div>
                <div className="text-[11px] text-slate-text-muted">
                  예스이사 현장 총괄 팀장 직통
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="px-3 py-2 rounded-lg bg-white border border-brand-border hover:bg-surface-container text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-4 h-4 text-safety-green" />
                    <span className="text-safety-green">복사완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-primary" />
                    <span>번호복사</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-text-muted leading-relaxed">
              카카오톡 친구추가(전화번호) 후 거실·안방·주방 사진을 보내주시면 10분 내 가견적을
              회신해 드립니다.
            </p>
          </div>

          {/* Instant Callback Form */}
          {sent ? (
            <div className="p-5 rounded-xl bg-badge-certified-bg text-center space-y-2">
              <div className="text-sm font-black text-badge-certified-blue">
                빠른 상담 요청이 접수되었습니다!
              </div>
              <p className="text-xs text-slate-text-muted">
                기재해 주신 연락처({quickPhone})로 5분 이내 카카오톡 또는 전화 연락을 드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickSend} className="space-y-3">
              <div className="text-xs font-bold text-on-surface">
                또는 연락처만 남기시면 카톡/전화로 바로 연락드립니다
              </div>
              {error && (
                <div className="text-xs font-bold text-primary bg-primary/10 p-2.5 rounded-lg">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="성함 (예: 홍길동)"
                  className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-xs"
                />
                <input
                  type="tel"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  placeholder="연락처 (010-0000-0000)"
                  className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-xs tabular-nums"
                />
              </div>
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="간단 메모 (예: 포항 양덕동 32평 11/28 포장이사)"
                className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low border border-brand-border text-xs"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-inverse-surface hover:bg-on-background text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>카톡·전화 빠른 상담 요청하기</span>
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-brand-border grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.phoneMain}`}
              className="py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-1.5 tabular-nums"
            >
              <Phone className="w-4 h-4" />
              <span>{COMPANY_INFO.phoneMain} 전화</span>
            </a>
            <button
              type="button"
              onClick={() => {
                handleClose();
                onNavigate('instant-quote');
              }}
              className="py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer"
            >
              상세 견적 폼 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
