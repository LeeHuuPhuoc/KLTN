/**
 * Dataset for AURA FIT AI - E-Commerce Store Catalog & Virtual Try-On Studio
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
  skirtTryon: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
};

// Full E-Commerce Store Products Catalog
const STORE_PRODUCTS = [
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
    style: "Smart Executive / French Chic",
    rating: 4.9,
    isHot: true
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
    style: "Nữ Tính / Lịch Thiệp",
    rating: 4.8,
    isHot: false
  },
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
    style: "Modern Executive",
    rating: 4.9,
    isHot: true
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
    style: "Dạ Tiệc / Nữ Tính",
    rating: 4.7,
    isHot: false
  },
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
    style: "Classic Preppy",
    rating: 4.9,
    isHot: true
  },
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
    style: "Contemporary Minimalist",
    rating: 4.95,
    isHot: true
  }
];

// User Models
const SAMPLE_MODELS = [
  {
    id: "model_1",
    name: "Mẫu Studio Nữ Phương Linh (Chụp Toàn Thân)",
    image: LOCAL_IMAGES.userAvatar,
    fallback: WEB_FALLBACKS.userAvatar,
    height: "168cm",
    weight: "50kg",
    skinTone: "Light Neutral"
  },
  {
    id: "model_2",
    name: "Mẫu Studio Nữ Minh Anh (Chụp Toàn Thân)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    fallback: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    height: "172cm",
    weight: "54kg",
    skinTone: "Warm Warm"
  }
];

// Recommendations pool for try-on styling
const RECOMMENDATIONS_CATALOG = [
  {
    id: "rec_bottom_01",
    category: "bottom",
    name: "Quần Tailored Charcoal Pleated Trousers",
    price: "890,000đ",
    image: LOCAL_IMAGES.bottomPant,
    fallback: WEB_FALLBACKS.bottomPant,
    color: "Xám Than Charcoal",
    material: "Tencel Wool-Blend",
    checked: true,
    tryonImage: LOCAL_IMAGES.tryonRendered,
    tryonFallback: WEB_FALLBACKS.tryonRendered,
    a100Scores: { color: 96, style: 97, occasion: 98, season: 94, material: 95, balance: 98 }
  },
  {
    id: "rec_bottom_02",
    category: "bottom",
    name: "Chân Váy Satin Pleated Champagne Gold",
    price: "750,000đ",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
    color: "Champagne Vàng",
    material: "Satin Pleated Silk",
    checked: false,
    tryonImage: WEB_FALLBACKS.skirtTryon,
    tryonFallback: WEB_FALLBACKS.skirtTryon,
    a100Scores: { color: 94, style: 95, occasion: 96, season: 91, material: 97, balance: 93 }
  },
  {
    id: "rec_shoes_01",
    category: "shoes",
    name: "Giày Loafer Da Thật Black Calfskin Nappa",
    price: "1,250,000đ",
    image: LOCAL_IMAGES.shoesPair,
    fallback: WEB_FALLBACKS.shoesPair,
    color: "Đen Tuyền Classic",
    material: "Da Bò Ý Nappa",
    checked: true,
    a100Scores: { color: 95, style: 96, occasion: 97, season: 95, material: 97, balance: 95 }
  },
  {
    id: "rec_bag_01",
    category: "bag",
    name: "Túi Xách Da Thật Crossbody Black Leather",
    price: "1,680,000đ",
    image: LOCAL_IMAGES.handbag,
    fallback: WEB_FALLBACKS.handbag,
    color: "Đen Bạc",
    material: "Da Bò Nguyên Tấm",
    checked: true,
    a100Scores: { color: 97, style: 97, occasion: 98, season: 96, material: 98, balance: 97 }
  }
];
