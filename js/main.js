document.addEventListener("DOMContentLoaded", () => {

  // =========================================================================
  // 1. SOUND EFFECTS (Web Audio API - Self-contained, no external mp3 needed)
  // =========================================================================
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
    },
    playTone(frequency, type, duration) {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn("Audio playback not allowed before user gesture");
      }
    },
    click() { this.playTone(600, 'sine', 0.08); },
    success() {
      this.playTone(523.25, 'triangle', 0.12);
      setTimeout(() => this.playTone(659.25, 'triangle', 0.18), 100);
    },
    pop() { this.playTone(850, 'sine', 0.05); }
  };

  // Attach sound to all buttons
  document.querySelectorAll("button, .btn").forEach(btn => {
    btn.addEventListener("click", () => AudioEngine.click());
  });

  // =========================================================================
  // 2. DAY & NIGHT / PASTEL THEME TOGGLE (Dynamic Style Changes & Switch)
  // =========================================================================
  const themeBtn = document.getElementById("bg-color-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      themeBtn.textContent = isDark ? "Day" : "Night";
      AudioEngine.pop();
    });
  }

  // =========================================================================
  // 3. LIVE CLOCK WITH GREETING (Switch Statement & textContent)
  // =========================================================================
  function updateDateTime() {
    const clockElement = document.getElementById("live-clock");
    if (!clockElement) return;

    const now = new Date();
    const hours = now.getHours();
    let greeting = "";

    // Switch statement logic
    switch (true) {
      case (hours >= 5 && hours < 12):
        greeting = "Good Morning!";
        break;
      case (hours >= 12 && hours < 18):
        greeting = "Good Afternoon!";
        break;
      default:
        greeting = "Good Evening!";
        break;
    }

    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    };
    clockElement.textContent = `${greeting} ${now.toLocaleString('en-US', options)}`;
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // =========================================================================
  // 4. OBJECTS, ARRAYS & HIGHER-ORDER FUNCTIONS (Cakes Catalog)
  // =========================================================================
  const cakesData = [
    {
      id: 1,
      title: "Chocolate Delight",
      category: "chocolate",
      price: "$28",
      image: "images/chocolate-delight.jpg",
      description: "Rich chocolate sponge with Belgian dark chocolate ganache."
    },
    {
      id: 2,
      title: "Berry Bliss",
      category: "fruit",
      price: "$32",
      image: "images/berry-bliss.jpg",
      description: "Light vanilla sponge layered with fresh seasonal berries and cream."
    },
    {
      id: 3,
      title: "Classic Red Velvet",
      category: "classic",
      price: "$30",
      image: "images/red-velvet.jpg",
      description: "Traditional velvet cake with smooth cream cheese frosting."
    },
    {
      id: 4,
      title: "Mango-Passion Fruit",
      category: "fruit",
      price: "$34",
      image: "images/gallery-9.jpg",
      description: "Tropical layers of fresh mango confit and passionfruit curd."
    },
    {
      id: 5,
      title: "Dark Truffle Cake",
      category: "chocolate",
      price: "$35",
      image: "images/gallery-1.jpg",
      description: "Decadent double Belgian dark chocolate with cocoa glaze."
    }
  ];

  const dynamicCakeContainer = document.getElementById("dynamic-cake-container");
  const filterButtons = document.querySelectorAll("#cake-filter-buttons .filter-btn");

  // Higher-order function: render cakes using map()
  function displayCakes(cakesList) {
    if (!dynamicCakeContainer) return;
    
    dynamicCakeContainer.innerHTML = cakesList.map(cake => `
      <article class="card card-animate" data-id="${cake.id}">
        <div class="card-img-wrap">
          <img src="${cake.image}" alt="${cake.title}">
        </div>
        <div class="card-body">
          <h3>${cake.title}</h3>
          <p>${cake.description}</p>
          <div class="cake-price" style="padding: 0 20px; font-weight: 700; color: var(--pastel-blue-800); margin-bottom: 14px; font-size: 1.15rem;">${cake.price}</div>
          <a href="order-contact.html" class="btn">Order this cake</a>
        </div>
      </article>
    `).join("");
  }

  // Filter cakes using Switch Statement and filter()
  function filterCakes(category) {
    let filtered;
    switch (category) {
      case "chocolate":
        filtered = cakesData.filter(cake => cake.category === "chocolate");
        break;
      case "fruit":
        filtered = cakesData.filter(cake => cake.category === "fruit");
        break;
      case "classic":
        filtered = cakesData.filter(cake => cake.category === "classic");
        break;
      case "all":
      default:
        filtered = cakesData;
        break;
    }
    displayCakes(filtered);
  }

  if (dynamicCakeContainer) {
    displayCakes(cakesData);

    filterButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterCakes(btn.getAttribute("data-category"));
        AudioEngine.click();
      });
    });
  }

  // =========================================================================
  // 5. KEYBOARD EVENT HANDLING (Arrow navigation for filters)
  // =========================================================================
  let currentFilterIdx = 0;
  window.addEventListener("keydown", (e) => {
    if (filterButtons.length === 0) return;

    if (e.key === "ArrowRight") {
      currentFilterIdx = (currentFilterIdx + 1) % filterButtons.length;
      filterButtons[currentFilterIdx].click();
      filterButtons[currentFilterIdx].focus();
    } else if (e.key === "ArrowLeft") {
      currentFilterIdx = (currentFilterIdx - 1 + filterButtons.length) % filterButtons.length;
      filterButtons[currentFilterIdx].click();
      filterButtons[currentFilterIdx].focus();
    }
  });

  // =========================================================================
  // 6. RATING STARS SYSTEM (querySelectorAll & Attribute/Class manipulation)
  // =========================================================================
  const starElements = document.querySelectorAll("#star-rating .star");
  const ratingFeedback = document.getElementById("rating-feedback");

  if (starElements.length > 0) {
    starElements.forEach(star => {
      star.addEventListener("click", () => {
        const ratingVal = parseInt(star.getAttribute("data-value"), 10);
        AudioEngine.success();

        starElements.forEach(s => {
          const val = parseInt(s.getAttribute("data-value"), 10);
          if (val <= ratingVal) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });

        if (ratingFeedback) {
          ratingFeedback.textContent = `Thank you! You gave us a ${ratingVal} out of 5 stars rating.`;
        }
      });
    });
  }

  // =========================================================================
  // 7. ACCORDION (FAQ)
  // =========================================================================
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const content = header.nextElementSibling;
      if (content) {
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
      AudioEngine.pop();
    });
  });

  // =========================================================================
  // 8. PROMO POPUP MODAL
  // =========================================================================
  const popupModal = document.getElementById("popup-modal");
  const openPopupBtn = document.getElementById("open-popup-btn");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const popupSubmitBtn = document.getElementById("popup-submit-btn");

  if (openPopupBtn && popupModal) {
    openPopupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      popupModal.classList.add("open");
      popupModal.style.display = "flex";
      AudioEngine.pop();
    });

    const closePopup = () => {
      popupModal.classList.remove("open");
      popupModal.style.display = "none";
    };

    if (closePopupBtn) closePopupBtn.addEventListener("click", closePopup);

    window.addEventListener("click", (e) => {
      if (e.target === popupModal) closePopup();
    });

    if (popupSubmitBtn) {
      popupSubmitBtn.addEventListener("click", () => {
        const emailInput = popupModal.querySelector("input[type='email']");
        if (emailInput && emailInput.value.trim() !== "") {
          AudioEngine.success();
          alert("Promo code successfully sent to " + emailInput.value + "!");
          emailInput.value = "";
          closePopup();
        } else {
          alert("Please enter a valid email address.");
        }
      });
    }
  }

  // =========================================================================
  // 9. FORM VALIDATION & RESET (Callbacks & DOM manipulation)
  // =========================================================================
  const orderForm = document.getElementById("contact-form");
  if (orderForm) {
    const errorContainer = document.createElement("div");
    errorContainer.id = "form-error-messages";
    errorContainer.style.color = "#c0504d";
    errorContainer.style.marginBottom = "16px";
    errorContainer.style.fontWeight = "600";
    orderForm.prepend(errorContainer);

    // Reset button explicitly clearing all inputs via querySelectorAll
    const resetBtn = orderForm.querySelector("button[type='reset']");
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        orderForm.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(input => {
          input.value = '';
          input.classList.remove("invalid");
        });
        errorContainer.textContent = "";
        AudioEngine.pop();
      });
    }

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let errors = [];

      const nameInput = document.getElementById("user-name");
      const emailInput = document.getElementById("user-email");
      const phoneInput = document.getElementById("user-phone");
      const messageInput = document.getElementById("user-message");
      const agreeCheckbox = document.getElementById("agree-contact");

      [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        if (input) input.classList.remove("invalid");
      });

      if (!nameInput.value.trim()) {
        errors.push("The 'Your name' field is required.");
        nameInput.classList.add("invalid");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        errors.push("Please enter a valid email address.");
        emailInput.classList.add("invalid");
      }

      if (phoneInput.value.trim() && phoneInput.value.trim().length < 6) {
        errors.push("The phone number must be at least 6 characters.");
        phoneInput.classList.add("invalid");
      }

      if (!messageInput.value.trim()) {
        errors.push("The 'Special requests' field cannot be empty.");
        messageInput.classList.add("invalid");
      }

      if (!agreeCheckbox.checked) {
        errors.push("You must agree to be contacted about your order.");
      }

      if (errors.length > 0) {
        errorContainer.style.color = "#c0504d";
        errorContainer.innerHTML = errors.join("<br>");
      } else {
        AudioEngine.success();
        errorContainer.style.color = "#2e7d32";
        errorContainer.innerHTML = "Order successfully validated and submitted!";
        orderForm.reset();
        setTimeout(() => {
          errorContainer.innerHTML = "";
        }, 5000);
      }
    });
  }
});