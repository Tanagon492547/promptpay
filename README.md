# **ตัวอย่างการเชื่อมต่อระบบชำระเงิน PromptPay ด้วย Next.js และ Omise**

โปรเจกต์นี้เป็นตัวอย่างพื้นฐานสำหรับการสร้างระบบชำระเงินผ่าน PromptPay โดยใช้ Next.js (App Router) เป็น Frontend/Backend และใช้ [Omise](https://www.omise.co/th) เป็น Payment Gateway เหมาะสำหรับนักศึกษาและผู้ที่สนใจเรียนรู้กระบวนการทำงานของ E-commerce ตั้งแต่การสร้าง QR Code ไปจนถึงการยืนยันการชำระเงินผ่าน Webhook

## **✨ คุณสมบัติหลัก**

* **สร้าง QR Code สำหรับ PromptPay:** สร้าง QR Code แบบ Dynamic ตามยอดเงินที่กำหนด  
* **ยืนยันการชำระเงินอัตโนมัติ:** ใช้ Webhook จาก Omise เพื่อตรวจสอบและยืนยันการชำระเงินแบบ Real-time  
* **หน้าแสดงผล:** มีหน้ารอรับการกลับมา (return\_uri) หลังจากลูกค้าทำธุรกรรมสำเร็จ  
* **การจัดการข้อผิดพลาด:** มีการจัดการ Error ทั้งฝั่ง Frontend และ Backend

## **🛠️ เทคโนโลยีที่ใช้**

* **Framework:** Next.js (App Router)  
* **ภาษา:** TypeScript  
* **Payment Gateway:** [Omise Node.js Library](https://github.com/omise/omise-node)  
* **UI:** React  
* **QR Code Rendering:** react-qr-code  
* **Webhook Testing:** ngrok

## **🚀 การติดตั้งและเริ่มใช้งาน**

### **สิ่งที่ต้องมี**

1. Node.js (v18.x ขึ้นไป)  
2. บัญชี Omise ([สมัครที่นี่](https://dashboard.omise.co/signup)) และต้องมี Test Keys

### **ขั้นตอนการติดตั้ง**

1. **Clone โปรเจกต์นี้:**  
   git clone \<your-repository-url\>  
   cd \<your-repository-name\>

2. **ติดตั้ง Dependencies:**  
   npm install

3. ตั้งค่า Environment Variables  
   สร้างไฟล์ .env.local ที่ Root ของโปรเจกต์ แล้วใส่ Keys ที่ได้จาก Omise Dashboard**สำคัญ:** ไฟล์ .env.local เป็นไฟล์ที่เก็บข้อมูลลับ **ห้าม** commit ขึ้น Git Repository เด็ดขาด\!  
   **.env.local**  
   \# Key สำหรับใช้ในโค้ดฝั่ง Client (ไม่เป็นความลับ)  
   OMISE\_PUBLIC\_KEY=pkey\_test\_xxxxxxxxxxxxxxxxxxxx

   \# Key สำหรับใช้ในโค้ดฝั่ง Server (เป็นความลับ ห้ามเปิดเผย)  
   OMISE\_SECRET\_KEY=skey\_test\_xxxxxxxxxxxxxxxxxxxx

   **หมายเหตุ:** หลังจากแก้ไขไฟล์นี้ จะต้องรีสตาร์ทเซิร์ฟเวอร์ทุกครั้ง  
4. **รัน Development Server**  
   npm run dev

   เปิดเบราว์เซอร์ไปที่ http://localhost:3000

## **📂 โครงสร้างโปรเจกต์ที่สำคัญ**

* app/page.tsx: หน้าแรกสำหรับแสดงปุ่มสร้าง QR Code (Frontend)  
* app/payment/complete/page.tsx: หน้าแสดงผลเมื่อจ่ายเงินสำเร็จ (สำหรับ return\_uri)  
* app/api/create-promptpay-charge/route.ts: API สำหรับสร้าง Charge และ QR Code (Backend)  
* app/api/webhook/route.ts: API สำหรับรอรับการยืนยันการชำระเงินจาก Omise (Backend)

## **🌊 ขั้นตอนการทำงานของระบบ**

1. ผู้ใช้กดปุ่ม **"สร้าง QR Code"** ที่หน้าบ้าน (page.tsx)  
2. **Frontend** เรียก fetch ไปยัง API ของเราที่ /api/create-promptpay-charge พร้อมส่ง amount  
3. **Backend** (create-promptpay-charge/route.ts) รับค่า amount, ติดต่อกับ Omise API เพื่อสร้าง charge  
4. **Omise** ส่งข้อมูล charge ที่มีสถานะ pending และ authorize\_uri (ลิงก์สำหรับ QR Code) กลับมา  
5. **Backend** ส่ง authorize\_uri กลับไปให้ **Frontend**  
6. **Frontend** ใช้ react-qr-code เพื่อแสดง QR Code จาก authorize\_uri  
7. ผู้ใช้สแกนจ่ายเงิน และเราจำลองการจ่ายสำเร็จใน Omise Dashboard  
8. **Omise** ส่ง **Webhook** (Event charge.complete) มายัง URL ที่เราตั้งค่าไว้ (ที่วิ่งผ่าน ngrok มายัง /api/webhook)  
9. **Backend** (webhook/route.ts) รับ Webhook, ตรวจสอบสถานะ charge.status  
10. ถ้า status \=== 'successful' ก็ทำการอัปเดตฐานข้อมูล (ในตัวอย่างนี้คือ console.log) และส่ง 200 OK กลับไปให้ Omise

## **💰 พารามิเตอร์สำคัญทางการเงิน (Key Financial Parameters)**

ในการเชื่อมต่อระบบการเงิน ความถูกต้องของข้อมูลเป็นสิ่งสำคัญที่สุด นี่คือพารามิเตอร์ที่ต้องให้ความสำคัญเป็นพิเศษ:

| พารามิเตอร์ (Parameter) | API Endpoint | คำอธิบาย |
| :---- | :---- | :---- |
| **amount** | /create-promptpay-charge | **สำคัญที่สุด:** ยอดเงินที่ต้องการเรียกเก็บ **ต้องส่งเป็นหน่วยเล็กที่สุดของสกุลเงินนั้นๆ** เช่น สกุลเงินบาท (THB) ต้องส่งเป็น **สตางค์** (500 บาท \= 50000 สตางค์) การคำนวณผิดพลาดที่จุดนี้จะทำให้เรียกเก็บเงินผิดทันที |
| **currency** | /create-promptpay-charge | สกุลเงินที่ต้องการเรียกเก็บ ต้องเป็นรหัส 3 ตัวตามมาตรฐาน [ISO 4217](https://th.wikipedia.org/wiki/ISO_4217) (เช่น thb) |
| **charge.id** | ได้รับจาก Omise ทั้ง 2 Endpoint | รหัสอ้างอิงของธุรกรรมที่ไม่ซ้ำกัน (เช่น chrg\_test\_...) ใช้สำหรับติดตาม, ตรวจสอบ, และอ้างอิงกับ Omise ควรเก็บ ID นี้ไว้ในฐานข้อมูลของเราเสมอ |
| **charge.status** | /webhook | สถานะของธุรกรรมที่ได้รับจาก Webhook **ต้องตรวจสอบว่าเป็น successful เท่านั้น** จึงจะยืนยันว่าการจ่ายเงินสำเร็จจริง ห้ามเชื่อถือสถานะ pending หรืออื่นๆ |
| **charge.amount** | /webhook | ยอดเงินที่ได้รับจาก Webhook **ต้องนำมาตรวจสอบกับยอดเงินของออเดอร์ในฐานข้อมูลของเรา** เพื่อให้แน่ใจว่าลูกค้าจ่ายเงินมาครบถ้วนถูกต้อง ก่อนทำการอัปเดตสถานะ |

## **🔗 การทดสอบ Webhook ด้วย ngrok**

Webhook ต้องการ URL สาธารณะเพื่อรับข้อมูลจาก Omise ในการพัฒนาบน localhost เราต้องใช้ ngrok

1. **รัน ngrok:**  
   ngrok http 3000

2. **คัดลอก URL:** นำ URL ที่ลงท้ายด้วย .ngrok-free.app ที่ได้จาก Terminal  
3. **ตั้งค่าที่ Omise:** ไปที่ Omise Dashboard \> Webhooks แล้วเพิ่ม Endpoint โดยนำ URL ที่คัดลอกมาต่อท้ายด้วย /api/webhookhttps://\<your-ngrok-url\>.ngrok-free.app/api/webhook  
4. **จำลองการจ่ายเงิน:** สร้าง QR Code และเข้าไปกด "Mark as successful" ในเมนู Charges ของ Omise Dashboard เพื่อทดสอบการยิง Webhook

**หมายเหตุ:** URL ของ ngrok จะเปลี่ยนทุกครั้งที่เปิดใช้งานใหม่