# Tailwind UI & Heroicons Setup Guide

## 🎨 Heroicons

Heroicons je besplatna biblioteka ikona optimizovana za Tailwind CSS. Instalirana je i spremna za korišćenje.

### Instalacija

```bash
npm install heroicons
```

✅ **Već instalirano!**

### Korišćenje u Astro komponentama

**VAŽNO:** `heroicons` npm paket sadrži SVG fajlove, ne JS komponente. Za Astro, importujemo SVG kao raw stringove.

#### Metoda 1: Direktan import SVG (preporučeno)

```astro
---
// Import SVG as raw string
import calendar from 'heroicons/24/outline/calendar.svg?raw';
import envelope from 'heroicons/24/outline/envelope.svg?raw';
---

<div class="flex items-center space-x-2">
  <span class="w-5 h-5 text-primary-600 inline-block" set:html={calendar} />
  <span>July 10-16, 2027</span>
</div>

<span class="w-6 h-6 text-gray-400 inline-block" set:html={envelope} />

<style>
  /* Ensure SVG fills the container */
  span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

#### Metoda 2: Korišćenje HeroIcon wrapper komponente

```astro
---
import HeroIcon from '../components/icons/HeroIcon.astro';
import calendar from 'heroicons/24/outline/calendar.svg?raw';
import envelope from 'heroicons/24/solid/envelope.svg?raw';
---

<HeroIcon svg={calendar} class="w-5 h-5 text-primary-600" />
<HeroIcon svg={envelope} class="w-6 h-6" />
```

### Varijante ikona

Heroicons dolazi u različitim veličinama i stilovima:

1. **24px Outline** - `heroicons/24/outline/icon-name.svg`
   - Tanak outline stil
   - Najčešće korišćen
   - Dobar za navigaciju i akcije

2. **24px Solid** - `heroicons/24/solid/icon-name.svg`
   - Puna ikona
   - Dobar za istaknute elemente
   - Veća vizuelna težina

3. **20px Solid** - `heroicons/20/solid/icon-name.svg`
   - Manja solid verzija
   - Dobar za kompaktne UI elemente
   - Koristi se u buttonima i malim prostorima

4. **16px Solid** - `heroicons/16/solid/icon-name.svg`
   - Najmanja verzija
   - Za vrlo kompaktne prostore
   - Inline text ikone

### Primeri korišćenja

#### U Footer komponenti

```astro
---
import calendar from 'heroicons/24/outline/calendar.svg?raw';
import envelope from 'heroicons/24/outline/envelope.svg?raw';
import mapPin from 'heroicons/24/outline/map-pin.svg?raw';
---

<div class="flex items-center space-x-2">
  <span class="w-5 h-5 inline-block" set:html={calendar} />
  <span>July 10-16, 2027</span>
</div>

<a href="mailto:info@icd2027.org" class="flex items-center space-x-2">
  <span class="w-5 h-5 inline-block" set:html={envelope} />
  <span>info@icd2027.org</span>
</a>

<div class="flex items-center space-x-2">
  <span class="w-5 h-5 inline-block" set:html={mapPin} />
  <span>Zagreb, Croatia</span>
</div>

<style>
  span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

#### U Button komponenti

```astro
---
import arrowRight from 'heroicons/24/outline/arrow-right.svg?raw';
---

<button class="btn btn-primary flex items-center space-x-2">
  <span>Register Now</span>
  <span class="w-5 h-5 inline-block" set:html={arrowRight} />
</button>

<style>
  button span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

#### U Form komponenti

```astro
---
import checkCircle from 'heroicons/24/outline/check-circle.svg?raw';
import xCircle from 'heroicons/24/outline/x-circle.svg?raw';
---

{success && (
  <div class="flex items-center space-x-2 text-green-600">
    <span class="w-5 h-5 inline-block" set:html={checkCircle} />
    <span>Successfully subscribed!</span>
  </div>
)}

{error && (
  <div class="flex items-center space-x-2 text-red-600">
    <span class="w-5 h-5 inline-block" set:html={xCircle} />
    <span>{error}</span>
  </div>
)}

<style>
  div span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

### Stilizovanje ikona

Ikone su SVG elementi i mogu se stilizovati Tailwind klasama na wrapper span elementu:

```astro
---
import calendar from 'heroicons/24/outline/calendar.svg?raw';
import envelope from 'heroicons/24/outline/envelope.svg?raw';
import phone from 'heroicons/24/outline/phone.svg?raw';
import heart from 'heroicons/24/outline/heart.svg?raw';
import arrowRight from 'heroicons/24/outline/arrow-right.svg?raw';
---

<!-- Boja -->
<span class="w-5 h-5 text-primary-600" set:html={calendar} />
<span class="w-6 h-6 text-gray-400" set:html={envelope} />

<!-- Veličina -->
<span class="w-4 h-4" set:html={phone} />  <!-- 16px -->
<span class="w-5 h-5" set:html={phone} />  <!-- 20px -->
<span class="w-6 h-6" set:html={phone} />  <!-- 24px -->

<!-- Hover efekti -->
<span class="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" set:html={heart} />

<!-- Animacije -->
<button class="group">
  <span class="w-5 h-5 group-hover:translate-x-1 transition-transform inline-block" set:html={arrowRight} />
</button>

<style>
  span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

### Dostupne ikone

Heroicons ima preko 200 ikona. Najčešće korišćene (sa tačnim imenima fajlova):

- **Navigation:** `home`, `bars-3` (menu), `x-mark`, `chevron-down`, `chevron-up`, `arrow-right`, `arrow-left`
- **Communication:** `envelope`, `phone`, `chat-bubble-left-right`
- **Location:** `map-pin`, `globe-alt`
- **Calendar & Time:** `calendar`, `clock`
- **User:** `user`, `user-circle`, `user-group`
- **Actions:** `heart`, `bookmark`, `share`, `magnifying-glass`
- **Status:** `check-circle`, `x-circle`, `exclamation-triangle`, `information-circle`
- **Social:** Heroicons ne uključuje social media ikone - koristite drugu biblioteku

**Kako pronaći ime ikone:**
1. Pogledajte na [heroicons.com](https://heroicons.com/)
2. Ili listajte fajlove: `node_modules/heroicons/24/outline/`
3. Ime fajla bez `.svg` ekstenzije je ime ikone

### Dokumentacija

- [Heroicons Website](https://heroicons.com/)
- [Heroicons GitHub](https://github.com/tailwindlabs/heroicons)
- [Icon Search](https://heroicons.com/) - pretraga ikona na zvaničnom sajtu

---

## 🎨 Tailwind UI

Tailwind UI je komercijalni proizvod koji nudi gotove komponente i layout primere optimizovane za Tailwind CSS.

### Šta je Tailwind UI?

Tailwind UI je biblioteka gotovih komponenti i layouta koje možete kopirati i prilagoditi svom projektu. Uključuje:

- **Komponente:** Buttons, Forms, Navigation, Modals, Dropdowns, itd.
- **Layout primeri:** Landing pages, Dashboard, E-commerce, itd.
- **Best practices:** Optimizovani kod sa Tailwind CSS-om

### Kako dobiti pristup?

1. **Kupite licencu** na [tailwindui.com](https://tailwindui.com/)
   - Individual License: $249 (jednokratno)
   - Team License: $399 (jednokratno)
   - Lifetime pristup svim komponentama

2. **Alternativa - Besplatne opcije:**
   - **Flowbite** - Besplatna Tailwind komponenta biblioteka
   - **Headless UI** - Besplatne nepristrasne komponente (za React/Vue)
   - **DaisyUI** - ✅ Već instalirano u vašem projektu!

### Korišćenje Tailwind UI komponenti

Ako imate pristup Tailwind UI:

1. Idite na [tailwindui.com](https://tailwindui.com/)
2. Pretražite komponente koje vam trebaju
3. Kopirajte HTML/Tailwind kod
4. Prilagodite Astro komponentama
5. Integrišite sa vašim dizajnom

### Primer konverzije Tailwind UI → Astro

**Tailwind UI kod:**
```html
<button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
  Button text
</button>
```

**Astro komponenta:**
```astro
---
interface Props {
  text: string;
  variant?: 'primary' | 'secondary';
}

const { text, variant = 'primary' } = Astro.props;
---

<button 
  type="button" 
  class={variant === 'primary' 
    ? 'rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
    : 'rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300'
  }
>
  {text}
</button>
```

### Besplatne alternative

#### 1. DaisyUI (✅ Već instalirano)

```html
<!-- Button -->
<button class="btn btn-primary">Click me</button>

<!-- Card -->
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Card title</h2>
    <p>Card content</p>
  </div>
</div>
```

#### 2. Flowbite (Astro kompatibilno)

```bash
npm install flowbite
```

#### 3. Headless UI (za interaktivne komponente)

```bash
npm install @headlessui/react  # Za React
npm install @headlessui/vue    # Za Vue
```

### Preporuke

Za vaš Astro projekat, preporučujem:

1. **Heroicons** ✅ - Za ikone (besplatno)
2. **DaisyUI** ✅ - Za osnovne komponente (besplatno)
3. **Tailwind UI** - Za kompleksnije layout primere (plaćeno, ali opciono)
4. **Custom komponente** - Za specifične potrebe projekta

---

## 📚 Dodatni resursi

- [Tailwind CSS Dokumentacija](https://tailwindcss.com/docs)
- [Astro Dokumentacija](https://docs.astro.build/)
- [Heroicons Dokumentacija](https://heroicons.com/)
- [DaisyUI Dokumentacija](https://daisyui.com/)
- [Tailwind UI](https://tailwindui.com/) (komercijalno)
