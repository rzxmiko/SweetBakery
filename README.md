# SweetBakery — Final Project (SE-2506)

A bakery website in Astana. Team: Shamelova Dilara, Yessendos Diana, Shyntemir Zhanbota.

## Pages (9)
index.html · menu.html · custom-cake.html · promotions.html · about.html · contact.html · cart.html · login.html · profile.html

## Where to find each requirement
| Requirement | Where |
|---|---| 
| Responsiveness | `css/style.css` (Grid, Flexbox, media queries, burger menu) |
| Light / dark mode | toggle in the header, `localStorage` → `sweetbakery-theme` (`script.js`, section 3) |
| Sign Up / Log In / Profile | `login.html`, `profile.html`, `main.js` sections 9–10 (`sweetbakery-users`, `sweetbakery-currentUser`) |
| Form validation | `script.js` section 8 + `main.js`. All forms use `novalidate`, errors are shown under the fields |
| Search and filtering | menu (search + categories + sorting, saved in `sweetbakery-menu-filter`), FAQ, recipes |
| Animations | hover effects, counters, toasts, accordion, form shake on error |
| External API | `main.js` section 6 — `fetch` + `async/await` to TheMealDB, with loading state and error handling |
| Languages | RU / KZ / EN, `js/translations.js`, saved in `sweetbakery-lang` |
| Cart and payment | `cart.html`: promo code, pickup / courier, date, Kaspi / card / cash |

## Files
```
css/style.css
js/translations.js   texts in 3 languages
js/data.js           products and promo codes
js/script.js         shared code (theme, language, cart, users, validation)
js/main.js           page logic
images/
```

Promo codes: SWEET15, WEEKEND10, STUDENT5.
