# SweetBakery 🍰

SweetBakery is a website for a small cake and dessert shop. The website
shows cakes, desserts, promotions, and information about the team.

## Live website
👉 https://rzxmiko.github.io/SweetBakery/

## Team
**Group:** SE-2506

| Name | Pages |
|------|-------|
| Shamelova Dilara | Home, Promotions (Popup, FAQ) |
| Yessendos Diana | Cakes Catalog, Desserts Menu (Live Clock, Color Switcher) |
| Shyntemir Zhanbota | About Us, Order & Contact (Form Validation, FAQ) |

## Pages
- `index.html` — Home page
- `promotions.html` — Special offers and gift sets
- `cakes-catalog.html` — Cake designs, fillings, and decor options
- `desserts-menu.html` — Cupcakes, macarons, and croissants menu
- `about.html` — About the bakery and the team
- `order-contact.html` — Order form and contact information

## JavaScript Features (Assignment 4)
- **Form Validation** (Order page)
- **FAQ Accordions** (Home, About Us)
- **Promo Code Popup** (Promotions)
- **Background Color Switcher** (All pages)
- **Live Clock** (All pages)

## jQuery Features (Assignment 6)
All jQuery code is in `js/script.js` (jQuery 4.0.0 from CDN, loaded in `<head>`).

| Task | Feature | Where |
|------|---------|-------|
| 0 | Setup, `$(document).ready()` prints "jQuery is ready!" | All pages |
| 1 | Real-time search and live filter of cakes | Cakes Catalog |
| 2 | Autocomplete search suggestions (keyboard + mouse) | Desserts Menu |
| 3 | Search highlighting in the FAQ (`<mark>`, opens matching answers) | Home, About Us |
| 4 | Colorful scroll progress bar with percent label | All pages |
| 5 | Animated number counter (starts when scrolled into view) | Home |
| 6 | Loading spinner + disabled button on submit | Order & Contact |
| 7 | Toast notifications that fade out | Order form, rating, copy, desserts search |
| 8 | "Copy" button with checkmark icon and tooltip | Promotions (promo code), Order & Contact (address) |
| 9 | Image lazy loading (`scroll()`, `.offset()`, `.attr('src')`) | All pages with images |

## Technologies
- HTML5
- CSS3
- JavaScript (Vanilla JS / ES6)
- jQuery 4.0.0
- Google Fonts

## Folder structure
```
SweetBakery/
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── script.js
├── images/
├── index.html
├── promotions.html
├── cakes-catalog.html
├── desserts-menu.html
├── about.html
├── order-contact.html
└── README.md
```
