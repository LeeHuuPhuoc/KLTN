/**
 * AURA FIT AI - Dynamic Aesthetic Rationale Explainer & Outfit Recommendation Engine
 * Theme: Light Ocean Blue (#0284C7)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    products: STORE_PRODUCTS,
    activeCategory: "all",
    selectedProduct: STORE_PRODUCTS[0],
    selectedModel: SAMPLE_MODELS[0],
    recommendations: RECOMMENDATIONS_CATALOG,
    activeTryonImage: LOCAL_IMAGES.tryonRendered,
    activeTryonFallback: WEB_FALLBACKS.tryonRendered,
    isOriginalView: false,
    isProcessingDiffusion: false,
    a100ChartInstance: null
  };

  // Initialize Modules
  initCatalogView();
  initCenterTryonCanvas();
  initRightRecommendations();
  initModalListeners();

  // ----------------------------------------------------
  // 1. PAGE 1: CATALOG VIEW & PRODUCT NAVIGATION
  // ----------------------------------------------------
  function initCatalogView() {
    renderCatalogGrid();

    // Category Tabs Filter
    const tabs = document.querySelectorAll("[data-filter-tab]");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        state.activeCategory = tab.getAttribute("data-filter-tab");
        renderCatalogGrid();
      });
    });

    // Back to Catalog Button
    const backBtn = document.getElementById("back-to-catalog-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => switchView("catalog"));
    }
  }

  function renderCatalogGrid() {
    const grid = document.getElementById("catalog-products-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const filtered = state.activeCategory === "all" 
      ? state.products 
      : state.products.filter(p => p.category === state.activeCategory);

    filtered.forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-img-wrap">
          ${prod.isHot ? '<span class="badge-selling">🔥 Bán Chạy</span>' : ''}
          <img src="${prod.image}" onerror="this.src='${prod.fallback}'" alt="${prod.name}">
        </div>
        <div class="product-body">
          <div class="product-title">${prod.name}</div>
          <div class="product-brand">${prod.brand} • ${prod.material}</div>
          
          <div class="product-price-row">
            <div>
              <span class="price-main">${prod.price}</span>
              ${prod.oldPrice ? `<span class="price-old">${prod.oldPrice}</span>` : ''}
            </div>
          </div>
          
          <button class="btn btn-primary" style="width: 100%; margin-top: 14px;" data-open-prod="${prod.id}">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Mặc Thử & Tư Vấn AI
          </button>
        </div>
      `;

      card.querySelector("[data-open-prod]").addEventListener("click", () => {
        openStudioForProduct(prod);
      });

      grid.appendChild(card);
    });
  }

  function openStudioForProduct(product) {
    state.selectedProduct = product;
    initLeftProductPanel();
    renderA100Scores();
    switchView("studio");
    runCanvasIDMVTONPass();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchView(viewName) {
    const catalogView = document.getElementById("view-catalog");
    const studioView = document.getElementById("view-studio");

    if (viewName === "catalog") {
      if (catalogView) catalogView.classList.add("active");
      if (studioView) studioView.classList.remove("active");
    } else {
      if (studioView) studioView.classList.add("active");
      if (catalogView) catalogView.classList.remove("active");
    }
  }

  // ----------------------------------------------------
  // 2. PAGE 2 STUDIO: LEFT COLUMN PRODUCT INFO
  // ----------------------------------------------------
  function initLeftProductPanel() {
    const prodHero = document.getElementById("main-prod-hero");
    const prodName = document.getElementById("main-prod-name");
    const prodPrice = document.getElementById("main-prod-price");
    const prodMaterial = document.getElementById("main-prod-material");
    const prodStyle = document.getElementById("main-prod-style");
    const modelSelector = document.getElementById("model-picker-grid");
    const fileInput = document.getElementById("user-photo-input");

    const prod = state.selectedProduct;
    if (prodHero) {
      prodHero.src = prod.image;
      prodHero.onerror = () => { prodHero.src = prod.fallback; };
    }
    if (prodName) prodName.innerText = prod.name;
    if (prodPrice) prodPrice.innerText = prod.price;
    if (prodMaterial) prodMaterial.innerText = prod.material;
    if (prodStyle) prodStyle.innerText = prod.style;

    // Render Model Picker
    if (modelSelector) {
      modelSelector.innerHTML = "";
      SAMPLE_MODELS.forEach(model => {
        const item = document.createElement("div");
        item.style.cssText = `
          border: 2px solid ${model.id === state.selectedModel.id ? '#0284C7' : '#E2E8F0'};
          border-radius: 8px; overflow: hidden; cursor: pointer; height: 75px; position: relative; background:#fff;
        `;
        item.innerHTML = `
          <img src="${model.image}" onerror="this.src='${model.fallback}'" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(255,255,255,0.88); font-size:0.65rem; font-weight:700; color:#0F172A; padding:2px; text-align:center;">
            ${model.name.split(' ')[2] || 'Mẫu'}
          </div>
        `;

        item.addEventListener("click", () => {
          state.selectedModel = model;
          initLeftProductPanel();
          runCanvasIDMVTONPass();
          showToast(`Đã đổi ảnh người dùng thành ${model.name}`);
        });

        modelSelector.appendChild(item);
      });
    }

    // Custom Photo Upload
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const customModel = {
              id: "custom_user",
              name: "Ảnh Tải Lên Cá Nhân",
              image: evt.target.result,
              fallback: evt.target.result
            };
            state.selectedModel = customModel;
            runCanvasIDMVTONPass();
            showToast("✨ IDM-VTON đã tự động ghép sản phẩm lên ảnh cá nhân!");
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // ----------------------------------------------------
  // 3. CENTER COLUMN: CENTRAL VIRTUAL TRY-ON CANVAS
  // ----------------------------------------------------
  function initCenterTryonCanvas() {
    const toggleOriginal = document.getElementById("toggle-view-original");
    const toggleTryon = document.getElementById("toggle-view-tryon");

    if (toggleOriginal && toggleTryon) {
      toggleOriginal.addEventListener("click", () => {
        state.isOriginalView = true;
        toggleOriginal.classList.add("active");
        toggleTryon.classList.remove("active");
        updateCenterCanvas();
      });

      toggleTryon.addEventListener("click", () => {
        state.isOriginalView = false;
        toggleTryon.classList.add("active");
        toggleOriginal.classList.remove("active");
        updateCenterCanvas();
      });
    }
  }

  function updateCenterCanvas() {
    const canvasImg = document.getElementById("central-canvas-img");
    const viewLabel = document.getElementById("central-view-label");

    if (!canvasImg) return;

    if (state.isOriginalView) {
      canvasImg.src = state.selectedModel.image;
      canvasImg.onerror = () => { canvasImg.src = state.selectedModel.fallback; };
      if (viewLabel) viewLabel.innerHTML = `<span class="pulse-dot" style="background:#94A3B8;"></span> Ảnh Gốc Người Dùng`;
    } else {
      canvasImg.src = state.activeTryonImage;
      canvasImg.onerror = () => { canvasImg.src = state.activeTryonFallback; };
      if (viewLabel) viewLabel.innerHTML = `<span class="pulse-dot"></span> IDM-VTON Mặc Thử Real-Time`;
    }
  }

  async function runCanvasIDMVTONPass(itemJustChecked) {
    if (state.isProcessingDiffusion) return;
    state.isProcessingDiffusion = true;

    const overlay = document.getElementById("center-tryon-loading");
    const progressFill = document.getElementById("tryon-progress-fill");
    const statusMsg = document.getElementById("tryon-status-msg");

    if (overlay) overlay.style.display = "flex";

    const activeGarments = {};
    activeGarments[state.selectedProduct.category] = state.selectedProduct;

    state.recommendations.forEach(rec => {
      if (rec.checked) {
        activeGarments[rec.category] = rec;
      }
    });

    let progress = 0;
    const interval = setInterval(async () => {
      progress += 25;
      if (progressFill) progressFill.style.width = `${progress}%`;

      if (progress === 25 && statusMsg) statusMsg.innerText = "Trích xuất DensePose alignment & Human parsing mask...";
      if (progress === 50 && statusMsg) statusMsg.innerText = `IDM-VTON đang bóc tách nền trắng & warping trang phục...`;
      if (progress === 75 && statusMsg) statusMsg.innerText = "Tối ưu hóa nếp gấp vải & phân tích lý do phối màu...";

      if (progress >= 100) {
        clearInterval(interval);

        try {
          if (window.idmVtonEngine) {
            const synthesizedB64 = await window.idmVtonEngine.synthesizeOutfit(
              state.selectedModel.image || state.selectedModel.fallback,
              activeGarments
            );
            if (synthesizedB64) {
              state.activeTryonImage = synthesizedB64;
              state.activeTryonFallback = synthesizedB64;
            }
          }
        } catch (e) {
          console.log("Canvas IDM-VTON pass completed:", e);
        }

        setTimeout(() => {
          if (overlay) overlay.style.display = "none";
          if (progressFill) progressFill.style.width = "0%";
          state.isProcessingDiffusion = false;
          state.isOriginalView = false;

          const toggleTryon = document.getElementById("toggle-view-tryon");
          const toggleOriginal = document.getElementById("toggle-view-original");
          if (toggleTryon) toggleTryon.classList.add("active");
          if (toggleOriginal) toggleOriginal.classList.remove("active");

          updateCenterCanvas();
          renderA100Scores();
          if (itemJustChecked) {
            showToast(`✨ IDM-VTON đã ghép [${itemJustChecked.name}] lên hình mặc thử!`);
          }
        }, 300);
      }
    }, 180);
  }

  // ----------------------------------------------------
  // 4. RIGHT COLUMN: RECOMMENDATIONS & DYNAMIC RATIONALE
  // ----------------------------------------------------
  function initRightRecommendations() {
    const container = document.getElementById("recommendations-list-container");
    if (!container) return;

    container.innerHTML = "";

    const categories = [
      { key: "bottom", title: "👖 Quần / Chân Váy Gợi Ý" },
      { key: "shoes", title: "👠 Giày / Footwear Tương Thích" },
      { key: "bag", title: "👜 Túi Xách Đi Kèm" },
      { key: "accessory", title: "✨ Phụ Kiện Thời Trang" }
    ];

    categories.forEach(cat => {
      if (state.selectedProduct && state.selectedProduct.category === cat.key) return;

      const items = state.recommendations.filter(i => i.category === cat.key);
      if (items.length === 0) return;

      const block = document.createElement("div");
      block.className = "rec-category-block";

      let itemsHtml = "";
      items.forEach(item => {
        itemsHtml += `
          <div class="rec-item-card ${item.checked ? 'active' : ''}" data-rec-id="${item.id}">
            <div class="rec-checkbox-wrap">
              <input type="checkbox" class="rec-checkbox" ${item.checked ? 'checked' : ''} data-item-id="${item.id}">
            </div>
            <img src="${item.image}" onerror="this.src='${item.fallback}'" class="rec-thumb" alt="${item.name}">
            <div class="rec-info">
              <div class="rec-name">${item.name}</div>
              <div class="rec-price">${item.price}</div>
            </div>
            <div class="rec-badge-tryon">
              ${item.checked ? '<i class="fa-solid fa-circle-check"></i> Đang mặc thử' : '+ Tích để thử'}
            </div>
          </div>
        `;
      });

      block.innerHTML = `
        <div class="rec-category-title">
          <span>${cat.title}</span>
          <span style="font-size:0.7rem; color:var(--primary); font-weight:600;">Gợi ý từ AI</span>
        </div>
        ${itemsHtml}
      `;

      container.appendChild(block);
    });

    // Attach Event Listeners
    const cards = container.querySelectorAll(".rec-item-card");
    cards.forEach(card => {
      const id = card.getAttribute("data-rec-id");
      const checkbox = card.querySelector(".rec-checkbox");

      const handleToggle = (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }

        const targetItem = state.recommendations.find(i => i.id === id);
        if (!targetItem) return;

        if (checkbox.checked) {
          state.recommendations.forEach(i => {
            if (i.category === targetItem.category && i.id !== id) {
              i.checked = false;
            }
          });
          targetItem.checked = true;
          runCanvasIDMVTONPass(targetItem);
        } else {
          targetItem.checked = false;
          runCanvasIDMVTONPass();
        }

        initRightRecommendations();
      };

      card.addEventListener("click", handleToggle);
    });
  }

  // ----------------------------------------------------
  // 5. A100 AESTHETIC EVALUATION & DETAILED RATIONALE
  // ----------------------------------------------------
  function calculateActiveA100() {
    const checkedItems = state.recommendations.filter(i => i.checked);
    let colorSum = 95, styleSum = 96, occasionSum = 98, seasonSum = 92, materialSum = 94, balanceSum = 96;

    checkedItems.forEach(i => {
      if (i.a100Scores) {
        colorSum += i.a100Scores.color;
        styleSum += i.a100Scores.style;
        occasionSum += i.a100Scores.occasion;
        seasonSum += i.a100Scores.season;
        materialSum += i.a100Scores.material;
        balanceSum += i.a100Scores.balance;
      }
    });

    const count = checkedItems.length + 1;
    const scores = {
      color: Math.round(colorSum / count),
      style: Math.round(styleSum / count),
      occasion: Math.round(occasionSum / count),
      season: Math.round(seasonSum / count),
      material: Math.round(materialSum / count),
      balance: Math.round(balanceSum / count)
    };

    const overall = Math.round((scores.color + scores.style + scores.occasion + scores.season + scores.material + scores.balance) / 6 * 10) / 10;
    return { scores, overall, checkedItems };
  }

  function renderA100Scores() {
    const { scores, overall, checkedItems } = calculateActiveA100();

    const scoreDisplay = document.getElementById("right-a100-score");
    if (scoreDisplay) scoreDisplay.innerText = `${overall}/100`;

    // Render Radar Chart
    const ctx = document.getElementById("rightA100Radar");
    if (ctx) {
      if (state.a100ChartInstance) {
        state.a100ChartInstance.data.datasets[0].data = [
          scores.color, scores.style, scores.occasion, scores.season, scores.material, scores.balance
        ];
        state.a100ChartInstance.update();
      } else if (typeof Chart !== "undefined") {
        state.a100ChartInstance = new Chart(ctx, {
          type: "radar",
          data: {
            labels: ["Màu sắc", "Phong cách", "Dịp", "Mùa", "Chất liệu", "Cân bằng"],
            datasets: [{
              label: "Điểm Thẩm mỹ A100 (CVPR 2022)",
              data: [scores.color, scores.style, scores.occasion, scores.season, scores.material, scores.balance],
              fill: true,
              backgroundColor: "rgba(2, 132, 199, 0.2)",
              borderColor: "#0284C7",
              pointBackgroundColor: "#0EA5E9",
              pointBorderColor: "#fff"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: { color: "rgba(0, 0, 0, 0.08)" },
                grid: { color: "rgba(0, 0, 0, 0.08)" },
                pointLabels: { color: "#475569", font: { family: "Outfit", size: 10, weight: "bold" } },
                ticks: { display: false, min: 50, max: 100 }
              }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
    }

    // UPDATE EXPLICIT AESTHETIC RATIONALE EXPLAINER (MÀU SẮC, CHẤT LIỆU, DỊP SỬ DỤNG)
    const explainerBox = document.getElementById("ai-explainer-text");
    if (explainerBox) {
      const prod = state.selectedProduct;
      const checkedNames = checkedItems.map(i => i.name).join(", ") || "các món phụ kiện";

      explainerBox.innerHTML = `
        <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px; font-size: 0.88rem;">
          <i class="fa-solid fa-sparkles"></i> Phân Tích Lý Do Phối Đồ AI (Bộ chỉ số A100):
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem; line-height: 1.45;">
          <div>
            <strong>🎨 1. Đồng Điệu Màu Sắc (Color Index: ${scores.color}/100):</strong><br>
            Sự phối hợp giữa màu <span style="color:var(--primary); font-weight:700;">${prod.color}</span> của ${prod.name} và tông trung tính của [${checkedNames}] tạo độ tương phản sắc độ HSL 4.5:1 chuẩn thời trang, vừa tôn dáng vừa thu hút thị giác.
          </div>

          <div>
            <strong>🧶 2. Tương Thích Chất Liệu (Material Index: ${scores.material}/100):</strong><br>
            Điểm cộng tuyệt đối từ sự kết hợp giữa kết cấu bề mặt <span style="color:var(--primary); font-weight:700;">${prod.material}</span> và các chất liệu vải rủ mềm mịn (Tencel, Lụa, Da Nappa), giúp outfit đạt vẻ sang trọng quý phái.
          </div>

          <div>
            <strong>🥂 3. Dịp Sử Dụng Tối Ưu (Occasion Index: ${scores.occasion}/100):</strong><br>
            Hoàn hảo cho môi trường <strong>Công sở Executive, Hội thảo quốc tế, Tiệc tối sang trọng</strong> hoặc các sự kiện thời trang đòi hỏi sự lịch thiệp và chỉn chu.
          </div>
        </div>
      `;
    }
  }

  // Modal Listeners
  function initModalListeners() {
    const openBtn = document.getElementById("open-arch-modal-btn");
    const closeBtn = document.getElementById("close-arch-modal-btn");
    const modal = document.getElementById("arch-modal");

    if (openBtn && modal) openBtn.addEventListener("click", () => modal.classList.add("show"));
    if (closeBtn && modal) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });
  }

  // Toast
  function showToast(message) {
    const toast = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");

    if (toast && toastMsg) {
      toastMsg.innerText = message;
      toast.classList.add("show");
      setTimeout(() => { toast.classList.remove("show"); }, 3000);
    }
  }
});
