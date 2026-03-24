# Korak-po-korak: deploy bilo koje izmjene na server

Koristi ove korake svaki put kad izmijeniš bilo što u projektu (tekst, slike, stilovi, stranice...) i želiš to objaviti na živoj stranici.

---

## ⚠️ ZLATNO PRAVILO

```
izmjena u kodu → npm run build → FTP upload dist/ → pm2 restart
```

**`npm run dev` (localhost) NE utječe na `dist/` — build mora biti pokrenut ručno!**  
Ako preskoči build, na server ćeš poslati staru verziju.

---

## Faza 1: Na svom računalu (lokalno)

### Korak 1.1 – Otvori terminal u mapi projekta

- Otvori terminal (ili Cursor terminal).
- Otvori mapu projekta:
  ```bash
  cd /Users/renata/Desktop/ICD112027
  ```

### Korak 1.2 – Napravi izmjenu (ako još nisi)

- Izmijeni što trebaš (`.astro` fajl, slike u `public/images/`, itd.).
- Spremi datoteku (Cmd+S).

### Korak 1.3 – ✅ OBAVEZNO: Pokreni build

```bash
npm run build
```

- Pričekaj da napiše `Complete!` (bez crvenih grešaka).
- **Ako piše greška — STANI, ne prelazi na FTP, prvo riješi grešku.**

### Korak 1.4 – Provjeri da je build novi

```bash
ls -la dist/
```

Datum uz `client` i `server` mora biti **danas**. Ako nije — build nije prošao.

Za provjeru konkretne izmjene (npr. tekst):
```bash
grep "što si mijenjala" dist/server/pages/STRANICA.astro.mjs
```

Ako je sve OK, prelazi na Fazu 2.

---

## Faza 2: Upload na server (FTP)

### Korak 2.1 – Spoji se na server preko FTP-a

- Otvori FTP klijent (FileZilla, Cyberduck, ili što već koristiš).
- Spoji se na server: `webserv.biol.pmf.hr`, korisnik: `icd11`

### Korak 2.2 – Na serveru pronađi mapu projekta

- Na serveru (desna strana u FTP-u) otvori: `/var/www/icd11.biol.pmf.hr/`
- Unutra je mapa `dist` (s podmapama `client` i `server`).

### Korak 2.3 – Prebaci cijeli lokalni `dist` na server

- **Lokalno (lijevo):** otvori `ICD112027/dist/` — vidiš `client` i `server`.
- **Na serveru (desno):** otvori `/var/www/icd11.biol.pmf.hr/`
- **Povuci** cijelu mapu `dist` s lijeve na desnu i **prepiši** (Replace/Overwrite).
- Pričekaj da se sve datoteke prenesu.

Kad je upload gotov, prelazi na Fazu 3.

---

## Faza 3: Restart Node procesa na serveru (SSH)

### Korak 3.1 – Spoji se na server

```bash
ssh icd11@webserv.biol.pmf.hr
```

Upiši lozinku kad zatraži.

### Korak 3.2 – Otvori mapu projekta na serveru

```bash
cd /var/www/icd11.biol.pmf.hr
```

### Korak 3.3 – ✅ OBAVEZNO: Restart PM2

```bash
pm2 restart icd11-2027
```

Očekivani ispis: `[PM2] Process successfully restarted`

### Korak 3.4 – Provjera statusa

```bash
pm2 status
```

`icd11-2027` mora biti `online` (zeleno). Ako je `errored`, pokreni:
```bash
pm2 logs icd11-2027 --lines 30
```
i pošalji poruku greške.

### Korak 3.5 – Izlazak s servera

```bash
exit
```

---

## Faza 4: Provjera u pregledniku

- Otvori stranicu u **inkognito prozoru** (Cmd+Shift+N) — izbjegava cache probleme.
- URL: `http://icd11.biol.pmf.hr/STRANICA`
- Provjeri da je izmjena vidljiva.

Ako vidiš staru verziju u normalnom prozoru — pritisni **Cmd+Shift+R** (hard refresh).

---

## Ako nešto ne radi

| Problem | Rješenje |
|---|---|
| Izmjena nije vidljiva na serveru | Provjeri je li `npm run build` pokrenut **nakon** izmjene |
| Build ima stari datum (`ls -la dist/`) | Pokreni `npm run build` ponovo |
| PM2 ne prepoznaje `icd11-2027` | `pm2 list` → nađi točan naziv → `pm2 restart TO_IME` |
| Greška pri buildu | Kopiraj grešku iz terminala i pošalji |
| Vidiš staru verziju u browseru | Inkognito prozor ili Cmd+Shift+R |

---

## Brzi podsjetnik (copy-paste)

```bash
# 1. Lokalno — build
cd /Users/renata/Desktop/ICD112027
npm run build

# 2. [FTP upload dist/ na server]

# 3. Server — restart
ssh icd11@webserv.biol.pmf.hr
cd /var/www/icd11.biol.pmf.hr
pm2 restart icd11-2027
pm2 status
exit
```

---

## Sigurnost

- **Lozinke ne spremaj u datoteke u projektu** (nikad u git).
- Za SSH preporuka: postavi SSH ključ na server i koristi ga umjesto lozinke.
