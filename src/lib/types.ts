export type PostStatus = 'draft' | 'pub';

export interface PostRecord {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  content: string;
  page_config: string;
  status: PostStatus;
  tags: string | null;
  updated_at: string;
}

export interface SiteConfigRecord {
  key: string;
  value: string;
}

export interface BlogPageConfig {
  siteTitle?: string;
  theme?: string;
  showSidebar?: boolean;
  navLinks?: Array<{ name: string; url: string }>;
  [key: string]: unknown;
}
