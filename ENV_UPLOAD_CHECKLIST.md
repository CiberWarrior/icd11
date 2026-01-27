# Checklist za Upload .env File-a na Server

## ✅ Prije Uploada

1. **Provjeri lokalni .env file:**
   ```bash
   cat .env
   ```
   
   Trebao bi sadržavati:
   ```
   MAILCHIMP_API_KEY=your_mailchimp_api_key_here-us22
   MAILCHIMP_LIST_ID=your_list_id_here
   MAILCHIMP_SERVER=us22
   ```

## 📤 Upload .env File-a

1. **Upload .env file na server:**
   - Putanja: `/var/www/icd11.biol.pmf.hr/.env`
   - Provjeri da file postoji i ima ispravne vrijednosti

## ✅ Nakon Uploada - Provjere na Serveru

### 1. Provjeri da .env file postoji i ima ispravne vrijednosti:
```bash
cd /var/www/icd11.biol.pmf.hr
cat .env
```

**Očekivani sadržaj:**
```
MAILCHIMP_API_KEY=your_mailchimp_api_key_here-us22
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER=us22
```

### 2. Provjeri dozvole .env file-a:
```bash
ls -la .env
```

**Očekivani output:**
```
-rw------- 1 icd11 icd11 271 datum .env
```

**Važno:** `.env` file treba imati dozvole `600` (samo vlasnik može čitati/pisati) radi sigurnosti.

Ako nema ispravne dozvole, postavi ih:
```bash
chmod 600 .env
```

### 3. Restart PM2 procesa da učita nove env varijable:
```bash
pm2 restart icd11-2027
```

Ili ako proces ne postoji:
```bash
pm2 start ecosystem.config.cjs
```

### 4. Provjeri da PM2 proces radi:
```bash
pm2 status
```

**Očekivani output:**
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name              │ mode     │ ↺    │ status    │ cpu     │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ icd11-2027        │ fork     │ 0    │ online    │ 0%      │ XX.Xmb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### 5. Provjeri PM2 logove za greške:
```bash
pm2 logs icd11-2027 --lines 20
```

**Provjeri da nema grešaka:**
- ❌ "Mailchimp credentials not configured"
- ❌ "EADDRINUSE" (port conflict)
- ✅ Aplikacija bi trebala biti online bez grešaka

### 6. Testiraj newsletter formu:
- Otvori: `http://icd11.biol.pmf.hr/announcement`
- Ispuni formu i pošalji
- Provjeri da se email uspješno dodaje u Mailchimp

## 🔍 Troubleshooting

### Problem: PM2 ne učitava .env varijable

**Rješenje:**
1. Provjeri da `ecosystem.config.cjs` ima `env_file: '.env'`
2. Provjeri da .env file postoji u root direktoriju projekta
3. Restart PM2 procesa: `pm2 restart icd11-2027`

### Problem: "Mailchimp credentials not configured"

**Rješenje:**
1. Provjeri da .env file sadrži sve tri varijable
2. Provjeri da nema razmaka oko `=` znaka
3. Provjeri da nema navodnika oko vrijednosti
4. Restart PM2 procesa

### Problem: Port conflict

**Rješenje:**
1. Provjeri da `ecosystem.config.cjs` ima `PORT: 4322`
2. Provjeri da Apache ProxyPass pokazuje na `localhost:4322`
3. Restart PM2 procesa

## 📝 Napomene

- **NE treba rebuild** - env varijable se čitaju u runtime-u
- **NE commit-aj .env file** - već je u .gitignore
- **Samo restart PM2 procesa** nakon promjene .env file-a
- **Provjeri dozvole** - .env file treba biti `600` (samo vlasnik)
