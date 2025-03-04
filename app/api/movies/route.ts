import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  console.log('PARAMS: ', params);

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
    return NextResponse.json({ error: res.statusText }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
