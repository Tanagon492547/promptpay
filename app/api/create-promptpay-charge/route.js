import { NextResponse } from 'next/server';

const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(request) {
  // ลอง console.log ดูว่าโค้ดเริ่มทำงานไหม
  console.log('API route called...'); 

  try {
    const { amount } = await request.json();

    if (!amount) {
      console.log('Error: Amount is missing');
      // --> ต้องมี return ตรงนี้
      return NextResponse.json(
        { message: 'ไม่พบยอดเงิน (amount)' },
        { status: 400 }
      );
    }

    console.log('Creating charge with amount:', amount);
    const charge = await omise.charges.create({
      amount: amount,
      currency: 'thb',
      source: { type: 'promptpay' },
      return_uri: 'url-ของเว็บคุณตามด้วย/payment/complete', // ngrok เช่น https://cb6997011453.ngrok-free.app
    });

    console.log('Charge created successfully:', charge.id);
    
    // --> จุดสำคัญมาก! ต้องมี return เพื่อส่งข้อมูลกลับไป
    return NextResponse.json({
      authorize_uri: charge.authorize_uri,
    });

  } catch (error) {
    console.error('!!! Backend Error:', error);
    
    // --> จุดสำคัญมาก! ถ้าเกิด error ก็ต้องมี return เพื่อส่งข้อความ error กลับไป
    return NextResponse.json(
      { message: error.message || 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}