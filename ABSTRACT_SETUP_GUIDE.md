# Setup vodič: Abstract submission sustav

Sve što trebaš napraviti da abstract upload radi od početka do kraja.

---

## Korak 1: Kreiraj Google Sheet za tracking

1. Otvori [Google Sheets](https://sheets.google.com)
2. Klikni **+ Blank** (novi prazan sheet)
3. U prvom redu napiši ove stupce (točno ovako):

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Timestamp | First Name | Last Name | Email | Presentation Type | Symposium | File Name | File URL |

4. **Važno:** Kopiraj **Sheet ID** iz URL-a  
   - URL izgleda: `https://docs.google.com/spreadsheets/d/1a2B3c4D5e6F7g8H9iJ0/edit`
   - Sheet ID je: `1a2B3c4D5e6F7g8H9iJ0` (između `/d/` i `/edit`)
   - **Tvoj Sheet ID:** `1GsrI6qVPGhVuo0wSheVNqf9-biqPdRF2vHrMfJgRh6I` ✅
5. Preименuj sheet u npr. "ICD 2027 Abstracts"
6. Ostavi tab otvoren

---

## Korak 2: Otvori postojeći Google Apps Script

1. Idi na [script.google.com](https://script.google.com)
2. Otvori projekt koji već ima web app URL za abstrakte
   - (Ako nemaš projekt, napravi **New project** i preskoči na Korak 3)
3. Obriši stari kod ili otvori novi file

---

## Korak 3: Zalijepi novi script

1. Otvori `scripts/abstract-upload.gs` u Cursoru
2. Kopiraj **cijeli** sadržaj (Cmd+A → Cmd+C)
3. Zalijepi u Apps Script editor
4. **Sheet ID je već postavljen** na `1GsrI6qVPGhVuo0wSheVNqf9-biqPdRF2vHrMfJgRh6I` ✅
5. Spremi (Cmd+S ili disketa ikona)

---

## Korak 4: Deploy novi web app (ili Update postojeći)

### Ako imaš postojeći deployment:

1. Klikni **Deploy** → **Manage deployments**
2. Klikni **Edit** (pencil ikona) pored postojećeg deploymenta
3. **Version**: odaberi **New version**
4. **Execute as**: **Me** (tvoj račun)
5. **Who has access**: **Anyone**
6. Klikni **Deploy**
7. Kopiraj Web App URL (spremit ćeš ga u sljedećem koraku)

### Ako nemaš deployment:

1. Klikni **Deploy** → **New deployment**
2. **Select type**: **Web app**
3. **Execute as**: **Me**
4. **Who has access**: **Anyone**
5. Klikni **Deploy**
6. **Authorize access** → odaberi svoj Google Account
7. Ako vidiš upozorenje "Google hasn't verified this app":
   - Klikni **Advanced**
   - Klikni **Go to [Project Name] (unsafe)**
8. Odobri pristup za:
   - **Drive** (spremanje datoteka)
   - **Gmail** (slanje potvrde)
   - **Sheets** (upis u tablicu)
9. Kopiraj Web App URL

---

## Korak 5: Ažuriraj website s novim URL-om (ako je potrebno)

**Samo ako imaš NOVI deployment** (novi URL):

1. Otvori `.env` file u projektu
2. Dodaj ili ažuriraj:
   ```
   GOOGLE_ABSTRACT_SCRIPT_URL=https://script.google.com/macros/s/TVOJ_NOVI_ID/exec
   ```
3. Restartaj dev server:
   ```bash
   # U terminalu gdje radi npm run dev:
   Ctrl+C
   npm run dev
   ```

**Ako si editirao postojeći deployment** (URL ostao isti), preskoči ovaj korak.

---

## Korak 6: Test cijelog toka

### 6.1 Pripremi testnu Word datoteku

1. Napravi prazan Word dokument
2. Napiši bilo što u njega (npr. "Test abstract 123")
3. Spremi kao `test-abstract.docx`

### 6.2 Testiraj u browseru

1. Otvori [http://localhost:4321/abstract-submission](http://localhost:4321/abstract-submission)
2. Popuni formu:
   - **First name**: Renata
   - **Last name**: Test
   - **Email**: tvoj-email@primjer.com
   - **Presentation type**: Oral
   - **Symposium**: General
   - **Word document**: Upload `test-abstract.docx`
3. Klikni **Submit abstract**
4. Čekaj... (može trajati 5-10 sekundi)

### 6.3 Provjeri rezultate

**Zelena obavijest?**  
Trebala bi vidjeti: *"Thank you, Renata! Your abstract has been received."*

**Email stigao?**  
Provjeri inbox (ili spam) — trebao bi stići email s potvrdom.

**Datoteka u Drive folderu?**  
1. Otvori [Google Drive folder](https://drive.google.com/drive/folders/1syH7ApUXZRicPs-2eiUXlfnS-Ka5HnN1)
2. Trebala bi vidjeti novu datoteku: `Test_Renata_Oral_20260831-HHMMSS.docx`

**Red u Google Sheetu?**  
1. Otvori Sheet iz Koraka 1
2. Trebao bi biti novi red s podacima:
   - Timestamp, Renata, Test, email, Oral, General, ime datoteke, Drive URL

---

## Ako nešto ne radi

### Greška: "The upload service is not ready yet"
- Apps Script nije deployiran ili URL nije točan
- Provjeri Korak 4 i 5

### Greška: "There was an error saving your abstract"
- Google račun nema pristup Drive folderu ili Sheetu
- Idi na Drive folder → Share → dodaj svoj Google račun kao **Editor**
- Idi na Sheet → Share → dodaj svoj Google račun kao **Editor**

### Datoteka stigla u Drive, ali nema reda u Sheetu
- SHEET_ID u scriptu je krivo kopiran
- Otvori Apps Script → provjeri liniju 21 → mora biti točan ID

### Email nije stigao
- Provjeri spam
- Gmail ponekad odgađa slanje za nekoliko minuta
- Datoteka je ipak spremljena — email je bonus, ne blokira upload

---

## Gotovo!

Kad sve radi s test datotekom, sustav je spreman.

Još trebam od tebe:
- Word predložak za preuzimanje (kad bude gotov)
- Odluka: treba li Abstract Submission u navigaciju?

Javi kad testiraš ili ako zaglaviš negdje!
