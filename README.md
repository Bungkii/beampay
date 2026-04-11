# LandiEDC - Web POS สำหรับเครื่อง Sunmi V2

ระบบ Point of Sale (POS) ผ่านหน้าเว็บ (Web-based) ที่ออกแบบมาโดยเฉพาะสำหรับเครื่องแอนดรอยด์ POS รุ่น **Sunmi V2** รองรับการรับชำระเงินผ่าน **Thai QR PromptPay** (เชื่อมต่อผ่าน Beam Checkout API) และ **เงินสด (Cash)** พร้อมระบบจัดการหลังการขายครบวงจร

## ✨ ฟีเจอร์หลัก (Features)

* **Secure Login:** ระบบล็อกอินด้วยรหัส PIN (ค่าเริ่มต้น: `111111`)
* **QR Payment:** สร้าง Thai QR PromptPay อัตโนมัติและระบบตรวจสอบยอดเงินเข้าอัตโนมัติ (Polling) ผ่าน Beam API
* **Cash Payment:** ระบบคำนวณเงินทอนสำหรับการรับชำระด้วยเงินสด
* **Thermal Printing (58mm):** โครงสร้าง CSS ออกแบบมาให้พิมพ์ลงบนกระดาษใบเสร็จ 58mm ได้พอดีเป๊ะ (รองรับสลิป QR, ใบเสร็จลูกค้า, ใบเสร็จร้านค้า และสลิปสรุปยอด)
* **Hardware Integration:** ดักจับสัญญาณจากหัวแสกนบาร์โค้ดของ Sunmi (Keyboard Emulation) เพื่อยกเลิกบิล (VOID)
* **Transaction Management:** ดูประวัติย้อนหลัง (History) และพิมพ์ใบเสร็จซ้ำ (Reprint)
* **Settlement:** ระบบสรุปยอดปิดกะ แยกยอดเงินสด, QR และรายการยกเลิก (VOID) ออกจากกันอย่างชัดเจน

## 📂 โครงสร้างโฟลเดอร์ (Project Structure)

โปรเจกต์นี้ถูกออกแบบมาเพื่อนำไป Deploy บน **Vercel** โดยแบ่งการทำงานเป็นฝั่ง Frontend (หน้าเว็บ) และ Backend (Serverless Functions สำหรับซ่อน API Key)

```text
/landi-edc-pos
 ├── index.html             # ไฟล์ Frontend หน้าจอ UI ทั้งหมดของ POS
 ├── /src                   # โฟลเดอร์เก็บรูปภาพ
 │    ├── bbllogo.png       # โลโก้ธนาคาร (หน้า Login / Home)
 │    ├── promptpay.webp    # โลโก้ PromptPay
 │    └── icon-thaiqr.png   # โลโก้ Thai QR
 └── /api                   # โฟลเดอร์ Backend (Vercel Serverless)
      ├── create-charge.js  # API สำหรับยิงไปสร้าง QR กับ Beam
      ├── check-status.js   # API สำหรับเช็คว่าลูกค้าโอนเงินหรือยัง
      └── webhook.js        # (Optional) สำหรับรับ Webhook จาก Beam
