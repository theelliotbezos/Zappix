# Zappix — UI/UX Design Specification
**Version 1.0 | zappix.ng**

> This document is the single source of truth for how Zappix looks and feels. Every colour, font, spacing value, component, and page layout is defined here. Follow it exactly and the app will look professional, consistent, and polished.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Colours](#2-colours)
3. [Typography](#3-typography)
4. [Spacing & Sizing System](#4-spacing--sizing-system)
5. [Border Radius](#5-border-radius)
6. [Shadows](#6-shadows)
7. [Icons](#7-icons)
8. [Core Components](#8-core-components)
9. [Layout System](#9-layout-system)
10. [Marketing Pages](#10-marketing-pages)
11. [Auth Pages](#11-auth-pages)
12. [Dashboard — Shell](#12-dashboard--shell)
13. [Dashboard Home](#13-dashboard-home)
14. [Status Scheduler](#14-status-scheduler)
15. [Broadcast Engine](#15-broadcast-engine)
16. [Analytics Dashboard](#16-analytics-dashboard)
17. [Contact Manager](#17-contact-manager)
18. [Ad Slot Manager](#18-ad-slot-manager)
19. [Chatbot Builder](#19-chatbot-builder)
20. [Multi-Account Manager](#20-multi-account-manager)
21. [Referral Dashboard](#21-referral-dashboard)
22. [Settings Pages](#22-settings-pages)
23. [Motion & Animation](#23-motion--animation)
24. [Responsive Design](#24-responsive-design)
25. [Accessibility](#25-accessibility)
26. [Empty States](#26-empty-states)
27. [Loading States](#27-loading-states)
28. [Error States](#28-error-states)
29. [Notifications & Toasts](#29-notifications--toasts)

---

## 1. Design Philosophy

### The Feeling
Zappix should feel like a **premium Nigerian-built product** — not a generic SaaS template. Every WhatsApp TV owner who opens it should feel like they are using something built specifically for them.

**Four words that describe the Zappix UI:**
- **Clean** — lots of white space, nothing cluttered or overwhelming
- **Friendly** — rounded corners, warm green accents, approachable typography
- **Confident** — bold numbers, clear hierarchy, no visual noise
- **Fast** — instant feedback, smooth transitions, no janky loading

### What to Avoid
- Dark mode (Zappix is light mode only)
- Purple, blue, or red as primary colours
- Sharp 90-degree corners on interactive elements
- Dense, cramped layouts with too many elements per row
- Generic "dashboard" aesthetics that look like every other SaaS
- More than 3 font weights on any single screen
- Decorative animations that serve no purpose

### The One Rule
If you look at a screen and it feels busy or confusing, remove things until it feels calm. Then add back only what is absolutely necessary.

---

## 2. Colours

### How to Set Up Colours
In your `globals.css` file, define these CSS variables inside `:root {}`. Use these variables everywhere in your code — never hardcode hex values.

```css
:root {
  /* ── Primary Brand ─────────────────────────────── */
  --green-600: #16A34A;   /* Primary buttons, active states, links */
  --green-500: #22C55E;   /* Hover states, success icons */
  --green-400: #4ADE80;   /* Light accents, progress bars */
  --green-100: #DCFCE7;   /* Tag backgrounds, badge fills, chip fills */
  --green-50:  #F0FDF4;   /* Card tints, section backgrounds, input focus tint */

  /* ── Neutral Base ──────────────────────────────── */
  --white:     #FFFFFF;   /* Page background, card background */
  --gray-50:   #F8FAFC;   /* App shell background, alternate table rows */
  --gray-100:  #F1F5F9;   /* Sidebar background, input backgrounds */
  --gray-200:  #E2E8F0;   /* Borders, dividers, separators */
  --gray-300:  #CBD5E1;   /* Disabled borders, placeholder text borders */
  --gray-400:  #94A3B8;   /* Placeholder text, disabled text */
  --gray-500:  #64748B;   /* Muted text, subtitles, metadata */
  --gray-700:  #334155;   /* Secondary body text */
  --gray-900:  #0F172A;   /* Primary text, headings */

  /* ── Semantic Colours ──────────────────────────── */
  --success-bg:   #F0FDF4;  /* Success message background */
  --success-text: #16A34A;  /* Success message text */
  --success-border:#86EFAC; /* Success message border */

  --warning-bg:   #FFFBEB;  /* Warning message background */
  --warning-text: #D97706;  /* Warning message text */
  --warning-border:#FCD34D; /* Warning message border */

  --error-bg:   #FEF2F2;    /* Error message background */
  --error-text: #DC2626;    /* Error message text */
  --error-border:#FCA5A5;   /* Error message border */

  --info-bg:   #EFF6FF;     /* Info message background */
  --info-text: #2563EB;     /* Info message text */
  --info-border:#BFDBFE;    /* Info message border */
}
```

### Colour Usage Rules

| Colour | When to Use | When NOT to Use |
|--------|------------|-----------------|
| `--green-600` | Primary buttons, active sidebar items, links, checkboxes, progress bars, focus rings | Backgrounds of large areas |
| `--green-50` | Card tints when you want a gentle green wash, input focus backgrounds | Body text, borders |
| `--green-100` | Tags, badges, chips, small highlights | Large backgrounds |
| `--gray-900` | All headings, primary body text | Anything that should be subtle |
| `--gray-500` | Metadata (dates, counts), helper text, secondary descriptions | Headings or anything important |
| `--gray-200` | Card borders, dividers, separator lines | Text |
| `--white` | All card and modal backgrounds | Nothing else |
| `--gray-50` | The main app shell background behind cards | Inside cards |

### Status Colours for Pills and Dots

```
Connected / Active / Live / Success → --green-600 text, --green-50 background, --green-100 border
Scheduled / Pending / In Progress   → #2563EB text, #EFF6FF background, #BFDBFE border
Sent / Completed / Done            → --gray-500 text, --gray-100 background, --gray-200 border
Failed / Error / Banned            → #DC2626 text, #FEF2F2 background, #FCA5A5 border
Warning / At Risk / Warm-up        → #D97706 text, #FFFBEB background, #FCD34D border
```

---

## 3. Typography

### Fonts to Install
Add these two lines to your `layout.tsx` or `_document.tsx`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700&family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

### Font Assignments

```css
/* In globals.css */
body {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  color: var(--gray-900);
  background: var(--gray-50);
  -webkit-font-smoothing: antialiased;
}

/* Apply Fraunces to headings and big numbers */
h1, h2, .display, .kpi-number, .hero-title {
  font-family: 'Fraunces', serif;
}
```

### Type Scale

Use this exact scale. Do not invent new sizes.

| Name | Size | Weight | Font | Line Height | Use For |
|------|------|--------|------|-------------|---------|
| `display-2xl` | 72px | 900 | Fraunces | 1.0 | Landing page hero headline |
| `display-xl` | 56px | 900 | Fraunces | 1.05 | Section hero headlines |
| `display-lg` | 40px | 800 | Fraunces | 1.1 | Page section titles |
| `display-md` | 32px | 800 | Fraunces | 1.15 | Card headlines, KPI numbers |
| `display-sm` | 24px | 700 | Fraunces | 1.2 | Sub-section headings |
| `text-xl` | 20px | 700 | Nunito | 1.4 | Large body, intro paragraphs |
| `text-lg` | 18px | 600 | Nunito | 1.5 | Body copy, descriptions |
| `text-md` | 16px | 500 | Nunito | 1.6 | Default body text |
| `text-sm` | 14px | 500 | Nunito | 1.5 | Secondary text, table cells |
| `text-xs` | 12px | 600 | Nunito | 1.4 | Labels, captions, badges |
| `text-2xs` | 11px | 700 | Nunito | 1.3 | Eyebrow text, micro labels |

### Tailwind Classes for Each Size

```
display-2xl → text-7xl font-black (Fraunces)
display-xl  → text-5xl font-black (Fraunces)
display-lg  → text-4xl font-extrabold (Fraunces)
display-md  → text-3xl font-extrabold (Fraunces)
display-sm  → text-2xl font-bold (Fraunces)
text-xl     → text-xl font-bold (Nunito)
text-lg     → text-lg font-semibold (Nunito)
text-md     → text-base font-medium (Nunito)
text-sm     → text-sm font-medium (Nunito)
text-xs     → text-xs font-semibold (Nunito)
text-2xs    → text-[11px] font-bold (Nunito)
```

### Eyebrow Labels
Short all-caps labels that appear above section headings to provide context.

```
FEATURES  |  HOW IT WORKS  |  PRICING
```

Style: `text-[11px] font-bold uppercase tracking-widest text-green-600`

---

## 4. Spacing & Sizing System

Use **4px as your base unit**. Every spacing value must be a multiple of 4.

```
4px   → very tight (between icon and label)
8px   → tight (inside compact components)
12px  → small (between list items)
16px  → default (card padding, between form fields)
20px  → medium (between sections within a card)
24px  → large (card padding on desktop)
32px  → section gap (between major sections inside a page)
40px  → page section padding
48px  → large section padding
64px  → major section breaks
80px  → hero section padding
96px  → very large section breaks
```

### Component Internal Padding

| Component | Padding |
|-----------|---------|
| Small button | 8px top/bottom, 16px left/right |
| Medium button | 10px top/bottom, 20px left/right |
| Large button | 14px top/bottom, 28px left/right |
| Input field | 10px top/bottom, 14px left/right |
| Small card | 16px all sides |
| Medium card | 24px all sides |
| Large card | 32px all sides |
| Table cell | 12px top/bottom, 16px left/right |
| Sidebar item | 10px top/bottom, 12px left/right |
| Badge / pill | 3px top/bottom, 10px left/right |
| Chip | 6px top/bottom, 14px left/right |

---

## 5. Border Radius

```css
:root {
  --radius-sm:   6px;   /* Small elements: badges, pills, tags */
  --radius-md:  10px;   /* Inputs, small buttons, table rows */
  --radius-lg:  14px;   /* Cards, modals, dropdowns */
  --radius-xl:  20px;   /* Large cards, panels */
  --radius-2xl: 28px;   /* Feature cards on landing page */
  --radius-full: 9999px; /* Pills, round buttons, avatars */
}
```

### When to Use Each Radius

| Radius | Elements |
|--------|----------|
| `radius-sm` (6px) | Badges, status dots (4px), small tags |
| `radius-md` (10px) | Form inputs, selects, small buttons, dropdown items |
| `radius-lg` (14px) | Dashboard cards, modals, dropdowns, tooltips |
| `radius-xl` (20px) | Large feature cards, sidebar, pricing plan cards |
| `radius-2xl` (28px) | Landing page hero cards, large marketing elements |
| `radius-full` | All buttons (Zappix uses pill-shaped buttons), chips, avatar images |

**Rule:** All buttons in Zappix use `border-radius: 9999px` (fully rounded/pill shape). This is one of the brand's signature design traits.

---

## 6. Shadows

```css
:root {
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.09), 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 24px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06);
  --shadow-green: 0 8px 24px rgba(22, 163, 74, 0.20);
  --shadow-green-lg: 0 12px 36px rgba(22, 163, 74, 0.28);
}
```

### Shadow Usage

| Shadow | When to Use |
|--------|-------------|
| `shadow-xs` | Subtle lift on hover for flat elements |
| `shadow-sm` | Default card shadow |
| `shadow-md` | Elevated cards, active/hovered cards |
| `shadow-lg` | Modals, dropdowns, floating panels |
| `shadow-xl` | Full-page modals, command palette |
| `shadow-green` | Primary buttons (resting state) |
| `shadow-green-lg` | Primary buttons (hover state) |

---

## 7. Icons

Use **Lucide React** for all icons. Install: `npm install lucide-react`

```tsx
import { BarChart2, Send, Users, Calendar } from 'lucide-react'
```

### Icon Sizes

| Context | Size | Tailwind Class |
|---------|------|----------------|
| Inside buttons | 16px | `w-4 h-4` |
| Sidebar navigation | 18px | `w-[18px] h-[18px]` |
| Feature icons in cards | 20px | `w-5 h-5` |
| Section header icons | 24px | `w-6 h-6` |
| Large feature icons | 32px | `w-8 h-8` |
| Empty state illustrations | 48px | `w-12 h-12` |

### Icon Usage Rules
- Always pair an icon with a text label in navigation (never icon only, except on mobile)
- Use `strokeWidth={1.8}` on all Lucide icons — the default 2 is slightly too thick for this design
- Icon colour should match its surrounding text colour
- Never use filled/solid icons — always use the default outlined style from Lucide

### Icon Assignments per Feature

```
Dashboard       → LayoutDashboard
Status Scheduler → Calendar
Broadcast Engine → Send
Contact Manager  → Users
Ad Slot Manager  → DollarSign
Analytics        → BarChart2
Chatbot Builder  → Bot
Menu Bot         → Menu
Multi-Account    → Smartphone
Referrals        → Gift
Settings         → Settings
Team Members     → UserPlus
Activity Log     → Activity
Billing          → CreditCard
Notifications    → Bell
Profile          → User
Logout           → LogOut
Connect Number   → QrCode
Warm-up          → Zap
Performance      → TrendingUp
```

---

## 8. Core Components

This section defines every reusable component in Zappix. Build each one exactly as described, then reuse it everywhere.

---

### 8.1 Buttons

There are 4 button variants. All use `border-radius: 9999px`.

#### Primary Button
The main call-to-action. Green background, white text.

```
Background:  var(--green-600) → #16A34A
Text:        white, font-weight 700, font-size 14px (Nunito)
Padding:     10px top/bottom, 22px left/right
Shadow:      var(--shadow-green)
Border:      none

Hover:       background darkens to #15803D
             shadow becomes var(--shadow-green-lg)
             transform: translateY(-1px)
             transition: all 200ms ease

Active:      transform: translateY(0px)
             background: #166534

Disabled:    opacity: 0.5, cursor: not-allowed, no transform
```

Sizes:
```
Small  → padding: 7px 16px, font-size: 13px
Medium → padding: 10px 22px, font-size: 14px  (default)
Large  → padding: 14px 30px, font-size: 16px
```

#### Ghost Button
Secondary actions. Transparent background with border.

```
Background:  transparent
Border:      1.5px solid var(--gray-200)
Text:        var(--gray-700), font-weight 700, font-size 14px
Padding:     10px 22px
Shadow:      none

Hover:       border-color: var(--green-600)
             text-color: var(--green-600)
             background: var(--green-50)
             transition: all 200ms ease
```

#### Soft Button
Softer version — green background tint.

```
Background:  var(--green-50)
Border:      1.5px solid var(--green-100) (#DCFCE7 border not --green-100)
Text:        var(--green-600), font-weight 700, font-size 14px
Padding:     10px 22px

Hover:       background: var(--green-100)
             border-color: #86EFAC
```

#### Danger Button
For destructive actions like delete or disconnect.

```
Background:  #FEF2F2
Border:      1.5px solid #FCA5A5
Text:        #DC2626, font-weight 700
Padding:     10px 22px

Hover:       background: #FEE2E2
             border-color: #F87171
```

---

### 8.2 Form Inputs

All inputs share this base style:

```
Background:   white
Border:       1.5px solid var(--gray-200)
Border radius: var(--radius-md) → 10px
Padding:      10px 14px
Font:         14px Nunito, font-weight 500
Text color:   var(--gray-900)
Placeholder:  var(--gray-400)
Width:        100% of its container

Focus state:
  border-color: var(--green-600)
  box-shadow: 0 0 0 3px var(--green-50)
  outline: none

Error state:
  border-color: #EF4444
  box-shadow: 0 0 0 3px #FEF2F2

Disabled state:
  background: var(--gray-50)
  border-color: var(--gray-200)
  text-color: var(--gray-400)
  cursor: not-allowed
```

#### Input Label
Always place labels above inputs, never as placeholders for important fields.

```
Font size:    13px
Font weight:  700 (bold)
Color:        var(--gray-700)
Margin bottom: 6px
```

#### Helper Text
Small text below an input providing extra context.

```
Font size:    12px
Font weight:  500
Color:        var(--gray-500)
Margin top:   5px
```

#### Textarea
Same as input but:
```
Min-height:   110px
Resize:       vertical only
```

#### Select Dropdown
Same styling as input. Add a ChevronDown icon (16px, gray-400) positioned absolutely at the right side, 14px from right edge.

---

### 8.3 Cards

#### Standard Card
```
Background:   white
Border:       1.5px solid var(--gray-200)
Border radius: var(--radius-lg) → 14px
Padding:      24px
Shadow:       var(--shadow-sm)

Hover (interactive cards only):
  border-color: #86EFAC (green-300)
  shadow: var(--shadow-md)
  transform: translateY(-2px)
  transition: all 250ms ease
```

#### KPI Card (for dashboard metrics)
```
Background:   white
Border:       1.5px solid var(--gray-200)
Border radius: var(--radius-lg) → 14px
Padding:      20px 24px
Shadow:       var(--shadow-sm)

Structure:
  Label:    12px, font-weight 700, var(--gray-500), UPPERCASE, letter-spacing 0.5px
  Value:    28–32px, font-weight 900, Fraunces, var(--gray-900) or var(--green-600)
  Change:   12px, font-weight 700
            Positive: var(--green-600) with ↑ prefix
            Negative: #EF4444 with ↓ prefix
```

#### Feature Card (landing page)
```
Background:   white
Border:       1.5px solid var(--gray-200)
Border radius: var(--radius-xl) → 20px
Padding:      28px
Shadow:       var(--shadow-sm)

Feature icon container:
  Width/Height: 46px × 46px
  Background:   var(--green-50)
  Border:       1.5px solid var(--green-100)
  Border radius: var(--radius-md) → 10px
  Margin bottom: 16px
  Content:      emoji or Lucide icon in var(--green-600)

Hover:
  border-color: #86EFAC
  shadow: var(--shadow-md)
  transform: translateY(-3px)
  transition: all 250ms ease
```

---

### 8.4 Badges and Pills

#### Status Pill
Rounded pill showing status of an item.

```
Padding:       3px 10px
Border radius: 9999px (full round)
Font size:     11px
Font weight:   700
Display:       inline-flex, align-items: center, gap: 5px

Dot (optional): 6px × 6px circle, same colour as text, margin-right: 4px
```

Colour variants:
```
Live/Active:    text #16A34A, bg #F0FDF4, border #86EFAC
Scheduled/Blue: text #2563EB, bg #EFF6FF, border #BFDBFE
Sent/Grey:      text #64748B, bg #F1F5F9, border #E2E8F0
Failed/Red:     text #DC2626, bg #FEF2F2, border #FCA5A5
Warning/Amber:  text #D97706, bg #FFFBEB, border #FCD34D
```

#### Count Badge
Small number badge (like notification count).

```
Background:   var(--green-600)
Text:         white, 10px, font-weight 800
Padding:      2px 7px
Border radius: 9999px
Min-width:    18px
Height:       18px
```

#### Tag Chip
User-created tags attached to contacts.

```
Padding:      5px 12px
Border radius: 9999px
Font size:    12px
Font weight:  700
Background:   var(--green-50)
Border:       1.5px solid var(--green-100)
Text:         var(--green-600)
Display:      inline-flex, align-items: center, gap: 6px

Remove button (×): 14px, var(--gray-400), hover: var(--gray-600)
```

---

### 8.5 Tables

All data tables share this style:

```
Container:
  background: white
  border: 1.5px solid var(--gray-200)
  border-radius: var(--radius-lg) → 14px
  overflow: hidden (so corners clip table content)

Header row:
  background: var(--gray-50)
  border-bottom: 1.5px solid var(--gray-200)

Header cell:
  font-size: 11px
  font-weight: 800
  color: var(--gray-500)
  text-transform: UPPERCASE
  letter-spacing: 0.8px
  padding: 10px 16px

Body row:
  border-bottom: 1px solid var(--gray-100)
  transition: background 150ms ease

  Hover: background: var(--gray-50)

  Last row: no border-bottom

Body cell:
  font-size: 14px
  font-weight: 500
  color: var(--gray-900)
  padding: 14px 16px
  vertical-align: middle

Alternate row shading (optional):
  Even rows: white
  Odd rows: var(--gray-50)
```

---

### 8.6 Modals

```
Overlay:
  background: rgba(0, 0, 0, 0.40)
  backdrop-filter: blur(4px)
  z-index: 50

Modal panel:
  background: white
  border-radius: var(--radius-xl) → 20px
  padding: 32px
  shadow: var(--shadow-xl)
  max-width: 480px (small), 640px (medium), 800px (large)
  width: calc(100% - 32px) on mobile
  max-height: 90vh
  overflow-y: auto

  Animate in:
    Initial: opacity 0, scale 0.96, translateY 8px
    Final:   opacity 1, scale 1, translateY 0
    Duration: 200ms, ease-out

Modal header:
  Font: 20px, Fraunces, font-weight 800
  Margin-bottom: 8px

Modal subtitle:
  Font: 14px, Nunito, var(--gray-500)
  Margin-bottom: 24px

Close button (X):
  Position: absolute, top: 20px, right: 20px
  Size: 32px × 32px
  Background: var(--gray-100), hover: var(--gray-200)
  Border-radius: 9999px
  Icon: X from Lucide, 16px, var(--gray-500)

Modal footer:
  Margin-top: 28px
  Padding-top: 20px
  Border-top: 1px solid var(--gray-200)
  Display: flex
  Justify: space-between (cancel left, actions right)
  Gap: 10px
```

---

### 8.7 Progress Bar

```
Container:
  height: 6px
  background: var(--gray-200)
  border-radius: 9999px
  overflow: hidden

Fill:
  height: 100%
  background: var(--green-600)
  border-radius: 9999px
  transition: width 400ms ease

Warm-up progress bar (special):
  Fill uses a gradient:
  background: linear-gradient(90deg, #16A34A 0%, #22C55E 100%)
```

---

### 8.8 Toggle Switch

```
Container:
  width: 44px, height: 24px
  background: var(--gray-200) when OFF
  background: var(--green-600) when ON
  border-radius: 9999px
  cursor: pointer
  transition: background 200ms ease

Knob:
  width: 18px, height: 18px
  background: white
  border-radius: 9999px
  position: absolute
  top: 3px
  left: 3px when OFF → right: 3px when ON
  shadow: 0 1px 3px rgba(0,0,0,0.2)
  transition: left/right 200ms ease
```

---

### 8.9 Callout / Alert Box

```
Structure:
  border-left: 4px solid (colour varies by type)
  background: varies by type
  border-radius: var(--radius-md) → 10px
  padding: 14px 16px 14px 20px
  display: flex
  gap: 12px

Label:
  font-size: 13px
  font-weight: 800
  color: varies by type

Body text:
  font-size: 13px
  font-weight: 500
  color: var(--gray-700)

Types:
  NOTE:      border #16A34A, bg #F0FDF4, text #16A34A
  WARNING:   border #D97706, bg #FFFBEB, text #D97706
  IMPORTANT: border #DC2626, bg #FEF2F2, text #DC2626
  INFO:      border #2563EB, bg #EFF6FF, text #2563EB
```

---

## 9. Layout System

### Page Structure

Every page in the Zappix app (not marketing pages) follows this exact structure:

```
┌─────────────────────────────────────────────────────────┐
│                    TOP NAVBAR (68px tall)                │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   SIDEBAR    │           MAIN CONTENT AREA             │
│   (230px)    │                                          │
│   sticky     │   Scrollable, padding: 28px 32px         │
│              │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Top Navbar

```
Height:       68px
Background:   white with backdrop-filter: blur(20px) on scroll
Border-bottom: 1px solid var(--gray-200)
Position:     fixed, top 0, left 0, right 0
Z-index:      100
Padding:      0 24px
Display:      flex, align-items: center, justify-content: space-between

Left side:    Logo (icon + wordmark)
Right side:   [Bell icon] [User avatar with dropdown]
```

### Logo

```
Icon:
  Size: 36px × 36px
  Background: var(--green-600)
  Border-radius: 10px
  Content: ⚡ emoji or lightning bolt SVG
  Shadow: 0 4px 12px rgba(22, 163, 74, 0.30)

Wordmark:
  Font: Fraunces, 22px, font-weight 800
  Color: var(--green-600)
  Letter-spacing: -0.5px
  Margin-left: 10px
```

### Sidebar

```
Width:        230px
Min-height:   calc(100vh - 68px)
Background:   white
Border-right: 1.5px solid var(--gray-200)
Padding:      24px 12px
Position:     sticky, top: 68px
Height:       calc(100vh - 68px)
Overflow-y:   auto

Section label:
  font-size: 10px
  font-weight: 800
  letter-spacing: 1.5px
  color: var(--gray-400)
  text-transform: UPPERCASE
  padding: 0 12px
  margin-bottom: 4px
  margin-top: 20px (first section no top margin)

Sidebar item (nav link):
  display: flex
  align-items: center
  gap: 10px
  padding: 10px 12px
  border-radius: var(--radius-md) → 10px
  font-size: 14px
  font-weight: 700
  color: var(--gray-500)
  cursor: pointer
  transition: all 180ms ease
  margin-bottom: 2px

  Hover:
    background: var(--gray-100)
    color: var(--gray-900)

  Active (current page):
    background: var(--green-50)
    color: var(--green-600)
    border: 1.5px solid var(--green-100)

  Icon: 18px, same colour as text

  Badge (count):
    margin-left: auto
    background: var(--green-600)
    color: white
    font-size: 10px, font-weight 800
    padding: 2px 7px
    border-radius: 9999px
```

### Main Content Area

```
Flex: 1 (fills remaining width after sidebar)
Padding: 28px 32px
Overflow-y: auto
Background: var(--gray-50)
```

### Page Header (inside main content)

Every page inside the app starts with a page header:

```
Display: flex, justify-content: space-between, align-items: flex-start
Margin-bottom: 24px

Left side:
  Page title: 26px, Fraunces, font-weight 800, var(--gray-900)
  Page subtitle: 13px, Nunito, font-weight 600, var(--gray-500), margin-top: 4px

Right side:
  Primary action button (e.g. "+ New Broadcast")
```

---

## 10. Marketing Pages

### 10.1 Landing Page — zappix.ng

#### Navbar (Marketing)
```
Height:       68px
Background:   rgba(255, 255, 255, 0.88) with backdrop-filter: blur(20px)
Border-bottom: 1px solid var(--gray-200)
Position:     fixed
Padding:      0 48px

Left:   Logo
Center: Nav links — Features, Pricing, Blog, Docs
        Font: 14px, Nunito, font-weight 600, var(--gray-500)
        Hover: var(--gray-900)
        Gap between links: 32px
Right:  [Ghost button: Sign in] [Primary button: Start free trial]
```

#### Hero Section
```
Layout:       2-column grid (1fr 1fr), gap: 60px, align-items: center
Padding:      100px 48px 80px
Max-width:    1140px, margin: 0 auto

LEFT COLUMN:
  Eyebrow badge:
    display: inline-flex
    align-items: center
    gap: 7px
    padding: 6px 14px
    background: var(--green-50)
    border: 1px solid #86EFAC
    border-radius: 9999px
    font-size: 12px, font-weight 700, var(--green-600)
    content: "🇳🇬 Built for Nigeria's WhatsApp Economy"
    margin-bottom: 24px

  Headline:
    font: Fraunces, 56px, font-weight 900
    line-height: 1.08
    letter-spacing: -1.5px
    color: var(--gray-900)
    margin-bottom: 20px

    Key phrase highlight:
      color: var(--green-600)
      position: relative
      ::after pseudo-element:
        content: ''
        position: absolute
        bottom: 4px
        left: 0, right: 0
        height: 8px
        background: var(--green-100) → #DCFCE7
        z-index: -1
        border-radius: 4px

  Subheadline:
    font: Nunito, 17px, font-weight 500
    color: var(--gray-500)
    line-height: 1.75
    max-width: 500px
    margin-bottom: 36px

  CTA buttons:
    display: flex, gap: 12px, flex-wrap: wrap

    Primary: Large primary button "Start free trial →"
    Secondary: Large soft button "▶ Watch demo"

RIGHT COLUMN:
  Floating card stack — 3 cards positioned relatively
  Height: 420px

  Card 1 (main — top, full width):
    Shows a mini bar chart of "This week's reach"
    + large number "94.2k" in Fraunces green
    + "↑ 18% vs last week" in green

  Card 2 (floating bottom-left, width: 200px):
    Rotated: rotate(-2deg)
    Shows "Ad Revenue ₦2.4M this month"
    Animated: floats up and down (CSS keyframe, 4s infinite)

  Card 3 (floating bottom-right, width: 220px):
    Rotated: rotate(1.5deg)
    Shows "47 posts scheduled" + 3 avatar dots
    Animated: floats (5s, offset from card 2)
```

#### Stats Bar
```
Background:   var(--green-50)
Border-top:   1px solid var(--green-100)
Border-bottom: 1px solid var(--green-100)
Padding:      28px 48px

Inner: max-width 1140px, flex, justify: space-around

Each stat:
  Number: Fraunces, 30px, font-weight 900, var(--green-600)
  Label:  Nunito, 13px, font-weight 600, var(--gray-500), margin-top: 3px
  Text-align: center
```

#### Features Grid
```
Section padding:   80px 48px
Max-width:         1140px, margin: 0 auto

Eyebrow label (above section title):
  "EVERYTHING YOU NEED" in green eyebrow style

Section title:
  Fraunces, 40px, font-weight 900, letter-spacing: -1px
  e.g. "Built for how Nigerians\nactually use WhatsApp"

Grid:
  3 columns on desktop, 2 on tablet, 1 on mobile
  gap: 18px
  margin-top: 48px

Each feature card: (see 8.3 Feature Card specification)
```

#### Pricing Section (on landing page — teaser)
Show the 3 plan cards in a preview row with a link to full pricing page.

#### Footer
```
Background:   var(--gray-900)
Color:        white
Padding:      60px 48px 40px

4-column grid:
  Col 1: Logo + tagline + social links
  Col 2: Product links (Features, Pricing, Blog, Changelog)
  Col 3: Company links (About, Contact, Careers)
  Col 4: Legal links (Terms, Privacy, Refund)

Bottom bar:
  Border-top: 1px solid rgba(255,255,255,0.1)
  Padding-top: 24px
  Font: 13px, var(--gray-400)
  "© 2026 Zappix Technologies. Built with ❤️ in Nigeria."
```

---

### 10.2 Pricing Page — zappix.ng/pricing

#### Plan Cards
```
Grid: 3 columns, gap: 20px
Max-width: 960px, margin: 0 auto
Padding: 0 40px 80px

Each plan card:
  background: white
  border: 1.5px solid var(--gray-200)
  border-radius: var(--radius-xl) → 20px
  padding: 32px
  transition: all 250ms ease

  Hover:
    shadow: var(--shadow-md)
    transform: translateY(-3px)

  Popular plan (Growth):
    border-color: var(--green-600)
    shadow: var(--shadow-green)
    position: relative
    ::before: 4px green bar at top

    "Most Popular" tag:
      position: absolute, top: -14px, left: 50%, transform: translateX(-50%)
      background: var(--green-600)
      color: white
      padding: 4px 16px
      border-radius: 9999px
      font-size: 12px, font-weight 800
      white-space: nowrap

Plan name:
  Fraunces, 22px, font-weight 800

Plan description:
  13px, var(--gray-500), margin-bottom: 20px, line-height: 1.5

Price:
  ₦ symbol: 16px, font-weight 700, vertical-align: super
  Amount: Fraunces, 42px, font-weight 900
  Popular plan amount: var(--green-600) colour
  "/month" or "/mo": 13px, var(--gray-500), margin-left: 4px

CTA button:
  width: 100%, margin-top: 20px, margin-bottom: 24px
  Popular plan: Primary button
  Others: Soft button

Divider: 1.5px solid var(--gray-200), margin-bottom: 20px

Feature list:
  Each feature: flex, align-items: flex-start, gap: 9px, margin-bottom: 10px
  Font: 13px, var(--gray-700), font-weight 600, line-height: 1.45
  Check icon: ✓ in var(--green-600), 14px
  Cross (not included): — in var(--gray-400)
```

#### Billing Toggle
```
Display: flex, align-items: center, justify-content: center, gap: 12px
Margin: 28px 0

"Monthly" label → "Yearly" label with toggle switch between them
"Save 17%" badge in green on the right
```

---

## 11. Auth Pages

### 11.1 Sign In — zappix.ng/login

```
Full page: min-height 100vh, background: var(--gray-50)
Display: flex, align-items: center, justify-content: center

Card:
  background: white
  border: 1.5px solid var(--gray-200)
  border-radius: var(--radius-xl) → 20px
  padding: 40px
  width: 100%, max-width: 400px
  shadow: var(--shadow-md)

Content (top to bottom):
  1. Logo (centered): icon + wordmark, margin-bottom: 32px
  2. Heading: "Welcome back" — Fraunces, 24px, 800, centered
  3. Sub: "Sign in to your Zappix account" — 14px, var(--gray-500), centered, mb: 28px
  4. Google button (full width, large):
       White background, border: 1.5px solid var(--gray-200)
       Google logo SVG on left (20px)
       Text: "Continue with Google" — 15px, font-weight 700, var(--gray-900)
       Hover: background var(--gray-50), border-color var(--gray-300)
       Padding: 12px 20px, border-radius: 9999px
  5. Divider: "or" with lines either side, margin: 20px 0 (muted gray)
  6. Link: "Don't have an account? Start free trial" — 14px, centered
       "Start free trial" in var(--green-600), font-weight 700
```

### 11.2 Onboarding — zappix.ng/onboarding

```
Full page: min-height 100vh, background: var(--gray-50)
Display: flex, align-items: center, justify-content: center

Card:
  background: white
  border-radius: var(--radius-xl)
  padding: 40px
  max-width: 560px, width: 100%
  shadow: var(--shadow-md)

Progress bar:
  Row of 5 equal segments at the top of the card
  Height: 5px, gap: 6px
  Completed: var(--green-600)
  Remaining: var(--gray-200)
  Border-radius: 9999px each
  Margin-bottom: 32px

Step 1 — Account Type:
  Heading: "What best describes you?" — Fraunces, 22px
  Sub: "This helps us set up Zappix correctly." — 14px, gray-500, mb: 24px

  Option cards (stacked, gap: 10px):
    Border: 1.5px solid var(--gray-200)
    Border-radius: var(--radius-lg) → 14px
    Padding: 16px 20px
    Cursor: pointer
    Display: flex, align-items: flex-start, gap: 14px

    Icon: 40px × 40px, background var(--gray-100), border-radius 10px, centered emoji

    Title: 15px, Nunito, font-weight 700, var(--gray-900)
    Desc:  13px, Nunito, var(--gray-500), margin-top: 3px

    Selected state:
      border-color: var(--green-600)
      background: var(--green-50)
      box-shadow: 0 0 0 3px var(--green-50)

Step 2 — Risk Disclosure:
  Amber callout box with the risk warnings
  Checkbox at bottom with label
  Button disabled until checkbox ticked

Step 3 — Connect Number:
  QR code display area:
    Width: 200px × 200px
    Border: 2px solid var(--gray-200)
    Border-radius: var(--radius-lg)
    Margin: 0 auto 20px
    Background: white with QR code centered

  Instructions below QR (numbered steps):
    1. Open WhatsApp on your phone
    2. Tap ⋮ Menu → Linked Devices
    3. Tap "Link a Device"
    4. Scan this QR code

Step 4 — Choose Plan:
  Simplified 3-plan row, same as pricing page but more compact

Step 5 — Done:
  Large celebration emoji (🎉) centered
  Heading, subtitle, big green button
```

---

## 12. Dashboard — Shell

The shell wraps all `/app/*` pages. It consists of the top navbar and sidebar described in Section 9.

### User Avatar Dropdown
```
Avatar: 36px circle, user's Google profile picture
        Fallback: initials on green background

Dropdown (appears on click):
  Width: 220px
  Position: absolute, top: 52px, right: 0
  Background: white
  Border: 1.5px solid var(--gray-200)
  Border-radius: var(--radius-lg)
  Shadow: var(--shadow-lg)
  Padding: 8px

  Header row:
    User name: 14px, font-weight 700
    User email: 12px, var(--gray-500)
    Padding: 12px 16px 10px

  Divider: 1px solid var(--gray-200)

  Menu items:
    "Profile Settings", "Billing", "Notifications"
    Each: 14px, font-weight 600, var(--gray-700)
    Padding: 9px 16px
    Hover: background var(--gray-50), border-radius 8px

  Divider

  Logout item: same style but text var(--error-text) → #DC2626
```

---

## 13. Dashboard Home

### KPI Row
```
Grid: 4 columns, gap: 16px, margin-bottom: 24px

Each KPI card (see 8.3 KPI Card spec):
  Card 1: "Status Views Today" — big green number
  Card 2: "Broadcasts Sent" — dark number
  Card 3: "Total Contacts" — dark number
  Card 4: "Ad Revenue (MTD)" — green number with ₦ prefix
```

### Content Grid Below KPIs
```
Grid: two columns — 1fr and 340px (fixed right column)
Gap: 20px

LEFT: Broadcast Reach Chart card
  Title: "Broadcast Reach — Last 7 Days"
  Right link: "View report →" in var(--green-600), 12px

  Bar chart (7 bars):
    Container height: 140px
    Each bar:
      Width: flex 1, gap: 6px between bars
      Background (resting): var(--green-50)
      Border: 1.5px solid var(--green-100)
      Border-radius: 6px 6px 0 0
      Hover: background var(--green-600), border-color var(--green-600)
              cursor pointer
              transition: all 250ms
    Day labels below: 10px, var(--gray-400), font-weight 700, text-center

RIGHT: Recent Broadcasts card
  Title: "Recent Broadcasts"
  Right link: "See all →"

  Each broadcast item:
    display: flex, align-items: center, gap: 12px
    padding: 13px 0
    border-bottom: 1px solid var(--gray-100)

    Status dot: 8px × 8px circle
      Live: var(--green-600) with box-shadow: 0 0 0 3px var(--green-50)
      Scheduled: #3B82F6
      Sent: var(--gray-400)

    Info column (flex: 1):
      Name: 13px, font-weight 700
      Meta: 11px, var(--gray-400), font-weight 600, margin-top: 2px

    Stat column (text-right):
      Reach: Fraunces, 15px, font-weight 800, var(--green-600)
      Status pill: margin-top: 3px
```

### Quick Actions Row
```
Below the grid — a row of shortcut buttons:
  "+ Schedule Status"
  "+ New Broadcast"
  "+ Add Contact"

Each: Ghost button, medium size
Row: display flex, gap: 10px
Margin-top: 20px
```

---

## 14. Status Scheduler

### Calendar View (`/app/scheduler`)

```
Header:
  Left: Month/Year label — Fraunces, 20px, font-weight 800
  Center: [← Prev] [Today] [Next →] navigation
  Right: [Month | Week | Day] view toggle + [+ New Post] button

Calendar grid (month view):
  7 columns (Mon–Sun)
  Day header row: 11px, font-weight 800, var(--gray-400), UPPERCASE, text-center

  Day cell:
    Min-height: 110px
    Border: 1px solid var(--gray-200)
    Padding: 8px
    Background: white

    Date number: 12px, font-weight 700, var(--gray-500), top-right of cell
    Today: date number has green circle background (24px × 24px, var(--green-600), white text)
    Past days: background var(--gray-50), date number var(--gray-300)

    Content gap (no posts): subtle amber tint — background: #FFFBEB, border-color: #FCD34D

    Scheduled post thumbnails:
      Each thumbnail: height 32px, border-radius 6px, overflow hidden
      Shows media thumbnail or coloured placeholder
      Label below thumbnail: 10px, font-weight 600, truncated
      Max 3 thumbnails shown, "+2 more" link if overflow
      Margin-bottom: 4px between thumbnails

  Click cell: opens "Add Post" modal for that date
  Click thumbnail: opens "Edit Post" drawer
```

### New Post Form (`/app/scheduler/new`)

```
Page layout: 2 columns — form on left (flex: 1), phone preview on right (260px fixed)

Form fields (top to bottom):
  1. Post Type tabs: [Image] [Video] [GIF] [Text]
     Tab style: pill toggles — active: green background, white text
                inactive: gray-100 background, gray-500 text

  2. Media upload zone (for image/video/gif):
     Height: 160px
     Border: 2px dashed var(--green-100)
     Border-radius: var(--radius-lg) → 14px
     Background: var(--green-50)
     Content center: upload icon (48px, var(--green-400)) + "Click to upload or drag & drop" text
     Hover: border-color var(--green-600), background var(--green-100)
     After upload: shows thumbnail with "Replace" button overlay

  3. Caption / text field (textarea)
     Label: "Caption" or "Text" depending on type
     Placeholder: "Write something engaging... Use {firstName} to personalise"
     Character count: right-aligned below textarea, gray-400

  4. Schedule date + time:
     Two inputs side by side (50% each):
       Date picker input
       Time picker input (dropdown with 15-min intervals)

  5. Post to:
     Two radio options: "All Numbers" or "Select Numbers"
     If "Select Numbers": checkbox list of connected numbers appears

  6. Label (optional):
     Small input for internal tag, e.g. "Ad — Dangote" or "Morning Gist"

Footer:
  Left: [Save as Draft] ghost button
  Right: [Schedule Post] primary button

Phone preview (right column):
  Label: "PREVIEW" — 11px, uppercase, gray-400, centered, mb: 10px
  Phone mockup showing how status will appear
  Updates live as user types caption
```

### Bulk Upload (`/app/scheduler/bulk`)

```
Step indicator (3 steps at top):
  [1. Upload Files] → [2. Set Schedule] → [3. Review & Confirm]
  Active step: green circle with number, bold label
  Completed: green checkmark circle
  Future: gray circle

Step 1 — Upload Zone:
  Large drop zone: 300px tall, dashed border, centered content
  "Drop your files here or click to browse"
  "Supports JPG, PNG, MP4, GIF • Max 64MB each"
  After upload: file grid appears (4 columns, thumbnails with names)

Step 2 — Schedule Settings:
  Start date picker
  Posts per day: [1] [2] [3] [4] (pill toggle buttons)
  Posting times: time pickers for each slot per day (up to 4)
  Target numbers: same as single post

Step 3 — Review Grid:
  Calendar-like grid showing each day and which files will post
  Each slot: thumbnail + time label
  Drag handles to reorder files between slots
  [Confirm Schedule] primary button at bottom
```

---

## 15. Broadcast Engine

### Broadcasts List (`/app/broadcasts`)

```
Filter row below page header:
  [All] [Sending] [Sent] [Scheduled] [Draft] [Failed]
  Status filter pills — active: green bg, inactive: gray bg
  Right side: Search input + [Date range] dropdown

Broadcast table:
  Columns: Name | Type | Status | Sent | Replied | Opt-outs | Date | Actions

  Type icons:
    Text: align-left icon
    Image: image icon
    Video: video icon
    Document: file-text icon

  Row actions (hover reveals):
    View report → (only for sent)
    Duplicate
    Cancel (only for scheduled)
    Delete (only for drafts)
```

### Broadcast Composer (`/app/broadcasts/new`)

5-step wizard. Progress shown in left sidebar panel.

```
Left sidebar (260px):
  Title: "New Broadcast" — Fraunces, 17px, 800
  Step list (vertical):
    Each step: flex, gap: 14px, padding: 14px 0, border-bottom: 1px solid gray-100

    Step number circle:
      Completed: 30px × 30px, green bg, white checkmark
      Current:   30px × 30px, green-50 bg, green border, green number
      Future:    30px × 30px, gray-100 bg, gray border, gray number

    Step title: 13px, font-weight 800, var(--gray-900)
    Step subtitle: 11px, var(--gray-400), font-weight 600, mt: 2px

Right main area: Form for current step + live phone preview on far right (240px)

Step 1 — Message Type:
  Large cards for each type (text, image, video, document, contact)
  2-column grid
  Each card: icon centered, label below, hover green border

Step 2 — Compose:
  Message text area (required)
  Token insert buttons: [{firstName}] [{city}] [{custom1}]
    Each button: gray-100 bg, 12px, hover: green
    Click inserts token at cursor position
  Media upload (if image/video/doc type)
  Character count display

Step 3 — Audience:
  Search + checkbox list of contact lists
  Each list: checkbox + list name + contact count badge
  "Estimated reach" total at bottom in green: "~47,000 contacts"
  Note: excludes opted-out contacts

Step 4 — Numbers & Speed:
  Checkbox list of connected numbers (showing status dot and name)
  "Auto-split contacts evenly" toggle
  Throttle speed selector:
    Three pill options: [🐢 Safe] [⚡ Normal] [🚀 Fast]
    Active: green bg, white text
    Tooltip on each explaining messages/minute rate
  Estimated send time display: "~47 minutes at Safe speed"

Step 5 — Schedule:
  Toggle: [Send Now] [Schedule for Later] [Recurring]
  If "Schedule": date + time pickers appear
  Review summary box:
    Gray-50 background, rounded
    Shows: message preview, audience size, numbers, speed
  [Review & Send →] primary button

Phone preview (always visible right side):
  Shows live message preview with real contact name filled in
  Updates as user types
```

### Broadcast Report (`/app/broadcasts/[id]`)

```
Header section:
  Broadcast name (large), status pill, date sent
  4 metric cards in a row:
    Messages Sent / Delivered (best-effort) / Replies / Opt-outs

Charts section:
  Left chart: Bar chart of sends per hour during delivery
  Right chart: Donut chart of sent/failed ratio

Per-number breakdown table:
  Columns: Number Name | Sent | Failed | Replies | Opt-outs

Failed deliveries section (if any):
  Table of failed contacts with error reason
  [Retry Failed] button top-right (primary button)

Replies section:
  List of contacts who replied with their message and timestamp
```

---

## 16. Analytics Dashboard

### Overview Page (`/app/analytics`)

```
Period selector row (full width, below page header):
  Left: [Today] [7 Days] [30 Days] [Custom ▾] — pill toggles
  Right: Toggle "Compare to previous period" with switch

KPI bar (6 cards in a row, slightly smaller than dashboard KPIs):
  Status Estimated Reach | Broadcasts Sent | Total Contacts
  Ad Revenue | Bot Conversations | Opt-outs

  Each card: white bg, border, 14px label, Fraunces 24px number
  Clickable — navigates to relevant sub-section

Combined Activity Chart (full width):
  Line chart with two lines:
    Green line: Status Estimated Reach
    Blue line: Messages Sent
  X-axis: dates
  Y-axis: counts
  Legend below chart
  Tooltip on hover: shows both values for that date

Bottom grid (2 columns):
  Left: Audience Growth area chart (green fill)
  Right: Ad Revenue bars (weekly)
```

### Callout under Status Analytics
```
Amber callout box (see 8.9):
  "Estimated Reach is based on your contact list size, not exact view counts.
   WhatsApp does not provide view count data via the Web protocol."
```

---

## 17. Contact Manager

### Contacts Table (`/app/contacts`)

```
Layout: Two-panel — filter sidebar (220px left) + table (main right)

Filter sidebar:
  Background: white, border-right: 1px solid var(--gray-200)
  Padding: 20px

  Search input at top (full width)

  Filter sections:
    "LIST" — collapsible, checkbox list of contact lists with counts
    "TAGS" — coloured tag chips, click to filter
    "STATUS" — [All] [Active] [Opted Out]
    "SOURCE" — [All] [Manual] [Imported] [Bot]

  "Clear all filters" link at bottom, var(--green-600)

Main table:
  Bulk action bar (appears when rows selected):
    Sticky at top, gray-900 background, white text
    Shows: "X contacts selected" + [Add to List] [Tag] [Export] [Delete] buttons
    All buttons white ghost style on dark background

  Table columns:
    ☐ (checkbox) | Name | Phone | Tags | List | Source | Added | Actions

  Contact name cell:
    Avatar circle (32px, initials on green bg) + name + email below
  
  Tags cell: up to 3 tag chips, "+2 more" if overflow

  Row hover: light green tint (var(--green-50))
  Row selected: slightly stronger green tint with green left border

Pagination:
  Bottom of table
  "Showing 1–50 of 4,241 contacts"
  [← Prev] [1] [2] [3] ... [85] [Next →]
```

### Contact Profile (`/app/contacts/[id]`)

```
2-column layout:
  Left (340px): Contact info panel
  Right (flex 1): History and activity

Left panel:
  Avatar (64px circle, initials)
  Name (Fraunces, 22px)
  Phone number (14px, gray-500)
  Edit button (ghost, small, top-right of panel)

  Tags section: all tags as chips with + Add Tag button
  Lists section: all lists this contact belongs to
  Custom fields: label + value rows
  Notes textarea: editable

  Status section:
    Opt-out status with toggle to manually opt-in/out
    Source badge

Right panel (tabs):
  [Messages] [Bot Interactions] [Orders] [Leads]

  Messages tab:
    Timeline of broadcasts this contact received
    Each: broadcast name, date, status (sent/delivered/replied/opted-out)

  Bot tab:
    Timeline of bot conversations
    Shows: date, flow type, what was collected

  Orders tab:
    Table of orders placed through order collection bot flow

  Leads tab:
    Table of lead capture submissions
```

### CSV Import (`/app/contacts/import`)

```
3 steps:

Step 1 — Upload:
  Large drop zone (similar to bulk upload)
  Download template link below zone

Step 2 — Map Columns:
  Two-panel display:
    Left: CSV column names from file
    Right: Zappix field dropdowns to map to

  Preview table of first 5 rows below map

  Import settings:
    [Skip duplicates] vs [Update existing] radio
    [Add to list] selector (optional)
    [Apply tags] chip input (optional)

Step 3 — Import Progress:
  Progress bar (animated, green fill)
  Live counter: "1,847 / 5,000 contacts imported"
  Summary on completion:
    ✅ 4,892 imported
    ⚠️ 108 skipped (duplicates)
    ❌ 0 errors
```

---

## 18. Ad Slot Manager

### Public Booking Page (`zappix.ng/ads/[username]`)

This page is publicly accessible — no login required.

```
Full page background: var(--gray-50)

Header section:
  TV owner profile: avatar + display name + "Advertise With Us"
  Stats row: "92,000+ contacts · Lagos & Beyond · 47 ad slots"

Slot cards grid (2 columns):
  Each slot card: white, border, rounded-xl, padding: 24px
  Hover: green border, slight lift

  Slot type badge: top-right (Status / Broadcast / Combo)
  Slot name: Fraunces, 18px, font-weight 800
  Estimated reach: "~45,000 estimated reach" with eye icon
  Price: Fraunces, 28px, var(--green-600), "₦15,000"

  Available dates:
    Small calendar row showing available vs booked dates for next 2 weeks
    Green dot = available, Red dot = booked

  [Book Now] primary button (full width) if available
  [Join Waitlist] ghost button if fully booked for selected period

Booking modal (on click):
  Form: client name, email, phone, ad creative upload, message/text input
  Calendar to select date
  Paystack payment button at bottom
```

### Ad Slots Dashboard (`/app/ads`)

```
Top section:
  Revenue summary card (green tint):
    This month: ₦2,400,000 | Pending: ₦350,000 | Bookings: 28
  Public page link: "zappix.ng/ads/yourname" with copy button

Pending Approvals section (if any):
  Amber callout showing count: "3 bookings awaiting your approval"
  Button: [Review Now]

Tabs: [Slots] [Bookings] [Revenue]
```

---

## 19. Chatbot Builder

### Bot List (`/app/bots`)

```
Card grid (3 columns):
  Each card shows:
    Number name + phone number
    Bot status toggle (large, prominent)
    Active features badges: [Away ✓] [Menu ✓] [FAQ ✓]
    Last conversation: "2 hours ago"
    [Configure] button (ghost)
```

### Bot Builder (`/app/bots/[id]`)

```
4 tabs: [Away Message] [Menu Bot] [FAQ] [Flows]
Tab style: underline tabs (not pill), active: green underline, bold

Away Message tab:
  Toggle to enable/disable
  Textarea for message
  Schedule type: [Always] [Custom Hours] [Weekends Only] pill toggle
  If custom hours: from/to time pickers

Menu Bot tab:
  Left panel: Menu tree view
    Visual tree of menu items
    Numbered items with labels
    Drag handle icon on left (for reordering)
    + Add Item button at bottom
    Click item: edit panel opens on right

  Right panel: Item editor
    Number, keyword, label, action type, CTA settings
    Live message preview at bottom of panel

FAQ tab:
  Stacked FAQ entries
  Each entry: trigger phrases (chip input) + response textarea
  + Add FAQ button

Flows tab:
  Two flow types: [Lead Capture] [Order Collection]
  Each shows as a vertical step-by-step flow diagram
  Edit each step inline
```

---

## 20. Multi-Account Manager

### Accounts Home (`/app/accounts`)

```
Number cards grid (2 columns):
  Each card: white, border, rounded-xl, padding: 24px

  Status indicator row:
    Coloured dot (8px): green/yellow/red
    Status text: "Connected" / "Reconnecting" / "Disconnected"
    Time since last seen (if disconnected)

  Number display name: Fraunces, 18px, 800
  Phone number: 14px, gray-500
  Colour tag: small coloured pill (e.g. "🔵 Blue")

  Stats row:
    📅 12 posts scheduled | 📢 2 active broadcasts | 🤖 Bot: ON

  Warm-up progress bar (if not complete):
    "Warm-up: Day 5 of 21"
    Green progress bar (5/21 filled)
    "Broadcasting limited to 50/day until Day 22"

  Footer actions: [Manage] ghost button | [⏸ Pause] ghost | [• • •] menu
```

### Connect New Number (`/app/accounts/new`)

```
Modal or dedicated page (centered, max-width 480px):

Step indicators at top (3 steps)

Step 1 — Instructions:
  Numbered list with icons:
  1. 📱 Open WhatsApp on your phone
  2. ⋮ Tap Menu → Linked Devices
  3. 🔗 Tap "Link a Device"
  4. 📷 Scan the QR code below

Step 2 — QR Code:
  White box (220px × 220px), centered
  Border: 1.5px solid var(--gray-200), border-radius: 14px
  QR code centered inside
  Below: "QR code refreshes in 45 seconds" countdown timer
  [Regenerate QR] link

  Connecting state: spinner + "Connecting..." + phone animation

Step 3 — Name Your Number:
  Input: Display name
  Colour tag picker (8 colour swatches)
  Category dropdown
  [Save & Continue] primary button

After connecting:
  Amber callout: "This number has been enrolled in the 21-day warm-up programme.
  Broadcasting is limited while your number warms up safely."
```

### Team Members (`/app/accounts/team`)

```
Invite form at top:
  Email input + Role dropdown [Admin / Editor / Viewer] + [Send Invite] button

Members table:
  Columns: Member | Role | Numbers Access | Status | Joined | Actions

  Member cell: avatar + name + email
  Role cell: badge with role colour
    Admin: purple
    Editor: blue
    Viewer: gray
  Status: [Accepted] green pill | [Pending] amber pill

  Row actions: [Change Role ▾] [Revoke Access]
```

---

## 21. Referral Dashboard

### Referral Home (`/app/referrals`)

```
4 sections stacked:

Section 1 — Wallet Card:
  Green gradient card (bg: linear-gradient from green-600 to green-500):
    "₦212,500" in white, Fraunces, 40px (available balance)
    "₦43,750 pending release" below in rgba(white, 0.7)
    "Releases on 1st of every month" micro text
    [Withdraw to Bank →] white button (right side)

Section 2 — Referral Link:
  White card, two rows:
    Row 1: "zappix.ng/ref/tunde" text + [Copy] button + [Share ▾] button
    Row 2: "Code: TUNDE25" text + [Copy] button
    Share dropdown: WhatsApp | Twitter/X | Copy Link

Section 3 — Stats Row:
  3 mini stat cards inline:
    "18 Total Referrals" | "16 Active" | "₦187,500 Earned This Month"

Section 4 — Two columns:
  Left (flex: 1): Referrals table
    Columns: Name | Plan | Status | Monthly Earning | Total Earned
    Status pills: Active (green) | Churned (gray) | Trial (amber)

  Right (340px): Leaderboard preview
    Title: "🏆 Top Referrers — March 2026"
    Top 3 rows with medals: 🥇 🥈 🥉
    Current user row highlighted in green-50 background
    [View Full Leaderboard →] link at bottom
```

### Withdrawal Page (`/app/referrals/withdraw`)

```
Two sections:

Left: Withdrawal form
  Amount input with ₦ prefix (min ₦5,000 shown as helper text)
  Bank account display (if already added):
    Card showing: bank name + account name + masked account number
    [Change account] link
  If no bank account: [Add Bank Account] button (opens modal)
  [Withdraw] primary button

Right: Transaction history
  Table: Date | Amount | Status | Bank | Reference
  Status pills: Completed (green) | Processing (amber) | Failed (red)
```

---

## 22. Settings Pages

### Settings Hub (`/app/settings`)

```
Grid of setting category cards (2 columns):
  Each card: icon (large, 32px, green bg circle) + title + description + [→] arrow

  Profile Settings    → user icon
  Billing & Plan      → credit card icon
  Notifications       → bell icon
  API & Integrations  → code icon (Agency plan only, locked badge on others)
```

### Billing Page (`/app/settings/billing`)

```
Current plan card:
  Green border, var(--green-50) background
  Plan name (Fraunces, large) + price + billing cycle
  Feature highlights as small checkmarks
  [Upgrade Plan] or [Change Plan] button

Next billing:
  "Next charge: ₦35,000 on April 1, 2026"

Plan comparison table:
  All 3 plans side by side with feature matrix
  Current plan column highlighted green

Cancel subscription:
  Gray section at bottom
  "Need to cancel? Your access continues until [date]."
  [Cancel Subscription] link in red (danger style, not button)
```

---

## 23. Motion & Animation

### Principles
- Animations should be **purposeful** — they communicate state changes, not just look pretty
- Keep durations short: 150–300ms for most transitions
- Use `ease-out` for elements entering the screen, `ease-in` for elements leaving
- Never animate more than 2 properties simultaneously unless necessary

### Standard Transitions

```css
/* Default transition for all interactive elements */
transition: all 200ms ease;

/* Cards on hover */
transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;

/* Buttons */
transition: background-color 200ms ease, box-shadow 200ms ease, transform 150ms ease;

/* Sidebar items */
transition: background-color 180ms ease, color 180ms ease;

/* Modal entry */
animation: modal-in 200ms ease-out;

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Page content entry (stagger children) */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Apply stagger with animation-delay on each child */
.hero-badge    { animation: slide-up 500ms ease both; }
.hero-headline { animation: slide-up 500ms 80ms ease both; }
.hero-sub      { animation: slide-up 500ms 160ms ease both; }
.hero-cta      { animation: slide-up 500ms 240ms ease both; }

/* Floating hero cards */
@keyframes float-1 {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%       { transform: translateY(-8px) rotate(-2deg); }
}
@keyframes float-2 {
  0%, 100% { transform: translateY(0) rotate(1.5deg); }
  50%       { transform: translateY(-6px) rotate(1.5deg); }
}
.hero-float-1 { animation: float-1 4s ease-in-out infinite; }
.hero-float-2 { animation: float-2 5s ease-in-out infinite; }
```

### Loading Skeleton Animation

```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: var(--radius-sm);
}
```

---

## 24. Responsive Design

### Breakpoints

```css
/* Mobile first approach */
sm:   640px   /* Large phones */
md:   768px   /* Tablets */
lg:   1024px  /* Small laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large screens */
```

### Layout Adaptations

| Screen | Sidebar | Main Content | KPI Grid |
|--------|---------|--------------|----------|
| Desktop (lg+) | 230px fixed | flex: 1 | 4 columns |
| Tablet (md) | 230px fixed | flex: 1 | 2 columns |
| Mobile (< md) | Hidden (drawer) | Full width | 1 column |

### Mobile Sidebar (Drawer)
```
On mobile: sidebar is hidden by default
Hamburger icon (☰) appears in top navbar left side
Tap: sidebar slides in from left (300ms ease-out)
Overlay behind sidebar: rgba(0,0,0,0.4)
Tap overlay: closes drawer
```

### Feature Grid Adaptations
```
Landing features grid:
  Desktop: 3 columns
  Tablet:  2 columns
  Mobile:  1 column

Pricing plans:
  Desktop: 3 columns
  Tablet:  2 columns (3rd card full width)
  Mobile:  1 column (stacked)

Dashboard KPIs:
  Desktop: 4 columns
  Tablet:  2 columns
  Mobile:  1 column

Broadcast composer:
  Desktop: form + phone preview side by side
  Mobile:  form full width, preview hidden (show as collapsible)
```

---

## 25. Accessibility

### Colour Contrast
Every text/background combination must meet **WCAG AA** minimum contrast ratio:
- Normal text (< 18px): minimum 4.5:1
- Large text (≥ 18px or 14px bold): minimum 3:1

```
var(--green-600) on white:     4.7:1 ✅
var(--gray-900) on white:      21:1 ✅
var(--gray-500) on white:      4.6:1 ✅ (just passes)
var(--gray-400) on white:      3.0:1 ✅ (for large text only)
White on var(--green-600):     4.7:1 ✅
```

### Focus States
Every interactive element must have a visible focus ring for keyboard users:

```css
/* Apply to all interactive elements */
:focus-visible {
  outline: 2px solid var(--green-600);
  outline-offset: 2px;
  border-radius: inherit;
}

/* For inputs — use box-shadow instead */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
  border-color: var(--green-600);
  box-shadow: 0 0 0 3px var(--green-50);
}
```

### ARIA Labels
- All icon-only buttons must have `aria-label="Description"`
- All form inputs must have associated `<label>` elements
- Status dots must have `aria-label="Connected"` or similar
- Modal must have `role="dialog"` and `aria-labelledby` pointing to its title
- Navigation must use `<nav>` element with `aria-label="Main navigation"`

### Keyboard Navigation
- All interactive elements reachable via Tab key
- Dropdowns and menus closeable with Escape key
- Modal closeable with Escape key
- Form submittable with Enter key

---

## 26. Empty States

Every section that can be empty must have a designed empty state. No blank white boxes.

### Empty State Structure

```
Container: centered, padding: 60px 20px
Max-width: 400px, margin: 0 auto

Large icon (48px): Lucide icon in var(--gray-300), centered
Heading: "No broadcasts yet" — Fraunces, 18px, var(--gray-900), mt: 16px, centered
Sub text: "Send your first broadcast to reach your audience." — 14px, var(--gray-500), centered, mt: 8px
CTA button: primary button, mt: 24px, centered
```

### Empty State Copy per Feature

```
Broadcasts:
  Icon: Send
  Heading: "No broadcasts yet"
  Sub: "Reach thousands of contacts with one click."
  Button: "+ Create Broadcast"

Contacts:
  Icon: Users
  Heading: "No contacts yet"
  Sub: "Import a CSV or add contacts manually to get started."
  Button: "Import Contacts"

Scheduled Statuses:
  Icon: Calendar
  Heading: "Your calendar is empty"
  Sub: "Schedule 30 days of content in 10 minutes with bulk upload."
  Button: "Schedule Your First Post"

Ad Slots:
  Icon: DollarSign
  Heading: "No ad slots created"
  Sub: "Create your first ad slot so brands can book and pay online."
  Button: "Create Ad Slot"

Referrals:
  Icon: Gift
  Heading: "No referrals yet"
  Sub: "Share your link and earn 25% every month for every user you bring in."
  Button: "Copy Your Referral Link"

Activity Log:
  Icon: Activity
  Heading: "No activity yet"
  Sub: "Actions by you and your team will appear here."
  (No button needed)
```

---

## 27. Loading States

### Page Loading
When a page is fetching data, show skeleton loaders — not a spinner.

```
KPI cards skeleton: 4 gray rectangles (same size as KPI cards) with shimmer animation
Table skeleton: header row + 5 skeleton rows of varying widths
Chart skeleton: gray rectangle the height of the chart area
```

### Button Loading State
When a button triggers an async action:
```
Replace button text with spinner icon (Loader2, 16px, animate-spin) + "Saving..."
Button remains same size and colour
Button disabled during loading
```

### Inline Loading (TanStack Query)
Use `isLoading` state from tRPC queries to show skeletons before data arrives.

---

## 28. Error States

### Form Field Errors
```
Border: changes to #EF4444 (red)
Box-shadow: 0 0 0 3px #FEF2F2
Error message below field:
  Color: #DC2626
  Font: 12px, font-weight 600
  Icon: AlertCircle (12px) + error text, display: flex, gap: 5px
```

### Page-Level Error
When a page fails to load:
```
Icon: WifiOff or AlertCircle (48px, var(--error-text))
Heading: "Something went wrong" — Fraunces, 20px
Sub: "We couldn't load this page. Please try again." — 14px, gray-500
Button: "Try Again" primary button
Small link: "Contact support" below button
```

### Network Error Toast
See Section 29 — Toasts.

---

## 29. Notifications & Toasts

### Toast Notifications
Toasts appear in the **bottom-right** corner of the screen. They stack vertically (newest on top).

```
Position: fixed, bottom: 24px, right: 24px, z-index: 200

Toast container:
  Width: 360px
  Background: white
  Border: 1.5px solid var(--gray-200)
  Border-radius: var(--radius-lg) → 14px
  Shadow: var(--shadow-lg)
  Padding: 16px 20px
  Display: flex, align-items: flex-start, gap: 14px

  Left: icon circle (36px, coloured by type)
  Center:
    Title: 14px, font-weight 700, var(--gray-900)
    Message: 13px, font-weight 500, var(--gray-500), margin-top: 3px
  Right: × close button (gray-400, 16px)

  Entry animation: slide in from right + fade in, 250ms ease-out
  Exit animation: fade out + slide right, 200ms ease-in

  Auto-dismiss: 4000ms for success, never for error

Types:
  Success: icon ✓ on green circle, left border 3px green
  Error:   icon ✗ on red circle, left border 3px red
  Warning: icon ⚠ on amber circle, left border 3px amber
  Info:    icon ℹ on blue circle, left border 3px blue
```

### Examples of Toast Copy

```
Broadcast queued:
  Success | "Broadcast Queued" | "Your broadcast to 47,000 contacts is being sent."

Number connected:
  Success | "Number Connected" | "+234 801 234 5678 is now live on Zappix."

Number disconnected:
  Error | "Number Disconnected" | "TV Main lost connection. Tap to reconnect."

Post failed:
  Warning | "Status Failed" | "1 post failed to publish. Tap to retry."

Plan upgraded:
  Success | "Plan Upgraded" | "You're now on the Growth plan. Enjoy!"

Withdrawal requested:
  Info | "Withdrawal Processing" | "₦25,000 will arrive in 1–3 business days."
```

---

## Final Checklist Before Handing Off to Development

Use this checklist to verify the design is complete before any feature is built:

- [ ] All colours use CSS variables, no hardcoded hex values
- [ ] Both fonts (Fraunces + Nunito) loaded correctly
- [ ] Every button uses pill shape (border-radius: 9999px)
- [ ] Every card has correct border, border-radius, and shadow
- [ ] All form inputs have labels (not just placeholders)
- [ ] Focus states visible on all interactive elements
- [ ] Empty state designed for every list/table
- [ ] Loading skeleton designed for every data-heavy page
- [ ] Error state designed for every form and page
- [ ] Status pills use correct colour system
- [ ] Mobile layout tested at 375px width
- [ ] All icon sizes follow the size table in Section 7
- [ ] No text smaller than 11px anywhere in the app
- [ ] Colour contrast meets WCAG AA for all text
- [ ] Toast notifications wired up for all async actions
- [ ] Warm-up progress bar visible on new numbers

---

*Zappix Design System v1.0 | zappix.ng*
*"Run your WhatsApp TV like a real media company."*
