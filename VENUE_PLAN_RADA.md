# Plan rada: dovršetak venue stranice (ICD 2027)

**Ograničenja:** Bez promjene routinga i sadržaja teksta, ne diraj Mailchimp/NewsletterForm, bez novih libraryja. Dizajn: Inter, hero-gradient, card, section-container.

---

## Korak 1: Uklanjanje redundantnog layouta i praznih elemenata

**Što točno mijenjam:**
- U svakoj sekciji na venue stranici uklanjam dupli wrapper: unutar `<div class="section-container">` više ne stavljam `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">` jer `section-container` već sadrži `container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`.
- Uklanjam prazan blok: `<div class="max-w-6xl mx-auto"></div>` u sekciji "The Westin Zagreb Hotel" (oko linija 122–124).
- Ostavljam samo jedan `section-container` po sekciji; gdje treba ograničiti širinu (npr. max-w-6xl za sadržaj), ostavljam samo unutarnji `max-w-6xl mx-auto` na wrapperu sadržaja, ne i ponovljeni padding.

**Datoteke:**
- `src/pages/venue.astro`

**Što provjeravam prije prelaska:**
- Svaka sekcija ima strukturu: `<section class="section-padding bg-...">` → `<div class="section-container">` → sadržaj (bez dodatnog `max-w-7xl mx-auto px-4...`).
- Nema praznih `<div>` koji ne obavljaju nikakvu ulogu.
- Na pregledu stranice layout ostaje ispravan (sadržaj centriran, padding konzistentan).

---

## Korak 2: Usklađivanje sekcija s indexom (section-padding, section-container)

**Što točno mijenjam:**
- Provjeravam da sve sekcije na venue imaju `section-padding` na `<section>` i `section-container` na prvom unutarnjem divu.
- Zamjenjujem ručne klase tipa `py-16 lg:py-24` s `section-padding` gdje ih ima.
- Naslovi sekcija: koristim isti pattern kao na indexu — npr. `text-center max-w-3xl mx-auto mb-16` za header blok gdje je to primjenjivo, i konzistentne `text-4xl lg:text-5xl font-bold text-gray-900` za h2.

**Datoteke:**
- `src/pages/venue.astro`

**Što provjeravam prije prelaska:**
- Sve sekcije imaju `section-padding` i `section-container`.
- Vizualno razmaci između sekcija odgovaraju indexu (py-16 lg:py-24).
- Headings (h2) izgledaju konzistentno s home stranicom.

---

## Korak 3: Zagreb plavi gradient u global.css (design token)

**Što točno mijenjam:**
- U `src/styles/global.css` u `@layer components` (ili utilities) dodajem klasu npr. `.zagreb-gradient` s vrijednostima koje se već koriste inline na venue: `background: linear-gradient(135deg, #2271ac 0%, #1a5a8a 100%);`.
- U `src/pages/venue.astro` zamjenjujem oba inline `style="background: linear-gradient(135deg, #2271ac 0%, #1a5a8a 100%);"` s klasom `zagreb-gradient` (About Zagreb kartica i "In Zagreb" kartica).

**Datoteke:**
- `src/styles/global.css`
- `src/pages/venue.astro`

**Što provjeravam prije prelaska:**
- Nema više inline gradienta za Zagreb plavu; oba mjesta koriste `zagreb-gradient`.
- Izgled "About Zagreb" i "In Zagreb" blokova je nepromijenjen.
- U pregledniku provjeri i tamnu i svijetlu temu ako postoji (ako ne, samo jedan pregled).

---

## Korak 4: Zamjena GSAP scroll animacija s Intersection Observer (kao na indexu)

**Što točno mijenjam:**
- U `src/pages/venue.astro` uklanjam GSAP skriptu (import gsap, ScrollTrigger i gsap.utils.toArray('.card-animate')...).
- Dodajem isti Intersection Observer pristup kao na `index.astro`: observer koji gleda elemente (npr. `.card-animate` ili sekcije/kartice), a pri ulasku u viewport dodaje im klasu `animate-fade-in-up`.
- Sve elemente koji sada imaju `card-animate` ostavljam s tom klasom (ili dodajem im je gdje želiš animaciju), a animacija se pokreće iz vanilla skripte, ne iz GSAP-a.
- U `<script>` koristim samo vanilla JS (nema importa gsap).

**Datoteke:**
- `src/pages/venue.astro`

**Što provjeravam prije prelaska:**
- Na scrollu se kartice/sekcije i dalje animiraju (fade-in-up).
- U konzoli nema grešaka; nema više referenci na gsap na ovoj stranici.
- Ponašanje je slično indexu (animacija pri skrolanju).

---

## Korak 5: Kartice i Card komponenta — konzistentnost s dizajnom

**Što točno mijenjam:**
- Pregledavam sve blokove na venue koji izgledaju kao kartice: koriste li `<Card variant="elevated">` gdje je to smisleno, ili barem iste Tailwind klase kao na indexu (rounded-2xl, shadow, transition).
- Sekcija "Discover Zagreb & Croatia": trenutno je to div s `rounded-2xl shadow-2xl`. Ostavljam sadržaj i tekst kakvi jesu; samo provjeravam da su `rounded-2xl`, sjenka i hover u skladu s `global.css` card stilovima (npr. shadow-soft / shadow-medium ako je u komponentama).
- Transport kartice (By Air, By Car, By Bus, By Train) ostaju kao jesu (gradienti, ikone); provjeravam samo da im border-radius i shadow odgovaraju ostalim karticama (npr. rounded-2xl, shadow-xl).

**Datoteke:**
- `src/pages/venue.astro`

**Što provjeravam prije prelaska:**
- Sve kartice imaju konzistentan rounded-2xl i prikladnu sjenku.
- Nema "odskakanja" u stilu (jedna kartica potpuno drugačiji radius ili sjenka).
- Card komponenta se koristi tamo gdje je već korištena (npr. Westin card); ostale blokove ne moraš nužno pretvarati u Card ako je struktura složena, ali vizualno su usklađene.

---

## Korak 6: Hero i tipografija — provjera bez obaveznih izmjena

**Što točno mijenjam:**
- Samo provjera: hero na venue koristi iste klase kao na indexu (`hero-gradient`, `section-container`, `glass`, `shadow-xl-colored`, dekorativni divovi, grid).
- U `global.css` i `tailwind.config.mjs` font je Inter (font-sans); body koristi `font-sans`. Ništa ne mijenjam ako je već tako.

**Datoteke:**
- `src/pages/venue.astro` (pregled)
- `src/styles/global.css` (pregled)
- `tailwind.config.mjs` (pregled)

**Što provjeravam prije prelaska:**
- Hero na `/venue` vizualno odgovara heroju na indexu (gradient, logo, countdown, tipografija).
- Font na cijeloj stranici je Inter.
- Ako nešto odstupa (npr. druga veličina naslova), uskladim jednu liniju klasa s indexom.

---

## Korak 7: Završna provjera — responzivnost i čistoća

**Što točno mijenjam:**
- Kratak responzivni pregled: mobil, tablet, desktop (npr. 375px, 768px, 1280px). Provjera da nema horizontalnog scrollanja i da sekcije/ gridovi (npr. 2x2 slike Westina, transport grid 2x2) dobro prelaze u jedan stupac na malim ekranima.
- Uklanjanje eventualnih duplih klasa ili mrtvog koda u venue.astro (npr. `hover:scale-100` koji ništa ne radi).
- Provjera da sve slike imaju `alt` i da linkovi imaju `rel="noopener noreferrer"` gdje je `target="_blank"` (već je uglavnom tako).

**Datoteke:**
- `src/pages/venue.astro`

**Što provjeravam prije zatvaranja plana:**
- Stranica `/venue` se ispravno učitava, bez konzolnih grešaka.
- Build prolazi: `npm run build`.
- Nema layout breakova na uobičajenim širinama ekrana.
- Mailchimp i index stranica nisu dirani; routing i tekst na venue su nepromijenjeni.

---

## Sažetak redoslijeda

| Korak | Fokus                         | Glavne datoteke      |
|-------|-------------------------------|----------------------|
| 1     | Redundantni layout, prazni divovi | venue.astro          |
| 2     | section-padding, section-container, naslovi | venue.astro          |
| 3     | Zagreb gradient u global.css | global.css, venue.astro |
| 4     | GSAP → Intersection Observer  | venue.astro          |
| 5     | Card / kartice usklađeno      | venue.astro          |
| 6     | Hero + Inter provjera         | venue, global, tailwind |
| 7     | Responzivnost, build, čistoća | venue.astro          |

Nakon koraka 7 venue stranica je finalno stilizirana u skladu s indexom i definiranim dizajnom, bez promjene routinga, teksta ili Mailchimp integracije.
