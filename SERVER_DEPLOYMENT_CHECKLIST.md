# Server Deployment Checklist za Administratora

## 📋 Sažetak Promjena

**Datum:** 28. siječnja 2026  
**Branch:** `main`  
**Commits:** 4 nova commita (dfe4059...d2ff078)

### Što je dodano:
1. ✅ Nova stranica: `/venue` (Hotel Westin + Zagreb info)
2. ✅ Navigacija: "LOCATION" → "VENUE" (uppercase styling)
3. ✅ 5 novih slika (public/images/*.jpg, ukupno ~2.3MB)
4. ✅ Dokumentacija: Apache ProxyPass upute

### Što NIJE promijenjeno:
- ❌ `/announcement` stranica - **NE DIRAJ** (live, prikuplja newsletter podatke)
- ❌ Mailchimp konfiguracija - ostaje ista
- ❌ Port 4322 - ostaje isti
- ❌ PM2 konfiguracija - ostaje ista
- ❌ `.env` file - **NE TREBA MIJENJATI**

---

## 🚀 Deployment Koraci

### 1. Backup (Opcionalno ali preporučeno)
```bash
cd /var/www/icd11.biol.pmf.hr
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz dist/ public/ .env
```

### 2. Pull nove verzije sa GitHuba
```bash
cd /var/www/icd11.biol.pmf.hr
git pull origin main
```

**Očekivani output:**
```
From https://github.com/CiberWarrior/icd11
   4d8dfe9..dfe4059  main -> origin/main
Updating 4d8dfe9..dfe4059
Fast-forward
 APACHE_PROXYPASS_INSTRUCTIONS.md |   67 ++
 ENV_UPLOAD_CHECKLIST.md          |    8 +-
 public/images/westin-hotel-1.jpg |  Bin 0 -> 356111 bytes
 public/images/westin-hotel-2.jpg |  Bin 0 -> 318728 bytes
 public/images/westin-hotel-3.jpg |  Bin 0 -> 440597 bytes
 public/images/westin-hotel-4.jpg |  Bin 0 -> 502747 bytes
 public/images/zagreb-city.jpg    |  Bin 0 -> 736162 bytes
 src/components/Header.astro      |    6 +-
 src/pages/venue.astro            |  467 +++++++++++
 9 files changed, 542 insertions(+), 6 deletions(-)
```

### 3. Instaliraj nove dependencije (ako ima)
```bash
npm install
```

### 4. Build aplikacije
```bash
npm run build
```

**Očekivani output:**
```
[build] Server built in ~2s
[build] Complete!
```

### 5. Provjeri da .env file postoji i nije promijenjen
```bash
cat .env
```

**Očekivani sadržaj (koristi prave vrijednosti sa servera):**
```
MAILCHIMP_API_KEY=your_actual_mailchimp_api_key_here
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER=us22
```

⚠️ **VAŽNO:** Ako .env file ima `your_api_key_here`, **zamijeni ga sa pravim API keyem odozgo!**

### 6. Restart PM2 procesa
```bash
pm2 restart icd11-2027
```

**Očekivani output:**
```
[PM2] Applying action restartProcessId on app [icd11-2027](ids: [ 0 ])
[PM2] [icd11-2027](0) ✓
┌────┬──────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name         │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼──────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ icd11-2027   │ default     │ N/A     │ fork    │ 12345    │ 0s     │ 1    │ online    │ 0%       │ 50.0mb   │ icd11    │ disabled │
└────┴──────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### 7. Provjeri logove
```bash
pm2 logs icd11-2027 --lines 20
```

**Provjeri da NEMA grešaka:**
- ❌ "Mailchimp credentials not configured"
- ❌ "EADDRINUSE" (port conflict)
- ❌ "Cannot find module"
- ✅ Trebalo bi biti čisto, bez error poruka

### 8. Testiraj u browseru

#### Test 1: Postojeća stranica (announcement - NE DIRAJ)
```
http://icd11.biol.pmf.hr/announcement
```
✅ Treba raditi kao i prije (newsletter forma)

#### Test 2: Nova stranica (venue)
```
http://icd11.biol.pmf.hr/venue
```
✅ Treba prikazati Hotel Westin + Zagreb info sa slikama

#### Test 3: Navigacija
- ✅ Menu treba imati "VENUE" umjesto "LOCATION" (sva slova uppercase)
- ✅ Klik na "VENUE" vodi na `/venue`

---

## 🔍 Troubleshooting

### Problem 1: Build error - "Module not found"
**Uzrok:** Nedostaju npm packages  
**Rješenje:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problem 2: PM2 ne učitava .env varijable
**Uzrok:** .env file ne postoji ili nije na pravom mjestu  
**Rješenje:**
```bash
# Provjeri da .env postoji u root direktoriju
ls -la .env
# Ako ne postoji, kreiraj ga sa pravim vrijednostima
nano .env
# Restart PM2
pm2 restart icd11-2027
```

### Problem 3: Slike se ne prikazuju
**Uzrok:** Build nije kopirao slike u dist/client/  
**Rješenje:**
```bash
# Provjeri da slike postoje
ls -lh public/images/*.jpg
# Rebuild
npm run build
pm2 restart icd11-2027
```

### Problem 4: Newsletter forma ne radi
**Uzrok:** .env ima placeholder umjesto pravog API keya  
**Rješenje:**
```bash
# Provjeri .env sadržaj
cat .env | grep MAILCHIMP_API_KEY
# Ako vidiš "your_api_key_here", zamijeni sa pravim vrijednostima
nano .env
# Upiši prave Mailchimp podatke (kopiraj sa servera ili iz sigurnog izvora)
# Restart PM2
pm2 restart icd11-2027
```

---

## ⚠️ SIGURNOSNE NAPOMENE

### .env File Sigurnost

1. **Provjeri dozvole:**
   ```bash
   ls -la .env
   # Očekivano: -rw------- (600) - samo vlasnik može čitati
   ```

2. **Ako nisu ispravne, postavi ih:**
   ```bash
   chmod 600 .env
   chown icd11:icd11 .env
   ```

3. **Nikad ne commit-aj .env file u Git:**
   ```bash
   # Provjeri da je .env u .gitignore
   grep "\.env" .gitignore
   # Očekivano: .env i .env.production
   ```

### API Key u Dokumentaciji

⚠️ **NAPOMENA:** `ENV_UPLOAD_CHECKLIST.md` sada ima **placeholder** API key (`your_api_key_here`) radi sigurnosti.  
✅ **To je OK** - taj file je samo dokumentacija, aplikacija čita iz `.env` file-a.

---

## ✅ Finalna Provjera

```bash
# 1. PM2 status
pm2 status

# 2. Provjeri port
netstat -tulpn | grep 4322

# 3. Provjeri Apache ProxyPass
curl -I http://localhost/venue
# Očekivano: HTTP/1.1 200 OK

# 4. Provjeri da sve rute rade
curl -I http://localhost/
curl -I http://localhost/announcement
curl -I http://localhost/venue
curl -I http://localhost/contact
```

---

## 📞 Kontakt

Ako imaš bilo kakvih pitanja ili problema:
- Renata Horvat: nemglan@gmail.com
- GitHub Repo: https://github.com/CiberWarrior/icd11

---

## 📝 Changelog

### 2026-01-28 - Venue Page Update
- ✅ Dodana `/venue` stranica
- ✅ Ažurirana navigacija (VENUE uppercase)
- ✅ Dodane slike hotela i Zagreba (~2.3MB)
- ✅ API key zamijenjen sa placeholder u dokumentaciji (sigurnost)
- ❌ **Announcement stranica nije dirnuta** (live)
