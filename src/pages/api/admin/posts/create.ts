import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';

/**
 * 读取表单字段并转成字符串。
 */
function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * 构造后台跳转响应。
 */
function redirectToAdmin(path: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: path,
    },
  });
}

export const POST: APIRoute = async (context) => {
  const db = getDb(context);
  const formData = await context.request.formData();

  const slug = readText(formData, 'slug');
  const title = readText(formData, 'title');
  const summary = readText(formData, 'summary');
  const coverUrl = readText(formData, 'cover_url');
  const content = readText(formData, 'content');
  const pageConfig = readText(formData, 'page_config') || '{}';
  const status = readText(formData, 'status') === 'draft' ? 'draft' : 'pub';
  const tags = readText(formData, 'tags');

  if (!slug || !title || !content) {
    return redirectToAdmin('/admin');
  }

  await db
    .prepare(
      `
      INSERT INTO posts (slug, title, summary, cover_url, content, page_config, status, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .bind(slug, title, summary || null, coverUrl || null, content, pageConfig, status, tags || null)
    .run();

  return redirectToAdmin('/admin');
};
