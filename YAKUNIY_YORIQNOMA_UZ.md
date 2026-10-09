# ITAD — Android va Google Play reliz loyihasi (2026)

## 1. GitHub orqali APK olish
1. Ushbu ZIPdagi **ichki fayllarni** GitHub repository ildiziga yuklang, ZIPning o‘zini emas.
2. Repository → Actions → **ITAD Android APK** → Run workflow.
3. Yashil yakunlansa, Artifacts bo‘limidan **ITAD-TELEFON-APK** ni yuklang, arxivdan `app-debug.apk` ni oling.
4. APKni Android telefonda sinang: dars, test, o‘yin, baho saqlash va qayta kirish.

## 2. Talaba-o‘qituvchi yagona serveri
1. Supabase loyihasini yarating va SQL Editor ichida `SUPABASE_BAZA.sql` ni bajaring.
2. Ilovada Supabase Project URL va **anon/publishable** kalitini kiriting. **service_role / secret** kalitini ILGARI HAM, HECH QACHON ilovaga kiritmang.
3. O‘qituvchi uchun alohida akkaunt yarating, so‘ng SQL Editor orqali `role='teacher'` qilib tayinlang.
4. Ikki telefonda talaba va o‘qituvchi akkauntlari orqali sinang. Internet bo‘lmasa, natijalar telefonda saqlanadi; serverga yozilish tasdiqlanmaguncha ular boshqa telefonda ko‘rinmaydi.

## 3. Play Market AAB
1. Play Console hisobiga ega bo‘ling; dastur nomini va paket identifikatorini nashrdan OLDIN yakuniy tasdiqlang (`uz.bdtuni.itad`).
2. **O‘zingizning xavfsiz upload keystore** faylingizni yarating. GitHub Actions Secrets ichiga `ITAD_KEYSTORE_BASE64`, `ITAD_KEYSTORE_PASSWORD`, `ITAD_KEY_ALIAS`, `ITAD_KEY_PASSWORD` qo‘ying. Maxfiy qiymatlarni hech kimga yubormang.
3. Actions → **ITAD Play Market AAB** → Run workflow.
4. Artifacts'dan **ITAD-PLAY-RELEASE-AAB** ni oling va Play Console orqali tegishli test trekiga yuklang.
5. Maxfiylik siyosati, data safety, ilova rasmi, yosh toifasi, kontakt, test akkauntlari va zarur yopiq sinovlarni tayyorlang. Google tekshiruvidan keyingina ommaga chiqariladi.

## Tasdiqlanmagan narsalar
- Bu muhitda haqiqiy `APK` / `AAB` yig‘ilmadi; Android telefonda to‘liq sinov o‘tkazilmadi.
- Universitet tasdiqlagan to‘liq darslik hali kiritilmadi. `www/textbook.js` namunaviy materialdir.
- Supabase loyihasi real serverga ulanmagan. Play Marketga yuklanmagan.
- Dastur sintaksisi va mavjud regressiya testlari nashr sifatini to‘liq kafolatlamaydi.
