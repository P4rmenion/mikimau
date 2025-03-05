import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  console.log(uuid);

  const res = await fetch(
    `${process.env.HOST}${process.env.ENDPOINT_MOVIES}${uuid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization')?.toString() || '',
      },
    },
  );

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return NextResponse.json(data);
}
