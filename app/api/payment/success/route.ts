import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const orderId = formData.get('order_id');
  const referenceCode = formData.get('reference_code');
  const tracker = formData.get('tracker');
  const signature = formData.get('signature');

  // Redirect to a client page with the data as query params
  const params = new URLSearchParams({
    order_id: orderId as string,
    reference_code: referenceCode as string,
    tracker: tracker as string,
    signature: signature as string,
  });

  return NextResponse.redirect(`/payment/success/result?${params.toString()}`);
}
