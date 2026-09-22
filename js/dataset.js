/**
 * Dataset for AURA FIT AI - E-Commerce Store Catalog, Polyvore Outfit Compatibility & VITON-HD Try-On Studio
 * Theme: Light Mode Ocean Blue (#0284C7)
 */

const LOCAL_IMAGES = {
  userAvatar: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/user_avatar_1789745159495.png",
  anchorTop: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/anchor_top_1789745180809.png",
  bottomPant: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/bottom_pant_1789745203155.png",
  shoesPair: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/shoes_pair_1789745231318.png",
  handbag: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/handbag_1789745254046.png",
  tryonRendered: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/tryon_rendered_1789745295785.png",
  altTop: "file:///C:/Users/admin/.gemini/antigravity-ide/brain/a1a7e7e1-21c6-4ed9-9831-0534d79856c7/alt_top_dress_1789745320299.png"
};

const WEB_FALLBACKS = {
  userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  anchorTop: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
  bottomPant: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
  shoesPair: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
  handbag: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  tryonRendered: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  altTop: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80",
  skirtTryon: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
  
  // Accessories fallbacks
  sunglasses: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  earrings: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
  watch: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  belt: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80",
  scarf: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80",
  
  // VITON-HD models
  vitonModelFemale1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  vitonModelFemale2: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  vitonModelMale1: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
};

// Polyvore Dataset Taxonomy & Advisory Context Meta
const ADVISORY_METADATA = {
  occasions: [
    { id: "office", label: "💼 Công Sở / Executive", icon: "fa-briefcase" },
    { id: "gala", label: "🥂 Dạ Tiệc / Event Sang Trọng", icon: "fa-champagne-glasses" },
    { id: "wedding", label: "💍 Tiệc Cưới / Celebration", icon: "fa-ring" },
    { id: "casual", label: "☕ Dạo Phố / Cà Phê", icon: "fa-mug-hot" },
    { id: "travel", label: "✈️ Du Lịch / Resort", icon: "fa-plane" }
  ],
  seasons: [
    { id: "spring_summer", label: "☀️ Xuân / Hè", icon: "fa-sun" },
    { id: "autumn_winter", label: "❄️ Thu / Đông", icon: "fa-snowflake" }
  ],
  styles: [
    { id: "smart_executive", label: "Modern Executive", desc: "Lịch thiệp, chuyên nghiệp & hiện đại" },
    { id: "french_chic", label: "French Chic", desc: "Tinh tế, nữ tính & cổ điển Pháp" },
    { id: "minimalist", label: "Minimalist Luxe", desc: "Tối giản, màu sắc trung tính sang trọng" },
    { id: "streetwear", label: "Contemporary Chic", desc: "Phá cách, trẻ trung & năng động" }
  ]
};

// VITON-HD Benchmark Model Dataset (For Virtual Try-On evaluation)
const VITON_HD_MODELS = [
  {
    id: "viton_hd_female_01",
    dataset: "VITON-HD Benchmark",
    name: "Phương Linh (Model Female #01)",
    gender: "female",
    image: LOCAL_IMAGES.userAvatar,
    fallback: WEB_FALLBACKS.vitonModelFemale1,
    height: "168cm",
    weight: "50kg",
    pose: "Frontal Stand (Full Body)",
    densepose: "Aligned (1024x1536)"
  },
  {
    id: "viton_hd_female_02",
    dataset: "VITON-HD Benchmark",
    name: "Minh Anh (Model Female #02)",
    gender: "female",
    image: WEB_FALLBACKS.vitonModelFemale2,
    fallback: WEB_FALLBACKS.vitonModelFemale2,
    height: "172cm",
    weight: "53kg",
    pose: "Frontal Neutral (Full Body)",
    densepose: "Aligned (1024x1536)"
  },
  {
    id: "viton_hd_male_01",
    dataset: "VITON-HD Benchmark",
    name: "Hoàng Nam (Model Male #01)",
    gender: "male",
    image: WEB_FALLBACKS.vitonModelMale1,
    fallback: WEB_FALLBACKS.vitonModelMale1,
    height: "180cm",
    weight: "72kg",
    pose: "Frontal Stand (Full Body)",
    densepose: "Aligned (1024x1536)"
  }
];

// Full E-Commerce Store Products Catalog (Polyvore Dataset Standardized)
const STORE_PRODUCTS = [
  // TOPS
  {
    id: "prod_01",
    category: "top",
    name: "Áo Blazer Tweed Tailored Luxury Beige",
    price: "1,450,000đ",
    oldPrice: "1,850,000đ",
    brand: "AURA Atelier Paris",
    image: LOCAL_IMAGES.anchorTop,
    fallback: WEB_FALLBACKS.anchorTop,
    color: "Beige / Kem",
    material: "Vải Tweed dệt thủ công 3D",
    style: "smart_executive",
    occasion: ["office", "gala"],
    season: "autumn_winter",
    rating: 4.9,
    isHot: true,
    polyvoreScore: 98.4
  },
  {
    id: "prod_02",
    category: "top",
    name: "Áo Sơ Mi Lụa Mulberry Cream Drape",
    price: "890,000đ",
    oldPrice: "1,150,000đ",
    brand: "Maison Silk",
    image: LOCAL_IMAGES.altTop,
    fallback: WEB_FALLBACKS.altTop,
    color: "Trắng Kem",
    material: "100% Lụa Tơ Tằm Mulberry",
    style: "french_chic",
    occasion: ["office", "casual", "wedding"],
    season: "spring_summer",
    rating: 4.8,
    isHot: false,
    polyvoreScore: 96.5
  },
  {
    id: "prod_07",
    category: "top",
    name: "Áo Vest Gile Dạ Cashmere Off-White",
    price: "1,120,000đ",
    oldPrice: "1,390,000đ",
    brand: "AURA Atelier Paris",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    color: "Off-White Kem Trắng",
    material: "Cashmere Premium",
    style: "minimalist",
    occasion: ["office", "gala"],
    season: "autumn_winter",
    rating: 4.85,
    isHot: true,
    polyvoreScore: 97.1
  },

  // BOTTOMS
  {
    id: "prod_03",
    category: "bottom",
    name: "Quần Tailored Charcoal Pleated Trousers",
    price: "890,000đ",
    oldPrice: "1,100,000đ",
    brand: "Minimalist Studio",
    image: LOCAL_IMAGES.bottomPant,
    fallback: WEB_FALLBACKS.bottomPant,
    color: "Xám Than Charcoal",
    material: "Tencel Wool-Blend",
    style: "smart_executive",
    occasion: ["office", "gala"],
    season: "autumn_winter",
    rating: 4.9,
    isHot: true,
    polyvoreScore: 98.0
  },
  {
    id: "prod_04",
    category: "bottom",
    name: "Chân Váy Satin Pleated Champagne Gold",
    price: "750,000đ",
    oldPrice: "950,000đ",
    brand: "Lumière Chic",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
    color: "Champagne Vàng Ánh Kim",
    material: "Satin Pleated Silk",
    style: "french_chic",
    occasion: ["gala", "wedding"],
    season: "spring_summer",
    rating: 4.7,
    isHot: false,
    polyvoreScore: 95.8
  },
  {
    id: "prod_08",
    category: "bottom",
    name: "Quần Jeans Straight-Leg Indigo Crisp",
    price: "690,000đ",
    oldPrice: "850,000đ",
    brand: "Denim Craft",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    color: "Xanh Indigo",
    material: "100% Cotton Denim Organic",
    style: "streetwear",
    occasion: ["casual", "travel"],
    season: "spring_summer",
    rating: 4.75,
    isHot: false,
    polyvoreScore: 94.2
  },

  // SHOES
  {
    id: "prod_05",
    category: "shoes",
    name: "Giày Loafer Da Thật Black Calfskin Nappa",
    price: "1,250,000đ",
    oldPrice: "1,550,000đ",
    brand: "Craftsman Italy",
    image: LOCAL_IMAGES.shoesPair,
    fallback: WEB_FALLBACKS.shoesPair,
    color: "Đen Tuyền Classic",
    material: "Da Bò Ý Nappa",
    style: "smart_executive",
    occasion: ["office", "gala"],
    season: "autumn_winter",
    rating: 4.9,
    isHot: true,
    polyvoreScore: 97.9
  },
  {
    id: "prod_09",
    category: "shoes",
    name: "Giày Cao Gót Satin Nude Pointed Heels",
    price: "1,150,000đ",
    oldPrice: "1,400,000đ",
    brand: "Lumière Chic",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    color: "Nude Hông Kem",
    material: "Da Bóng Glossy Satin",
    style: "french_chic",
    occasion: ["gala", "wedding"],
    season: "spring_summer",
    rating: 4.88,
    isHot: true,
    polyvoreScore: 96.9
  },

  // BAGS
  {
    id: "prod_06",
    category: "bag",
    name: "Túi Xách Da Thật Crossbody Black Leather",
    price: "1,680,000đ",
    oldPrice: "2,100,000đ",
    brand: "Atelier Noire",
    image: LOCAL_IMAGES.handbag,
    fallback: WEB_FALLBACKS.handbag,
    color: "Đen Bạc",
    material: "Da Bò Nguyên Tấm",
    style: "minimalist",
    occasion: ["office", "gala", "casual"],
    season: "autumn_winter",
    rating: 4.95,
    isHot: true,
    polyvoreScore: 98.7
  },

  // ACCESSORIES
  {
    id: "prod_10",
    category: "accessory",
    accessoryType: "glasses",
    name: "Kính Mát Cat-Eye Polarized Acetate Black",
    price: "520,000đ",
    oldPrice: "700,000đ",
    brand: "Optique Atelier",
    image: WEB_FALLBACKS.sunglasses,
    fallback: WEB_FALLBACKS.sunglasses,
    color: "Đen Tuyền / Kim Loại Vàng",
    material: "Acetate Cao Cấp & Tròng Polarized",
    style: "french_chic",
    occasion: ["casual", "travel", "gala"],
    season: "spring_summer",
    rating: 4.8,
    isHot: true,
    polyvoreScore: 96.0
  },
  {
    id: "prod_11",
    category: "accessory",
    accessoryType: "necklace",
    name: "Dây Chuyền Vàng 18K Mặt Ngọc Trai Akoya",
    price: "1,850,000đ",
    oldPrice: "2,300,000đ",
    brand: "Bijoux de Luxe",
    image: WEB_FALLBACKS.necklace,
    fallback: WEB_FALLBACKS.necklace,
    color: "Vàng Ánh Kim / Ngọc Trai Trắng",
    material: "Vàng 18K & Ngọc Trai Akoya",
    style: "french_chic",
    occasion: ["gala", "wedding", "office"],
    season: "spring_summer",
    rating: 4.95,
    isHot: true,
    polyvoreScore: 98.9
  },
  {
    id: "prod_12",
    category: "accessory",
    accessoryType: "earrings",
    name: "Khuyên Tai Ngọc Trai Giọt Nước Vintage Gold",
    price: "450,000đ",
    oldPrice: "600,000đ",
    brand: "Bijoux de Luxe",
    image: WEB_FALLBACKS.earrings,
    fallback: WEB_FALLBACKS.earrings,
    color: "Vàng Cổ Điển / Trắng Tự Nhiên",
    material: "Mạ Vàng 14K & Ngọc Trai",
    style: "french_chic",
    occasion: ["gala", "wedding"],
    season: "spring_summer",
    rating: 4.82,
    isHot: false,
    polyvoreScore: 95.4
  },
  {
    id: "prod_13",
    category: "accessory",
    accessoryType: "watch",
    name: "Đồng Hồ Nữ Dây Da Classic Minimalist Gold",
    price: "2,150,000đ",
    oldPrice: "2,800,000đ",
    brand: "Horloge Geneva",
    image: WEB_FALLBACKS.watch,
    fallback: WEB_FALLBACKS.watch,
    color: "Dây Da Đen / Vỏ Vàng Gold",
    material: "Da Thật & Kính Sapphire",
    style: "smart_executive",
    occasion: ["office", "gala"],
    season: "autumn_winter",
    rating: 4.9,
    isHot: true,
    polyvoreScore: 97.8
  },
  {
    id: "prod_14",
    category: "accessory",
    accessoryType: "belt",
    name: "Thắt Lưng Da Nappa Mặt Khóa Kim Loại Vàng",
    price: "480,000đ",
    oldPrice: "650,000đ",
    brand: "Craftsman Italy",
    image: WEB_FALLBACKS.belt,
    fallback: WEB_FALLBACKS.belt,
    color: "Đen Tuyền / Khóa Vàng",
    material: "Da Bò Nappa",
    style: "smart_executive",
    occasion: ["office", "casual"],
    season: "autumn_winter",
    rating: 4.75,
    isHot: false,
    polyvoreScore: 94.8
  },
  {
    id: "prod_15",
    category: "accessory",
    accessoryType: "scarf",
    name: "Khăn Lụa Tơ Tằm Họa Tiết Monogram Paris",
    price: "620,000đ",
    oldPrice: "800,000đ",
    brand: "Maison Silk",
    image: WEB_FALLBACKS.scarf,
    fallback: WEB_FALLBACKS.scarf,
    color: "Xanh Navy / Be",
    material: "100% Lụa Tơ Tằm Twill",
    style: "french_chic",
    occasion: ["office", "travel", "gala"],
    season: "autumn_winter",
    rating: 4.88,
    isHot: true,
    polyvoreScore: 96.7
  }
];

// Complete Pre-built Polyvore Outfit Recommendations (Polyvore Compatibility Graph)
const POLYVORE_RECOMMENDED_OUTFITS = [
  {
    id: "polyvore_set_01",
    name: "Executive Tweed & Charcoal Elegance",
    occasion: "office",
    occasionLabel: "Công Sở Executive",
    season: "autumn_winter",
    style: "smart_executive",
    compatibilityScore: 98.4,
    description: "Phối hợp giữa Blazer Tweed Luxury Beige và Quần Tailored Pleated Charcoal tạo vẻ thanh lịch chuẩn phong thái lãnh đạo nữ.",
    a100Scores: { color: 98, style: 98, occasion: 99, season: 96, material: 97, balance: 99 },
    items: {
      top: STORE_PRODUCTS.find(p => p.id === "prod_01"),
      bottom: STORE_PRODUCTS.find(p => p.id === "prod_03"),
      shoes: STORE_PRODUCTS.find(p => p.id === "prod_05"),
      bag: STORE_PRODUCTS.find(p => p.id === "prod_06"),
      accessory: STORE_PRODUCTS.find(p => p.id === "prod_13") // Đồng hồ
    }
  },
  {
    id: "polyvore_set_02",
    name: "Mulberry Silk & Satin Gold Gala Glam",
    occasion: "gala",
    occasionLabel: "Dạ Tiệc & Event Sang Trọng",
    season: "spring_summer",
    style: "french_chic",
    compatibilityScore: 97.6,
    description: "Bộ đôi Áo Sơ Mi Lụa Mulberry Kem và Chân Váy Satin Champage Gold thướt tha, đi kèm trang sức ngọc trai tôn vinh nét quý phái.",
    a100Scores: { color: 97, style: 98, occasion: 98, season: 96, material: 99, balance: 96 },
    items: {
      top: STORE_PRODUCTS.find(p => p.id === "prod_02"),
      bottom: STORE_PRODUCTS.find(p => p.id === "prod_04"),
      shoes: STORE_PRODUCTS.find(p => p.id === "prod_09"),
      bag: STORE_PRODUCTS.find(p => p.id === "prod_06"),
      accessory: STORE_PRODUCTS.find(p => p.id === "prod_11") // Dây chuyền ngọc trai
    }
  },
  {
    id: "polyvore_set_03",
    name: "French Chic Silk & Tweed Contemporary",
    occasion: "wedding",
    occasionLabel: "Tiệc Cưới & Kỷ Niệm",
    season: "spring_summer",
    style: "french_chic",
    compatibilityScore: 96.8,
    description: "Sự kết hợp tinh tế giữa Blazer Tweed Beige nhẹ nhàng cùng Chân Váy Satin Pleated và phụ kiện kính mát thời thượng.",
    a100Scores: { color: 96, style: 97, occasion: 97, season: 95, material: 96, balance: 96 },
    items: {
      top: STORE_PRODUCTS.find(p => p.id === "prod_01"),
      bottom: STORE_PRODUCTS.find(p => p.id === "prod_04"),
      shoes: STORE_PRODUCTS.find(p => p.id === "prod_09"),
      bag: STORE_PRODUCTS.find(p => p.id === "prod_06"),
      accessory: STORE_PRODUCTS.find(p => p.id === "prod_10") // Kính mát
    }
  },
  {
    id: "polyvore_set_04",
    name: "Minimalist Cashmere Vest & Denim Travel",
    occasion: "casual",
    occasionLabel: "Cà Phê & Du Lịch",
    season: "spring_summer",
    style: "streetwear",
    compatibilityScore: 95.2,
    description: "Phong cách dạo phố phóng khoáng với Áo Vest Cashmere Off-White mix Quần Jeans Indigo và phụ kiện thắt lưng da bò.",
    a100Scores: { color: 95, style: 96, occasion: 96, season: 94, material: 95, balance: 94 },
    items: {
      top: STORE_PRODUCTS.find(p => p.id === "prod_07"),
      bottom: STORE_PRODUCTS.find(p => p.id === "prod_08"),
      shoes: STORE_PRODUCTS.find(p => p.id === "prod_05"),
      bag: STORE_PRODUCTS.find(p => p.id === "prod_06"),
      accessory: STORE_PRODUCTS.find(p => p.id === "prod_14") // Thắt lưng
    }
  }
];

// Recommendations pool for try-on styling panel
const RECOMMENDATIONS_CATALOG = STORE_PRODUCTS.map(p => ({
  ...p,
  checked: p.id === "prod_03" || p.id === "prod_05" || p.id === "prod_06" || p.id === "prod_11",
  a100Scores: {
    color: Math.min(99, Math.floor(p.polyvoreScore + (Math.random() * 2 - 1))),
    style: Math.min(99, Math.floor(p.polyvoreScore + (Math.random() * 2 - 1))),
    occasion: Math.min(99, Math.floor(p.polyvoreScore + (Math.random() * 2 - 1))),
    season: Math.min(99, Math.floor(p.polyvoreScore - 2)),
    material: Math.min(99, Math.floor(p.polyvoreScore + 1)),
    balance: Math.min(99, Math.floor(p.polyvoreScore))
  }
}));

window.ADVISORY_METADATA = ADVISORY_METADATA;
window.VITON_HD_MODELS = VITON_HD_MODELS;
window.STORE_PRODUCTS = STORE_PRODUCTS;
window.POLYVORE_RECOMMENDED_OUTFITS = POLYVORE_RECOMMENDED_OUTFITS;
window.RECOMMENDATIONS_CATALOG = RECOMMENDATIONS_CATALOG;
