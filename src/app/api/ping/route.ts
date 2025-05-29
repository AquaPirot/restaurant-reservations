// src/app/api/ping/route.ts
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.query('SELECT 1');
    return Response.json({ ok: true, rows });
  } catch (err) {
    console.error('Ping error →', err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
