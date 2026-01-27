# Sljedeći Koraci - Provjera i Testiranje

## ✅ 1. Provjeri Strukturu Projekta na Serveru

```bash
cd /var/www/icd11.biol.pmf.hr
ls -la
```

**Očekivana struktura:**
```
├── .env
├── dist/
├── ecosystem.config.cjs
├── logs/
├── node_modules/
├── package.json          ← Trebao bi biti ovdje
├── package-lock.json    ← Trebao bi biti ovdje
└── public/
```

## ✅ 2. Provjeri da PM2 Proces Radi

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

Ako proces nije online ili ne postoji:
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

## ✅ 3. Provjeri PM2 Logove

```bash
pm2 logs icd11-2027 --lines 30
```

**Provjeri da NEMA grešaka:**
- ❌ "EADDRINUSE" (port conflict)
- ❌ "Mailchimp credentials not configured"
- ❌ "Cannot find module"
- ✅ Aplikacija bi trebala biti online bez grešaka

## ✅ 4. Provjeri da Aplikacija Sluša na Pravom Portu

```bash
netstat -tlnp | grep 4322
```

Ili:
```bash
ss -tlnp | grep 4322
```

**Očekivani output:**
```
tcp  0  0  ::1:4322  :::*  LISTEN  [PID]/node
```

Ako ne vidiš port 4322, provjeri:
- Da li je `PORT: 4322` u `ecosystem.config.cjs`
- Da li je PM2 proces pokrenut
- Da li postoje greške u logovima

## ✅ 5. Testiraj Lokalno na Serveru (curl)

```bash
curl http://localhost:4322/announcement
```

**Očekivani output:**
- HTML sadržaj stranice (ne greška)

Ako dobiješ grešku "Connection refused":
- Provjeri da li PM2 proces radi
- Provjeri da li aplikacija sluša na portu 4322

## ✅ 6. Provjeri Newsletter API Endpoint

```bash
curl -X POST http://localhost:4322/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","surname":"User","email":"test@example.com","country":"HR","newsletterConsent":true}'
```

**Očekivani output:**
- JSON response (success ili error, ali ne "Connection refused")

## ⚠️ 7. Apache ProxyPass Konfiguracija

**Ovo mora napraviti administrator:**

Apache konfiguracija (`/etc/apache2/sites-available/icd11.biol.pmf.hr.conf`) treba imati:

```apache
ProxyPass / http://localhost:4322/
ProxyPassReverse / http://localhost:4322/
```

**NE:**
```apache
ProxyPass / http://localhost:3000/  ← KRIVO
```

**Upute za administratora:**
```
Molim te promijeni Apache ProxyPass konfiguraciju:

1. Otvori datoteku:
   sudo nano /etc/apache2/sites-available/icd11.biol.pmf.hr.conf

2. Pronađi linije:
   ProxyPass / http://localhost:3000/
   ProxyPassReverse / http://localhost:3000/

3. Promijeni ih u:
   ProxyPass / http://localhost:4322/
   ProxyPassReverse / http://localhost:4322/

4. Provjeri sintaksu:
   sudo apache2ctl configtest

5. Ako je sintaksa OK, restartiraj Apache:
   sudo systemctl restart apache2
```

## ✅ 8. Finalni Test - Web Browser

Nakon što administrator promijeni Apache konfiguraciju:

1. Otvori: `http://icd11.biol.pmf.hr/announcement`
2. Provjeri da se stranica učitava
3. Ispuni newsletter formu
4. Provjeri da se email uspješno dodaje u Mailchimp

## 🔍 Troubleshooting

### Problem: PM2 proces ne pokreće se

**Rješenje:**
```bash
cd /var/www/icd11.biol.pmf.hr
pm2 delete icd11-2027  # Obriši stari proces ako postoji
pm2 start ecosystem.config.cjs
pm2 save
```

### Problem: Port 4322 je zauzet

**Rješenje:**
```bash
# Provjeri što koristi port 4322
sudo lsof -nP -iTCP:4322 -sTCP:LISTEN

# Ako je to stari PM2 proces, zaustavi ga
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.cjs
```

### Problem: "Cannot find module" greške

**Rješenje:**
```bash
cd /var/www/icd11.biol.pmf.hr
npm install  # Reinstaliraj dependencies
pm2 restart icd11-2027
```

### Problem: Newsletter forma ne radi

**Provjeri:**
1. Da li `.env` file postoji i ima ispravne vrijednosti
2. Da li PM2 proces radi (`pm2 status`)
3. Da li postoje greške u logovima (`pm2 logs icd11-2027`)
4. Da li Apache ProxyPass pokazuje na `localhost:4322`

## 📝 Checklist

- [ ] `package.json` i `package-lock.json` su u `/var/www/icd11.biol.pmf.hr/`
- [ ] PM2 proces je online (`pm2 status`)
- [ ] Nema grešaka u PM2 logovima
- [ ] Aplikacija sluša na portu 4322
- [ ] `curl http://localhost:4322/announcement` radi
- [ ] Newsletter API endpoint radi (`curl -X POST ...`)
- [ ] Apache ProxyPass pokazuje na `localhost:4322` (administrator)
- [ ] Web stranica se učitava u browseru
- [ ] Newsletter forma radi i dodaje emaile u Mailchimp
