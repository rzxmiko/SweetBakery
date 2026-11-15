document.addEventListener("DOMContentLoaded", function () {

  // =======================================================================
  // PRODUCT CARDS
  // =======================================================================
  function createProductCard(product) {
    let badges = "";
    if (product.bestseller) badges += '<span class="badge badge-bestseller">' + t("badge.hit") + "</span>";
    if (product.oldPrice) badges += '<span class="badge badge-sale">' + t("badge.sale") + "</span>";

    const oldPrice = product.oldPrice ? '<span class="price-old">' + formatPrice(product.oldPrice) + "</span>" : "";
    const unit = product.category === "cakes" ? '<span class="price-unit">' + t("product.perKg") + "</span>" : "";

    return `
      <article class="product-card">
        <div class="product-media">
          <img src="${product.image}" alt="${tr(product.name)}" onerror="this.style.visibility='hidden'">
          <div class="product-badges">${badges}</div>
        </div>
        <div class="product-body">
          <p class="product-cat">${t("cat." + product.category)}</p>
          <h3 class="product-title">${tr(product.name)}</h3>
          <p class="product-desc">${tr(product.desc)}</p>
          <div class="product-footer">
            <div class="product-price">
              <span class="price-now">${formatPrice(product.price)}</span>${oldPrice}${unit}
            </div>
            <button type="button" class="btn btn-primary btn-add" data-id="${product.id}">
              ${icon("plus")}<span>${t("product.add")}</span>
            </button>
          </div>
        </div>
      </article>`;
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest(".btn-add");
    if (!button) return;

    const product = products.find(function (p) { return p.id === button.dataset.id; });
    addToCart(product.id);
    showToast(t("toast.added", { name: tr(product.name) }));

    button.classList.add("added");
    setTimeout(function () { button.classList.remove("added"); }, 1000);
  });

  const bestsellersBox = document.getElementById("bestsellers");
  function showBestsellers() {
    const best = products.filter(function (p) { return p.bestseller; });
    bestsellersBox.innerHTML = best.map(createProductCard).join("");
  }
  if (bestsellersBox) showBestsellers();

  const setsBox = document.getElementById("sets-grid");
  function showSets() {
    const sets = products.filter(function (p) { return p.category === "sets"; });
    setsBox.innerHTML = sets.map(createProductCard).join("");
  }
  if (setsBox) showSets();


  // =======================================================================
  // MENU: search + category + sort (saved in localStorage)
  // =======================================================================
  const menuGrid = document.getElementById("menu-grid");
  const menuSearch = document.getElementById("menu-search");
  const menuSort = document.getElementById("menu-sort");
  const categoryButtons = document.querySelectorAll("#menu-categories .chip");

  let menuFilter = getData("sweetbakery-menu-filter", { category: "all", search: "", sort: "default" });

  function showMenu() {
    const search = menuFilter.search.trim().toLowerCase();

    let list = products.filter(function (p) {
      const categoryOk = menuFilter.category === "all" || p.category === menuFilter.category;
      const text = (p.name.en + " " + p.name.ru + " " + p.name.kk + " " + tr(p.desc)).toLowerCase();
      return categoryOk && text.includes(search);
    });

    // sort
    switch (menuFilter.sort) {
      case "cheap":
        list.sort(function (a, b) { return a.price - b.price; });
        break;
      case "expensive":
        list.sort(function (a, b) { return b.price - a.price; });
        break;
    }

    menuGrid.innerHTML = list.map(createProductCard).join("");
    document.getElementById("menu-empty").hidden = list.length > 0;
    document.getElementById("menu-results").textContent = t("menu.found", { n: list.length });

    categoryButtons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.category === menuFilter.category);
    });

    saveData("sweetbakery-menu-filter", menuFilter);
  }

  if (menuGrid) {
    const urlCategory = new URLSearchParams(window.location.search).get("cat");
    if (urlCategory) menuFilter.category = urlCategory;

    menuSearch.value = menuFilter.search;
    menuSort.value = menuFilter.sort;

    menuSearch.addEventListener("input", function () {
      menuFilter.search = menuSearch.value;
      showMenu();
    });
    menuSort.addEventListener("change", function () {
      menuFilter.sort = menuSort.value;
      showMenu();
    });
    categoryButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        menuFilter.category = btn.dataset.category;
        showMenu();
      });
    });
    document.getElementById("menu-reset").addEventListener("click", function () {
      menuFilter = { category: "all", search: "", sort: "default" };
      menuSearch.value = "";
      menuSort.value = "default";
      showMenu();
    });

    showMenu();
  }


  // =======================================================================
  // CUSTOM CAKE BUILDER
  // =======================================================================
  const builderForm = document.getElementById("builder-form");

  function getChecked(name) {
    return builderForm.querySelector('input[name="' + name + '"]:checked');
  }

  function getOptionTitle(input) {
    return input.closest(".option-card").querySelector(".option-title").textContent;
  }

  function updateBuilder() {
    const size = getChecked("size");
    const filling = getChecked("filling");
    const decor = getChecked("decor");
    const occasion = document.getElementById("b-occasion");

    const total = Number(size.dataset.price) + Number(filling.dataset.price) + Number(decor.dataset.price);

    const rows = [
      [t("builder.occasion"), occasion.value ? occasion.options[occasion.selectedIndex].text : "—"],
      [t("builder.size"), getOptionTitle(size)],
      [t("builder.filling"), getOptionTitle(filling)],
      [t("builder.decor"), getOptionTitle(decor)]
    ];
    document.getElementById("builder-summary").innerHTML = rows.map(function (row) {
      return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
    }).join("");

    document.getElementById("builder-total").textContent = formatPrice(total);

    const ready = new Date();
    ready.setDate(ready.getDate() + Number(decor.dataset.days));
    document.getElementById("builder-ready").textContent = t("builder.ready", { date: ready.toLocaleDateString("ru-RU") });

    return total;
  }

  if (builderForm) {
    builderForm.addEventListener("change", updateBuilder);
    updateBuilder();

    builderForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const occasion = document.getElementById("b-occasion");
      const text = document.getElementById("b-text");

      let ok = showError(occasion, occasion.value === "" ? "builder.errOccasion" : "");
      ok = showError(text, text.value.trim().length > 30 ? "builder.errText" : "") && ok;
      if (!ok) {
        shakeForm(builderForm);
        return;
      }

      const decor = getChecked("decor");
      addCustomCakeToCart({
        kg: getChecked("size").value,
        price: updateBuilder(),
        days: Number(decor.dataset.days),
        details: occasion.options[occasion.selectedIndex].text + " · " +
                 getOptionTitle(getChecked("filling")) + " · " + getOptionTitle(decor) +
                 (text.value.trim() ? " · «" + text.value.trim() + "»" : "")
      });
      showToast(t("builder.added"));
    });
  }


  // =======================================================================
  // PROMOTIONS
  // =======================================================================
  const popup = document.getElementById("popup-modal");
  if (popup) {
    const popupForm = document.getElementById("popup-form");
    const popupEmail = document.getElementById("popup-email");

    document.getElementById("open-popup-btn").addEventListener("click", function () {
      popup.hidden = false;
      setTimeout(function () { popup.classList.add("open"); }, 10);
    });

    function closePopup() {
      popup.classList.remove("open");
      setTimeout(function () { popup.hidden = true; }, 250);
    }
    document.getElementById("close-popup-btn").addEventListener("click", closePopup);
    popup.addEventListener("click", function (event) {
      if (event.target === popup) closePopup();
    });

    popupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!showError(popupEmail, checkEmail(popupEmail.value))) return;
      document.getElementById("popup-form-step").hidden = true;
      document.getElementById("popup-done-step").hidden = false;
    });

    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(btn.dataset.copy);
        btn.classList.add("copied");
        showToast(t("toast.copied"));
        setTimeout(function () { btn.classList.remove("copied"); }, 1500);
      });
    });

    document.querySelectorAll(".apply-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        saveData("sweetbakery-promo", btn.dataset.code);
        showToast(t("promo.applied", { code: btn.dataset.code }));
      });
    });
  }


  // =======================================================================
  // FAQ ACCORDION + SEARCH WITH HIGHLIGHT
  // =======================================================================
  const faqItems = document.querySelectorAll(".accordion-item");

  function toggleFaq(item, open) {
    const panel = item.querySelector(".accordion-panel");
    item.classList.toggle("open", open);
    panel.style.maxHeight = open ? panel.scrollHeight + "px" : null;
  }

  faqItems.forEach(function (item) {
    item.querySelector(".accordion-trigger").addEventListener("click", function () {
      toggleFaq(item, !item.classList.contains("open"));
    });
  });

  const faqSearch = document.getElementById("faq-search");
  function searchFaq() {
    const query = faqSearch.value.trim().toLowerCase();
    let found = 0;

    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq-q");
      const answer = item.querySelector(".faq-a");
      question.textContent = t(question.dataset.i18n);
      answer.textContent = t(answer.dataset.i18n);

      if (query === "") {
        item.hidden = false;
        toggleFaq(item, false);
        return;
      }

      const match = (question.textContent + " " + answer.textContent).toLowerCase().includes(query);
      item.hidden = !match;
      if (match) {
        found++;
        highlight(question, query);
        highlight(answer, query);
        toggleFaq(item, true);
      }
    });

    const info = document.getElementById("faq-info");
    info.textContent = query === "" ? "" : t("faq.found", { n: found });
  }

  function highlight(element, query) {
    const text = element.textContent;
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return;
    element.innerHTML = "";
    element.append(text.slice(0, index));
    const mark = document.createElement("mark");
    mark.textContent = text.slice(index, index + query.length);
    element.append(mark, text.slice(index + query.length));
  }

  if (faqSearch) faqSearch.addEventListener("input", searchFaq);


  // =======================================================================
  // EXTERNAL API — dessert recipes from TheMealDB
  // =======================================================================
  const recipeGrid = document.getElementById("recipe-grid");
  const recipeSearch = document.getElementById("recipe-search");
  const recipeInfo = document.getElementById("recipe-info");
  const recipeError = document.getElementById("recipe-error");
  const recipeMore = document.getElementById("recipe-more");
  let allRecipes = [];
  let recipesShown = 8;

  async function loadRecipes() {
    recipeError.hidden = true;
    recipeGrid.hidden = false;
    recipeInfo.textContent = t("recipes.loading");
    recipeGrid.innerHTML = '<div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-line"></div></div>'.repeat(8);

    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert");
      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }
      const data = await response.json();
      allRecipes = data.meals || [];
      showRecipes();
    } catch (error) {
      console.error("Could not load recipes:", error);
      recipeGrid.innerHTML = "";
      recipeGrid.hidden = true;
      recipeInfo.textContent = "";
      recipeMore.hidden = true;
      recipeError.hidden = false;
    }
  }

  function showRecipes() {
    const query = recipeSearch.value.trim().toLowerCase();
    const list = allRecipes.filter(function (r) {
      return r.strMeal.toLowerCase().includes(query);
    });
    const visible = list.slice(0, recipesShown);

    recipeGrid.innerHTML = visible.map(function (r) {
      return `
        <a class="recipe-card" href="https://www.themealdb.com/meal/${r.idMeal}" target="_blank" rel="noopener">
          <span class="recipe-img"><img src="${r.strMealThumb}/preview" alt="${r.strMeal}"></span>
          <span class="recipe-name">${r.strMeal}</span>
          <span class="recipe-link">${t("recipes.open")} ${icon("arrow")}</span>
        </a>`;
    }).join("");

    recipeInfo.textContent = list.length ? t("recipes.found", { n: visible.length, total: list.length }) : t("recipes.none");
    recipeMore.hidden = visible.length >= list.length;
  }

  if (recipeGrid) {
    recipeSearch.value = getData("sweetbakery-recipe-search", "");

    recipeSearch.addEventListener("input", function () {
      saveData("sweetbakery-recipe-search", recipeSearch.value);
      recipesShown = 8;
      if (allRecipes.length) showRecipes();
    });
    recipeMore.addEventListener("click", function () {
      recipesShown += 8;
      showRecipes();
    });
    document.getElementById("recipe-retry").addEventListener("click", loadRecipes);

    loadRecipes();
  }


  // =======================================================================
  // CONTACT FORM
  // =======================================================================
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const cName = document.getElementById("c-name");
    const cPhone = document.getElementById("c-phone");
    const cEmail = document.getElementById("c-email");
    const cMessage = document.getElementById("c-message");
    phoneMask(cPhone);

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      let ok = showError(cName, checkName(cName.value));
      ok = showError(cPhone, checkPhone(cPhone.value)) && ok;
      ok = showError(cEmail, checkEmail(cEmail.value)) && ok;
      const messageError = cMessage.value.trim() === "" ? "err.required" : (cMessage.value.trim().length < 10 ? "err.short" : "");
      ok = showError(cMessage, messageError) && ok;

      if (!ok) {
        shakeForm(contactForm);
        return;
      }

      const messages = getData("sweetbakery-messages", []);
      messages.push({ name: cName.value, email: cEmail.value, phone: cPhone.value, message: cMessage.value, date: new Date().toISOString() });
      saveData("sweetbakery-messages", messages);

      const success = document.getElementById("contact-success");
      success.hidden = false;
      success.textContent = t("contact.sent", { name: cName.value.trim() });
      contactForm.reset();
      showToast(t("contact.sentToast"));
    });
  }


  // =======================================================================
  // CART AND CHECKOUT
  // =======================================================================
  const cartList = document.getElementById("cart-list");

  function getDiscountPercent() {
    const code = getData("sweetbakery-promo", "");
    return promoCodes[code] || 0;
  }

  function getMinDays() {
    let days = 1;
    getCart().forEach(function (item) {
      if (item.custom && item.custom.days > days) days = item.custom.days;
    });
    return days;
  }

  function showCart() {
    const cart = getCart();
    document.getElementById("cart-empty").hidden = cart.length > 0;
    document.getElementById("cart-view").hidden = cart.length === 0;
    if (cart.length === 0) return;

  
    cartList.innerHTML = cart.map(function (item) {
      const info = getItemInfo(item);
      return `
        <li class="cart-item" data-id="${item.id}">
          <img src="${info.image}" alt="" class="cart-item-img" onerror="this.style.visibility='hidden'">
          <div class="cart-item-info">
            <h3>${info.name}</h3>
            <p class="cart-item-details">${info.details}</p>
            <p class="cart-item-unit">${formatPrice(info.price)}</p>
          </div>
          <div class="qty">
            <button type="button" class="qty-btn" data-action="minus" aria-label="-">${icon("minus")}</button>
            <span class="qty-value">${item.qty}</span>
            <button type="button" class="qty-btn" data-action="plus" aria-label="+">${icon("plus")}</button>
          </div>
          <strong class="cart-item-total">${formatPrice(info.price * item.qty)}</strong>
          <button type="button" class="icon-btn cart-remove" data-action="remove" aria-label="Remove">${icon("trash")}</button>
        </li>`;
    }).join("");

    let subtotal = 0;
    cart.forEach(function (item) { subtotal += getItemInfo(item).price * item.qty; });

    const percent = getDiscountPercent();
    const discount = Math.round(subtotal * percent / 100);
    const courier = document.querySelector('input[name="delivery"]:checked').value === "courier";
    const delivery = courier && subtotal < FREE_DELIVERY_FROM ? DELIVERY_PRICE : 0;
    const total = subtotal - discount + delivery;

    let html = "<div><dt>" + t("cart.subtotal") + "</dt><dd>" + formatPrice(subtotal) + "</dd></div>";
    if (percent > 0) {
      html += '<div class="is-discount"><dt>' + t("cart.discount") + " " + getData("sweetbakery-promo", "") + " (−" + percent + "%)</dt><dd>−" + formatPrice(discount) + "</dd></div>";
    }
    html += "<div><dt>" + t("cart.delivery") + "</dt><dd>" + (delivery ? formatPrice(delivery) : t("checkout.free")) + "</dd></div>";
    html += '<div class="is-total"><dt>' + t("cart.total") + "</dt><dd>" + formatPrice(total) + "</dd></div>";
    document.getElementById("totals").innerHTML = html;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + getMinDays());
    document.getElementById("date-hint").textContent = t("checkout.dateHint", { date: minDate.toLocaleDateString("ru-RU") });

    return total;
  }

  if (cartList) {
    const checkoutForm = document.getElementById("checkout-form");
    const promoForm = document.getElementById("promo-form");
    const promoInput = document.getElementById("promo-input");

    cartList.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button) return;
      const id = button.closest(".cart-item").dataset.id;
      let cart = getCart();
      const item = cart.find(function (i) { return i.id === id; });

      if (button.dataset.action === "plus") item.qty++;
      if (button.dataset.action === "minus" && item.qty > 1) item.qty--;
      if (button.dataset.action === "remove") cart = cart.filter(function (i) { return i.id !== id; });

      saveCart(cart);
      showCart();
    });

    document.getElementById("cart-clear").addEventListener("click", function () {
      saveCart([]);
      showCart();
    });

    promoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const code = promoInput.value.trim().toUpperCase();
      let error = "";
      if (code === "") error = "err.required";
      else if (!promoCodes[code]) error = "promo.wrong";
      if (!showError(promoInput, error)) return;

      saveData("sweetbakery-promo", code);
      promoInput.value = "";
      showToast(t("promo.applied", { code: code }));
      showCart();
    });

    checkoutForm.addEventListener("change", function () {
      const delivery = checkoutForm.querySelector('input[name="delivery"]:checked').value;
      const payment = checkoutForm.querySelector('input[name="payment"]:checked').value;
      document.getElementById("address-block").hidden = delivery !== "courier";
      document.getElementById("card-block").hidden = payment !== "card";
      showCart();
    });

    const user = getCurrentUser();
    if (user) {
      document.getElementById("co-name").value = user.name;
      document.getElementById("co-email").value = user.email;
      document.getElementById("co-phone").value = user.phone;
    }
    phoneMask(document.getElementById("co-phone"));

    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("co-name");
      const phone = document.getElementById("co-phone");
      const email = document.getElementById("co-email");
      const address = document.getElementById("co-address");
      const date = document.getElementById("co-date");
      const card = document.getElementById("co-card");
      const exp = document.getElementById("co-exp");
      const cvv = document.getElementById("co-cvv");
      const agree = document.getElementById("co-agree");
      const delivery = checkoutForm.querySelector('input[name="delivery"]:checked').value;
      const payment = checkoutForm.querySelector('input[name="payment"]:checked').value;

      let ok = showError(name, checkName(name.value));
      ok = showError(phone, checkPhone(phone.value)) && ok;
      ok = showError(email, checkEmail(email.value)) && ok;

      if (delivery === "courier") {
        ok = showError(address, address.value.trim().length < 5 ? "err.address" : "") && ok;
      } else {
        showError(address, "");
      }

      let dateError = "";
      const minDate = new Date();
      minDate.setHours(0, 0, 0, 0);
      minDate.setDate(minDate.getDate() + getMinDays());
      if (date.value === "") dateError = "err.required";
      else if (new Date(date.value + "T00:00:00") < minDate) dateError = "err.date";
      ok = showError(date, dateError) && ok;

      if (payment === "card") {
        ok = showError(card, /^\d{16}$/.test(card.value.replace(/\s/g, "")) ? "" : "err.card") && ok;
        ok = showError(exp, /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp.value.trim()) ? "" : "err.exp") && ok;
        ok = showError(cvv, /^\d{3}$/.test(cvv.value) ? "" : "err.cvv") && ok;
      } else {
        [card, exp, cvv].forEach(function (input) { showError(input, ""); });
      }

      ok = showError(agree, agree.checked ? "" : "err.agree") && ok;

      if (!ok) {
        shakeForm(checkoutForm);
        return;
      }

      const orderButton = document.getElementById("place-order");
      orderButton.classList.add("loading");
      orderButton.disabled = true;

      setTimeout(function () {
        const total = showCart();
        const order = {
          number: "SB-" + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toISOString(),
          date: date.value,
          items: getCart().map(function (item) {
            const info = getItemInfo(item);
            return { name: info.name, qty: item.qty, price: info.price };
          }),
          total: total,
          delivery: delivery,
          payment: payment,
          email: email.value.trim().toLowerCase()
        };
        const orders = getData("sweetbakery-orders", []);
        orders.unshift(order);
        saveData("sweetbakery-orders", orders);

        saveCart([]);
        localStorage.removeItem("sweetbakery-promo");

        document.getElementById("cart-view").hidden = true;
        document.getElementById("order-success").hidden = false;
        document.getElementById("success-number").textContent = t("success.number", { n: order.number });
        window.scrollTo({ top: 0, behavior: "smooth" });
        orderButton.classList.remove("loading");
        orderButton.disabled = false;
      }, 1200);
    });

    showCart();
  }


  // =======================================================================
  // SIGN UP / LOG IN
  // =======================================================================
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const signupForm = document.getElementById("signup-form");
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");

    if (getCurrentUser()) {
      window.location.href = "profile.html";
    }

    const next = new URLSearchParams(window.location.search).get("next") === "cart" ? "cart.html" : "profile.html";

    function showTab(name) {
      const isLogin = name === "login";
      document.getElementById("login-panel").hidden = !isLogin;
      document.getElementById("signup-panel").hidden = isLogin;
      tabLogin.setAttribute("aria-selected", isLogin);
      tabSignup.setAttribute("aria-selected", !isLogin);
    }
    tabLogin.addEventListener("click", function () { showTab("login"); });
    tabSignup.addEventListener("click", function () { showTab("signup"); });
    if (new URLSearchParams(window.location.search).get("mode") === "signup") showTab("signup");

    document.querySelectorAll(".pw-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const input = document.getElementById(btn.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
        btn.classList.toggle("is-on");
      });
    });

    const sPassword = document.getElementById("s-password");
    sPassword.addEventListener("input", function () {
      const rules = checkPasswordRules(sPassword.value);
      document.querySelectorAll("#pw-rules li").forEach(function (li) {
        li.classList.toggle("ok", rules[li.dataset.rule]);
      });
    });
    phoneMask(document.getElementById("s-phone"));

    // ----- Log In -----
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("l-email");
      const password = document.getElementById("l-password");
      const alertBox = document.getElementById("login-alert");

      let ok = showError(email, checkEmail(email.value));
      ok = showError(password, checkRequired(password.value)) && ok;
      if (!ok) {
        shakeForm(loginForm);
        return;
      }

      const user = getUsers().find(function (u) {
        return u.email === email.value.trim().toLowerCase() && u.password === password.value;
      });

      if (!user) {
        alertBox.hidden = false;
        alertBox.textContent = t("auth.wrong");
        shakeForm(loginForm);
        return;
      }

      saveData("sweetbakery-currentUser", user.email);
      window.location.href = next;
    });

    // ----- Sign Up -----
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("s-name");
      const email = document.getElementById("s-email");
      const phone = document.getElementById("s-phone");
      const confirm = document.getElementById("s-confirm");

      let emailError = checkEmail(email.value);
      const exists = getUsers().some(function (u) { return u.email === email.value.trim().toLowerCase(); });
      if (!emailError && exists) emailError = "err.emailTaken";

      let ok = showError(name, checkName(name.value));
      ok = showError(email, emailError) && ok;
      ok = showError(phone, checkPhone(phone.value)) && ok;
      ok = showError(sPassword, checkPassword(sPassword.value)) && ok;
      ok = showError(confirm, confirm.value !== sPassword.value || confirm.value === "" ? "err.confirm" : "") && ok;

      if (!ok) {
        shakeForm(signupForm);
        return;
      }


      const users = getUsers();
      users.push({
        name: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        phone: phone.value.trim(),
        password: sPassword.value,
        createdAt: new Date().toISOString()
      });
      saveData("sweetbakery-users", users);
      saveData("sweetbakery-currentUser", email.value.trim().toLowerCase());
      window.location.href = next;
    });
  }


  // =======================================================================
  // PROFILE PAGE
  // =======================================================================
  const profileName = document.getElementById("profile-name");

  function showProfile() {
    const user = getCurrentUser();
    profileName.textContent = t("profile.hello", { name: user.name });
    document.getElementById("profile-avatar").textContent = user.name.charAt(0).toUpperCase();
    document.getElementById("profile-since").textContent = t("profile.since", { date: new Date(user.createdAt).toLocaleDateString("ru-RU") });
    document.getElementById("detail-name").textContent = user.name;
    document.getElementById("detail-email").textContent = user.email;
    document.getElementById("detail-phone").textContent = "+7 " + user.phone;

    const orders = getData("sweetbakery-orders", []).filter(function (o) { return o.email === user.email; });
    const ordersBox = document.getElementById("orders-list");

    if (orders.length === 0) {
      ordersBox.innerHTML = '<p class="empty-text">' + t("profile.noOrders") + ' <a class="text-link" href="menu.html">' + t("cart.toMenu") + "</a></p>";
      return;
    }

    ordersBox.innerHTML = orders.map(function (order) {
      const items = order.items.map(function (item) {
        return "<li><span>" + item.name + " × " + item.qty + "</span><span>" + formatPrice(item.price * item.qty) + "</span></li>";
      }).join("");
      return `
        <article class="order-card">
          <header class="order-head">
            <div>
              <h3>${t("profile.order")} ${order.number}</h3>
              <p class="order-date">${t("profile.date")}: ${new Date(order.date).toLocaleDateString("ru-RU")} · ${t("checkout." + order.delivery)} · ${t("pay." + order.payment)}</p>
            </div>
            <span class="status status-preparing">${t("profile.accepted")}</span>
          </header>
          <ul class="order-items">${items}</ul>
          <p class="order-total">${t("cart.total")}: <strong>${formatPrice(order.total)}</strong></p>
        </article>`;
    }).join("");
  }

  if (profileName) {
    if (!getCurrentUser()) {
      window.location.href = "login.html";
      return;
    }
    showProfile();

    document.getElementById("logout-btn").addEventListener("click", function () {
      logOut();
      window.location.href = "index.html";
    });
  }


  const counters = document.querySelectorAll(".stat-number");

  function startCounter(el) {
    const target = Number(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + el.dataset.suffix;
    }, 25);
  }

  if (counters.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    counters.forEach(function (c) { observer.observe(c); });
  }


  document.addEventListener("languageChanged", function () {
    if (bestsellersBox) showBestsellers();
    if (setsBox) showSets();
    if (menuGrid) showMenu();
    if (builderForm) updateBuilder();
    if (faqSearch) searchFaq();
    if (recipeGrid && allRecipes.length) showRecipes();
    if (cartList) showCart();
    if (profileName && getCurrentUser()) showProfile();
  });
});
