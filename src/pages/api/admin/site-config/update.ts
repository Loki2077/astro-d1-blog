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
  const value = formData.get('value');
  const configValue = typeof value === 'string' ? value.trim() : '{}';

  await db
    .prepare(
      `
      INSERT INTO site_configs (key, value)
      VALUES ('base', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    )
    .bind(configValue || '{}')
    .run();

  return redirectToAdmin('/admin');
};
