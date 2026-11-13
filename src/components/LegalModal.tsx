import React from 'react';
import { X } from 'lucide-react';
import { COMPANY_INFO } from '../data/yesMovingData';

interface LegalModalProps {
  tab: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ tab, onClose }) => {
  if (!tab) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl border border-brand-border shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-surface-container-low border-b border-brand-border flex items-center justify-between">
          <h2 className="text-lg font-black text-on-surface">
            {tab === 'terms' ? '예스이사 서비스 이용약관' : '개인정보처리방침'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-on-surface-variant space-y-4 leading-relaxed">
          {tab === 'terms' ? (
            <>
              <div>
                <h3 className="font-bold text-on-surface mb-1">제1조 (목적)</h3>
                <p>
                  본 약관은 {COMPANY_INFO.name}({COMPANY_INFO.englishName}, 사업자번호{' '}
                  {COMPANY_INFO.businessNumber}, 화물자동차운송주선사업 허가{' '}
                  {COMPANY_INFO.freightLicense})가 제공하는 포장이사, 일반이사, 보관이사,
                  사무실이전 및 사다리차 배차 상담 서비스의 이용 조건과 절차를 규정합니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">제2조 (견적 및 계약의 체결)</h3>
                <p>
                  온라인 및 유선 견적 신청 후 담당 팀장이 무료 방문 실측을 진행하며, 국토교통부
                  표준이사화물약관에 준거한 서면 또는 전자 계약서 작성 시 계약이 확정됩니다. 계약서
                  외 부당한 추가 요금을 요구하지 않습니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">
                  제3조 (손해배상 및 보험 처리)
                </h3>
                <p>
                  이삿짐 운송 및 상하차 작업 중 회사의 귀책사유로 물품이 파손·훼손·분실된 경우,
                  당사가 가입한 적재물배상책임보험(사고당 최대 5억원 한도) 및 관련 법령에 따라
                  신속하게 원상복구 또는 배상 처리합니다.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-bold text-on-surface mb-1">
                  1. 개인정보의 수집 및 이용 목적
                </h3>
                <p>
                  {COMPANY_INFO.name}는 무료 방문 견적 산출, 이사 배차 일정 확인, 고객 상담 안내를
                  위해 필요한 최소한의 개인정보(성명, 연락처, 출발지/도착지 주소, 이사 예정일)만을
                  수집합니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">2. 보유 및 이용 기간</h3>
                <p>
                  수집된 개인정보는 이사 상담 및 계약 이행 완료일로부터 1년간 보관 후 지체 없이
                  안전하게 파기합니다. 단, 관계 법령에 의해 보존이 필요한 경우 해당 기간 동안
                  보관합니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">3. 제3자 제공 금지</h3>
                <p>
                  {COMPANY_INFO.name}는 100% 직영 운영 원칙에 따라 고객의 개인정보를 외부 알선
                  업체나 제3자에게 판매·제공하지 않습니다.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-brand-border bg-surface-container-low flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
