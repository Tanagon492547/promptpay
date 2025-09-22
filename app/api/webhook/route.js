// ไฟล์: app/api/webhook/route.js
import { NextResponse } from 'next/server';

export async function POST(request) { // <--- แก้ไขตรงนี้
  try {
    const event = await request.json();

    if (event.key === 'charge.complete') {
      const charge = event.data;
      console.log(`Webhook received for Charge ID: ${charge.id}`);

      if (charge.status === 'successful') {
        console.log('✅ Payment successful!');
        // ณ จุดนี้ คือการอัปเดตฐานข้อมูลว่าจ่ายเงินแล้ว
      } else {
        console.log(`❌ Payment failed or was cancelled. Status: ${charge.status}`);
      }
    } else {
      console.log(`Webhook received an unhandled event type: ${event.key}`);
    }
    
    // ส่ง status 200 OK กลับไปให้ Omise
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 400 });
  }
}