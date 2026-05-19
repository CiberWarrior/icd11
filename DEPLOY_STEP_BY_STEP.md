# Deploy na produkciju (Apache + Node + PM2)

Jedan vodič za sve: **standardni deploy (FTP)** i **alternativa (git + build na serveru)** za administratore.

---

## Koji način koristiti?

| Način | Kada | Sažetak |
|--------|------|--------|
| **A — FTP (standard)** | Svaki put kad radiš na svom Macu i želiš objavu | `npm run build` lokalno → upload cijelog **`dist/`** → **`pm2 restart`** na serveru. **GitHub (`git push`) = backup koda** — na serveru **ne treba** `git pull`. |
| **B — Git na serveru** | Server ima git klon i netko deploya direktno s GitHuba | SSH → `git pull` → `npm install` → `npm run build` → `pm2 restart`. |

**Zlatno pravilo za način A:**

```
izmjena u kodu → npm run build → FTP upload cijelog dist/ → pm2 restart
```

`npm run dev` **ne** ažurira `dist/` — build mora biti pokrenut ručno nakon izmjena.

---

## Način A: korak po korak (FTP)

### 1. Lokalno (Mac)

1. Otvori terminal u mapi projekta, npr.:
   ```bash
   cd /Users/renchi/Desktop/ICD112027
   ```
2. Uredi datoteke, **spremi** (Cmd+S).
3. Build:
   ```bash
   npm run build
   ```
   Pričekaj **`[build] Complete!`** bez grešaka. Ako build padne — ne uploadaj, prvo popravi.
4. (Opcija) Provjera da je `dist/` svjež:
   ```bash
   ls -la dist/
   ```
   Datumi kod `client` i `server` trebaju biti od danas.

### 2. FTP

1. Spoji se na server (npr. **webserv.biol.pmf.hr**, korisnik **icd11**).
2. Na serveru otvori mapu projekta, npr. **`/var/www/icd11.biol.pmf.hr/`**.
3. S lokalnog računala uploadaj **cijelu** mapu **`dist/`** (uključujući **`client`** i **`server`**) i **prepiši** postojeće datoteke.

### 3. SSH — restart PM2

1. Na **Macu** (ne na serveru dok ne vidiš prompt nakon SSH-a):
   ```bash
   ssh icd11@webserv.biol.pmf.hr
   ```
2. Kad vidiš npr. `icd11@webserv:~$`, **ne pokreći ponovo** `ssh` na isti host — već si na serveru.
3. Restart (radi i iz `~`, ne moraš prije `cd` u `/var/www/...`):
   ```bash
   pm2 restart icd11-2027
   pm2 status
   ```
   Proces **icd11-2027** treba biti **online**.
4. Izlaz: `exit`

**Česte zablude:** put `/var/www/...` ne postoji na Macu — samo nakon SSH-a na Linux. `pm2` naredbe izvršavaj samo u SSH sesiji na serveru, ne lokalno.

### 4. Preglednik

- Inkognito prozor ili **Cmd+Shift+R** (hard refresh) da izbjegneš stari cache.

---

## Način B: git pull + build na serveru (admin)

Koristi se kad je u `/var/www/icd11.biol.pmf.hr/` (ili gdje već) puni git klon i deploy ide bez FTP-a.

1. (Opcija) Backup:
   ```bash
   cd /var/www/icd11.biol.pmf.hr
   tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz dist/ public/ .env
   ```
2. Pull i build:
   ```bash
   cd /var/www/icd11.biol.pmf.hr
   git pull origin main
   npm install
   npm run build
   ```
   Očekivano: `[build] Complete!`
3. Provjera **`.env`** u rootu projekta (Mailchimp i sl.) — vidi **`ENV_UPLOAD_CHECKLIST.md`** ako treba.
4. Restart:
   ```bash
   pm2 restart icd11-2027
   pm2 logs icd11-2027 --lines 20
   ```

---

## Ako nešto ne radi

| Problem | Što provjeriti |
|--------|----------------|
| Izmjena se ne vidi | `npm run build` **nakon** izmjene? Uploadan **cijeli** `dist/`? `pm2 restart` **nakon** uploada? Inkognito / hard refresh? |
| Stari datum u `dist/` | Ponovno `npm run build` lokalno. |
| `pm2` nije prepoznat | Naredbe na **serveru** u SSH-u, ne na Macu. |
| PM2 `errored` | `pm2 logs icd11-2027 --lines 40` |
| **PM2 lista prazna** ili **Service Unavailable** | Vidi sekciju "PM2: Aplikacija nije pokrenuta" ispod. |

### PM2: Aplikacija nije pokrenuta

Ako `pm2 status` ne pokazuje **icd11-2027** ili je aplikacija **stopped**, pokreni ju s ecosystem configom:

```bash
ssh icd11@webserv.biol.pmf.hr
cd /var/www/icd11.biol.pmf.hr
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
exit
```

**VAŽNO:** Koristi `ecosystem.config.cjs` (NE direktno `dist/server/entry.mjs`) jer ecosystem file postavlja **PORT=4322** koji Apache ProxyPass očekuje.

Ako vidiš da aplikacija sluša na **port 4321** umjesto 4322:

```bash
pm2 delete icd11-2027
pm2 start ecosystem.config.cjs
pm2 save
```

Provjera porta u logovima:

```bash
pm2 logs icd11-2027 --lines 5
```

Treba vidjeti: `Server listening on http://localhost:4322`

### Build: "Module not found" (na serveru, način B)

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PM2 / newsletter: Mailchimp greške u logu

- `.env` u **rootu** projekta na serveru, ispravni ključevi (ne placeholder). Nakon izmjene: `pm2 restart icd11-2027`.

### Slike se ne vide

- Jesu li nove slike u **`public/`** i ušle u build? Za način A: nakon builda uploadaj i **`public`** ako mijenjaš samo slike bez novog `dist` client assets — u pravilu novi build + novi `dist/` rješava.

---

## Provjera nakon deploya (SSH, server)

```bash
pm2 status
pm2 logs icd11-2027 --lines 20
```

Lokalno na serveru (Apache proxy na port 4322):

```bash
curl -I http://localhost/
```

Očekivano: **200 OK** (ne redirect na port u URL-u). Apache ProxyPass: **`APACHE_PROXYPASS_INSTRUCTIONS.md`**.

---

## Sigurnost

- **Nikad** ne commitaj `.env` u git.
- Lozinke ne ostavljaj u datotekama u repou.
- SSH ključ umjesto lozinke — preporuka za često spajanje.

Detalji oko uploada `.env` na server: **`ENV_UPLOAD_CHECKLIST.md`**.

---

## Brzi copy-paste (način A)

```bash
# Lokalno
cd /Users/renchi/Desktop/ICD112027
npm run build

# Zatim: FTP — cijeli dist/ na /var/www/icd11.biol.pmf.hr/

# Server (SSH)
ssh icd11@webserv.biol.pmf.hr
pm2 restart icd11-2027
pm2 status
exit
```

---

## Ostala dokumentacija

- **Apache ProxyPass** (bez `:4322` u URL-u): `APACHE_PROXYPASS_INSTRUCTIONS.md`
- **Mailchimp / .env na serveru:** `ENV_UPLOAD_CHECKLIST.md`

Repozitorij: https://github.com/CiberWarrior/icd11
