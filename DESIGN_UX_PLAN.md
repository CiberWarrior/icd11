# Plan za Moderan Dizajn i UX - ICD 11 2027

## 🎯 Ciljevi

1. **Moderan i profesionalan izgled** - Refleksira važnost znanstvenog kongresa
2. **Odličan UX** - Intuitivna navigacija i jasne call-to-action
3. **Responsive dizajn** - Savršeno funkcionira na svim uređajima
4. **Performance** - Brzo učitavanje i smooth animacije
5. **Accessibility** - Dostupno svima (WCAG 2.1 AA)

---

## 🎨 Dizajn Koncept

### Design System

#### Boje (Color Palette)
```
Primarna paleta:
- Primary Blue: #1e3c72 (trenutna) → #0d47a1 (modernija, življa)
- Secondary Blue: #1565c0
- Light Blue: #e3f2fd → #e8f4f8 (meksa, modernija)
- Accent: #dc2626 (red) → #c62828 (tamniji, profesionalniji)
- Success: #10b981 (green-500)
- Warning: #f59e0b (amber-500)
- Error: #ef4444 (red-500)

Neutral paleta:
- Text Primary: #1a202c (gray-900)
- Text Secondary: #4a5568 (gray-700)
- Text Tertiary: #718096 (gray-500)
- Background: #ffffff
- Background Secondary: #f7fafc (gray-50)
- Border: #e2e8f0 (gray-200)
```

#### Tipografija
```
Headings:
- Font: Inter, system-ui, sans-serif (modern, readable)
- H1: 3rem (48px) / 1.2 line-height / 700 weight
- H2: 2.25rem (36px) / 1.3 line-height / 600 weight
- H3: 1.875rem (30px) / 1.4 line-height / 600 weight

Body:
- Font: Inter, system-ui, sans-serif
- Base: 1rem (16px) / 1.6 line-height / 400 weight
- Large: 1.125rem (18px) / 1.6 line-height
- Small: 0.875rem (14px) / 1.5 line-height
```

#### Spacing System
```
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)
- 4xl: 6rem (96px)
```

#### Shadows
```
- sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
- xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

#### Border Radius
```
- sm: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- 2xl: 1.5rem (24px)
- full: 9999px
```

---

## 📐 Layout Struktura

### Header (Navigation)
```
┌─────────────────────────────────────────────────┐
│  [Logo]  [Home] [About] [Program] [Contact]   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Komponente:**
- Logo (lijevo)
- Navigation menu (centar/desno)
- Mobile hamburger menu
- Sticky header s scroll effect
- Active state indicators

### Hero Section
```
┌─────────────────────────────────────────────────┐
│                                                 │
│           [Large Logo/Title]                    │
│                                                 │
│      "11th International Congress of           │
│           Dipterology"                          │
│                                                 │
│         Zagreb, Croatia | July 10-16, 2027     │
│                                                 │
│         [Newsletter Form Card]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Poboljšanja:**
- Veći, impresivniji hero
- Gradient overlay
- Subtle animacije (fade-in, slide-up)
- Call-to-action buttons
- Scroll indicator

### Content Sections

#### 1. About Section
- Kratak opis kongresa
- Key information cards
- Statistics (broj sudionika, godina, itd.)
- Icon-based layout

#### 2. Program Preview
- Timeline layout
- Key dates
- Important deadlines
- Visual calendar

#### 3. Location Section
- Zagreb city highlight
- Map integration (Google Maps)
- Venue information
- Travel information

#### 4. Speakers Section (placeholder)
- Grid layout za future speakers
- Placeholder cards
- "Coming soon" state

#### 5. Newsletter Section
- Već implementirana forma
- Poboljšanja:
  - Veći, prominentniji
  - Success state animacije
  - Better error handling UI

### Footer
```
┌─────────────────────────────────────────────────┐
│  [Logo]  [Quick Links]  [Contact]  [Social]     │
│                                                 │
│           Copyright © 2027                      │
└─────────────────────────────────────────────────┘
```

**Komponente:**
- Logo i kratki opis
- Quick links
- Contact info
- Social media links (ako postoje)
- Copyright

---

## 🎭 Komponente za Redesign

### 1. Button Component
```typescript
Varijante:
- Primary: Solid blue, white text
- Secondary: Outlined, blue border
- Success: Green, za success states
- Danger: Red, za delete/cancel
- Ghost: Transparent, za subtle actions

States:
- Default
- Hover (scale 1.02, shadow increase)
- Active (scale 0.98)
- Disabled (opacity 50%, no pointer)
- Loading (spinner + disabled)
```

### 2. Card Component
```typescript
Varijante:
- Default: White bg, shadow
- Elevated: Veći shadow, hover lift
- Outlined: Border, no shadow
- Glass: Backdrop blur, transparent bg

Features:
- Hover effects
- Clickable state
- Image support
- Header/Footer slots
```

### 3. Form Components
```typescript
Input:
- Label (required indicator)
- Input field (focus states)
- Helper text
- Error message
- Success state

Checkbox/Radio:
- Custom styling
- Hover states
- Focus ring
- Disabled state
```

### 4. Navigation Component
```typescript
Desktop:
- Horizontal menu
- Active state underline
- Hover effects
- Dropdown support (ako treba)

Mobile:
- Hamburger icon
- Slide-in menu
- Overlay backdrop
- Smooth animations
```

---

## 🎬 Animacije i Transitions

### Micro-interactions
1. **Button hover:** Scale 1.02, shadow increase
2. **Card hover:** Lift effect, shadow increase
3. **Input focus:** Border color change, ring effect
4. **Link hover:** Underline animation
5. **Page transitions:** Fade in/out

### Scroll Animations
1. **Fade in on scroll:** Sekcije se pojavljuju dok scrollaš
2. **Slide up:** Content slides up dok scrollaš
3. **Parallax effect:** Subtle parallax na hero sekciji

### Loading States
1. **Skeleton loaders:** Za future content
2. **Spinner:** Za async operations
3. **Progress bar:** Za form submissions

---

## 📱 Responsive Breakpoints

```
Mobile: < 640px
- Stacked layout
- Full-width components
- Hamburger menu
- Larger touch targets (min 44x44px)

Tablet: 640px - 1024px
- 2-column layouts gdje je moguće
- Adjusted spacing
- Touch-friendly navigation

Desktop: > 1024px
- Full layout
- Multi-column grids
- Hover states active
- Desktop navigation
```

---

## ♿ Accessibility Improvements

1. **Semantic HTML:** Proper heading hierarchy, landmarks
2. **ARIA labels:** Za interaktivne elemente
3. **Keyboard navigation:** Tab order, focus indicators
4. **Color contrast:** WCAG AA minimum (4.5:1)
5. **Alt text:** Za sve slike
6. **Screen reader support:** Proper labels i descriptions
7. **Focus management:** Visible focus states

---

## 🚀 Performance Optimizacije

1. **Image optimization:**
   - WebP format
   - Lazy loading
   - Responsive images (srcset)
   - Proper sizing

2. **Code splitting:**
   - Astro automatski radi ovo
   - Lazy load komponente gdje je moguće

3. **CSS optimization:**
   - Tailwind purging (automatski)
   - Critical CSS inline

4. **Font loading:**
   - System fonts (brže)
   - Ili font-display: swap za custom fonts

---

## 📋 Implementation Plan (Prioriteti)

### Faza 1: Foundation (Visok prioritet)
- [ ] Update color palette u Tailwind config
- [ ] Kreirati base komponente (Button, Card, Input)
- [ ] Redesign Header/Navigation
- [ ] Redesign Footer
- [ ] Update global styles

### Faza 2: Hero & Landing (Visok prioritet)
- [ ] Redesign Hero sekciju
- [ ] Poboljšati newsletter form dizajn
- [ ] Dodati scroll animations
- [ ] Optimizirati logo display

### Faza 3: Content Sections (Srednji prioritet)
- [ ] About sekcija
- [ ] Program preview sekcija
- [ ] Location sekcija
- [ ] Speakers placeholder sekcija

### Faza 4: Polish (Srednji prioritet)
- [ ] Micro-interactions
- [ ] Loading states
- [ ] Error states
- [ ] Success states
- [ ] Smooth page transitions

### Faza 5: Advanced (Nizak prioritet)
- [ ] Dark mode (opcionalno)
- [ ] Advanced animations
- [ ] Parallax effects
- [ ] Interactive elements

---

## 🎨 Design Inspiration & Trends

### Modern Web Design Trends 2024-2025
1. **Glassmorphism** - Već koristimo, možemo proširiti
2. **Gradient overlays** - Na hero sekciji
3. **Bento grid layouts** - Za content sections
4. **Smooth animations** - Micro-interactions
5. **Bold typography** - Veliki, čitljivi headings
6. **Minimalist navigation** - Clean, simple
7. **Card-based layouts** - Za organizaciju contenta
8. **Soft shadows** - Umjesto hard borders

### Academic/Conference Website Best Practices
1. **Clear hierarchy** - Važne informacije na vrhu
2. **Easy navigation** - Lako pronaći informacije
3. **Trust signals** - Logo, organizatori, partneri
4. **Call-to-actions** - Jasni, prominentni
5. **Information architecture** - Logička organizacija
6. **Professional imagery** - Visoka kvaliteta
7. **Contact accessibility** - Lako pronaći kontakt

---

## 📝 Next Steps

1. **Review ovog plana** - Diskutiraj i prilagodi prema potrebama
2. **Prioritiziraj** - Odluči što je najvažnije prvo
3. **Kreni s implementacijom** - Faza po faza
4. **Testiraj** - Na različitim uređajima i browserima
5. **Iteriraj** - Poboljšavaj na osnovu feedbacka

---

## 🔗 Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Astro Documentation](https://docs.astro.build)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)
