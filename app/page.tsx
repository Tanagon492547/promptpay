"use client"

import { useState } from 'react';
import QRCode from "react-qr-code";

export default function Home() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const amount = 500; // ตัวอย่างยอดเงิน 500 บาท

  const handleCreatePromptPayCharge = async () => {
    setIsLoading(true);
    setError('');
    setQrCodeUrl('');

    try {
      const response = await fetch('/api/create-promptpay-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }), // ส่งยอดเงินเป็นสตางค์
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการสร้าง QR Code');
      }

      console.log('ได้ข้อมูล QR Code:', data);
      setQrCodeUrl(data.authorize_uri);

    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
   <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>จ่ายเงินด้วย PromptPay (Next.js)</h1>
      <p>ยอดชำระ: {amount} บาท</p>
      
      {!qrCodeUrl && (
        <button onClick={handleCreatePromptPayCharge} disabled={isLoading}>
          {isLoading ? 'กำลังสร้าง QR Code...' : 'สร้าง QR Code เพื่อชำระเงิน'}
        </button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {qrCodeUrl && (
        <div style={{ marginTop: '20px' }} >
          <h2>สแกนเพื่อจ่ายเงิน</h2>
          <div className='flex w-full justify-center'>
            <QRCode value={qrCodeUrl} size={256} />
          </div>
          
          <p>QR Code นี้จะหมดอายุในไม่ช้า</p>
        </div>
      )}
    </div>
  );
}
