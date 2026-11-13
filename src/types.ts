export type PageId =
  | 'home'
  | 'company-certification'
  | 'moving-services'
  | 'auspicious-calendar'
  | 'work-gallery'
  | 'location-contact'
  | 'instant-quote';

export type MovingType =
  | '가정포장이사'
  | '일반이사'
  | '원룸소형이사'
  | '기업관공서이사'
  | '보관이사';

export type RegionName =
  | '포항시 북구'
  | '포항시 남구'
  | '경주시'
  | '영덕군'
  | '울진군'
  | '타지역';

export type TransportMethod = '엘리베이터' | '사다리차' | '계단수작업';

export type HomeSize = '10평 이하' | '10~20평대' | '20~30평대' | '30~40평대' | '40평대 이상';

export interface MovingServiceInfo {
  id: string;
  anchorId: string;
  number: string;
  badge: string;
  subtitle: string;
  title: string;
  quoteType: MovingType;
  description: string;
  image: string;
  fallbackImage: string;
  imageAlt: string;
  imageTag: string;
  imageHeadline: string;
  features: {
    iconName: string;
    title: string;
    description: string;
    accentColor: string;
  }[];
  footerNote: string;
}

export interface GalleryCase {
  id: string;
  title: string;
  category: '가정포장이사' | '원룸·소형이사' | '기업·관공서' | '보관이사' | '사다리차·특수운반';
  region: '포항시' | '경주시' | '영덕군' | '울진군';
  route: string;
  date: string;
  truckInfo: string;
  crewInfo: string;
  rating: number;
  image: string;
  fallbackImage: string;
  summary: string;
  highlights: string[];
  customerComment: string;
  customerName: string;
}

export interface CustomerReview {
  id: string;
  route: string;
  region: '포항시' | '경주시' | '영덕군' | '울진군';
  serviceType: string;
  headline: string;
  content: string;
  author: string;
  date: string;
  rating: number;
}

export interface BranchInfo {
  id: 'pohang' | 'gyeongju' | 'yeongdeok' | 'uljin';
  name: string;
  badge: string;
  address: string;
  coverage: string[];
  dispatchTime: string;
  phone: string;
  directPhone: string;
  hours: string;
  description: string;
  facilities: string[];
  directionsCar: string;
  directionsTransit: string;
  naverMapQuery: string;
  kakaoMapQuery: string;
}

export interface QuoteSubmission {
  id: string;
  createdAt: string;
  movingType: MovingType;
  startRegion: RegionName;
  startDetail: string;
  startHousing: string;
  startFloor: string;
  startTransport: TransportMethod;
  endRegion: RegionName;
  endDetail: string;
  endHousing: string;
  endFloor: string;
  endTransport: TransportMethod;
  homeSize: HomeSize;
  movingDate: string;
  movingTime: string;
  customerName: string;
  customerPhone: string;
  specialItems: string[];
  memo: string;
  estimatedRange: string;
  recommendedTruck: string;
}

export interface QuotePrefill {
  movingType?: MovingType;
  movingDate?: string;
  startRegion?: RegionName;
  endRegion?: RegionName;
  homeSize?: HomeSize;
}
