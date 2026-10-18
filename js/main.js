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
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric',
        hour12: true 
      };
      clockElement.innerText = now.toLocaleDateString('en-US', options);
    }
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);


  // TASK 4

  const colorBtn = document.getElementById("bg-color-btn");
  if (colorBtn) {
    const pastelColors = ['#fbfdfe', '#f4f8fc', '#e8f1f9', '#fde9ee', '#fff5e6'];
    colorBtn.addEventListener("click", () => {
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      document.body.style.backgroundColor = randomColor;
    });
  }


  // TASK 3

  const popupModal = document.getElementById("popup-modal");
  const openPopupBtn = document.getElementById("open-popup-btn");
  const closePopupBtn = document.getElementById("close-popup-btn");

  if (openPopupBtn && popupModal) {
    openPopupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      popupModal.style.display = "flex";
    });

    closePopupBtn.addEventListener("click", () => {
      popupModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === popupModal) {
        popupModal.style.display = "none";
      }
    });
  }


  // TASK 2

  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const content = header.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });


  // TASK 1

  const orderForm = document.getElementById("contact-form");
  if (orderForm) {

    const errorContainer = document.createElement("div");
    errorContainer.id = "form-error-messages";
    errorContainer.style.color = "#9b3652";
    errorContainer.style.marginBottom = "16px";
    errorContainer.style.fontWeight = "600";
    orderForm.prepend(errorContainer);

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let errors = [];

      const name = document.getElementById("user-name").value.trim();
      const email = document.getElementById("user-email").value.trim();
      const phone = document.getElementById("user-phone").value.trim();
      const message = document.getElementById("user-message").value.trim();
      const agree = document.getElementById("agree-contact").checked;

      if (!name) {
        errors.push("Поле 'Your name' обязательно для заполнения.");
      }

      if (!email || !email.includes("@") || !email.includes(".")) {
        errors.push("Введите корректный email-адрес.");
      }

      if (phone && phone.length < 6) {
        errors.push("Номер телефона слишком короткий.");
      }

      if (!message) {
        errors.push("Поле 'Special requests' не должно быть пустым.");
      }

      if (!agree) {
        errors.push("Вы должны согласиться на получение информации о заказе.");
      }

      if (errors.length > 0) {
        errorContainer.innerHTML = errors.join("<br>");
      } else {
        errorContainer.style.color = "#2e7d32";
        errorContainer.innerHTML = "🎉 Заказ успешно прошел валидацию и отправлен!";
        orderForm.reset();
        setTimeout(() => {
          errorContainer.innerHTML = "";
        }, 5000);
      }
    });
  }
});