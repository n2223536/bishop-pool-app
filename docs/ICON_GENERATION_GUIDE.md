# 🎨 Icon & Splash Screen Generation Guide

## Overview

This guide explains how to create icons and splash screens for the Bishop Estates Cabana Club PWA.

## Required Assets

### App Icons
| Size | Use | Path |
|------|-----|------|
| 192×192 | Android homescreen | `/public/icons/icon-192x192.png` |
| 192×192 (maskable) | Android adaptive icons | `/public/icons/icon-192x192-maskable.png` |
| 512×512 | Android splash, manifest | `/public/icons/icon-512x512.png` |
| 512×512 (maskable) | Android adaptive splash | `/public/icons/icon-512x512-maskable.png` |
| 180×180 | iPhone home screen | `/public/icons/icon-180x180-apple.png` |
| 96×96 | Shortcuts/Quick actions | `/public/icons/icon-96x96.png` |
| 16×16 | Favicon | `/public/favicon.ico` |
| SVG | Favicon (modern) | `/public/favicon.svg` |

### iPhone Splash Screens
| Device | Size | Path |
|--------|------|------|
| iPhone 6/7/8 | 750×1334 | `/public/splash/apple-splash-750-1334.png` |
| iPhone 6+/7+/8+ | 1242×2208 | `/public/splash/apple-splash-1242-2208.png` |
| iPhone 12 | 1125×2436 | `/public/splash/apple-splash-1125-2436.png` |
| iPhone 12 Pro | 1170×2532 | `/public/splash/apple-splash-1170-2532.png` |
| iPhone 14 Pro | 1290×2796 | `/public/splash/apple-splash-1290-2796.png` |
| iPad Air 4 | 1536×2048 | `/public/splash/apple-splash-1536-2048.png` |

## Design Specifications

### Brand Colors
- **Primary Blue:** `#1e40af` (from manifest.json)
- **Accent Gold:** `#fbbf24`
- **Dark Blue:** `#1e3a8a`
- **Light Background:** `#ffffff`

### Design Guidelines

#### App Icon (192×192 & 512×512)
- **Safe zone:** 88-pixel padding from edges
- **Background:** Solid `#1e40af` or gradient
- **Center element:** Pool/water theme, club logo, or stylized "C"
- **Style:** Modern, flat design (no 3D shadows)
- **Format:** PNG with transparency
- **File size:** Keep under 50 KB

#### Maskable Icon (192×192 & 512×512)
Used by Android for adaptive icons. The entire icon should fit within a centered circle:
- **Usable area:** Center 40% of the image
- **Design:** Ensure logo is circular or fits in circle
- **Background:** Can be transparent or solid
- **Purpose:** Android generates the circle mask automatically

#### iPhone Home Screen Icon (180×180)
- **Size:** Exactly 180×180 pixels
- **No rounded corners:** iOS adds them automatically
- **No glossy finish:** iOS adds this effect
- **Same as app icon:** Use your main app icon

#### iPhone Splash Screens
- **Safe area:** Leave padding on all sides
- **Text placement:** Center on screen
- **App name/logo:** Top 1/3 of screen
- **Colors:** Match manifest theme colors
- **Orientation:** Portrait (as specified in manifest)

**Splash Screen Design Tips:**
- Use the same branding as app icon
- Keep it simple (2-3 colors max)
- Add app name if not in logo
- Consider safe areas (notches on newer iPhones)

## Tools for Creation

### Option 1: Free Online Tools (Easiest)
- **PWA Asset Generator:** https://www.pwabuilder.com/
  - Upload your icon
  - Generates all sizes automatically
  - Includes splash screens
  
- **Favicon Generator:** https://favicon-generator.org/
  - Create ICO files easily
  
- **Capacitor Assets:** https://capacitorjs.com/docs/guides/splash-screens-and-icons
  - Excellent splash screen generator

### Option 2: Figma (Design-Friendly)
1. Create a 512×512 canvas
2. Design your icon
3. Export at multiple sizes:
   - Right-click → Export → Set scale (1x, 2x, 4x, etc.)
4. Rename to correct dimensions

### Option 3: Command Line (Powerful)
Using ImageMagick:
```bash
# Resize image to 192x192
convert original.png -resize 192x192 icon-192x192.png

# Create favicon
convert original.png -define icon:auto-resize=16,32,48,64 favicon.ico

# Batch resize for all sizes
for size in 96 192 512; do
  convert original.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

Using pngquant for optimization:
```bash
pngquant 256 icon-512x512.png --output icon-512x512-optimized.png
```

### Option 4: Adobe XD / Sketch / Illustrator
Design professionally with full control:
1. Create at 512×512 (1x scale)
2. Export as PNG with transparency
3. Use ImageMagick to resize for all sizes

## Maskable Icon Requirements

For Android adaptive icons, create a "maskable" version:

1. **Design the icon:** Make sure your main element fits in center circle (diameter = 60% of canvas)
2. **Add background:** Can be solid or gradient
3. **Save as separate file:** `icon-192x192-maskable.png`
4. **Android will:** Crop it to a circle automatically

**Example maskable design:**
```
Canvas: 192×192
Safe circle: 115px diameter (centered)
Background: Full canvas (192×192)
Logo/element: Centered, fits in 115px circle
```

## Implementation Checklist

- [ ] **Create or design main app icon** (512×512)
- [ ] **Resize to all sizes** (96, 192, 512 for standard; 180 for Apple)
- [ ] **Create maskable versions** (192×192-maskable, 512×512-maskable)
- [ ] **Generate splash screens** for iPhone models
  - [ ] 750×1334 (iPhone 6/7/8)
  - [ ] 1242×2208 (iPhone 6+/7+/8+)
  - [ ] 1125×2436 (iPhone 12)
  - [ ] 1170×2532 (iPhone 12 Pro)
  - [ ] 1290×2796 (iPhone 14 Pro)
  - [ ] 1536×2048 (iPad Air)
- [ ] **Optimize images:** Compress PNG without losing quality
- [ ] **Place in `/public/icons/`** directory
- [ ] **Place splash screens in `/public/splash/`** directory
- [ ] **Update manifest.json** if icon names differ
- [ ] **Test on iPhone:** Add to home screen, verify appearance
- [ ] **Test on Android:** Install PWA, check icon quality

## Testing Icons

### On iPhone
1. Add app to home screen
2. Icon should appear without pixellation
3. Check that corners round correctly
4. Verify splash screen shows when launching

### On Android
1. Install PWA
2. Check home screen icon
3. Verify maskable icon is used (circular background)
4. Check splash screen displays

### In Browser
1. Open DevTools (F12)
2. Go to Application → Manifest
3. Verify all icon paths resolve (green checkmarks)
4. Check `sizes` and `purpose` attributes

## Quick Start Template

Use this as your design base:

**Design requirements:**
- Background: `#1e40af` (primary blue)
- Accent: `#fbbf24` (gold) or white
- Style: Modern, flat, no shadows
- Concept: Pool, water, community, or "BC" monogram
- Safe area: 20% padding from edges

**Splash screen layout:**
```
┌─────────────────────────────────┐
│                                 │
│       App Icon (180×180)        │  ← Safe area top
│                                 │
│                                 │
│    Bishop Estates Cabana Club   │
│                                 │
│      (Loading indicator)        │
│                                 │
│                                 │
│                                 │  ← Safe area bottom
└─────────────────────────────────┘
```

## File Optimization

### PNG Optimization (Without Quality Loss)
```bash
# Using pngquant
pngquant 256 --strip icon-512x512.png --output icon-512x512-opt.png

# Using optipng
optipng -o2 icon-192x192.png

# Using imagemin (Node.js)
npm install -g imagemin imagemin-pngquant
imagemin icons/*.png --plugin=pngquant --out-dir=icons-optimized
```

### Target File Sizes
- 192×192: 20-30 KB
- 512×512: 30-50 KB
- Splash screens: 50-100 KB each

## Troubleshooting

### Icon appears blurry on iPhone
- Ensure image is at least 180×180
- Use PNG (not JPEG)
- Check file is not scaled up from smaller original

### Splash screen doesn't appear
- Verify filename matches exactly (case-sensitive)
- Check media query in `_document.tsx`
- Ensure file is in `/public/splash/` directory
- Test on actual device (simulators sometimes fail)

### Maskable icon has weird shape
- Ensure important content fits in center circle (60% diameter)
- Provide full background color
- Test on actual Android device

### Image file size too large
- Compress with pngquant or optipng
- Consider reducing color palette
- Use WebP instead of PNG (if browser support added)

## Next Steps

1. **Choose design tool** (Figma, Illustrator, or online tool)
2. **Create base icon** (512×512)
3. **Generate all sizes** (use PWA Asset Generator or ImageMagick)
4. **Create splash screens** (iPhone sizes)
5. **Optimize** (pngquant/optipng)
6. **Place in `/public/icons/` and `/public/splash/`**
7. **Test on real devices** (iPhone + Android)
8. **Update manifest.json** if needed

---

## Resources

- **PWA Asset Generator:** https://www.pwabuilder.com/
- **ImageMagick:** https://imagemagick.org/
- **Figma PWA Template:** https://www.figma.com/community
- **MDN PWA Icons Guide:** https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
- **Apple Icon Guidelines:** https://developer.apple.com/design/human-interface-guidelines/app-icons

