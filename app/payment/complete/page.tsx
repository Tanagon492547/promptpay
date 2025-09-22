// app/payment/complete/page.tsx

import Link from 'next/link';

export default function PaymentCompletePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 ชำระเงินสำเร็จ!</h1>
      <p>ขอบคุณที่ใช้บริการนะเหมียว</p>
      <Link href="/">
        <button>กลับไปหน้าแรก</button>
      </Link>
    </div>
  );
}