# Apache ProxyPass Konfiguracija

## Problem
Aplikacija trenutno radi na `http://icd11.biol.pmf.hr:4322/announcement` (port u URL-u).  
**Treba:** `http://icd11.biol.pmf.hr/announcement` i `https://icd11.biol.pmf.hr/announcement`

## Rješenje

Koristiti **ProxyPass** (NE Redirect!) da proxy-uje zahtjeve na Node.js aplikaciju na portu 4322.

## Koraci

### 1. Uključi potrebne module
```bash
sudo a2enmod proxy proxy_http headers
```

### 2. Uredi Apache konfiguraciju
```bash
sudo nano /etc/apache2/sites-available/icd11.biol.pmf.hr.conf
```

### 3. Dodaj ProxyPass konfiguraciju

**Za HTTP (port 80):**
```apache
<VirtualHost *:80>
    ServerName icd11.biol.pmf.hr
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:4322/
    ProxyPassReverse / http://localhost:4322/
</VirtualHost>
```

**Za HTTPS (port 443):**
```apache
<VirtualHost *:443>
    ServerName icd11.biol.pmf.hr
    
    # Tvoje postojeće SSL postavke...
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:4322/
    ProxyPassReverse / http://localhost:4322/
</VirtualHost>
```

### 4. Provjeri i restartiraj
```bash
sudo apache2ctl configtest
sudo systemctl restart apache2
```

## VAŽNO

❌ **NE koristiti Redirect** - to ne radi sa statičkim resursima  
✅ **Koristiti ProxyPass** - proxy-uje SVE zahtjeve na Node.js aplikaciju

## Provjera

```bash
curl -I http://icd11.biol.pmf.hr/announcement
# Treba vratiti 200 OK (ne 301/302 redirect)
```

U browseru otvori `http://icd11.biol.pmf.hr/announcement` - treba raditi bez porta u URL-u.
