# 🧱 Vader Flix Aesthetic Vision (v2)
**Theme:** *Imperial Brutalism meets Star Wars Command Console*

> **Note:** This is a reference document for the final styling phase of the project. All core functionality and integrations should be completed before implementing these aesthetic changes.

---

## 🎨 Color System

| Role              | Color         | Notes |
|-------------------|---------------|-------|
| Background        | `#121212`     | Dark Carbon – base layer, not pure black |
| Primary Accent    | `#D00000`     | Sith Red – active buttons, highlights |
| Secondary Accent  | `#0050B3`     | Starfield Blue – hover/focus |
| Borders/Lines     | `#2A2A2A`     | Death Star Gray – outlines |
| Text (Primary)    | `#E0E0E0`     | Imperial White – high-contrast |
| Text (Muted)      | `#999999`     | Secondary UI text |
| Success           | `#00C851`     | Victory Green – subtle |
| Error             | `#FF4444`     | Alarm Red – critical UI |

---

## 🧬 Typography System

- **Display / Hero Titles**: Custom Star Wars font (e.g., *Star Jedi*)
- **Headers**: Orbitron (Google Font) – angular, technical
- **Body Text**: Inter or Roboto – clean sans-serif
- **Monospace**: Share Tech Mono – console-like
- **Special Accents**: Aurebesh hover/tooltips (sparingly)

---

## 🧩 Components

### Buttons
- Angular, rectangular
- Default: red border, transparent
- Hover: red background, white text
- Disabled: faded border, 50% opacity
- Animations: Instant, snappy

### Cards
- Flat, inset borders
- Optional hover shimmer (carbonite freeze)
- Previews grayscale until hover

### Modals
- Fade in with "hyperspace blink"
- Red-lit `X` close button
- Panel-styled content

### Tables/Grids
- All-caps headers
- Zebra striping with dark gray
- Hover: red underline for actions

---

## 🔁 Animations & Effects

| Event        | Effect                          |
|--------------|---------------------------------|
| Page load    | Hyperspace streak → fade in     |
| Click        | Subtle pulse ripple             |
| Loading      | Lightsaber pulse bar            |
| Success      | Vader breath + green pulse      |
| Error        | Red alert flash + comms sound   |
| Hover        | Carbonite freeze shimmer        |

---

## 🎮 Special Elements

- **Search Bar**: Styled as targeting computer
- **Scrollbars**: Slim red bars, thicken on hover
- **Notifications**: Slide from top-right w/ sound
- **404 Page**: "These aren't the droids..." + sandstorm

---

## 🧠 Accessibility & Performance

- WCAG 2.1 AA compliant contrast
- Animations respect `prefers-reduced-motion`
- Fonts from CDN/local fallback
- CSS vars used for theming
- GPU-accelerated transitions

---

## 🧪 Responsive Strategy

- **Mobile**: Datapad style UI
- **Tablet**: Split-panel control surface
- **Desktop**: Full Death Star command dashboard

---

## 🥷 Future Enhancements

- Optional sound for UI actions
- Custom crosshair/lightsaber cursor
- Parallax starfield background
- User-role-based color theming

---

## 🧾 Notes

- Functionality > Style
- Sharp, brutal, readable UI only
- Never over-decorate — build what the Empire would actually use
