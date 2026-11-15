# SweetBakery — Final Project (SE-2506)

Сайт пекарни в Астане. Команда: Shamelova Dilara, Yessendos Diana, Shyntemir Zhanbota.

## Страницы (9)
index.html · menu.html · custom-cake.html · promotions.html · about.html · contact.html · cart.html · login.html · profile.html

## Где что находится (по критериям)
| Критерий | Где |
|---|---|
| Адаптивность | `css/style.css` (Grid, Flexbox, media queries, бургер-меню) |
| Светлая/тёмная тема | переключатель в шапке, `localStorage` → `sweetbakery-theme` (`script.js`, раздел 3) |
| Sign Up / Log In / Profile | `login.html`, `profile.html`, `main.js` разделы 9–10 (`sweetbakery-users`, `sweetbakery-currentUser`) |
| Валидация форм | `script.js` раздел 8 + `main.js`. У всех форм `novalidate`, ошибки под полями |
| Поиск и фильтр | меню (поиск + категории + сортировка, сохраняется в `sweetbakery-menu-filter`), FAQ, рецепты |
| Анимации | hover-эффекты, счётчики, тосты, аккордеон, тряска формы при ошибке |
| Внешний API | `main.js` раздел 6 — `fetch` + `async/await` к TheMealDB, загрузка и обработка ошибки |
| Языки | RU / KZ / EN, `js/translations.js`, сохраняется в `sweetbakery-lang` |
| Корзина и оплата | `cart.html`: промокод, самовывоз/курьер, дата, Kaspi / карта / наличные |

## Файлы
```
css/style.css
js/translations.js   тексты на 3 языках
js/data.js           товары и промокоды
js/script.js         общий код (тема, язык, корзина, пользователи, валидация)
js/main.js           логика страниц
images/
```

Промокоды: SWEET15, WEEKEND10, STUDENT5.
