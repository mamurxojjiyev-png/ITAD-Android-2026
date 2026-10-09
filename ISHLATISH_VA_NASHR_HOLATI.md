# ITAD — amaliy tayyorgarlik holati

## Tayyorlangan
- GitHub Actions yordamida APK debug paketini yig‘ish va imzolangan AABni chiqarish uchun ish jarayonlari.
- `npm test`: modullarni tekshirish va tarmoq maketi bilan talaba kirishi, natijani yuborish, bahoni o‘qish va rollarni tekshirish.
- Supabase ma’lumotlar bazasi va RLS uchun `SUPABASE_BAZA.sql`.

## GitHubda APK chiqarish
1. ZIPni oching va fayllarni repository **ildiziga** yuklang; `.github/workflows` papkasi saqlansin.
2. GitHub → Actions → `ITAD Android APK` → `Run workflow`.
3. Jarayon muvaffaqiyatli tugagach, `ITAD-TELEFON-APK` artifactini oling. Uning ichida `app-debug.apk` bo‘ladi.
4. APKni haqiqiy telefonga o‘rnating va barcha oynalar, testlar, o‘yinlar, offline/online natijalarni sinang.

## Supabase
1. Supabase hisobingizda yangi loyiha oching; SQL Editor ichida `SUPABASE_BAZA.sql`ni ishga tushiring.
2. Project URL va **publishable/anon** kalitini ilovaning server sozlamasi sahifasiga kiriting. `service_role` yoki secret key hech qachon ilovaga kiritilmaydi.
3. Talaba email orqali ro‘yxatdan o‘tadi. O‘qituvchi rolini loyiha egasi SQL Editor orqali tayinlaydi.
4. Kamida ikki haqiqiy qurilmada talabaning natijasi o‘qituvchi oynasida ko‘rinishini tekshiring.

## Play Market
1. Play Console hisobida ilova yarating.
2. GitHub repository secretsga `ITAD_KEYSTORE_BASE64`, `ITAD_KEYSTORE_PASSWORD`, `ITAD_KEY_ALIAS`, `ITAD_KEY_PASSWORD`ni kiriting.
3. Actions → `ITAD Play Market AAB` → `Run workflow` orqali imzolangan AAB yarating.
4. Play Console ilova ma’lumotlari, maxfiylik siyosati, Data safety, yosh toifasi, testlarni talabga muvofiq to‘ldiring; AABni yuklab sinov/nashrga yuboring.

## Tasdiqlanmagan
- Bu muhitda APK/AAB yig‘ilmadi va Android telefon sinovi bo‘lmadi.
- Supabase hisobga real ulanmagan: boshqa telefonlarning baholarini ko‘rish sinovdan o‘tmagan.
- Universitet tasdiqlagan to‘liq darslik mavjud emas, faqat loyihadagi materiallar mavjud.
- Google Play nashr bajarilmagan. Hisob ruxsatlari va Google ko‘rigi talab qilinadi.
