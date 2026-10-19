document.addEventListener("DOMContentLoaded", () => {

  // TASK 5
  function updateDateTime() {
    const clockElement = document.getElementById("live-clock");
    if (clockElement) {
      const now = new Date();
      const options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      };
      clockElement.innerText = now.toLocaleString('en-US', options);
    }
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // TASK 4
  const colorBtn = document.getElementById("bg-color-btn");
  if (colorBtn) {
    const pastelColors = ['#fbfdfe', '#f4f8fc', '#e8f1f9', '#fde9ee', '#fff5e6', '#f3e5f5'];
    colorBtn.addEventListener("click", () => {
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      document.body.style.backgroundColor = randomColor;
    });
  }

  // TASK 3
  const popupModal = document.getElementById("popup-modal");
  const openPopupBtn = document.getElementById("open-popup-btn");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const popupSubmitBtn = document.getElementById("popup-submit-btn");

  if (openPopupBtn && popupModal) {
    openPopupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      popupModal.classList.add("open");
      popupModal.style.display = "flex";
    });

    const closePopup = () => {
      popupModal.classList.remove("open");
      popupModal.style.display = "none";
    };

    if (closePopupBtn) {
      closePopupBtn.addEventListener("click", closePopup);
    }

    window.addEventListener("click", (e) => {
      if (e.target === popupModal) {
        closePopup();
      }
    });

    if (popupSubmitBtn) {
      popupSubmitBtn.addEventListener("click", () => {
        const emailInput = popupModal.querySelector("input[type='email']");
        if (emailInput && emailInput.value.trim() !== "") {
          alert("Promo code successfully sent to " + emailInput.value + "!");
          emailInput.value = "";
          closePopup();
        } else {
          alert("Please enter a valid email address.");
        }
      });
    }
  }

  // TASK 2
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
    });
  });

  // TASK 1
  const orderForm = document.getElementById("contact-form");
  if (orderForm) {
    const errorContainer = document.createElement("div");
    errorContainer.id = "form-error-messages";
    errorContainer.style.color = "#c0504d";
    errorContainer.style.marginBottom = "16px";
    errorContainer.style.fontWeight = "600";
    orderForm.prepend(errorContainer);

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