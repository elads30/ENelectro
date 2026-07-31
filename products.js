const products = [
  {
    id: "p1",
    name: "RoboClean X-Ultra",
    tagline: "The Future of Autonomous Home Cleaning",
    category: "cleaning",
    categoryLabel: "Cleaning",
    price: 899,
    originalPrice: 1049,
    rating: 4.8,
    reviewsCount: 142,
    image: "./assets/roboclean.png",
    badge: "Best Seller",
    description: "Equipped with LiDAR navigation, 8000Pa suction power, and a self-emptying, auto-washing dock, the RoboClean X-Ultra keeps your floors spotless without you lifting a finger.",
    specs: [
      "8000Pa Hyper Suction Power",
      "LiDAR 4.0 Room Mapping & Obstacle Avoidance",
      "Self-Emptying & Mop Self-Cleaning Dock",
      "Up to 180 Minutes Runtime (5200mAh)",
      "Smart App & Voice Assistant Integration"
    ],
    reviews: [
      { user: "עמית ל.", rating: 5, text: "פשוט מושלם! שואב ומנגב בצורה מדהימה ולא נתקע בכלל במכשולים.", date: "2026-07-15" },
      { user: "מיכל ש.", rating: 4, text: "נוח מאוד לשימוש, האפליקציה קצת מורכבת בהתחלה אבל הניקיון מעולה.", date: "2026-07-20" }
    ],
    inStock: true
  },
  {
    id: "p2",
    name: "BaristaPro Touch",
    tagline: "Café-Quality Coffee at Your Fingertips",
    category: "kitchen",
    categoryLabel: "Kitchen Tech",
    price: 1299,
    rating: 4.9,
    reviewsCount: 89,
    image: "./assets/baristapro.png",
    badge: "Premium Choice",
    description: "An automatic bean-to-cup espresso machine featuring an interactive color touchscreen, built-in conical burr grinder, and an automatic microfoam milk texturing system.",
    specs: [
      "Interactive 5-inch HD Color Touchscreen",
      "Integrated Steel Conical Burr Grinder (30 settings)",
      "Auto MilQ system for dairy, almond, oat, and soy options",
      "15 Bar Italian High-Pressure Pump",
      "Dual heating block for simultaneous brewing and steaming"
    ],
    reviews: [
      { user: "דניאל כ.", rating: 5, text: "מכונה מדהימה. הקפה יוצא בדיוק כמו בבית קפה איטלקי.", date: "2026-07-10" },
      { user: "שירה מ.", rating: 5, text: "האפשרות להגדיר פרופיל אישי לכל אחד בבית היא פשוט גאונית.", date: "2026-07-28" }
    ],
    inStock: true
  },
  {
    id: "p3",
    name: "FrostSentinel 600",
    tagline: "Keep Your Food Fresh for Longer",
    category: "kitchen",
    categoryLabel: "Kitchen Tech",
    price: 2499,
    originalPrice: 2799,
    rating: 4.7,
    reviewsCount: 64,
    image: "./assets/refrigerator.png",
    badge: "10% OFF",
    description: "A smart French door refrigerator featuring a built-in 21-inch touchscreen, triple cooling zones, and internal cameras to monitor your groceries from anywhere.",
    specs: [
      "600 Liters Capacity with Triple Cooling Zone",
      "FamilyHub 21.5-inch Smart Touchscreen Display",
      "Internal ViewInside cameras (accessible via app)",
      "Energy Star certified inverter compressor",
      "Dual Ice Maker (crushed and cubed ice)"
    ],
    reviews: [
      { user: "אביב ג.", rating: 5, text: "המקרר הכי טוב שקניתי. נוח מאוד, מסך המגע סופר שימושי למתכונים.", date: "2026-07-02" }
    ],
    inStock: true
  },
  {
    id: "p4",
    name: "HydroSpin 9G",
    tagline: "Intelligent Laundry Care",
    category: "cleaning",
    categoryLabel: "Cleaning",
    price: 799,
    rating: 4.6,
    reviewsCount: 110,
    image: "./assets/washing_machine.png",
    badge: "Eco-Friendly",
    description: "Eco-wash front load washing machine with AI fabric detection, auto-dosing detergent system, and high-temperature steam sterilization.",
    specs: [
      "9kg Capacity drum with LED drum light",
      "AI DD (Direct Drive) Fabric Sensing Technology",
      "ezDispense Automatic Detergent & Softener Dispenser",
      "Steam+ Allergy Care Cycle removes 99.9% of allergens",
      "Ultra-quiet inverter motor (52dB wash, 71dB spin)"
    ],
    reviews: [
      { user: "אורית פ.", rating: 4, text: "שקטה מאוד, מנקה היטב וחוסכת המון סבון בזכות המינון האוטומטי.", date: "2026-06-25" }
    ],
    inStock: true
  },
  {
    id: "p5",
    name: "AeroBreeze Dual",
    tagline: "Breathe Clean, Stay Cool",
    category: "climate",
    categoryLabel: "Climate Control",
    price: 499,
    rating: 4.8,
    reviewsCount: 205,
    image: "./assets/aerobreeze.png",
    badge: "Hot Item",
    description: "A combination of a medical-grade HEPA H13 air purifier and a bladeless cooling fan. Cleans 99.97% of airborne pollutants while keeping your home comfortable.",
    specs: [
      "True HEPA H13 Filter & Carbon Filter",
      "Bladeless Air Multiplier Technology",
      "350-degree oscillation for whole-room circulation",
      "Real-time PM2.5, PM10, VOC & NO2 monitoring",
      "Ultra-quiet Night Mode (29dB)"
    ],
    reviews: [
      { user: "יונתן ר.", rating: 5, text: "שיפר משמעותית את איכות השינה שלי. מסנן מצוין של אבק וריחות.", date: "2026-07-22" },
      { user: "לינה ק.", rating: 4, text: "עושה עבודה נהדרת, קצת יקר אבל שווה את הבריאות.", date: "2026-07-24" }
    ],
    inStock: true
  },
  {
    id: "p6",
    name: "ThermoChef Smart Oven",
    tagline: "Master Any Recipe Automatically",
    category: "kitchen",
    categoryLabel: "Kitchen Tech",
    price: 649,
    originalPrice: 699,
    rating: 4.5,
    reviewsCount: 52,
    image: "./assets/smartoven.png",
    badge: "New Arrival",
    description: "A smart desktop oven combining convection baking, air frying, and steam cooking with an internal camera that recognizes foods and adjusts cooking times.",
    specs: [
      "5-in-1: Convection, Air Fry, Steam, Dehydrate, Toast",
      "CookCam food recognition camera inside",
      "Precise temperature probe included",
      "30-liter capacity fits a 12-inch pizza",
      "Over 100 guided smart recipes via app"
    ],
    reviews: [
      { user: "רעות מ.", rating: 5, text: "המכשיר הכי שימושי במטבח שלי! הצלייה באדים יוצאת מושלמת.", date: "2026-07-12" }
    ],
    inStock: true
  },
  {
    id: "p7",
    name: "VoltClimate Pro 12",
    tagline: "Smart Climate Control All Year Round",
    category: "climate",
    categoryLabel: "Climate Control",
    price: 1199,
    rating: 4.7,
    reviewsCount: 38,
    image: "./assets/voltclimate.png",
    badge: "High Efficiency",
    description: "A sleek smart inverter air conditioner and heater. Adapts dynamically to room occupancy and outdoor temperatures to optimize power usage.",
    specs: [
      "12,000 BTU cooling and heating capacity",
      "Full DC Inverter technology saves up to 45% energy",
      "AI Comfort Control detects temperature and humidity",
      "Self-cleaning freeze technology for clean airflow",
      "Built-in Wi-Fi for full remote scheduling"
    ],
    reviews: [
      { user: "רועי ב.", rating: 5, text: "מזגן שקט במיוחד ומקרר את הסלון הגדול שלי תוך דקות בודדות.", date: "2026-07-18" }
    ],
    inStock: true
  },
  {
    id: "p8",
    name: "Lumina SmartHub Max",
    tagline: "The Brain of Your Connected Home",
    category: "smarthome",
    categoryLabel: "Smart Home",
    price: 299,
    rating: 4.9,
    reviewsCount: 312,
    image: "./assets/smarthub.png",
    badge: "Top Rated",
    description: "A smart control hub with a beautiful 10-inch smart display, premium sound speakers, and full Zigbee/Thread support to coordinate all smart devices.",
    specs: [
      "10.1-inch adaptive HD touchscreen",
      "Built-in Zigbee, Thread, and Matter smart radio",
      "Premium stereo speakers with deep bass",
      "5MP wide-angle camera for video calls and security monitoring",
      "Voice assistant active listening up to 8 meters"
    ],
    reviews: [
      { user: "ניב ד.", rating: 5, text: "מרכז השליטה האולטימטיבי לבית. חיברתי את כל המנורות והשואב בקלות.", date: "2026-07-29" }
    ],
    inStock: true
  }
];
// Export removed to prevent CORS file:// issues. Loaded as global products variable.
