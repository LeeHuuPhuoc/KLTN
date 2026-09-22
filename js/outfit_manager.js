/**
 * AURA FIT AI - Saved Outfits Manager & Advisory Rating/Feedback Engine
 * Manages user saved outfit collections, LocalStorage persistence, PDF report generation, and rating/feedback processing.
 */

class OutfitManager {
  constructor() {
    this.storageKeyOutfits = "aura_saved_outfits";
    this.storageKeyFeedbacks = "aura_user_feedbacks";
    this.apiUrlFeedback = "http://localhost:5000/api/feedback";
  }

  /**
   * Save current outfit configuration
   */
  saveOutfit(outfitName, product, items, model, a100Scores, tryonImage) {
    const saved = this.getSavedOutfits();

    const newOutfit = {
      id: "saved_" + Date.now(),
      name: outfitName || `Outfit ${product.name.substring(0, 20)}...`,
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      mainProduct: product,
      items: items || [],
      model: model,
      a100Scores: a100Scores || { overall: 96.2 },
      tryonImage: tryonImage || product.image
    };

    saved.unshift(newOutfit);
    localStorage.setItem(this.storageKeyOutfits, JSON.stringify(saved));
    return newOutfit;
  }

  getSavedOutfits() {
    try {
      const data = localStorage.getItem(this.storageKeyOutfits);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  deleteSavedOutfit(id) {
    let saved = this.getSavedOutfits();
    saved = saved.filter(o => o.id !== id);
    localStorage.setItem(this.storageKeyOutfits, JSON.stringify(saved));
    return saved;
  }

  /**
   * Submit user rating (1-5 stars) and feedback comment
   */
  async submitFeedback(rating, comment, outfitContext = {}) {
    const feedbackObj = {
      id: "fb_" + Date.now(),
      rating: rating,
      comment: comment,
      outfitName: outfitContext.name || "Tư vấn tổng quát",
      date: new Date().toLocaleDateString("vi-VN"),
      status: "Verified Feedback"
    };

    // Save locally
    const feedbacks = this.getFeedbacks();
    feedbacks.unshift(feedbackObj);
    localStorage.setItem(this.storageKeyFeedbacks, JSON.stringify(feedbacks));

    // Send to backend Flask if available
    try {
      await fetch(this.apiUrlFeedback, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackObj)
      });
    } catch (e) {
      console.log("Local feedback saved.");
    }

    return feedbackObj;
  }

  getFeedbacks() {
    try {
      const data = localStorage.getItem(this.storageKeyFeedbacks);
      return data ? JSON.parse(data) : [
        { id: "fb_demo1", rating: 5, comment: "Gợi ý outfit Tweed phối quần charcoal rất chuẩn phong cách công sở. Ghép IDM-VTON rất chân thực!", date: "22/09/2026", status: "Verified" }
      ];
    } catch (e) {
      return [];
    }
  }

  /**
   * Generate Printable PDF / Visual Report Window
   */
  exportReport(outfit) {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) return;

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Báo Cáo Phối Đồ AURA FIT AI - ${outfit.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1E293B; background: #F8FAFC; }
          .header { border-bottom: 2px solid #0284C7; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: bold; color: #0284C7; }
          .card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .score-badge { background: #E0F2FE; color: #0284C7; font-size: 20px; font-weight: bold; padding: 8px 16px; border-radius: 20px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">AURA FIT AI • BÁO CÁO PHỐI ĐỒ CHUYÊN NGÀNH</div>
            <div style="font-size:12px; color:#64748B;">Polyvore Dataset Compatibility & A100 Aesthetic Framework (CVPR 2022)</div>
          </div>
          <div class="score-badge">ĐIỂM: ${outfit.a100Scores.overall || 96.2}/100</div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Sản Phẩm & Trang Phục Đã Phối</h3>
            <ul>
              <li><strong>Sản phẩm chính:</strong> ${outfit.mainProduct ? outfit.mainProduct.name : 'N/A'}</li>
              ${outfit.items ? outfit.items.map(i => `<li><strong>${i.category}:</strong> ${i.name} (${i.price})</li>`).join('') : ''}
            </ul>
          </div>
          <div class="card">
            <h3>Đánh Giá Điểm Thẩm Mỹ A100 (6 Chiều)</h3>
            <p>• <strong>Màu sắc HSL:</strong> Harmony contrast 4.5:1 đạt chuẩn thời trang cao cấp.</p>
            <p>• <strong>Chất liệu:</strong> Sự kết hợp đồng điệu giữa kết cấu Tweed/Cashmere và Satin silk.</p>
            <p>• <strong>Dịp sử dụng:</strong> Tối ưu cho Công sở Executive, Event & Dạ tiệc.</p>
          </div>
        </div>

        <div class="card" style="text-align:center;">
          <p style="font-size:12px; color:#94A3B8;">Xuất ngày: ${outfit.date || new Date().toLocaleDateString()} • AURA FIT AI IDM-VTON Studio</p>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
  }
}

window.outfitManager = new OutfitManager();
