import type { APIContext } from 'astro';
import type { PostRecord, SiteConfigRecord } from './types';

interface PreparedStatement {
  bind(...values: unknown[]): PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface BlogDatabase {
  prepare(sql: string): PreparedStatement;
}

/**
 * 从 Astro 上下文中获取 D1 数据库连接。
 */
export function getDb(context: Pick<APIContext, 'locals'>): BlogDatabase {
  const db = (context.locals as { runtime?: { env?: { DB?: BlogDatabase } } }).runtime?.env?.DB;
  if (!db) {
    throw new Error('D1 数据库未绑定，请检查 wrangler.toml 中的 DB 配置');
  }
  return db;
}

/**
 * 获取发布状态的文章列表。
 */
export async function listPublishedPosts(db: BlogDatabase): Promise<PostRecord[]> {
  const query = `
    SELECT id, slug, title, summary, cover_url, content, page_config, status, tags, updated_at
    FROM posts
    WHERE status = 'pub'
    ORDER BY updated_at DESC
  `;
  const result = await db.prepare(query).all<PostRecord>();
  return result.results;
}

/**
 * 通过 slug 获取单篇文章。
 */
export async function getPostBySlug(db: BlogDatabase, slug: string): Promise<PostRecord | null> {
  const query = `
    SELECT id, slug, title, summary, cover_url, content, page_config, status, tags, updated_at
    FROM posts
    WHERE slug = ?
    LIMIT 1
  `;
  return db.prepare(query).bind(slug).first<PostRecord>();
}

/**
 * 获取全部文章，供管理后台使用。
 */
export async function listAllPosts(db: BlogDatabase): Promise<PostRecord[]> {
  const query = `
    SELECT id, slug, title, summary, cover_url, content, page_config, status, tags, updated_at
    FROM posts
    ORDER BY updated_at DESC
  `;
  const result = await db.prepare(query).all<PostRecord>();
  return result.results;
}

/**
 * 通过 id 获取文章，供编辑页使用。
 */
export async function getPostById(db: BlogDatabase, id: number): Promise<PostRecord | null> {
  const query = `
    SELECT id, slug, title, summary, cover_url, content, page_config, status, tags, updated_at
    FROM posts
    WHERE id = ?
    LIMIT 1
  `;
  return db.prepare(query).bind(id).first<PostRecord>();
}

/**
 * 读取指定配置键。
 */
export async function getSiteConfig(db: BlogDatabase, key: string): Promise<SiteConfigRecord | null> {
  const query = 'SELECT key, value FROM site_configs WHERE key = ? LIMIT 1';
  return db.prepare(query).bind(key).first<SiteConfigRecord>();
}
