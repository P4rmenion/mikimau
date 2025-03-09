import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ rental_uuid: string }> },
) {
  const { rental_uuid } = await params;

  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_RENTALS}${rental_uuid}`,
    {
      method: 'PATCH',
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
