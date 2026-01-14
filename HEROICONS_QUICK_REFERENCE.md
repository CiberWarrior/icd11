# Heroicons Quick Reference

Brzi vodič za korišćenje Heroicons ikona u Astro komponentama.

## Osnovni način korišćenja

```astro
---
// 1. Importuj SVG kao raw string
import calendar from 'heroicons/24/outline/calendar.svg?raw';
---

<!-- 2. Prikaži ikonu koristeći set:html -->
<span class="w-5 h-5 text-primary-600 inline-block" set:html={calendar} />

<!-- 3. Dodaj CSS za pravilno prikazivanje -->
<style>
  span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

## Najčešće korišćene ikone

### Navigacija
```astro
import home from 'heroicons/24/outline/home.svg?raw';
import bars3 from 'heroicons/24/outline/bars-3.svg?raw';  // menu icon
import xMark from 'heroicons/24/outline/x-mark.svg?raw';  // close icon
import chevronDown from 'heroicons/24/outline/chevron-down.svg?raw';
import chevronUp from 'heroicons/24/outline/chevron-up.svg?raw';
import chevronLeft from 'heroicons/24/outline/chevron-left.svg?raw';
import chevronRight from 'heroicons/24/outline/chevron-right.svg?raw';
import arrowRight from 'heroicons/24/outline/arrow-right.svg?raw';
import arrowLeft from 'heroicons/24/outline/arrow-left.svg?raw';
```

### Komunikacija
```astro
import envelope from 'heroicons/24/outline/envelope.svg?raw';
import phone from 'heroicons/24/outline/phone.svg?raw';
import chatBubble from 'heroicons/24/outline/chat-bubble-left-right.svg?raw';
```

### Lokacija i vreme
```astro
import mapPin from 'heroicons/24/outline/map-pin.svg?raw';
import globeAlt from 'heroicons/24/outline/globe-alt.svg?raw';
import calendar from 'heroicons/24/outline/calendar.svg?raw';
import clock from 'heroicons/24/outline/clock.svg?raw';
```

### Korisnici
```astro
import user from 'heroicons/24/outline/user.svg?raw';
import userCircle from 'heroicons/24/outline/user-circle.svg?raw';
import userGroup from 'heroicons/24/outline/user-group.svg?raw';
import users from 'heroicons/24/outline/users.svg?raw';
```

### Akcije
```astro
import heart from 'heroicons/24/outline/heart.svg?raw';
import bookmark from 'heroicons/24/outline/bookmark.svg?raw';
import share from 'heroicons/24/outline/share.svg?raw';
import magnifyingGlass from 'heroicons/24/outline/magnifying-glass.svg?raw';
import pencil from 'heroicons/24/outline/pencil.svg?raw';
import trash from 'heroicons/24/outline/trash.svg?raw';
import plus from 'heroicons/24/outline/plus.svg?raw';
import minus from 'heroicons/24/outline/minus.svg?raw';
```

### Status ikone
```astro
import checkCircle from 'heroicons/24/outline/check-circle.svg?raw';
import xCircle from 'heroicons/24/outline/x-circle.svg?raw';
import exclamationTriangle from 'heroicons/24/outline/exclamation-triangle.svg?raw';
import informationCircle from 'heroicons/24/outline/information-circle.svg?raw';
```

### Dokument i fajlovi
```astro
import document from 'heroicons/24/outline/document.svg?raw';
import documentText from 'heroicons/24/outline/document-text.svg?raw';
import folder from 'heroicons/24/outline/folder.svg?raw';
import paperClip from 'heroicons/24/outline/paper-clip.svg?raw';
```

## Varijante veličina

### 24px (outline ili solid)
```astro
import calendar from 'heroicons/24/outline/calendar.svg?raw';
import calendarSolid from 'heroicons/24/solid/calendar.svg?raw';
```

### 20px (samo solid)
```astro
import calendar20 from 'heroicons/20/solid/calendar.svg?raw';
```

### 16px (samo solid)
```astro
import calendar16 from 'heroicons/16/solid/calendar.svg?raw';
```

## Primeri korišćenja

### Ikona sa tekstom
```astro
---
import calendar from 'heroicons/24/outline/calendar.svg?raw';
---

<div class="flex items-center space-x-2">
  <span class="w-5 h-5 text-primary-600 inline-block" set:html={calendar} />
  <span>July 10-16, 2027</span>
</div>

<style>
  span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

### Ikona u buttonu
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

### Ikona sa hover efektom
```astro
---
import heart from 'heroicons/24/outline/heart.svg?raw';
---

<button class="group">
  <span 
    class="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors inline-block" 
    set:html={heart} 
  />
</button>

<style>
  button span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

### Animirana ikona
```astro
---
import arrowRight from 'heroicons/24/outline/arrow-right.svg?raw';
---

<a href="#" class="group flex items-center space-x-2">
  <span>Read more</span>
  <span 
    class="w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" 
    set:html={arrowRight} 
  />
</a>

<style>
  a span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

### Status poruke
```astro
---
import checkCircle from 'heroicons/24/outline/check-circle.svg?raw';
import xCircle from 'heroicons/24/outline/x-circle.svg?raw';
---

<!-- Success -->
<div class="flex items-center space-x-2 text-green-600">
  <span class="w-5 h-5 inline-block" set:html={checkCircle} />
  <span>Successfully saved!</span>
</div>

<!-- Error -->
<div class="flex items-center space-x-2 text-red-600">
  <span class="w-5 h-5 inline-block" set:html={xCircle} />
  <span>Something went wrong</span>
</div>

<style>
  div span :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
```

## Tailwind klase za ikone

### Veličine
- `w-3 h-3` - 12px (vrlo malo)
- `w-4 h-4` - 16px (malo)
- `w-5 h-5` - 20px (standard)
- `w-6 h-6` - 24px (srednje)
- `w-8 h-8` - 32px (veliko)
- `w-10 h-10` - 40px (vrlo veliko)

### Boje
- `text-gray-400` - siva
- `text-primary-600` - primarna boja
- `text-red-600` - crvena
- `text-green-600` - zelena
- `text-blue-600` - plava
- `text-white` - bela

### Hover efekti
- `hover:text-primary-600` - promena boje
- `hover:scale-110` - povećanje
- `hover:rotate-90` - rotacija
- `hover:translate-x-1` - pomeranje

### Transicije
- `transition-colors` - glatka promena boje
- `transition-transform` - glatka promena transformacije
- `transition-all` - glatka promena svega

## Pronalaženje ikona

1. **Online:** [heroicons.com](https://heroicons.com/)
2. **Lokalno:** 
   ```bash
   ls node_modules/heroicons/24/outline/
   ```
3. **Pretraga:**
   ```bash
   ls node_modules/heroicons/24/outline/ | grep calendar
   ```

## Česta pitanja

**Q: Ikona se ne prikazuje?**
A: Proverite:
- Da li ste importovali sa `?raw` na kraju
- Da li ste dodali CSS stil za SVG
- Da li je ime fajla tačno (npr. `bars-3` ne `menu`)

**Q: Ikona je pogrešne veličine?**
A: Dodajte `inline-block` klasu na span element i proverite CSS stil.

**Q: Kako promeniti boju ikone?**
A: Dodajte `text-{color}` klasu na span element. SVG koristi `currentColor`.

**Q: Kako napraviti animaciju?**
A: Dodajte `transition-{property}` i hover/group klase na span element.
