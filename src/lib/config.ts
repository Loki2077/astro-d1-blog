import type { BlogPageConfig } from './types';

/**
 * 将未知值解析成对象，解析失败返回空对象。
 */
export function safeParseObject(value: string | null | undefined): Record<string, unknown> {
  if (!value) {
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * 判断值是否为普通对象。
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 深度合并对象，后面的对象会覆盖前面的对象。
 */
export function deepMerge(...sources: Array<Record<string, unknown>>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const current = output[key];
      if (isPlainObject(current) && isPlainObject(value)) {
        output[key] = deepMerge(current, value);
        continue;
      }
      output[key] = value;
    }
  }
  return output;
}

/**
 * 按优先级合并配置：frontmatter > pageConfig > globalConfig。
 */
export function buildFinalConfig(
  globalConfig: Record<string, unknown>,
  pageConfig: Record<string, unknown>,
  frontmatterConfig: Record<string, unknown>,
): BlogPageConfig {
  return deepMerge(globalConfig, pageConfig, frontmatterConfig) as BlogPageConfig;
}
