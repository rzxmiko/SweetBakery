// ---------- 1. localStorage helpers ----------
function getData(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultValue;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return defaultValue;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(sum) {
  return sum.toLocaleString("ru-RU") + " ₸";
}


// ---------- 2. Translations ----------
let currentLang = getData("sweetbakery-lang", "ru");

function t(key, params) {
  let text = translations[currentLang][key] || translations.en[key] || key;
  if (params) {
    for (const name in params) {
      text = text.replace("{" + name + "}", params[name]);
    }
  }
  return text;
}

function tr(obj) {
  return obj[currentLang] || obj.en;
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll(".field-error[data-key]").forEach(function (el) {
    el.textContent = el.dataset.key ? t(el.dataset.key) : "";
  });

  document.title = t(document.body.dataset.title) + " — SweetBakery";
}

function changeLanguage(lang) {
  currentLang = lang;
  saveData("sweetbakery-lang", lang);
  applyTranslations();
  updateAccountLink();
  document.dispatchEvent(new Event("languageChanged"));
}


// ---------- 3. Light / dark theme (saved in localStorage) ----------
function initTheme() {
  const themeSwitch = document.getElementById("theme-switch");
  const theme = getData("sweetbakery-theme", "light");
  document.documentElement.dataset.theme = theme;
  themeSwitch.setAttribute("aria-checked", theme === "dark");

  themeSwitch.addEventListener("click", function () {
    const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = newTheme;
    themeSwitch.setAttribute("aria-checked", newTheme === "dark");
    saveData("sweetbakery-theme", newTheme);
  });
}


// ---------- 4. Icons (simple SVG, put into <span data-icon="name">) ----------
const icons = {
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  store: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  mobile: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  package: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};

function icon(name) {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + "</svg>";
}

function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach(function (el) {
    el.innerHTML = icon(el.dataset.icon);
  });
}


// ---------- 5. Header ----------
function initMobileMenu() {
  const burger = document.getElementById("burger");
  burger.addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
  });
}

function updateCartCount() {
  const badge = document.getElementById("cart-badge");
  const count = getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  badge.textContent = count;
  badge.hidden = count === 0;
}

// "Sign in" or user name in the header
function updateAccountLink() {
  const link = document.getElementById("account-link");
  const label = document.getElementById("account-label");
  const user = getCurrentUser();
  if (user) {
    link.href = "profile.html";
    label.textContent = user.name;
  } else {
    link.href = "login.html";
    label.textContent = t("nav.signIn");
  }
}


// ---------- 6. Cart (array of { id, qty } in localStorage) ----------
function getCart() {
  return getData("sweetbakery-cart", []);
}

function saveCart(cart) {
  saveData("sweetbakery-cart", cart);
  updateCartCount();
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === id; });
  if (item) {
    item.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  saveCart(cart);

  // bump animation on the badge
  const badge = document.getElementById("cart-badge");
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
}

// custom cakes from the builder are saved with their own price
function addCustomCakeToCart(cake) {
  const cart = getCart();
  cart.push({ id: "custom-" + Date.now(), qty: 1, custom: cake });
  saveCart(cart);
}

// returns { name, price, image, details } for one cart item
function getItemInfo(item) {
  if (item.custom) {
    return {
      name: t("custom.itemName", { kg: item.custom.kg }),
      price: item.custom.price,
      image: "images/gallery-6.jpg",
      details: item.custom.details
    };
  }
  const product = products.find(function (p) { return p.id === item.id; });
  return {
    name: tr(product.name),
    price: product.price,
    image: product.image,
    details: t("cat." + product.category)
  };
}


// ---------- 7. Users: Sign Up / Log In simulation ----------
function getUsers() {
  return getData("sweetbakery-users", []);
}

function getCurrentUser() {
  const email = getData("sweetbakery-currentUser", null);
  return getUsers().find(function (u) { return u.email === email; }) || null;
}

function logOut() {
  localStorage.removeItem("sweetbakery-currentUser");
}


// ---------- 8. Form validation helpers ----------
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const phoneRegex = /^7\d{9}$/;            // 10 digits after +7, e.g. 701 234 56 78
const nameRegex = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі\s-]{2,40}$/;

function isValidPhone(value) {
  return phoneRegex.test(value.replace(/\D/g, ""));
}

// password: 8+ characters, uppercase, lowercase and a digit
function checkPasswordRules(password) {
  return {
    length: password.length >= 8,
    upper: /[A-ZА-ЯЁ]/.test(password),
    lower: /[a-zа-яё]/.test(password),
    digit: /\d/.test(password)
  };
}

function isStrongPassword(password) {
  const rules = checkPasswordRules(password);
  return rules.length && rules.upper && rules.lower && rules.digit;
}

// show / hide error under a field. errorKey = translation key or "" (no error)
function showError(input, errorKey) {
  const errorBox = input.closest(".field").querySelector(".field-error");
  errorBox.dataset.key = errorKey;
  errorBox.textContent = errorKey ? t(errorKey) : "";
  input.classList.toggle("is-invalid", errorKey !== "");
  return errorKey === "";
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach(function (box) {
    box.dataset.key = "";
    box.textContent = "";
  });
  form.querySelectorAll(".is-invalid").forEach(function (input) {
    input.classList.remove("is-invalid");
  });
}

// ready checks that return an error key or ""
function checkRequired(value) {
  return value.trim() === "" ? "err.required" : "";
}
function checkName(value) {
  if (value.trim() === "") return "err.required";
  return nameRegex.test(value.trim()) ? "" : "err.name";
}
function checkEmail(value) {
  if (value.trim() === "") return "err.required";
  return emailRegex.test(value.trim()) ? "" : "err.email";
}
function checkPhone(value) {
  if (value.trim() === "") return "err.required";
  return isValidPhone(value) ? "" : "err.phone";
}
function checkPassword(value) {
  if (value === "") return "err.required";
  return isStrongPassword(value) ? "" : "err.password";
}

// formats phone while typing: 7011234567 -> 701 123 45 67
function phoneMask(input) {
  input.addEventListener("input", function () {
    const d = input.value.replace(/\D/g, "").slice(0, 10);
    input.value = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(" ");
  });
}

// shake the form when there are errors
function shakeForm(form) {
  form.classList.remove("shake");
  void form.offsetWidth;
  form.classList.add("shake");
}


// ---------- 9. Toast notifications ----------
function showToast(message, type) {
  const box = document.getElementById("toast-stack");
  const toast = document.createElement("div");
  toast.className = "toast toast-" + (type || "success");
  toast.innerHTML = '<span class="toast-icon">' + icon(type === "error" ? "alert" : "check") + "</span>" +
                    '<span class="toast-msg"></span>';
  toast.querySelector(".toast-msg").textContent = message;
  box.appendChild(toast);

  setTimeout(function () { toast.classList.add("show"); }, 10);
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}


// ---------- Start ----------
document.addEventListener("DOMContentLoaded", function () {
  renderIcons();
  applyTranslations();
  initTheme();
  initMobileMenu();
  updateCartCount();
  updateAccountLink();

  const langSelect = document.getElementById("lang-select");
  langSelect.value = currentLang;
  langSelect.addEventListener("change", function () {
    changeLanguage(langSelect.value);
  });

  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.visibility = "hidden";
    });
  });
});
