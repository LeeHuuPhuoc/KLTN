/**
 * AURA FIT AI - Main Application Integration & Interactivity Controller
 * Theme: Light Ocean Blue (#0284C7)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    products: window.STORE_PRODUCTS || [],
    activeCategory: "all",
    searchQuery: "",
    selectedProduct: (window.STORE_PRODUCTS && window.STORE_PRODUCTS[0]) || null,
    selectedModel: (window.VITON_HD_MODELS && window.VITON_HD_MODELS[0]) || null,
    recommendations: window.RECOMMENDATIONS_CATALOG || [],
    polyvoreOutfits: window.POLYVORE_RECOMMENDED_OUTFITS || [],
    activeTryonImage: (window.LOCAL_IMAGES && window.LOCAL_IMAGES.tryonRendered) || "",
    activeTryonFallback: (window.WEB_FALLBACKS && window.WEB_FALLBACKS.tryonRendered) || "",
    isOriginalView: false,
    isProcessingDiffusion: false,
    a100ChartInstance: null,
    currentFeedbackRating: 5
  };

  // Initialize Modules
  initNavbarCounters();
  initCatalogView();
  initContextAdvisoryWidget();
  initPolyvoreOutfitsSection();
  initCenterTryonCanvas();
  initRightRecommendations();
  initChatbotIntegration();
  initSavedOutfitsModal();
  initFeedbackModal();
  initModalListeners();

  // ----------------------------------------------------
  // 0. NAVBAR & INITIALIZATION
  // ----------------------------------------------------
  function initNavbarCounters() {
    updateSavedOutfitsBadge();
  }

  function updateSavedOutfitsBadge() {
    const badge = document.getElementById("saved-outfits-count");
    if (badge && window.outfitManager) {
      const list = window.outfitManager.getSavedOutfits();
      badge.innerText = list.length;
    }
  }

  // ----------------------------------------------------
  // 1. PAGE 1: CATALOG VIEW & SEARCH / FILTER
  // ----------------------------------------------------
  function initCatalogView() {
    renderCatalogGrid();

    // Search Input Event
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        renderCatalogGrid();
      });
    }

    // Category Tabs Filter
    const tabsContainer = document.getElementById("catalog-category-tabs");
    if (tabsContainer) {
      const tabs = tabsContainer.querySelectorAll("[data-filter-tab]");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          state.activeCategory = tab.getAttribute("data-filter-tab");
          renderCatalogGrid();
        });
      });
    }

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
    
    let filtered = state.products;

    // Filter by Category
    if (state.activeCategory !== "all") {
      filtered = filtered.filter(p => p.category === state.activeCategory);
    }

    // Filter by Search Query
    if (state.searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(state.searchQuery) ||
        (p.material && p.material.toLowerCase().includes(state.searchQuery)) ||
        (p.color && p.color.toLowerCase().includes(state.searchQuery)) ||
        (p.brand && p.brand.toLowerCase().includes(state.searchQuery))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 12px; color: #CBD5E1;"></i>
          <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa "${state.searchQuery}"</p>
        </div>
      `;
      return;
    }

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
            ${prod.polyvoreScore ? `<span style="font-size:0.75rem; font-weight:700; color:var(--accent-emerald);">Polyvore: ${prod.polyvoreScore}%</span>` : ''}
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

  // ----------------------------------------------------
  // 2. ADVISORY CONTEXT WIDGET & POLYVORE RECOMMENDED OUTFITS
  // ----------------------------------------------------
  function initContextAdvisoryWidget() {
    const applyBtn = document.getElementById("apply-context-advisory-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const occasion = document.getElementById("context-occasion-select").value;
        const season = document.getElementById("context-season-select").value;
        const style = document.getElementById("context-style-select").value;

        filterPolyvoreOutfits(occasion, season, style);
        showToast("✨ AI đã lọc danh sách Polyvore Outfit đề xuất tối ưu!");
      });
    }
  }

  function initPolyvoreOutfitsSection() {
    renderPolyvoreOutfits(state.polyvoreOutfits);
  }

  function filterPolyvoreOutfits(occasion, season, style) {
    let list = state.polyvoreOutfits;
    if (occasion !== "all") list = list.filter(o => o.occasion === occasion);
    if (season !== "all") list = list.filter(o => o.season === season);
    if (style !== "all") list = list.filter(o => o.style === style);

    renderPolyvoreOutfits(list);
  }

  function renderPolyvoreOutfits(outfits) {
    const container = document.getElementById("polyvore-outfits-container");
    if (!container) return;

    container.innerHTML = "";

    if (outfits.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--text-muted);">
          Không có outfit nào khớp với bộ lọc ngữ cảnh. Vui lòng chọn ngữ cảnh rộng hơn.
        </div>
      `;
      return;
    }

    outfits.forEach(outfit => {
      const card = document.createElement("div");
      card.className = "polyvore-card";

      const itemsList = Object.values(outfit.items).filter(Boolean);

      let thumbsHtml = "";
      itemsList.forEach(item => {
        thumbsHtml += `<img src="${item.image}" onerror="this.src='${item.fallback}'" class="polyvore-thumb" title="${item.name}">`;
      });

      card.innerHTML = `
        <div class="compatibility-badge">Polyvore: ${outfit.compatibilityScore}%</div>
        <h3 style="font-size: 1.05rem; margin-bottom: 4px; padding-right: 80px;">${outfit.name}</h3>
        <div style="font-size: 0.78rem; color: var(--primary); font-weight: 700; margin-bottom: 8px;">
          🏷️ ${outfit.occasionLabel} • Điểm A100: ${outfit.a100Scores.color}/100
        </div>
        <p style="font-size: 0.82rem; color: var(--text-sub); line-height: 1.4; margin-bottom: 10px;">
          ${outfit.description}
        </p>
        <div class="polyvore-items-preview">
          ${thumbsHtml}
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: auto;" data-tryon-set="${outfit.id}">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Mặc Thử Trọn Bộ Outfit Này
        </button>
      `;

      card.querySelector("[data-tryon-set]").addEventListener("click", () => {
        applyPolyvoreOutfitToStudio(outfit);
      });

      container.appendChild(card);
    });
  }

  function applyPolyvoreOutfitToStudio(outfit) {
    if (!outfit || !outfit.items) return;

    // Set selected main product to top or first item
    const mainProd = outfit.items.top || Object.values(outfit.items)[0];
    state.selectedProduct = mainProd;

    // Check all recommended items in outfit
    const outfitItemIds = Object.values(outfit.items).map(i => i && i.id).filter(Boolean);
    state.recommendations.forEach(rec => {
      rec.checked = outfitItemIds.includes(rec.id);
    });

    openStudioForProduct(mainProd);
    showToast(`✨ Đã áp dụng toàn bộ sản phẩm trong [${outfit.name}] vào phòng thử đồ!`);
  }

  function openStudioForProduct(product) {
    state.selectedProduct = product;
    initLeftProductPanel();
    initRightRecommendations();
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
  // 3. PAGE 2 STUDIO: LEFT COLUMN PRODUCT INFO & VITON-HD MODELS
  // ----------------------------------------------------
  function initLeftProductPanel() {
    const prodHero = document.getElementById("main-prod-hero");
    const prodName = document.getElementById("main-prod-name");
    const prodPrice = document.getElementById("main-prod-price");
    const prodMaterial = document.getElementById("main-prod-material");
    const prodColor = document.getElementById("main-prod-color");
    const prodStyle = document.getElementById("main-prod-style");
    const modelSelector = document.getElementById("model-picker-grid");
    const fileInput = document.getElementById("user-photo-input");

    const prod = state.selectedProduct;
    if (!prod) return;

    if (prodHero) {
      prodHero.src = prod.image;
      prodHero.onerror = () => { prodHero.src = prod.fallback; };
    }
    if (prodName) prodName.innerText = prod.name;
    if (prodPrice) prodPrice.innerText = prod.price;
    if (prodMaterial) prodMaterial.innerText = prod.material || "-";
    if (prodColor) prodColor.innerText = prod.color || "-";
    if (prodStyle) prodStyle.innerText = prod.style || "-";

    // Render VITON-HD Model Picker
    if (modelSelector) {
      modelSelector.innerHTML = "";
      const models = window.VITON_HD_MODELS || [];
      models.forEach(model => {
        const item = document.createElement("div");
        item.style.cssText = `
          border: 2px solid ${model.id === state.selectedModel.id ? '#0284C7' : '#E2E8F0'};
          border-radius: 8px; overflow: hidden; cursor: pointer; height: 75px; position: relative; background:#fff;
        `;
        item.innerHTML = `
          <img src="${model.image}" onerror="this.src='${model.fallback}'" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(255,255,255,0.88); font-size:0.65rem; font-weight:700; color:#0F172A; padding:2px; text-align:center;">
            ${model.name.split(' ')[0]}
          </div>
        `;

        item.addEventListener("click", () => {
          state.selectedModel = model;
          initLeftProductPanel();
          runCanvasIDMVTONPass();
          showToast(`Đã đổi mẫu VITON-HD thành [${model.name}]`);
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
              id: "custom_user_" + Date.now(),
              name: "Ảnh Cá Nhân Tải Lên",
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
  // 4. CENTER COLUMN: CENTRAL VIRTUAL TRY-ON CANVAS
  // ----------------------------------------------------
  function initCenterTryonCanvas() {
    const toggleOriginal = document.getElementById("toggle-view-original");
    const toggleTryon = document.getElementById("toggle-view-tryon");
    const downloadBtn = document.getElementById("download-tryon-hd-btn");
    const quickSaveBtn = document.getElementById("quick-save-current-outfit-btn");
    const exportPdfBtn = document.getElementById("export-pdf-report-btn");
    const studioFeedbackBtn = document.getElementById("open-studio-feedback-btn");

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

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = `AURA_IDM_VTON_TryOn_${Date.now()}.png`;
        link.href = state.activeTryonImage;
        link.click();
        showToast("Đã tải ảnh mặc thử HD thành công!");
      });
    }

    if (quickSaveBtn) {
      quickSaveBtn.addEventListener("click", () => {
        if (!window.outfitManager) return;
        const checkedItems = state.recommendations.filter(i => i.checked);
        const scores = calculateActiveA100();
        const saved = window.outfitManager.saveOutfit(
          `Outfit ${state.selectedProduct.name}`,
          state.selectedProduct,
          checkedItems,
          state.selectedModel,
          scores,
          state.activeTryonImage
        );
        updateSavedOutfitsBadge();
        showToast(`💾 Đã lưu outfit [${saved.name}] thành công!`);
      });
    }

    if (exportPdfBtn) {
      exportPdfBtn.addEventListener("click", () => {
        if (!window.outfitManager) return;
        const checkedItems = state.recommendations.filter(i => i.checked);
        const scores = calculateActiveA100();
        window.outfitManager.exportReport({
          name: state.selectedProduct.name,
          mainProduct: state.selectedProduct,
          items: checkedItems,
          a100Scores: scores,
          date: new Date().toLocaleDateString()
        });
      });
    }

    if (studioFeedbackBtn) {
      studioFeedbackBtn.addEventListener("click", () => {
        const modal = document.getElementById("feedback-modal");
        if (modal) modal.classList.add("show");
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
      if (viewLabel) viewLabel.innerHTML = `<span class="pulse-dot" style="background:#94A3B8;"></span> Ảnh Gốc VITON-HD`;
    } else {
      canvasImg.src = state.activeTryonImage;
      canvasImg.onerror = () => { canvasImg.src = state.activeTryonFallback; };
      if (viewLabel) viewLabel.innerHTML = `<span class="pulse-dot"></span> IDM-VTON Real-Time Render`;
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
    if (state.selectedProduct) {
      activeGarments[state.selectedProduct.category] = state.selectedProduct;
    }

    state.recommendations.forEach(rec => {
      if (rec.checked) {
        if (rec.category === "accessory" && rec.accessoryType) {
          activeGarments[rec.accessoryType] = rec;
        } else {
          activeGarments[rec.category] = rec;
        }
      }
    });

    let progress = 0;
    const interval = setInterval(async () => {
      progress += 25;
      if (progressFill) progressFill.style.width = `${progress}%`;

      if (progress === 25 && statusMsg) statusMsg.innerText = "Trích xuất DensePose alignment & VITON-HD parsing mask...";
      if (progress === 50 && statusMsg) statusMsg.innerText = `IDM-VTON đang bóc tách nền trắng & warping trang phục + phụ kiện...`;
      if (progress === 75 && statusMsg) statusMsg.innerText = "Tối ưu hóa nếp gấp vải, độ sáng & ma trận Polyvore...";

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
  // 5. RIGHT COLUMN: RECOMMENDATIONS & ACCESSORIES
  // ----------------------------------------------------
  function initRightRecommendations() {
    const container = document.getElementById("recommendations-list-container");
    if (!container) return;

    container.innerHTML = "";

    const categories = [
      { key: "bottom", title: "👖 Quần / Chân Váy Gợi Ý" },
      { key: "shoes", title: "👠 Giày / Footwear Tương Thích" },
      { key: "bag", title: "👜 Túi Xách Đi Kèm" },
      { key: "accessory", title: "✨ Phụ Kiện Thời Trang (Trang Sức, Kính, Đồng Hồ, Thắt Lưng)" }
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
          <span style="font-size:0.7rem; color:var(--primary); font-weight:600;">Polyvore AI</span>
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
            if (i.category === targetItem.category && i.id !== id && i.category !== 'accessory') {
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
  // 6. A100 AESTHETIC EVALUATION & DETAILED RATIONALE
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

    const centerQuickScore = document.getElementById("center-a100-quick-score");
    if (centerQuickScore) centerQuickScore.innerText = `${overall}`;

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

    // UPDATE RATIONALE EXPLAINER
    const explainerBox = document.getElementById("ai-explainer-text");
    if (explainerBox && state.selectedProduct) {
      const prod = state.selectedProduct;
      const checkedNames = checkedItems.map(i => i.name).join(", ") || "các món phụ kiện đã chọn";

      explainerBox.innerHTML = `
        <div style="font-weight: 700; color: var(--primary); margin-bottom: 12px; font-size: 0.92rem;">
          <i class="fa-solid fa-sparkles"></i> Phân Tích Lý Do Phối Đồ AI (Bộ chỉ số A100 - CVPR 2022):
        </div>

        <div class="rationale-cards-grid">
          <div class="rationale-card-item">
            <div class="rationale-card-title">🎨 1. Đồng Điệu Màu Sắc (${scores.color}/100)</div>
            <div class="rationale-card-desc">
              Màu <span style="color:var(--primary); font-weight:700;">${prod.color}</span> của ${prod.name} tạo tương phản sắc độ HSL 4.5:1 tinh tế cùng [${checkedNames}].
            </div>
          </div>

          <div class="rationale-card-item">
            <div class="rationale-card-title">🧶 2. Tương Thích Chất Liệu (${scores.material}/100)</div>
            <div class="rationale-card-desc">
              Sự hài hòa giữa <span style="color:var(--primary); font-weight:700;">${prod.material}</span> và bề mặt vải cao cấp giúp trang phục chỉn chu và quý phái.
            </div>
          </div>

          <div class="rationale-card-item">
            <div class="rationale-card-title">🥂 3. Dịp Sử Dụng Tối Ưu (${scores.occasion}/100)</div>
            <div class="rationale-card-desc">
              Tối ưu cho <strong>Công sở Executive, Event Dạ Tiệc, Tiệc Cưới</strong> hoặc các sự kiện thời trang đòi hỏi tính chỉn chu cao.
            </div>
          </div>
        </div>
      `;
    }
  }

  // ----------------------------------------------------
  // 7. AI CHATBOT INTEGRATION
  // ----------------------------------------------------
  function initChatbotIntegration() {
    const triggerBtn = document.getElementById("open-chatbot-btn");
    const closeBtn = document.getElementById("close-chatbot-btn");
    const drawer = document.getElementById("chatbot-drawer");
    const form = document.getElementById("chatbot-input-form");
    const input = document.getElementById("chatbot-input-text");
    const messagesWrap = document.getElementById("chatbot-messages-container");

    if (triggerBtn && drawer) {
      triggerBtn.addEventListener("click", () => drawer.classList.toggle("show"));
    }
    if (closeBtn && drawer) {
      closeBtn.addEventListener("click", () => drawer.classList.remove("show"));
    }

    // Render Initial Welcome Message
    renderChatbotMessages();

    if (form && input) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = input.value;
        if (!text.trim()) return;

        input.value = "";
        await window.fashionAIChatbot.sendMessage(text, {
          selectedProduct: state.selectedProduct,
          selectedModel: state.selectedModel
        });

        renderChatbotMessages();
      });
    }

    // Quick Action Chips
    const chips = document.querySelectorAll("[data-chat-chip]");
    chips.forEach(chip => {
      chip.addEventListener("click", async () => {
        const text = chip.getAttribute("data-chat-chip");
        await window.fashionAIChatbot.sendMessage(text, {
          selectedProduct: state.selectedProduct,
          selectedModel: state.selectedModel
        });
        renderChatbotMessages();
      });
    });
  }

  function renderChatbotMessages() {
    const messagesWrap = document.getElementById("chatbot-messages-container");
    if (!messagesWrap || !window.fashionAIChatbot) return;

    messagesWrap.innerHTML = "";
    const msgs = window.fashionAIChatbot.messages;

    msgs.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${msg.sender}`;

      // Convert simple markdown bold/bullet to HTML
      let htmlText = msg.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      let actionsHtml = "";
      if (msg.actions && msg.actions.length > 0) {
        msg.actions.forEach(act => {
          actionsHtml += `<button class="chat-action-btn" data-act-type="${act.actionType}" data-act-id="${act.outfitId || ''}">${act.label}</button>`;
        });
      }

      bubble.innerHTML = `
        <div>${htmlText}</div>
        ${actionsHtml ? `<div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">${actionsHtml}</div>` : ''}
        <div style="font-size:0.65rem; color:#94A3B8; text-align:right; margin-top:4px;">${msg.timestamp}</div>
      `;

      // Attach button clicks
      const btns = bubble.querySelectorAll(".chat-action-btn");
      btns.forEach(b => {
        b.addEventListener("click", () => {
          const type = b.getAttribute("data-act-type");
          const id = b.getAttribute("data-act-id");

          if (type === "tryon_outfit" && id) {
            const outfit = state.polyvoreOutfits.find(o => o.id === id);
            if (outfit) applyPolyvoreOutfitToStudio(outfit);
          } else if (type === "view_accessories") {
            switchView("studio");
            showToast("Đã chuyển sang bảng gợi ý phụ kiện!");
          } else if (type === "trigger_upload") {
            switchView("studio");
            document.getElementById('user-photo-input').click();
          } else if (type === "open_context_filter") {
            switchView("catalog");
            window.scrollTo({ top: 200, behavior: "smooth" });
          }
        });
      });

      messagesWrap.appendChild(bubble);
    });

    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  // ----------------------------------------------------
  // 8. SAVED OUTFITS MODAL
  // ----------------------------------------------------
  function initSavedOutfitsModal() {
    const openBtn = document.getElementById("open-saved-outfits-btn");
    const closeBtn = document.getElementById("close-saved-outfits-modal-btn");
    const modal = document.getElementById("saved-outfits-modal");

    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        renderSavedOutfitsList();
        modal.classList.add("show");
      });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    }
  }

  function renderSavedOutfitsList() {
    const container = document.getElementById("saved-outfits-list-container");
    if (!container || !window.outfitManager) return;

    container.innerHTML = "";
    const list = window.outfitManager.getSavedOutfits();

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-bookmark" style="font-size: 2.5rem; margin-bottom: 12px; color: #CBD5E1;"></i>
          <p>Bạn chưa lưu outfit nào. Hãy bấm <strong>"Lưu Outfit Này"</strong> trong phòng thử đồ!</p>
        </div>
      `;
      return;
    }

    list.forEach(saved => {
      const card = document.createElement("div");
      card.className = "saved-outfit-card";
      card.innerHTML = `
        <img src="${saved.tryonImage}" onerror="this.src='${saved.mainProduct.fallback}'" class="saved-outfit-thumb" alt="${saved.name}">
        <div style="flex:1;">
          <h4 style="font-size:0.95rem; font-weight:700;">${saved.name}</h4>
          <div style="font-size:0.78rem; color:var(--text-muted);">Lưu ngày: ${saved.date} • A100 Score: ${saved.a100Scores.overall || 96.2}/100</div>
          <div style="font-size:0.75rem; color:var(--primary); font-weight:600; margin-top:2px;">
            Sản phẩm: ${saved.mainProduct.name}
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline" style="font-size:0.78rem; padding:6px 12px;" data-load-saved="${saved.id}">
            <i class="fa-solid fa-rotate-left"></i> Thử Lại
          </button>
          <button class="btn btn-gold" style="font-size:0.78rem; padding:6px 12px;" data-pdf-saved="${saved.id}">
            <i class="fa-solid fa-file-pdf"></i> Báo Cáo
          </button>
          <button class="btn btn-outline" style="font-size:0.78rem; padding:6px 12px; color:var(--accent-rose);" data-delete-saved="${saved.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

      card.querySelector("[data-load-saved]").addEventListener("click", () => {
        state.selectedProduct = saved.mainProduct;
        openStudioForProduct(saved.mainProduct);
        document.getElementById("saved-outfits-modal").classList.remove("show");
      });

      card.querySelector("[data-pdf-saved]").addEventListener("click", () => {
        window.outfitManager.exportReport(saved);
      });

      card.querySelector("[data-delete-saved]").addEventListener("click", () => {
        window.outfitManager.deleteSavedOutfit(saved.id);
        renderSavedOutfitsList();
        updateSavedOutfitsBadge();
        showToast("Đã xóa outfit khỏi danh sách lưu.");
      });

      container.appendChild(card);
    });
  }

  // ----------------------------------------------------
  // 9. FEEDBACK & RATING MODAL
  // ----------------------------------------------------
  function initFeedbackModal() {
    const openBtn = document.getElementById("open-feedback-btn");
    const closeBtn = document.getElementById("close-feedback-modal-btn");
    const modal = document.getElementById("feedback-modal");
    const form = document.getElementById("feedback-form");
    const stars = document.querySelectorAll("#star-rating-selector .star-icon");
    const scoreText = document.getElementById("star-score-text");

    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        renderPastFeedbacks();
        modal.classList.add("show");
      });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    }

    // Star Selector Interactivity
    stars.forEach(star => {
      star.addEventListener("click", () => {
        const rating = parseInt(star.getAttribute("data-star"), 10);
        state.currentFeedbackRating = rating;

        stars.forEach((s, idx) => {
          if (idx < rating) s.classList.add("active");
          else s.classList.remove("active");
        });

        if (scoreText) {
          const labels = ["Rất tệ", "Kém", "Bình thường", "Tốt", "Tuyệt vời"];
          scoreText.innerText = `${rating}.0 / 5.0 (${labels[rating - 1]})`;
        }
      });
    });

    // Form Submit
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const comment = document.getElementById("feedback-comment-input").value.trim();
        if (!comment) {
          alert("Vui lòng nhập nhận xét chi tiết.");
          return;
        }

        if (window.outfitManager) {
          await window.outfitManager.submitFeedback(
            state.currentFeedbackRating,
            comment,
            state.selectedProduct
          );
        }

        document.getElementById("feedback-comment-input").value = "";
        renderPastFeedbacks();
        showToast("⭐ Cảm ơn bạn đã gửi đánh giá cho hệ thống AURA FIT AI!");
        if (modal) modal.classList.remove("show");
      });
    }
  }

  function renderPastFeedbacks() {
    const container = document.getElementById("past-feedbacks-list");
    if (!container || !window.outfitManager) return;

    container.innerHTML = "";
    const list = window.outfitManager.getFeedbacks();

    list.slice(0, 3).forEach(fb => {
      const item = document.createElement("div");
      item.style.cssText = "background:var(--bg-sub); padding:10px; border-radius:8px;";
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span style="color:var(--accent-gold);">${'★'.repeat(fb.rating)} (${fb.rating}/5)</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">${fb.date}</span>
        </div>
        <div style="margin-top:4px;">"${fb.comment}"</div>
      `;
      container.appendChild(item);
    });
  }

  // ----------------------------------------------------
  // 10. MODAL LISTENERS
  // ----------------------------------------------------
  function initModalListeners() {
    const openArchBtn = document.getElementById("open-arch-modal-btn");
    const closeArchBtn = document.getElementById("close-arch-modal-btn");
    const archModal = document.getElementById("arch-modal");

    if (openArchBtn && archModal) openArchBtn.addEventListener("click", () => archModal.classList.add("show"));
    if (closeArchBtn && archModal) closeArchBtn.addEventListener("click", () => archModal.classList.remove("show"));

    // Close on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("show");
      });
    });
  }

  // Toast Utility
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
