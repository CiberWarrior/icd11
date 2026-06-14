# 🔒 Security Checklist - ICD11 Website

Ovaj dokument sadrži sigurnosne mjere, preporuke i zadatke za zaštitu web stranice.

---

## ✅ Trenutno implementirano

### 1. HTTPS / SSL
- ✅ SSL certifikat je aktivan
- ✅ HTTPS radi na `https://icd11.biol.pmf.hr`

### 2. Environment Variables (.env)
- ✅ `.env` fajl je u `.gitignore`
- ✅ Tajni ključevi nisu u git repozitoriju
- ✅ Mailchimp API ključevi su na serveru, ne u kodu

### 3. Network Security
- ✅ Node.js aplikacija sluša samo na `localhost:4322`
- ✅ Port nije dostupan javno (samo preko Apache proxy)
- ✅ Apache ProxyPass koristi `ProxyPreserveHost On`

### 4. Application Security
- ✅ PM2 watch je disabled u produkciji
- ✅ Astro framework ima automatsku XSS zaštitu
- ✅ Nema SQL baze (statički sadržaj + Mailchimp API)

---

## ⚠️ Preporučena poboljšanja

### 1. Apache Security Headers

**Problem:** Nedostaju važni sigurnosni headeri koji štite od napada.

**Rješenje:** Dodati security headere u Apache konfiguraciju.

**Kako implementirati:**

Zamolite IT administratora (onaj s `sudo` pristupom) da doda sljedeće u Apache konfiguraciju:

```apache
<VirtualHost *:443>
    ServerName icd11.biol.pmf.hr
    
    # SSL postavke...
    
    # Security Headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # Content Security Policy (stroga verzija)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://mailchimp.com https://*.list-manage.com; frame-ancestors 'self';"
    
    # HSTS (HTTPS only)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:4322/
    ProxyPassReverse / http://localhost:4322/
</VirtualHost>
```

**Testiranje headera:**
```bash
curl -I https://icd11.biol.pmf.hr
```

---

### 2. Rate Limiting (newsletter forma)

**Problem:** Newsletter forma može biti zlouporabljena za spam ili DoS napade.

**Rješenje:** Implementirati rate limiting.

**Opcija A - Apache mod_ratelimit (preporučeno):**

Zamolite IT administratora da konfigurira:

```apache
<Location "/api/newsletter">
    SetOutputFilter RATE_LIMIT
    SetEnv rate-limit 20
    SetEnv rate-initial-burst 10
</Location>
```

**Opcija B - Na razini koda:**

Dodati rate limiting u Astro API endpoint. (Možemo implementirati ako želite)

---

### 3. Ažuriranje Dependencies ⚠️ HITNO

**Problem:** Node.js paketi imaju sigurnosne ranjivosti.

**Trenutno stanje (14. lipanj 2026):**
- ❌ **5 vulnerabilities pronađeno**
  - 2 HIGH severity (esbuild, astro)
  - 3 MODERATE severity (@astrojs/node, @astrojs/vercel)

**Rješenje:** Ažurirati dependencies na najnovije verzije.

**NAPOMENA:** Većina ranjivosti se odnosi na **development server** (koji ne radi u produkciji), ali ih svejedno treba popraviti.

**Kako popraviti:**

```bash
# Na lokalu (Mac)
cd /Users/renchi/Documents/Cursor/icd11

# Provjeri što će biti promijenjeno
npm audit fix --dry-run

# Popravi ranjivosti (može zahtijevati breaking changes)
npm audit fix --force

# Nakon popravka, testiraj lokalno
npm run dev
# Otvori http://localhost:4321 i provjeri da sve radi

# Build za produkciju
npm run build

# Ako sve radi:
git add package.json package-lock.json
git commit -m "Fix security vulnerabilities in dependencies"
git push origin main

# FTP upload na server + PM2 restart (vidi DEPLOY_STEP_BY_STEP.md)
```

**Preporuka:** Provjeravati jednom mjesečno ili nakon svakog Astro release-a.

---

### 4. Fail2Ban za SSH zaštitu

**Problem:** Server je ranjiv na brute-force napade na SSH.

**Rješenje:** Instalirati Fail2Ban koji automatski blokira IP-ove nakon više neuspjelih pokušaja.

**Napomena:** Ovo mora napraviti IT administrator s `sudo` pristupom.

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

### 5. Backup Strategy

**Problem:** Nema automatskog backupa stranice i baze podataka (Mailchimp).

**Rješenje:**

**A. Git backup (već implementirano):** ✅
- Kod je na GitHub-u

**B. Server backup (treba implementirati):**

Zamolite IT administratora da postavi cronjob za backup:

```bash
# Dodati u crontab
0 2 * * * tar -czf /home/icd11/backups/icd11_$(date +\%Y\%m\%d).tar.gz /home/icd11/WEB-icd11.biol.pmf.hr/dist /home/icd11/WEB-icd11.biol.pmf.hr/.env /home/icd11/WEB-icd11.biol.pmf.hr/public
```

**C. Mailchimp export (ručno):**
- Jednom mjesečno exportirati email listu iz Mailchimp dashboard-a

---

### 6. PM2 Monitoring

**Problem:** Nema monitoringa aplikacije - ne znate ako crashuje.

**Rješenje:** Postaviti PM2 monitoring.

**Kako implementirati:**

```bash
ssh icd11@webserv.biol.pmf.hr
cd ~/WEB-icd11.biol.pmf.hr

# PM2 Plus (besplatno za 1 server)
pm2 link <secret_key> <public_key>
```

Registrirajte se na: https://app.pm2.io

**Alternativa (jednostavnije):** Email notifikacije pri crashu aplikacije.

---

### 7. Log Monitoring

**Problem:** Nema monitoringa logova za sumnjive aktivnosti.

**Rješenje:** Redovno provjeravati logove.

**Kako provjeriti logove:**

```bash
ssh icd11@webserv.biol.pmf.hr
cd ~/WEB-icd11.biol.pmf.hr

# PM2 logovi (greške i outputi)
pm2 logs icd11-2027 --lines 100

# Apache access log (tko pristupa stranici)
sudo tail -f /var/log/apache2/access.log

# Apache error log
sudo tail -f /var/log/apache2/error.log
```

**Što tražiti:**
- Neobični broj zahtjeva s jednog IP-a
- 404 greške koje izgledaju kao skeniranje ranjivosti
- Neuspjeli POST zahtjevi na `/api/newsletter`

---

### 8. Firewall (UFW)

**Problem:** Možda firewall nije konfiguriran.

**Provjera:** Zamolite IT administratora da provjeri:

```bash
sudo ufw status
```

**Trebao bi biti aktivan i dozvoljavati samo:**
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS)

**Konfiguracija (ako nije postavljen):**

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

### 9. .env File Permissions

**Problem:** `.env` fajl možda ima preopuštene dozvole.

**Provjera:**

```bash
ssh icd11@webserv.biol.pmf.hr
cd ~/WEB-icd11.biol.pmf.hr
ls -la .env
```

**Trebalo bi biti:**
```
-rw------- 1 icd11 icd11 271 .env
```

**Ako nije, popraviti:**

```bash
chmod 600 .env
```

---

### 10. Apache Version Hiding

**Problem:** Apache otkriva verziju u headerima (olakšava napadačima).

**Rješenje:** Zamolite IT administratora da u `/etc/apache2/conf-available/security.conf` postavi:

```apache
ServerTokens Prod
ServerSignature Off
```

Zatim:

```bash
sudo systemctl restart apache2
```

---

## 🚨 Incident Response Plan

### Ako primijetite provalu ili sumnjivo ponašanje:

1. **Odmah prekinite PM2:**
   ```bash
   ssh icd11@webserv.biol.pmf.hr
   pm2 stop icd11-2027
   ```

2. **Obavijestite IT administratora**

3. **Provjerite logove:**
   ```bash
   pm2 logs icd11-2027 --lines 200
   tail -100 /var/log/apache2/access.log
   ```

4. **Promijenite lozinke:**
   - SSH lozinka
   - Mailchimp API ključ
   - GitHub pristup

5. **Pregledajte izmjene:**
   ```bash
   cd ~/WEB-icd11.biol.pmf.hr
   ls -lat | head -20
   ```

6. **Vratite se na zadnji poznati dobar backup**

---

## 📋 Mjesečni Security Checklist

**Svaki mjesec:**

- [ ] Provjerite `npm audit` i ažurirajte dependencies
- [ ] Pregledajte PM2 logove za greške
- [ ] Pregledajte Apache access log za sumnjive IP-ove
- [ ] Exportajte Mailchimp email listu (backup)
- [ ] Provjerite da SSL certifikat ne istječe uskoro
- [ ] Testirajte da backup procedura radi

**Svakih 6 mjeseci:**

- [ ] Promijenite SSH lozinku
- [ ] Promijenite Mailchimp API ključ
- [ ] Pregledajte ovaj dokument i ažurirajte prema potrebi

---

## 🔗 Korisni resursi

- **SSL Test:** https://www.ssllabs.com/ssltest/
- **Security Headers Test:** https://securityheaders.com/
- **npm audit:** https://docs.npmjs.com/cli/v8/commands/npm-audit
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

---

## 📝 Kontakti

**IT Administrator (za sudo zadatke):**
- Ime: _________________
- Email: _________________

**Web Developer (Renata):**
- Email: _________________

---

**Zadnje ažuriranje:** 14. lipanj 2026  
**Sljedeća revizija:** 14. prosinac 2026
