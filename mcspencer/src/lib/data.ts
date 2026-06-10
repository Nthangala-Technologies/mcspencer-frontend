export type Category =
  | "Electronics"
  | "Hardware"
  | "Car Spares"
  | "Stationery"
  | "Fashion"
  | "AgroMarket";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  category: Category;
  details?: string[];
};

export const categories: { name: Category; icon: string; image: string }[] = [
  { name: "Electronics", icon: "Laptop", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop" },
  { name: "Hardware", icon: "Wrench", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop" },
  { name: "Car Spares", icon: "Car", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop" },
  { name: "Stationery", icon: "BookOpen", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&h=400&fit=crop" },
  { name: "Fashion", icon: "Shirt", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" },
  { name: "AgroMarket", icon: "Leaf", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop" },
];

export const products: Product[] = [
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Samsung Galaxy Book4 Pro 16\"",
    price: 22999,
    description:
      "Intel Core Ultra 7, 16 GB RAM, 512 GB SSD. Ultra-slim AMOLED display perfect for professionals on the move.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
    ],
    category: "Electronics",
    details: [
      "Intel Core Ultra 7 155H processor",
      "16 GB LPDDR5 RAM",
      "512 GB NVMe SSD",
      "16-inch 2.8K 120 Hz AMOLED display",
      "Up to 22-hour battery life",
    ],
  },
  {
    id: "2",
    name: "LG UltraGear 27\" QHD Monitor",
    price: 6499,
    description:
      "27-inch 2560×1440 IPS panel, 165 Hz refresh, 1 ms response. HDR10 ready — ideal for work and gaming.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&h=600&fit=crop",
    ],
    category: "Electronics",
    details: [
      "27-inch QHD (2560×1440) IPS",
      "165 Hz refresh rate, 1 ms GTG",
      "HDR10, 99 % sRGB colour",
      "USB-C, HDMI, DisplayPort inputs",
      "Height & tilt adjustable stand",
    ],
  },
  {
    id: "3",
    name: "Logitech MX Master 3S Wireless Mouse",
    price: 1399,
    description:
      "8000 DPI MagSpeed scroll, ultra-quiet clicks, Bluetooth & USB receiver. Ergonomic comfort for long work sessions.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615750824032-f9de12c3e4ee?w=800&h=600&fit=crop",
    ],
    category: "Electronics",
    details: [
      "8000 DPI electromagnetic MagSpeed scroll",
      "Ultra-quiet click buttons",
      "USB-C rechargeable — 70-day battery",
      "Works on any surface including glass",
      "Multi-device Bluetooth + USB Logi Bolt",
    ],
  },
  {
    id: "4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 7999,
    description:
      "Industry-leading noise cancellation with 30-hour battery. Crystal-clear calls and Hi-Res Audio support.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
    ],
    category: "Electronics",
    details: [
      "8 microphones with Auto NC Optimizer",
      "30-hour battery (3 min charge = 3 hrs)",
      "Hi-Res Audio & LDAC codec support",
      "Speak-to-Chat auto-pause",
      "Foldable design with carry case",
    ],
  },
  {
    id: "5",
    name: "Samsung 65\" 4K QLED Smart TV",
    price: 18499,
    description:
      "Quantum Dot technology with Quantum HDR, built-in Tizen OS, and ultra-slim bezels. South Africa's top seller.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4e10a?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f4e10a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571415060716-baff5f717c3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=800&h=600&fit=crop",
    ],
    category: "Electronics",
    details: [
      "65-inch 4K Quantum Dot display",
      "Quantum HDR 12x",
      "Tizen Smart TV — Netflix, Showmax, DStv Now",
      "Object Tracking Sound+",
      "3× HDMI 2.1, 2× USB, Wi-Fi 5",
    ],
  },

  // ── Hardware ──────────────────────────────────────────────────────────────
  {
    id: "6",
    name: "Bosch GSB 18V-55 Combi Drill Kit",
    price: 3299,
    description:
      "18 V brushless combi drill/driver with two 2.0 Ah batteries, charger, and L-BOXX carry case.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop",
    ],
    category: "Hardware",
    details: [
      "55 Nm torque, brushless motor",
      "13 mm all-metal keyless chuck",
      "2 × 18 V 2.0 Ah ProCORE batteries included",
      "2-speed gearbox (0–500 / 0–1900 rpm)",
      "L-BOXX carry case included",
    ],
  },
  {
    id: "7",
    name: "Stanley 108-Piece Mechanics Tool Set",
    price: 1599,
    description:
      "Full chrome-vanadium socket and spanner set in a blow-moulded carry case. Lifetime warranty.",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565435398572-be79cb9de99e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800&h=600&fit=crop",
    ],
    category: "Hardware",
    details: [
      "108 pieces — metric & imperial",
      "Chrome vanadium steel",
      "72-tooth ratchet mechanism",
      "Blow-moulded storage case",
      "Lifetime limited warranty",
    ],
  },
  {
    id: "8",
    name: "Makita 9-inch Angle Grinder",
    price: 1849,
    description:
      "2 000 W powerful motor, variable speed 2 800–6 000 rpm, with anti-restart and auto-stop carbon brush.",
    image: "https://images.unsplash.com/photo-1567861911437-538298e4232a?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1567861911437-538298e4232a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1416752037-f48d27d02ae2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ],
    category: "Hardware",
    details: [
      "2 000 W motor output",
      "Variable speed 2 800–6 000 rpm",
      "9-inch (230 mm) disc size",
      "Auto-stop carbon brush protection",
      "Anti-restart safety function",
    ],
  },

  // ── Car Spares ─────────────────────────────────────────────────────────────
  {
    id: "9",
    name: "Brembo Ceramic Brake Pad Set (Front)",
    price: 849,
    description:
      "OEM-quality ceramic pads — low dust, near-silent braking. Fits Toyota Corolla, VW Polo, Hyundai i20 and most popular SA models.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=800&h=600&fit=crop",
    ],
    category: "Car Spares",
    details: [
      "Ceramic low-dust compound",
      "Fits Toyota Corolla 2014–2024 (front)",
      "Pre-attached noise-reduction shims",
      "Hardware kit included",
      "TÜV-certified quality",
    ],
  },
  {
    id: "10",
    name: "Castrol EDGE 5W-30 Fully Synthetic 5L",
    price: 469,
    description:
      "Full synthetic engine oil for petrol and diesel cars. Superior protection under extreme pressure — ideal for SA summer heat.",
    image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    ],
    category: "Car Spares",
    details: [
      "5W-30 Fluid Titanium Technology",
      "3× stronger against viscosity breakdown",
      "5-litre resealable jug",
      "Suitable for petrol & diesel engines",
      "Meets VW 502.00/505.00 & BMW LL-01",
    ],
  },
  {
    id: "11",
    name: "Presto 360° Magnetic Car Phone Mount",
    price: 199,
    description:
      "Universal magnetic dashboard mount. Mounts to vent or dashboard. Holds phones up to 7 inches securely.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&fit=crop",
    ],
    category: "Car Spares",
    details: [
      "N52 strong neodymium magnet",
      "360-degree ball-joint rotation",
      "Vent clip + sticky pad included",
      "MagSafe compatible",
      "Fits all phones 4–7 inches",
    ],
  },

  // ── Stationery ─────────────────────────────────────────────────────────────
  {
    id: "12",
    name: "Leuchttrum1917 A5 Hardcover Notebook",
    price: 349,
    description:
      "German-engineered 249-page dot-grid journal. Acid-free, archival paper. The notebook of choice for professionals across SA.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=600&fit=crop",
    ],
    category: "Stationery",
    details: [
      "249 numbered dot-grid pages",
      "80 gsm acid-free archival paper",
      "Lay-flat binding",
      "Two ribbon bookmarks + elastic closure",
      "Pre-printed table of contents",
    ],
  },
  {
    id: "13",
    name: "Stabilo Boss 8-Colour Highlighter Set",
    price: 149,
    description:
      "Classic wedge-tip highlighters with 40-hour ink life. Brilliant fluorescent colours that won't bleed through most papers.",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop",
    ],
    category: "Stationery",
    details: [
      "8 fluorescent colours",
      "Wedge tip for broad & fine lines",
      "Ink-stop reservoir — won't dry out",
      "Non-bleed on most photocopier paper",
      "Ventilated cap for child safety",
    ],
  },
  {
    id: "14",
    name: "Parker Jotter Ballpoint Pen — Black",
    price: 249,
    description:
      "Iconic stainless steel body with medium-point blue ink. Refillable, built to last a lifetime.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=600&fit=crop",
    ],
    category: "Stationery",
    details: [
      "Stainless steel body with chrome trim",
      "Medium-point Quink blue ink",
      "Retractable click mechanism",
      "Refillable — compatible with Parker G2",
      "Gift box included",
    ],
  },

  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    id: "15",
    name: "Woolworths Merino Business Blazer",
    price: 3499,
    description:
      "100 % merino wool slim-fit blazer. Machine washable, wrinkle-resistant — ideal for the SA boardroom or Joburg winter.",
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=800&h=600&fit=crop",
    ],
    category: "Fashion",
    details: [
      "100 % merino wool — lightweight & warm",
      "Slim contemporary fit",
      "Machine washable (cold)",
      "Available in Navy, Charcoal, Black (S–XXL)",
      "Ethically sourced — Woolworths Good Business Journey",
    ],
  },
  {
    id: "16",
    name: "Fossil Defender RFID Leather Wallet",
    price: 799,
    description:
      "Full-grain leather bifold with RFID-blocking lining. 8 card slots, two bill compartments — slim enough to fit any pocket.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&h=600&fit=crop",
    ],
    category: "Fashion",
    details: [
      "Full-grain cowhide leather",
      "RFID-blocking metallic lining",
      "8 card slots + 2 bill sections",
      "Slim 8 mm profile when empty",
      "Gift-ready box packaging",
    ],
  },
  {
    id: "17",
    name: "Rip Curl Stacka 35L Backpack",
    price: 1299,
    description:
      "Water-resistant 35-litre pack. Padded 15\" laptop sleeve, ventilated back panel — built for the Cape Town commute.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=600&fit=crop",
    ],
    category: "Fashion",
    details: [
      "35-litre capacity",
      "Padded 15-inch laptop sleeve",
      "Airflow ventilated back panel",
      "Water-resistant ripstop nylon",
      "Available in Black, Navy & Olive",
    ],
  },

  // ── AgroMarket ────────────────────────────────────────────────────────────
  {
    id: "18",
    name: "Kirchhoffs Wonder Soil Organic Fertiliser 5 kg",
    price: 189,
    description:
      "Balanced NPK slow-release granules certified for edible crops. Trusted by South African smallholder and home garden farmers.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
    ],
    category: "AgroMarket",
    details: [
      "5 kg resealable bag",
      "Balanced NPK 5-5-5 slow-release",
      "SABS-certified organic",
      "Safe for all edible crops",
      "Child & pet friendly",
    ],
  },
  {
    id: "19",
    name: "Netafim Techline Drip Kit — 50 Plants",
    price: 649,
    description:
      "Israeli-engineered precision drip irrigation for up to 50 plants. UV-resistant tubing, self-flushing emitters — easy DIY setup.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
    ],
    category: "AgroMarket",
    details: [
      "Covers up to 50 plants / 25 m row",
      "Self-flushing pressure-compensating emitters",
      "UV-stabilised polyethylene tubing",
      "Timer compatible (12 V or battery)",
      "All couplings & pegs included",
    ],
  },
  {
    id: "20",
    name: "Husqvarna 135 Chainsaw 14\" Bar",
    price: 4999,
    description:
      "38 cc petrol chainsaw with X-Torq engine — 20 % lower fuel use, 75 % fewer emissions. Ideal for SA smallholding firewood.",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1416752037-f48d27d02ae2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop",
    ],
    category: "AgroMarket",
    details: [
      "38 cc X-Torq engine",
      "14-inch (35 cm) bar & chain",
      "Inertia-activated chain brake",
      "Air Injection air filter — longer service intervals",
      "Carry case & bar cover included",
    ],
  },
];
