

$(document).ready(function () {

  // =========================================================================
  // TASK 0. SETUP
  // =========================================================================
  console.log("jQuery is ready!");

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // =========================================================================
  // TASK 7. NOTIFICATION SYSTEM (toast that fades out)
  // =========================================================================
  const $toastBox = $('<div id="toast-container" aria-live="polite"></div>').appendTo("body");

  function showToast(message, type, duration) {
    type = type || "success";
    duration = duration || 3000;

    const icons = { success: "✔", error: "✖", info: "ℹ" };

    const $toast = $('<div class="toast" role="status"></div>')
      .addClass("toast-" + type)
      .append($('<span class="toast-icon"></span>').text(icons[type] || icons.info))
      .append($('<span class="toast-msg"></span>').text(message))
      .appendTo($toastBox)
      .hide();

    $toast.fadeIn(250).delay(duration).fadeOut(400, function () {
      $(this).remove();
    });

    $toast.on("click", function () {
      $(this).stop(true, true).fadeOut(200, function () {
        $(this).remove();
      });
    });
  }

  $("#star-rating").on("click", ".star", function () {
    const value = $(this).attr("data-value");
    showToast("Thanks for rating us " + value + " out of 5!", "success");
  });

  // =========================================================================
  // TASK 1. REAL-TIME SEARCH AND LIVE FILTER (Cakes Catalog)
  // =========================================================================
  const $cakeSearch = $("#cake-search");

  function applyCakeSearch() {
    const query = $cakeSearch.val().trim().toLowerCase();
    const $cards = $("#dynamic-cake-container .card");
    const total = $cards.length;

    const $matches = $cards.hide().filter(function () {
      return $(this).text().toLowerCase().indexOf(query) > -1;
    }).show();

    $("#no-cakes-msg").prop("hidden", $matches.length > 0 || total === 0);

    if (query === "") {
      $("#cake-search-info").text("");
    } else {
      $("#cake-search-info").text("Showing " + $matches.length + " of " + total + " cakes");
    }
  }

  if ($cakeSearch.length) {
    $cakeSearch.on("keyup input", applyCakeSearch);

    $("#cake-filter-buttons").on("click", ".filter-btn", applyCakeSearch);
  }

  // =========================================================================
  // TASK 2. AUTOCOMPLETE SEARCH SUGGESTIONS (Desserts Menu)
  // =========================================================================
  const $dessertSearch = $("#dessert-search");
  const $suggestions = $("#dessert-suggestions");

  if ($dessertSearch.length && $suggestions.length) {
    const dessertItems = $("#menu-table tbody tr").map(function () {
      const $cells = $(this).find("td");
      const nameIdx = $cells.length === 4 ? 1 : 0;
      return {
        name: $cells.eq(nameIdx).text().trim(),
        price: $cells.eq($cells.length - 1).text().trim(),
        $row: $(this)
      };
    }).get();

    let activeIdx = -1;

    function closeSuggestions() {
      $suggestions.hide().empty();
      $dessertSearch.attr("aria-expanded", "false");
      activeIdx = -1;
    }

    function renderSuggestions(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        closeSuggestions();
        return;
      }

      const matches = dessertItems
        .filter(function (item) { return item.name.toLowerCase().indexOf(q) > -1; })
        .sort(function (a, b) {
          return (b.name.toLowerCase().indexOf(q) === 0) - (a.name.toLowerCase().indexOf(q) === 0);
        })
        .slice(0, 6);

      $suggestions.empty();
      activeIdx = -1;

      if (matches.length === 0) {
        $suggestions.append('<li class="sg-empty">No suggestions found</li>');
      } else {
        const re = new RegExp("(" + escapeRegExp(q) + ")", "ig");
        $.each(matches, function (i, item) {
          const label = escapeHtml(item.name).replace(re, "<strong>$1</strong>");
          $('<li class="sg-item" role="option"></li>')
            .html('<span>' + label + '</span><span class="sg-meta">$' + escapeHtml(item.price) + '</span>')
            .data("item", item)
            .appendTo($suggestions);
        });
      }

      $suggestions.slideDown(120);
      $dessertSearch.attr("aria-expanded", "true");
    }

    function chooseSuggestion(item) {
      $dessertSearch.val(item.name);
      closeSuggestions();

      $(".row-found").removeClass("row-found");
      item.$row.addClass("row-found");
      window.scrollTo({ top: item.$row.offset().top - 140, behavior: "smooth" });
      setTimeout(function () { item.$row.removeClass("row-found"); }, 2400);

      showToast(item.name + " — $" + item.price, "info");
    }

    function moveActive(step) {
      const $items = $suggestions.children(".sg-item");
      if (!$items.length) return;
      activeIdx = (activeIdx + step + $items.length) % $items.length;
      $items.removeClass("active").eq(activeIdx).addClass("active");
    }

    $dessertSearch.on("input", function () {
      renderSuggestions($(this).val());
    });

    $dessertSearch.on("keydown", function (e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveActive(-1);
          break;
        case "Enter": {
          const $items = $suggestions.children(".sg-item");
          const $target = activeIdx > -1 ? $items.eq(activeIdx) : $items.first();
          if ($target.length) {
            e.preventDefault();
            chooseSuggestion($target.data("item"));
          }
          break;
        }
        case "Escape":
          closeSuggestions();
          break;
      }
    });

    $suggestions.on("mousedown", ".sg-item", function (e) {
      e.preventDefault();
      chooseSuggestion($(this).data("item"));
    });

    $suggestions.on("mouseenter", ".sg-item", function () {
      $(this).addClass("active").siblings().removeClass("active");
      activeIdx = $(this).index();
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".autocomplete-box").length) closeSuggestions();
    });
  }

  // =========================================================================
  // TASK 3. SEARCH HIGHLIGHTING (FAQ on Home and About pages)
  // Matching words are wrapped in <mark>, and matching answers are opened.
  // =========================================================================
  const $faqSearch = $("#faq-search");

  if ($faqSearch.length) {
    const $faqTargets = $(".accordion-header, .accordion-content p");

    $faqTargets.each(function () {
      $(this).data("origText", $(this).text());
    });

    function highlightText(text, re) {
      let out = "";
      let last = 0;
      let count = 0;
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(text)) !== null) {
        out += escapeHtml(text.slice(last, m.index)) +
          '<mark class="search-hit">' + escapeHtml(m[0]) + "</mark>";
        last = m.index + m[0].length;
        count++;
        if (m[0].length === 0) re.lastIndex++;
      }
      out += escapeHtml(text.slice(last));
      return { html: out, count: count };
    }

    function runFaqHighlight() {
      const query = $faqSearch.val().trim();

      $faqTargets.each(function () {
        $(this).text($(this).data("origText"));
      });
      $(".accordion-header").each(function () {
        const $header = $(this);
        if ($header.data("openedBySearch")) {
          $header.removeClass("active").removeData("openedBySearch");
          $header.next(".accordion-content").css("max-height", "");
        }
      });

      if (!query) {
        $("#faq-search-info").text("").removeClass("no-results");
        return;
      }

      const re = new RegExp(escapeRegExp(query), "gi");
      let total = 0;

      $(".accordion-header").each(function () {
        const $header = $(this);
        const $content = $header.next(".accordion-content");
        let itemHits = 0;

        $header.add($content.find("p")).each(function () {
          const result = highlightText($(this).data("origText"), re);
          if (result.count > 0) {
            $(this).html(result.html);
            itemHits += result.count;
          }
        });

        total += itemHits;

        if (itemHits > 0 && !$header.hasClass("active")) {
          $header.addClass("active").data("openedBySearch", true);
          $content.css("max-height", $content[0].scrollHeight + "px");
        }
      });

      const $info = $("#faq-search-info");
      if (total === 0) {
        $info.text("No matches found").addClass("no-results");
      } else {
        $info.text(total + (total === 1 ? " match found" : " matches found")).removeClass("no-results");
      }
    }

    $faqSearch.on("keyup input", runFaqHighlight);
  }

  // =========================================================================
  // TASK 4. COLORFUL AND STYLIZED SCROLL PROGRESS BAR
  // =========================================================================
  const $progress = $(
    '<div id="scroll-progress" aria-hidden="true">' +
      '<div class="scroll-progress-bar"></div>' +
      '<span class="scroll-progress-label">0%</span>' +
    "</div>"
  ).prependTo("body");

  const $progressBar = $progress.find(".scroll-progress-bar");
  const $progressLabel = $progress.find(".scroll-progress-label");

  function updateScrollProgress() {
    const scrollable = $(document).height() - $(window).height();
    const percent = scrollable > 0 ? ($(window).scrollTop() / scrollable) * 100 : 0;
    const rounded = Math.min(100, Math.max(0, Math.round(percent)));

    $progressBar.css("width", percent + "%");
    $progressLabel.text(rounded + "%").toggleClass("visible", rounded > 0);
  }

  $(window).on("scroll resize", updateScrollProgress);
  updateScrollProgress();

  // =========================================================================
  // TASK 5. ANIMATED NUMBER COUNTER (Home page stats)
  // Starts once, when the numbers scroll into view.
  // =========================================================================
  const $counters = $(".stat-number");

  function animateCounter($el) {
    const target = Number($el.attr("data-target")) || 0;
    const suffix = $el.attr("data-suffix") || "";

    $({ value: 0 }).animate({ value: target }, {
      duration: 2200,
      easing: "swing",
      step: function (now) {
        $el.text(Math.floor(now).toLocaleString("en-US") + suffix);
      },
      complete: function () {
        $el.text(target.toLocaleString("en-US") + suffix);
      }
    });
  }

  function checkCounters() {
    if (!$counters.length) return;
    const viewportBottom = $(window).scrollTop() + $(window).height();

    $counters.each(function () {
      const $el = $(this);
      if ($el.data("counted")) return;
      if ($el.offset().top < viewportBottom - 60) {
        $el.data("counted", true);
        animateCounter($el);
      }
    });
  }

  if ($counters.length) {
    $(window).on("scroll resize", checkCounters);
    checkCounters();
  }

  // =========================================================================
  // TASK 6. LOADING SPINNER ON SUBMIT (Order form)
  // main.js validates the form and fires "order:valid" / "order:invalid".
  // =========================================================================
  const $orderForm = $("#contact-form");

  if ($orderForm.length) {
    $orderForm.on("order:valid", function () {
      const $btn = $(this).find(".submit-btn");
      if ($btn.prop("disabled")) return;        

      const originalText = $btn.text();

      $btn
        .prop("disabled", true)               
        .attr("aria-busy", "true")
        .html('<span class="btn-spinner" aria-hidden="true"></span>Please wait…');

      setTimeout(function () {
        $btn
          .prop("disabled", false)
          .removeAttr("aria-busy")
          .text(originalText);

        showToast("Your order was submitted successfully!", "success");
      }, 2000);
    });

    $orderForm.on("order:invalid", function () {
      showToast("Please check the highlighted fields.", "error");
    });
  }

  // =========================================================================
  // TASK 8. "COPIED TO CLIPBOARD" BUTTON (Promo code and address)
  // =========================================================================
  const ICON_COPY =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="13" height="13" rx="2"></rect>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="20 6 9 17 4 12"></polyline></svg>';

  $(".copy-btn").html(ICON_COPY);

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const $ta = $("<textarea readonly></textarea>")
        .val(text)
        .css({ position: "fixed", top: 0, left: 0, opacity: 0 })
        .appendTo("body");
      $ta[0].select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      $ta.remove();
      ok ? resolve() : reject();
    });
  }

  function markCopied($btn) {
    clearTimeout($btn.data("timer"));
    $btn.find(".copy-tooltip").remove();

    $btn.addClass("copied").html(ICON_CHECK);
    $('<span class="copy-tooltip" role="status">Copied to clipboard!</span>')
      .appendTo($btn)
      .hide()
      .fadeIn(150);

    showToast("Copied to clipboard!", "success");

    $btn.data("timer", setTimeout(function () {
      $btn.removeClass("copied").html(ICON_COPY);
    }, 2000));
  }

  $(document).on("click", ".copy-btn", function () {
    const $btn = $(this);
    const text = $($btn.attr("data-copy-target")).text().trim();

    copyText(text).then(
      function () { markCopied($btn); },
      function () { showToast("Could not copy. Please copy it manually.", "error"); }
    );
  });

  $(".snippet").on("copy", function () {
    const $btn = $('.copy-btn[data-copy-target="#' + this.id + '"]');
    if ($btn.length) markCopied($btn);
  });

  // =========================================================================
  // TASK 9. IMAGE LAZY LOADING
  // =========================================================================
  const $lazyImages = $("img.lazy");

  function lazyLoadImages() {
    const threshold = $(window).scrollTop() + $(window).height() + 200;

    $lazyImages.each(function () {
      const $img = $(this);
      const realSrc = $img.attr("data-src");
      if (!realSrc) return;                      

      if ($img.offset().top < threshold) {
        $img
          .one("load error", function () { $img.addClass("loaded"); })
          .attr("src", realSrc)
          .removeAttr("data-src");
      }
    });
  }

  if ($lazyImages.length) {
    $(window).on("scroll resize load", lazyLoadImages);
    lazyLoadImages();
  }

});