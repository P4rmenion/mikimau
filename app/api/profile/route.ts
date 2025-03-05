import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_PROFILE}`,
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

export async function PATCH(req: Request) {
  const payload = await req.json();

  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_PROFILE}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization')?.toString() || '',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
