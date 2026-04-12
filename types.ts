
export type PageState = 'loader' | 'journey' | 'console' | 'project' | 'contact';

export enum ProjectCategory {
  GRAPHIC = 'Pattern Design',
  FULL_BRANDING = 'Full Branding',
  UI = 'UI Design',
  AMAZON = 'Amazon Design',
  ADDITIONAL = 'Additional Works',
}

export type ProjectModuleDisplay = 'ui' | 'amazon' | 'long-scroll' | 'gallery';

export interface ProjectModuleSection {
  id: string;
  title?: string;
  description?: string;
  images: string[];
  layout?: 'stack' | 'grid';
  flow?: 'standard' | 'continuous';
}

export interface AmazonModuleData {
  productTitle: string;
  price: string;
  rating: string;
  reviewCount: string;
  galleryImages: string[];
  detailImages: string[];
  bullets: string[];
  breadcrumb?: string[];
  badge?: string;
  availability?: string;
  shipping?: string;
  highlights?: string[];
}

export interface ProjectModuleData {
  id: string;
  title: string;
  subtitle: string;
  display: ProjectModuleDisplay;
  boardFrame?: 'framed' | 'plain';
  loadingEffect?: 'pulse' | 'static' | 'none';
  cover?: string;
  coverColor?: string;
  images?: string[];
  sections?: ProjectModuleSection[];
  amazon?: AmazonModuleData;
}

export interface ProjectData {
  id: string;
  category: ProjectCategory;
  title: string;
  description: string;
  client: string;
  heroImage: string;
  images: string[];
  skills: { name: string; value: number }[];
  tools: string[];
  challenge: string;
  solution: string;
  modules?: ProjectModuleData[];
}

export interface CartridgeProps {
  category: ProjectCategory;
  onClick: (cat: ProjectCategory) => void;
  index: number;
}
