# Mailchimp `.env` na serveru

`.env` s Maca se **ne uploadaja**. Na Macu stoji predložak `your_api_key_here`. Ako se ta datoteka prepiše preko serverske, Mailchimp odbije svaku prijavu.

Ključ se uređuje samo na serveru, u `/var/www/icd11.biol.pmf.hr/.env`, preko SSH-a. Cijeli ključ se ne šalje u chat i ne ispisuje naredbom `cat .env`.

## Provjera na serveru

```bash
cd /var/www/icd11.biol.pmf.hr
node -e '
const fs=require("fs");
const env={};
for (const line of fs.readFileSync(".env","utf8").split(/\n/)) {
  const t=line.trim();
  if (!t||t.startsWith("#")) continue;
  const i=t.indexOf("=");
  if (i<0) continue;
  env[t.slice(0,i).trim()]=t.slice(i+1).trim().replace(/^["'\'']|["'\'']$/g,"");
}
const key=env.MAILCHIMP_API_KEY||"";
const suffix=key.includes("-")?key.slice(key.lastIndexOf("-")+1):"";
console.log(JSON.stringify({
  placeholder: /your_|_here|changeme|placeholder/i.test(key),
  suffixMatchesServer: suffix===env.MAILCHIMP_SERVER,
  listPlaceholder: /your_|_here|changeme|placeholder/i.test(env.MAILCHIMP_LIST_ID||"")
}, null, 2));
'
```

Očekivano: `placeholder: false`, `listPlaceholder: false`, `suffixMatchesServer: true`.

Nakon izmjene `.env`:

```bash
pm2 restart ecosystem.config.cjs --update-env
pm2 save
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
3. Učitaj novu datoteku: `pm2 restart ecosystem.config.cjs --update-env`, pa `pm2 save`

### Problem: "Mailchimp credentials not configured"

**Rješenje:**
1. Provjeri da .env file sadrži sve tri varijable
2. Provjeri da nema razmaka oko `=` znaka
3. Provjeri da nema navodnika oko vrijednosti
4. `pm2 restart ecosystem.config.cjs --update-env`, pa `pm2 save`

### Problem: Port conflict

**Rješenje:**
1. Provjeri da `ecosystem.config.cjs` ima `PORT: 4322`
2. Provjeri da Apache ProxyPass pokazuje na `localhost:4322`
3. Restart PM2 procesa

## 📝 Napomene

- **Ne uploadaj `.env` s Maca**
- **Ne commitaj `.env`** — već je u .gitignore
- Nakon promjene `.env` na serveru: `pm2 restart ecosystem.config.cjs --update-env`, pa `pm2 save`
- **Provjeri dozvole** — `.env` treba biti `600` (samo vlasnik čita i piše)
