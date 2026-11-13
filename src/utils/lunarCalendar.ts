export interface LunarDateInfo {
  solarDateStr: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  isAuspicious: boolean; // 손없는날 (음력 9, 10, 19, 20, 29, 30)
  directionLabel: string; // 악귀 방위 안내
  holidayName: string | null;
  availability: 'available' | 'popular' | 'almost_full';
  isEconomyRecommended: boolean; // 평일 알뜰이사 추천
}

const SOLAR_HOLIDAYS: Record<string, string> = {
  '01-01': '신정',
  '03-01': '삼일절',
  '05-05': '어린이날',
  '06-06': '현충일',
  '08-15': '광복절',
  '10-03': '개천절',
  '10-09': '한글날',
  '12-25': '성탄절',
};

// Accurate lunar holiday mappings (2025-2027) via solar keys
const SPECIFIC_HOLIDAYS: Record<string, string> = {
  '2025-01-28': '설날 연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날 연휴',
  '2025-05-05': '어린이날·부처님오신날',
  '2025-10-05': '추석 연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석 연휴',
  '2025-10-08': '대체공휴일',
  '2026-02-16': '설날 연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날 연휴',
  '2026-03-02': '삼일절 대체공휴일',
  '2026-05-24': '부처님오신날',
  '2026-05-25': '대체공휴일',
  '2026-08-17': '광복절 대체공휴일',
  '2026-09-24': '추석 연휴',
  '2026-09-25': '추석',
  '2026-09-26': '추석 연휴',
  '2026-10-05': '개천절 대체공휴일',
  '2027-02-06': '설날 연휴',
  '2027-02-07': '설날',
  '2027-02-08': '설날 연휴',
  '2027-02-09': '대체공휴일',
  '2027-05-13': '부처님오신날',
  '2027-08-16': '광복절 대체공휴일',
  '2027-09-14': '추석 연휴',
  '2027-09-15': '추석',
  '2027-09-16': '추석 연휴',
  '2027-10-04': '개천절 대체공휴일',
  '2027-10-11': '한글날 대체공휴일',
};

const chineseCalendarFormatter = new Intl.DateTimeFormat('en-US-u-ca-chinese', {
  month: 'numeric',
  day: 'numeric',
});

export function getLunarMonthDay(date: Date): {
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
} {
  try {
    const parts = chineseCalendarFormatter.formatToParts(date);
    const monthPart = parts.find((p) => p.type === 'month')?.value ?? '1';
    const dayPart = parts.find((p) => p.type === 'day')?.value ?? '1';
    const isLeapMonth = monthPart.toLowerCase().includes('bis') || monthPart.includes('윤');
    const lunarMonth = parseInt(monthPart.replace(/\D/g, ''), 10) || 1;
    const lunarDay = parseInt(dayPart.replace(/\D/g, ''), 10) || 1;
    return { lunarMonth, lunarDay, isLeapMonth };
  } catch {
    // Fallback deterministic approximation if Intl chinese calendar is unavailable
    const day = date.getDate();
    return { lunarMonth: date.getMonth() + 1, lunarDay: day, isLeapMonth: false };
  }
}

export function getDirectionByLunarDay(lunarDay: number): string {
  const lastDigit = lunarDay % 10;
  if (lastDigit === 9 || lastDigit === 0) {
    return '사방 무방 (악귀가 없는 길일)';
  }
  if (lastDigit === 1 || lastDigit === 2) {
    return '동쪽 방향 주의 (그 외 방향 무방)';
  }
  if (lastDigit === 3 || lastDigit === 4) {
    return '남쪽 방향 주의 (그 외 방향 무방)';
  }
  if (lastDigit === 5 || lastDigit === 6) {
    return '서쪽 방향 주의 (그 외 방향 무방)';
  }
  return '북쪽 방향 주의 (그 외 방향 무방)';
}

export function formatSolarDateKey(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function getLunarDateInfo(year: number, month: number, day: number): LunarDateInfo {
  const date = new Date(year, month - 1, day, 12, 0, 0);
  const solarDateStr = formatSolarDateKey(year, month, day);
  const mmdd = solarDateStr.slice(5);
  const dayOfWeek = date.getDay();

  const { lunarMonth, lunarDay, isLeapMonth } = getLunarMonthDay(date);
  const lastDigit = lunarDay % 10;
  const isAuspicious = lastDigit === 9 || lastDigit === 0;
  const holidayName = SPECIFIC_HOLIDAYS[solarDateStr] || SOLAR_HOLIDAYS[mmdd] || null;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let availability: 'available' | 'popular' | 'almost_full' = 'available';
  if (isAuspicious && isWeekend) {
    availability = 'almost_full';
  } else if (isAuspicious || isWeekend || day >= 27) {
    availability = 'popular';
  }

  const isEconomyRecommended = !isAuspicious && !isWeekend && !holidayName && day >= 4 && day <= 22;

  return {
    solarDateStr,
    year,
    month,
    day,
    dayOfWeek,
    lunarMonth,
    lunarDay,
    isLeapMonth,
    isAuspicious,
    directionLabel: getDirectionByLunarDay(lunarDay),
    holidayName,
    availability,
    isEconomyRecommended,
  };
}

export function getMonthCalendarCells(year: number, month: number): (LunarDateInfo | null)[] {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (LunarDateInfo | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(getLunarDateInfo(year, month, d));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function getKoreanWeekdayLabel(dayOfWeek: number): string {
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  return labels[dayOfWeek] || '';
}
