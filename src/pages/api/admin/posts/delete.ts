import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';

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
  const idValue = formData.get('id');
  const id = typeof idValue === 'string' ? Number(idValue) : NaN;

  if (!Number.isFinite(id) || id <= 0) {
    return redirectToAdmin('/admin');
  }

  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  return redirectToAdmin('/admin');
};
