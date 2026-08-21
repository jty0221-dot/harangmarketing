import { neon, Pool, type PoolClient } from "@neondatabase/serverless";

/**
 * Neon Postgres 연결 (서버 전용)
 *
 * - getSql():          HTTP 단발 쿼리 — 대부분의 읽기/단일 쓰기에 사용 (가장 빠름)
 * - withTransaction(): 상호작용 트랜잭션 — 잔액 차감처럼 여러 쿼리가
 *                      "전부 성공 아니면 전부 취소"여야 할 때. WebSocket 연결.
 *
 * DATABASE_URL 은 Vercel(Neon 통합)이 주입한다. 로컬은 .env.local 에 넣는다.
 */

function dbUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다");
  return url;
}

let _sql: ReturnType<typeof neon> | null = null;

/** HTTP 단발 쿼리용 태그드 템플릿. 예: const rows = await getSql()`SELECT ...` */
export function getSql() {
  if (!_sql) _sql = neon(dbUrl());
  return _sql;
}

/**
 * 상호작용 트랜잭션. 콜백 안의 모든 쿼리는 원자적으로 커밋되거나 롤백된다.
 * 예:
 *   await withTransaction(async (c) => {
 *     const r = await c.query("UPDATE members SET balance = balance - $1 WHERE id=$2 AND balance >= $1 RETURNING balance", [amt, id]);
 *     if (r.rowCount === 0) throw new Error("잔액 부족");
 *     await c.query("INSERT INTO ledger (...) VALUES (...)", [...]);
 *   });
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: dbUrl() });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
