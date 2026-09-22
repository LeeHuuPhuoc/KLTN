/**
 * AURA FIT AI - Interactive LLM Fashion Advisory Chatbot Engine
 * Connects conversational consultation with real-time visual Studio visualization & IDM-VTON try-on.
 */

class FashionAIChatbot {
  constructor() {
    this.messages = [
      {
        sender: "bot",
        text: "Xin chào! Tôi là **AURA AI Advisor** 🤖✨ - Chuyên gia tư vấn thời trang cá nhân hóa dựa trên **Polyvore Dataset** & bộ chỉ số thẩm mỹ **A100 (CVPR 2022)**.\n\nHãy cho tôi biết **Dịp sử dụng** (Công sở, Dạ tiệc, Tiệc cưới, Đi chơi...), **Phong cách** hoặc **Chất liệu** bạn mong muốn, tôi sẽ tư vấn và hỗ trợ bạn mặc thử ngay nhé!",
        timestamp: this.getCurrentTime()
      }
    ];
    this.apiUrl = "http://localhost:5000/api/chatbot";
    this.onActionCallback = null;
  }

  setActionCallback(callback) {
    this.onActionCallback = callback;
  }

  getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  /**
   * Process user input message and generate fashion advisory response
   * @param {string} userText 
   * @param {Object} currentContext - Current studio state (selected product, model, etc.)
   */
  async sendMessage(userText, currentContext = {}) {
    if (!userText || !userText.trim()) return;

    // Add user message
    this.messages.push({
      sender: "user",
      text: userText.trim(),
      timestamp: this.getCurrentTime()
    });

    // Generate Bot response
    let responseObj = null;

    // Try API if available
    try {
      const apiResp = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          context: currentContext,
          messages_history: this.messages
        })
      });

      if (apiResp.ok) {
        responseObj = await apiResp.json();
      }
    } catch (e) {
      // Backend offline, fallback to client fashion intelligence engine
    }

    if (!responseObj) {
      responseObj = this.generateLocalLLMResponse(userText.trim(), currentContext);
    }

    this.messages.push({
      sender: "bot",
      text: responseObj.text,
      suggestedOutfit: responseObj.suggestedOutfit,
      actions: responseObj.actions || [],
      timestamp: this.getCurrentTime()
    });

    return this.messages;
  }

  /**
   * Local Fashion Intelligence & Polyvore Compatibility Engine
   */
  generateLocalLLMResponse(text, currentContext) {
    const lower = text.toLowerCase();
    const outfits = window.POLYVORE_RECOMMENDED_OUTFITS || [];
    const products = window.STORE_PRODUCTS || [];

    // 1. Check Occasion Matches
    if (lower.includes("công sở") || lower.includes("đi làm") || lower.includes("hội thảo") || lower.includes("office")) {
      const outfit = outfits.find(o => o.occasion === "office") || outfits[0];
      return {
        text: `🏛️ **Tư Vấn Outfit Công Sở / Modern Executive (Độ tương thích Polyvore: ${outfit.compatibilityScore}%)**:\n\n` +
              `• **Sản phẩm chính:** ${outfit.items.top.name} kết hợp cùng ${outfit.items.bottom.name}.\n` +
              `• **Điểm nổi bật:** Phối màu HSL chuẩn 4.5:1 giữa tông Beige sang trọng và Xám Than Charcoal giúp tôn dáng, chuyên nghiệp.\n` +
              `• **Phụ kiện đi kèm:** ${outfit.items.accessory.name} & ${outfit.items.shoes.name}.\n\n` +
              `Bạn có muốn thử outfit này trên mẫu **VITON-HD** ngay không?`,
        suggestedOutfit: outfit,
        actions: [
          { label: "✨ Mặc Thử Outfit Này Ngay", actionType: "tryon_outfit", outfitId: outfit.id },
          { label: "👜 Gợi Ý Phụ Kiện Chi Tiết", actionType: "view_accessories" }
        ]
      };
    }

    if (lower.includes("dạ tiệc") || lower.includes("sự kiện") || lower.includes("event") || lower.includes("gala")) {
      const outfit = outfits.find(o => o.occasion === "gala") || outfits[1];
      return {
        text: `🥂 **Tư Vấn Outfit Dạ Tiệc Sang Trọng (Độ tương thích Polyvore: ${outfit.compatibilityScore}%)**:\n\n` +
              `• **Sản phẩm chọn lọc:** ${outfit.items.top.name} đi cùng ${outfit.items.bottom.name}.\n` +
              `• **Lý do phối đồ AI (A100 Framework):** Bề mặt Lụa Tơ Tằm Mulberry mềm mại kết hợp Satin Pleated Vàng Ánh Kim mang lại hiệu ứng lấp lánh nhẹ nhàng dưới ánh đèn đêm tiệc.\n` +
              `• **Trang sức kiệt tác:** ${outfit.items.accessory.name} tôn vinh phần cổ nữ tính.\n\n` +
              `Hãy chọn **Mặc thử** để quan sát thực tế kết quả IDM-VTON!`,
        suggestedOutfit: outfit,
        actions: [
          { label: "✨ Mặc Thử Outfit Dạ Tiệc", actionType: "tryon_outfit", outfitId: outfit.id },
          { label: "💎 Xem Trang Sức Ngọc Trai", actionType: "view_jewelry" }
        ]
      };
    }

    if (lower.includes("cưới") || lower.includes("tiệc cưới") || lower.includes("wedding")) {
      const outfit = outfits.find(o => o.occasion === "wedding") || outfits[2];
      return {
        text: `💍 **Tư Vấn Trang Phục Dự Tiệc Cưới (Độ tương thích Polyvore: ${outfit.compatibilityScore}%)**:\n\n` +
              `• **Trang phục đề xuất:** ${outfit.items.top.name} phối cùng ${outfit.items.bottom.name}.\n` +
              `• **Sự hòa hợp:** Phong cách French Chic nữ tính, chỉn chu nhưng không lấn át chủ nhân buổi tiệc.\n` +
              `• **Mức độ hài hòa HSL:** Điểm A100 Màu sắc đạt **97/100**.\n\n` +
              `Bạn có muốn IDM-VTON hỗ trợ ghép trang phục này lên hình của bạn không?`,
        suggestedOutfit: outfit,
        actions: [
          { label: "✨ Thử Trang Phục Tiệc Cưới", actionType: "tryon_outfit", outfitId: outfit.id }
        ]
      };
    }

    if (lower.includes("phụ kiện") || lower.includes("kính") || lower.includes("dây chuyền") || lower.includes("túi")) {
      return {
        text: `✨ **Gợi Ý Phụ Kiện Đạt Điểm Polyvore Compatibility Cao Nhất**:\n\n` +
              `1. 💎 **Dây Chuyền Vàng 18K Mặt Ngọc Trai Akoya**: Tăng **+12% điểm quý phái** cho áo Blazer/Sơ mi lụa.\n` +
              `2. 🕶️ **Kính Mát Cat-Eye Polarized**: Phù hợp dạo phố, chụp ảnh OOTD sang chảnh.\n` +
              `3. ⌚ **Đồng Hồ Nữ Classic Minimalist**: Phụ kiện không thể thiếu cho quý cô công sở.\n\n` +
              `Tích chọn các ô phụ kiện trong phòng thử đồ để canvas tự động thêm phụ kiện lên người bạn!`,
        actions: [
          { label: "👜 Mở Danh Mục Phụ Kiện", actionType: "view_accessories" }
        ]
      };
    }

    if (lower.includes("idm-vton") || lower.includes("thử đồ") || lower.includes("ảo") || lower.includes("ảnh")) {
      return {
        text: `👗 **Hướng Dẫn Chức Năng Thử Đồ Ảo IDM-VTON (Diffusion Model HD)**:\n\n` +
              `• Bạn có thể chọn các mẫu chuẩn trong tập dữ liệu **VITON-HD Benchmark** hoặc **Tải ảnh cá nhân toàn thân** của bạn lên.\n` +
              `• Hệ thống AI sẽ tự động chạy DensePose Alignment & Human Parsing để ghép quần áo, túi xách và phụ kiện theo đúng phom dáng.\n\n` +
              `Hãy chọn bất kỳ sản phẩm nào để bắt đầu thử đồ!`,
        actions: [
          { label: "📸 Tải Ảnh Cá Nhân Mặc Thử", actionType: "trigger_upload" }
        ]
      };
    }

    // Default Advisory Response
    const defaultOutfit = outfits[0];
    return {
      text: `🤖 **AURA Fashion Advisor Phân Tích Requirements**:\n\n` +
            `Dựa trên yêu cầu "*${text}*", tôi gợi ý bộ outfit **${defaultOutfit.name}** đạt điểm tương thích Polyvore **${defaultOutfit.compatibilityScore}%**.\n\n` +
            `• **Top:** ${defaultOutfit.items.top.name}\n` +
            `• **Bottom:** ${defaultOutfit.items.bottom.name}\n` +
            `• **Phụ kiện:** ${defaultOutfit.items.accessory.name}\n\n` +
            `Bạn có thể bấm **Mặc thử ngay** để quan sát mô phỏng IDM-VTON thời gian thực!`,
      suggestedOutfit: defaultOutfit,
      actions: [
        { label: "✨ Mặc Thử Ngay Tra Cứu AI", actionType: "tryon_outfit", outfitId: defaultOutfit.id },
        { label: "💼 Lọc Theo Dịp Sử Dụng", actionType: "open_context_filter" }
      ]
    };
  }
}

window.fashionAIChatbot = new FashionAIChatbot();
