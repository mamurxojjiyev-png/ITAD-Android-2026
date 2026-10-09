# ITAD — Play Marketga chiqarish bo‘yicha aniq ketma-ketlik

## 1. Android APK sinovi
Repo asosiy papkasiga ushbu loyihaning **ichidagi** barcha fayllarni (jumladan yashirin `.github`) yuklang. Actions > **ITAD Android APK** > Run workflow. `ITAD-TELEFON-APK` artefaktini yuklab oling. Telefoningizda darslar, test, baholash, o‘yin, o‘yinlardan qaytish, oflayn saqlashni tekshiring.

## 2. Server va o‘qituvchi baholari
Supabase'da loyiha yaratish — loyiha egasi tomonidan amalga oshiriladi. `SUPABASE_BAZA.sql` ni SQL Editor da bajaring, dasturga faqat Supabase URL va **anon/publishable** kalitini kiriting. **Service role/secret kalitlarini ilovaga kiritmang.** Talaba va o‘qituvchi uchun alohida foydalanuvchilar bilan ikki telefonda tekshiring. Server ochilmagan bo‘lsa, boshqa talabalarning baholarini ko‘rish ishlamaydi.

## 3. Play Store AAB imzolash
Google Play Console akkaunti ochilishi kerak. `keytool -genkeypair -v -keystore upload-key.jks -alias itad-upload -keyalg RSA -keysize 3072 -validity 10000` bilan bir martalik yuklash kaliti yarating. Uni xavfsiz saqlang. Repository GitHub > Settings > Secrets and variables > Actions'da `ITAD_KEYSTORE_BASE64`, `ITAD_KEYSTORE_PASSWORD`, `ITAD_KEY_ALIAS`, `ITAD_KEY_PASSWORD` nomli sirlarni saqlang. `ITAD_KEYSTORE_BASE64` — `.jks` faylining base64 ko‘rinishi; kalit va parolni hech kimga oddiy xabar orqali yubormang. Actions > **ITAD Play Market AAB** > Run workflow. `ITAD-PLAY-RELEASE-AAB` artefakti hosil bo‘lsa Play Console'ga yuklang.

## 4. Play Console
`https://play.google.com/console/` dan ilova yarating. Ilova nomi, ikonka, skrinshot, qisqa/to‘liq tavsif, aloqa manzili, maxfiylik siyosati URL, Data safety, akkaunt o‘chirish talablari, auditoriya va content rating ma’lumotlarini kiriting. API 36 maqsad talabini va Google tekshiruvini bajaring. Zarur bo‘lsa yopiq test guruhini ishlating. Tasdiqlangandan keyin nashr etiladi; bu ZIP o‘zi Play Marketga nashr qilmaydi.

## 5. Kontent
Universitet tasdiqlagan darslikning asli yuborilmagan. 10 ta konspekt o‘rniga to‘liq tasdiqlangan darslik avtomatik yaratilmagan. Kontent huquqi va to‘liqligini tekshiring.

## Hozirgi real holat
Loyiha APK va release AAB yig‘ishni GitHub'da ishga tushirishga tayyorlangan. Bu konteynerda Android SDK yo‘q; GitHub build, real telefon, Supabase va Play Console tekshiruvlari hali o‘tkazilmagan. Bu holatni 100% xatosiz tayyor deb hisoblamang.
