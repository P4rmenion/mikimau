import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_RENTALS}`,
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

export async function POST(req: Request) {
  const payload = await req.json();
  console.log(JSON.stringify(payload));

  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_RENTALS}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization')?.toString() || '',
      },
      body: JSON.stringify(payload),
    },
  );

  console.log(res);

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
