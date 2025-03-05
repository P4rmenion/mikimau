import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_MOVIES}?${params?.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization')?.toString() || '',
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
