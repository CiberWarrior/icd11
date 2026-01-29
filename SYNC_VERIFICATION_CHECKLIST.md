# ✅ Checklist za provjeru identičnosti fajlova na oba računala

Ovaj checklist osigurava da su svi fajlovi identični i da će build raditi bez greške.

## 📋 Korak 1: Provjeri Git status na oba računala

### Na prvom računalu (ovom):
```bash
cd /path/to/ICD112027
git status
```
**Očekivani rezultat:** `working tree clean` - nema uncommitted changes

### Na drugom računalu:
```bash
cd /path/to/ICD112027
git status
```
**Očekivani rezultat:** `working tree clean` - nema uncommitted changes

---

## 📋 Korak 2: Provjeri da su commitovi identični

### Na prvom računalu:
```bash
git log --oneline -1
```
**Očekivani commit:** `f98543f Enhance Venue page with Zagreb information...`

### Na drugom računalu:
```bash
git log --oneline -1
```
**Očekivani commit:** `f98543f Enhance Venue page with Zagreb information...`

**✅ Commit hash mora biti IDENTIČAN!**

---

## 📋 Korak 3: Provjeri da nema razlika između local i remote

### Na oba računala:
```bash
git fetch origin
git diff HEAD origin/main
```
**Očekivani rezultat:** Prazan output (nema razlika)

---

## 📋 Korak 4: Provjeri ključne sistemske fajlove

Provjeri da ovi fajlovi postoje i imaju iste sadržaje:

### Obavezni fajlovi:
- ✅ `package.json` - dependency-ije moraju biti identične
- ✅ `package-lock.json` - mora biti identičan
- ✅ `tsconfig.json`
- ✅ `astro.config.mjs`
- ✅ `tailwind.config.mjs`
- ✅ `src/env.d.ts`
- ✅ `.env.example`
- ✅ `.gitignore`
- ✅ `ecosystem.config.cjs`

### Provjeri dependency-ije:
```bash
npm list --depth=0
```
**Očekivani paketi:**
- @astrojs/node@^8.3.4
- @astrojs/tailwind@^5.1.0
- @lucide/astro@^0.563.0
- aos@^2.3.4
- astro@^4.0.0
- gsap@^3.14.2
- heroicons@^2.2.0

---

## 📋 Korak 5: Provjeri strukturu fajlova

### Provjeri da postoje svi ključni fajlovi:
```bash
# Stranice
ls src/pages/
# Trebaju biti: announcement.astro, contact.astro, home.astro, index.astro, venue.astro
# + api/newsletter.ts

# Komponente
ls src/components/
# Trebaju biti: Button.astro, Card.astro, Footer.astro, Header.astro, itd.

# Slike
ls public/images/
# Trebaju biti: zagreb-logo.png, zagreb-city.jpg, westin-hotel-*.jpg, logo-icd-2027.png
```

---

## 📋 Korak 6: Provjeri .env file (SAMO na drugom računalu)

### Na drugom računalu:
```bash
cat .env
```

**Provjeri da postoje ove 3 varijable:**
```bash
MAILCHIMP_API_KEY=your_actual_key_here
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER=us22
```

**⚠️ VAŽNO:** `.env` file NIJE u gitu (to je dobro!), ali mora postojati na svakom računalu lokalno.

---

## 📋 Korak 7: Test build na oba računala

### Na prvom računalu:
```bash
rm -rf dist node_modules/.vite
npm run build
```
**Očekivani rezultat:** `✓ Complete!` bez grešaka

### Na drugom računalu:
```bash
rm -rf dist node_modules/.vite
npm run build
```
**Očekivani rezultat:** `✓ Complete!` bez grešaka

**✅ Build mora proći bez grešaka na oba računala!**

---

## 📋 Korak 8: Provjeri da nema untracked fajlova koji bi trebali biti u gitu

### Na oba računala:
```bash
git ls-files --others --exclude-standard
```

**Očekivani rezultat:** Prazan output (osim `.env` koji je u `.gitignore`)

---

## 🔍 Dodatna provjera: Hash provjera ključnih fajlova

Ako želite biti 100% sigurni, provjerite SHA256 hash ključnih fajlova:

### Na prvom računalu:
```bash
sha256sum package.json package-lock.json astro.config.mjs tailwind.config.mjs
```

### Na drugom računalu:
```bash
sha256sum package.json package-lock.json astro.config.mjs tailwind.config.mjs
```

**✅ Hash-ovi moraju biti IDENTIČNI!**

---

## ✅ Finalna provjera

Ako su svi koraci prošli:
- ✅ Git status clean na oba računala
- ✅ Commit hash identičan
- ✅ Nema razlika između local i remote
- ✅ Svi sistemski fajlovi postoje
- ✅ Dependency-ije identične
- ✅ Build prolazi bez greške na oba računala
- ✅ `.env` postoji na drugom računalu sa Mailchimp varijablama

**🎉 Tada možete biti 100% sigurni da će sve raditi identično!**

---

## 🚨 Ako nešto ne odgovara

1. **Ako commit hash nije identičan:**
   ```bash
   git pull origin main
   ```

2. **Ako build ne prolazi:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Ako fali neki fajl:**
   ```bash
   git pull origin main
   ```

4. **Ako dependency-ije nisu identične:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📝 Napomene

- `.env` file se NIKAD ne commitira u git (to je dobro!)
- `dist/` folder se ne commitira (build output)
- `node_modules/` se ne commitira (instalira se sa `npm install`)
- Sve ostalo MORA biti identično na oba računala
