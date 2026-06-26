/* ============================================================
   Vanité — interações em JavaScript puro
   ============================================================ */
(function () {
  "use strict";

  /* ----------- Ano dinâmico no rodapé ----------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = "© " + new Date().getFullYear();

  /* ----------- Menu mobile ----------- */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        burger.classList.remove("open");
      });
    });
  }

  /* ============================================================
     ATELIER — construtor de produto estilo e-commerce + carrinho
     ============================================================ */
  var BRL = function (v) {
    return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  var BASES = [
    { id: "facial", name: "Creme Facial", img: "assets/line-facial.jpg", price: 189, desc: "Creme facial nutritivo com ativos botânicos para uma pele luminosa e confortável." },
    { id: "corporal", name: "Loção Corporal", img: "assets/line-corporal.jpg", price: 149, desc: "Loção sedosa de absorção rápida que nutre profundamente a pele do corpo." },
    { id: "capilar", name: "Máscara Capilar", img: "assets/line-capilar.jpg", price: 129, desc: "Tratamento capilar recarregável com extratos naturais para brilho saudável." }
  ];

  var FRAGRANCES = [
    { id: "sem", name: "Sem fragrância", note: "Pureza absoluta", add: 0, desc: "A fórmula essencial, sem aromas adicionados. Ideal para peles sensíveis." },
    { id: "lavanda", name: "Lavanda", note: "Floral · Calmante", add: 19, desc: "Colhida na Provença, traz serenidade e um perfume delicado ao fim do dia." },
    { id: "bambu", name: "Bambu", note: "Verde · Fresco", add: 19, desc: "Nota limpa e vibrante, com a frescura translúcida das florestas de bambu." },
    { id: "alecrim", name: "Alecrim", note: "Herbal · Revigorante", add: 19, desc: "Aromático e energizante, com o caráter mediterrâneo das ervas selvagens." },
    { id: "hortela", name: "Hortelã", note: "Mentolado · Vivo", add: 19, desc: "Refrescância instantânea com um toque cristalino de menta." },
    { id: "baunilha", name: "Baunilha", note: "Doce · Aconchegante", add: 24, desc: "Envolvente e quente, a baunilha de Madagascar traz conforto e sensualidade." }
  ];

  var SIZES = [
    { id: "50", name: "50 ml", sub: "Descoberta", add: 0 },
    { id: "100", name: "100 ml", sub: "Essencial", add: 50 },
    { id: "200", name: "200 ml", sub: "Maison", add: 90 }
  ];

  var INTENSITIES = [
    { id: "suave", name: "Suave", add: 0 },
    { id: "equilibrada", name: "Equilibrada", add: 0 },
    { id: "intensa", name: "Intensa", add: 12 }
  ];

  var state = { base: "corporal", frag: "lavanda", size: "100", intensity: "equilibrada" };

  function get(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }

  function unitPrice() {
    var b = get(BASES, state.base), f = get(FRAGRANCES, state.frag);
    var s = get(SIZES, state.size), i = get(INTENSITIES, state.intensity);
    var price = b.price + s.add;
    if (f.id !== "sem") { price += f.add + i.add; }
    return price;
  }

  /* ---------- elementos ---------- */
  var baseGrid = document.getElementById("baseGrid");
  var fragChips = document.getElementById("fragChips");
  var fragHint = document.getElementById("fragHint");
  var sizeRow = document.getElementById("sizeRow");
  var intensityRow = document.getElementById("intensityRow");
  var intensityStep = document.getElementById("intensityStep");
  var previewImg = document.getElementById("previewImg");
  var previewBadge = document.getElementById("previewBadge");
  var previewName = document.getElementById("previewName");
  var previewDesc = document.getElementById("previewDesc");
  var previewSpecs = document.getElementById("previewSpecs");
  var previewPrice = document.getElementById("previewPrice");
  var addCartBtn = document.getElementById("addCartBtn");

  if (baseGrid && fragChips) {
    function renderBases() {
      baseGrid.innerHTML = "";
      BASES.forEach(function (b) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "base-card" + (b.id === state.base ? " active" : "");
        btn.innerHTML =
          '<img src="' + b.img + '" alt="' + b.name + '" />' +
          '<span class="bc-body"><span class="bc-name">' + b.name + "</span>" +
          '<span class="bc-price">a partir de ' + BRL(b.price) + "</span></span>";
        btn.addEventListener("click", function () { state.base = b.id; renderBases(); updatePreview(); });
        baseGrid.appendChild(btn);
      });
    }

    function renderFrags() {
      fragChips.innerHTML = "";
      FRAGRANCES.forEach(function (f) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip" + (f.id === state.frag ? " active" : "");
        btn.textContent = f.name;
        btn.addEventListener("click", function () { state.frag = f.id; renderFrags(); updatePreview(); });
        fragChips.appendChild(btn);
      });
    }

    function renderOptions(row, list, key) {
      row.innerHTML = "";
      list.forEach(function (o) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt" + (o.id === state[key] ? " active" : "");
        btn.innerHTML = o.name + (o.sub ? '<span class="opt-sub">' + o.sub + "</span>" : "");
        btn.addEventListener("click", function () { state[key] = o.id; renderOptions(row, list, key); updatePreview(); });
        row.appendChild(btn);
      });
    }

    function updatePreview() {
      var b = get(BASES, state.base), f = get(FRAGRANCES, state.frag);
      var s = get(SIZES, state.size), i = get(INTENSITIES, state.intensity);
      previewImg.src = b.img;
      previewImg.alt = b.name + " " + f.name;
      previewBadge.textContent = f.name;
      previewName.textContent = b.name;
      previewDesc.textContent = b.desc;
      fragHint.textContent = f.desc;

      var noFrag = f.id === "sem";
      intensityStep.classList.toggle("disabled", noFrag);

      var specs = [
        ["Fragrância", f.name],
        ["Tamanho", s.name],
        ["Intensidade", noFrag ? "—" : i.name],
        ["Acabamento", "Vidro recarregável"]
      ];
      previewSpecs.innerHTML = specs.map(function (sp) {
        return "<li><span>" + sp[0] + "</span><span>" + sp[1] + "</span></li>";
      }).join("");

      previewPrice.textContent = BRL(unitPrice());
    }

    addCartBtn.addEventListener("click", function () {
      addToCart();
      addCartBtn.textContent = "Adicionado ✓";
      addCartBtn.classList.add("added");
      setTimeout(function () { addCartBtn.textContent = "Adicionar ao carrinho"; addCartBtn.classList.remove("added"); }, 1800);
    });

    renderBases();
    renderFrags();
    renderOptions(sizeRow, SIZES, "size");
    renderOptions(intensityRow, INTENSITIES, "intensity");
    updatePreview();
  }

  /* ============================================================
     CARRINHO
     ============================================================ */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("vanite_cart") || "[]"); } catch (e) { cart = []; }

  var cartToggle = document.getElementById("cartToggle");
  var cartDrawer = document.getElementById("cartDrawer");
  var cartOverlay = document.getElementById("cartOverlay");
  var cartClose = document.getElementById("cartClose");
  var cartItemsEl = document.getElementById("cartItems");
  var cartEmptyEl = document.getElementById("cartEmpty");
  var cartFootEl = document.getElementById("cartFoot");
  var cartTotalEl = document.getElementById("cartTotal");
  var cartCountEl = document.getElementById("cartCount");
  var checkoutBtn = document.getElementById("checkoutBtn");

  function saveCart() {
    try { localStorage.setItem("vanite_cart", JSON.stringify(cart)); } catch (e) {}
  }

  function addToCart() {
    var b = get(BASES, state.base), f = get(FRAGRANCES, state.frag);
    var s = get(SIZES, state.size), i = get(INTENSITIES, state.intensity);
    var noFrag = f.id === "sem";
    var key = [state.base, state.frag, state.size, noFrag ? "-" : state.intensity].join("|");
    var existing = cart.filter(function (it) { return it.key === key; })[0];
    if (existing) { existing.qty += 1; }
    else {
      cart.push({
        key: key, name: b.name, img: b.img, price: unitPrice(), qty: 1,
        meta: f.name + " · " + s.name + (noFrag ? "" : " · " + i.name)
      });
    }
    saveCart(); renderCart(); openCart();
  }

  function changeQty(key, delta) {
    var it = cart.filter(function (x) { return x.key === key; })[0];
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) { cart = cart.filter(function (x) { return x.key !== key; }); }
    saveCart(); renderCart();
  }

  function renderCart() {
    var count = cart.reduce(function (a, it) { return a + it.qty; }, 0);
    var total = cart.reduce(function (a, it) { return a + it.price * it.qty; }, 0);

    if (cartCountEl) {
      cartCountEl.textContent = count;
      cartCountEl.hidden = count === 0;
    }

    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";
    cart.forEach(function (it) {
      var div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML =
        '<img src="' + it.img + '" alt="' + it.name + '" />' +
        '<div><p class="ci-name">' + it.name + "</p>" +
        '<p class="ci-meta">' + it.meta + "</p>" +
        '<div class="ci-foot"><div class="qty">' +
        '<button type="button" data-act="dec" aria-label="Diminuir">−</button>' +
        "<span>" + it.qty + "</span>" +
        '<button type="button" data-act="inc" aria-label="Aumentar">+</button>' +
        '</div><span class="ci-price">' + BRL(it.price * it.qty) + "</span></div>" +
        '<button type="button" class="ci-remove" data-act="rm">Remover</button></div>';
      div.querySelector('[data-act="dec"]').addEventListener("click", function () { changeQty(it.key, -1); });
      div.querySelector('[data-act="inc"]').addEventListener("click", function () { changeQty(it.key, 1); });
      div.querySelector('[data-act="rm"]').addEventListener("click", function () { changeQty(it.key, -it.qty); });
      cartItemsEl.appendChild(div);
    });

    var empty = cart.length === 0;
    if (cartEmptyEl) cartEmptyEl.hidden = !empty;
    if (cartItemsEl) cartItemsEl.hidden = empty;
    if (cartFootEl) cartFootEl.hidden = empty;
    if (cartTotalEl) cartTotalEl.textContent = BRL(total);
  }

  function openCart() {
    if (!cartDrawer) return;
    cartOverlay.hidden = false;
    requestAnimationFrame(function () { cartOverlay.classList.add("show"); });
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
  }
  function closeCart() {
    if (!cartDrawer) return;
    cartOverlay.classList.remove("show");
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
    setTimeout(function () { cartOverlay.hidden = true; }, 350);
  }

  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      var total = cart.reduce(function (a, it) { return a + it.price * it.qty; }, 0);
      cart = []; saveCart(); renderCart();
      cartFootEl.hidden = false;
      cartFootEl.innerHTML =
        '<div class="cart-success"><p class="cs-check">✓</p>' +
        "<p class=\"cart-empty-title\">Pedido confirmado</p>" +
        '<p class="muted">Obrigado! Seu pedido de ' + BRL(total) +
        " foi recebido. Cada frasco será preparado individualmente à sua medida.</p></div>";
      if (cartEmptyEl) cartEmptyEl.hidden = true;
    });
  }

  renderCart();


  /* ----------- Formulário de contato ----------- */
  var form = document.getElementById("contactForm");
  var submitBtn = document.getElementById("submitBtn");
  if (form && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitBtn.textContent = "Mensagem enviada ✓";
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.textContent = "Enviar mensagem";
        submitBtn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  /* ----------- Newsletter ----------- */
  var newsBtn = document.getElementById("newsBtn");
  var newsEmail = document.getElementById("newsEmail");
  if (newsBtn && newsEmail) {
    newsBtn.addEventListener("click", function () {
      if (!newsEmail.value) return;
      newsBtn.textContent = "Assinado ✓";
      setTimeout(function () { newsBtn.textContent = "Assinar"; newsEmail.value = ""; }, 3000);
    });
  }

  /* ----------- Scroll reveal (IntersectionObserver) ----------- */
  var revealEls = document.querySelectorAll(".reveal:not(.is-visible)");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          setTimeout(function () { el.classList.add("is-visible"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
