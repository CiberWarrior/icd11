# Korak-po-korak: deploy (npr. nova slika loga)

Koristi ove korake kad mijenjaš sadržaj (npr. zamjena `logo-icd-2027-wide.png`) i želiš to prebaciti na server.

---

## Faza 1: Na svom računalu (lokalno)

### Korak 1.1 – Otvori terminal u mapi projekta

- Otvori terminal (ili Cursor terminal).
- Otvori mapu projekta:
  ```bash
  cd /Users/renchi/Desktop/ICD112027
  ```

### Korak 1.2 – Zamijeni sliku (ako još nisi)

- U projektu otvori mapu: `public/images/`
- Zamijeni datoteku `logo-icd-2027-wide.png` novom (ime ostavi isto: `logo-icd-2027-wide.png`).

### Korak 1.3 – Pokreni build

- U istom terminalu pokreni:
  ```bash
  npm run build
  ```
- Pričekaj da napiše npr. `Complete!` (bez crvenih grešaka).
- Ako piše greška, ne prelazi na FTP – prvo to riješi.

### Korak 1.4 – Provjeri da u buildu ima nova slika

- Otvori mapu: `ICD112027/dist/client/images/`
- Provjeri da u njoj postoji `logo-icd-2027-wide.png` i da je datum/datoteka ona koju si upravo stavila (nova slika).

Ako je sve OK, prelazi na Fazu 2.

---

## Faza 2: Upload na server (FTP)

### Korak 2.1 – Spoji se na server preko FTP-a

- Otvori FTP klijent (FileZilla, Cyberduck, ili što već koristiš).
- Spoji se na svoj server (host, korisničko ime, lozinka).

### Korak 2.2 – Na serveru pronađi mapu projekta

- Na serveru (desna strana u FTP-u) otvori mapu gdje ti stoji projekt.
- Unutra bi trebala biti mapa `dist` (s podmapama `client` i `server`).
- Ako `dist` ne postoji, projekt vjerojatno stoji negdje drugdje – koristi putanju koju inače koristiš za ovaj site.

### Korak 2.3 – Prebaci cijeli lokalni `dist` na server

- **Lokalno (lijevo):** otvori `ICD112027/dist/` – vidiš `client` i `server`.
- **Na serveru (desno):** otvori istu mapu gdje sada stoji stari `dist` (ili root projekta, ovisno kako si deployala).
- **Prebaci:** povuci cijelu mapu `dist` s lijeve strane na desnu i **prepiši** postojeći `dist` na serveru (Replace/Overwrite).
- Pričekaj da se sve datoteke prenesu (posebno `dist/client/images/logo-icd-2027-wide.png`).

Kad je upload gotov, prelazi na Fazu 3.

---

## Faza 3: Restart Node procesa na serveru (SSH)

### Korak 3.1 – Spoji se na server preko SSH-a

- Otvori terminal na svom računalu.
- Spoji se na server:
  ```bash
  ssh icd11@webserv.biol.pmf.hr
  ```
- Kad traži lozinku, upiši je ručno (ne spremaj je u ovaj dokument – vidi napomenu o sigurnosti na kraju).

### Korak 3.2 – Otvori mapu projekta na serveru

- Nakon prijave napiši:
  ```bash
  cd /var/www/icd11.biol.pmf.hr
  ```
  Tu su na serveru `ecosystem.config.cjs` i mapa `dist`.

### Korak 3.3 – Restart PM2

- Pokreni:
  ```bash
  pm2 restart icd11-2027
  ```
- Trebao bi ispis npr. `[PM2] Process successfully restarted`.

### Korak 3.4 – Provjera

- Napiši:
  ```bash
  pm2 status
  ```
- U listi bi `icd11-2027` trebao biti u statusu `online` (zeleno).

### Korak 3.5 – Izlazak s servera

- Napiši:
  ```bash
  exit
  ```

---

## Faza 4: Provjera u pregledniku

- Otvori svoju stranicu (npr. početnu i stranicu s “Sign in”).
- Osvježi s **hard refresh**: **Ctrl+Shift+R** (Windows/Linux) ili **Cmd+Shift+R** (Mac).
- Provjeri da se prikazuje novi logo.

---

## Ako nešto ne radi

- **Stari logo se i dalje vidi:** napravi hard refresh (Ctrl+Shift+R / Cmd+Shift+R), ili probaj u inkognito prozoru.
- **PM2 ne prepoznaje `icd11-2027`:** na serveru u mapi projekta pokreni `pm2 list` i vidi točan naziv appa; restartaj s tim imenom: `pm2 restart TO_IME`.
- **Greška pri buildu:** kopiraj cijelu poruku greške iz terminala i pošalji je da možemo točno vidjeti što popraviti.

---

## Sigurnost

- **Lozinke ne spremaj u datoteke u projektu** (nikad u git).
- Za SSH preporuka: postavi SSH ključ na server i koristi ga umjesto lozinke.
- Ako si lozinku negdje poslala u čistom tekstu, razmisli o promjeni lozinke na serveru (User management na webserv.biol.pmf.hr, ako imaš pristup).
