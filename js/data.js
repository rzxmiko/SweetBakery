const products = [
  {
    id: "chocolate-delight", category: "cakes", price: 14000, image: "images/chocolate-delight.jpg", bestseller: true,
    name: { en: "Chocolate Delight", ru: "Шоколадный восторг", kk: "Шоколадты ләззат" },
    desc: {
      en: "Chocolate sponge with Belgian dark chocolate ganache.",
      ru: "Шоколадный бисквит с ганашем из бельгийского шоколада.",
      kk: "Бельгия шоколадының ганаші бар шоколадты бисквит."
    }
  },
  {
    id: "berry-bliss", category: "cakes", price: 15500, image: "images/berry-bliss.jpg", bestseller: true,
    name: { en: "Berry Bliss", ru: "Ягодное блаженство", kk: "Жидек рақаты" },
    desc: {
      en: "Vanilla sponge with fresh berries and cream.",
      ru: "Ванильный бисквит со свежими ягодами и сливками.",
      kk: "Жаңа жидектер мен кілегейі бар ванильді бисквит."
    }
  },
  {
    id: "red-velvet", category: "cakes", price: 14500, image: "images/red-velvet.jpg", bestseller: false,
    name: { en: "Red Velvet", ru: "Красный бархат", kk: "Қызыл барқыт" },
    desc: {
      en: "Classic velvet cake with cream cheese frosting.",
      ru: "Классический бархатный торт с крем-чизом.",
      kk: "Крем-чизі бар классикалық барқыт торт."
    }
  },
  {
    id: "mango-passion", category: "cakes", price: 16000, image: "images/gallery-9.jpg", bestseller: false,
    name: { en: "Mango & Passion Fruit", ru: "Манго-маракуйя", kk: "Манго-маракуйя" },
    desc: {
      en: "Light layers of mango confit and passion fruit curd.",
      ru: "Лёгкие слои мангового конфи и курда из маракуйи.",
      kk: "Манго конфиі мен маракуйя курдының жеңіл қабаттары."
    }
  },
  {
    id: "salted-caramel", category: "cakes", price: 15000, image: "images/gallery-8.jpg", bestseller: false,
    name: { en: "Salted Caramel", ru: "Солёная карамель", kk: "Тұзды карамель" },
    desc: {
      en: "Butter sponge with salted caramel and pecans.",
      ru: "Сливочный бисквит с солёной карамелью и пеканом.",
      kk: "Тұзды карамель мен пеканы бар бисквит."
    }
  },

  // ----- Cupcakes -----
  {
    id: "caramel-cupcake", category: "cupcakes", price: 1200, image: "images/cupcakess.jpeg", bestseller: true,
    name: { en: "Caramel Cupcake", ru: "Карамельный капкейк", kk: "Карамель капкейгі" },
    desc: {
      en: "Salted caramel inside and buttercream on top.",
      ru: "Солёная карамель внутри и масляный крем сверху.",
      kk: "Ішінде тұзды карамель, үстінде майлы крем."
    }
  },
  {
    id: "chocolate-cupcake", category: "cupcakes", price: 1300, image: "images/gallery-2.jpg", bestseller: false,
    name: { en: "Double Chocolate Cupcake", ru: "Капкейк «Двойной шоколад»", kk: "«Қос шоколад» капкейгі" },
    desc: {
      en: "Cocoa sponge, chocolate chips and chocolate cream.",
      ru: "Какао-бисквит, шоколадная крошка и шоколадный крем.",
      kk: "Какао бисквит, шоколад түйіршіктері мен кремі."
    }
  },

  // ----- Macarons -----
  {
    id: "pistachio-macaron", category: "macarons", price: 800, image: "images/macarons.jpg", bestseller: false,
    name: { en: "Pistachio Macaron", ru: "Фисташковый макарон", kk: "Пісте макароны" },
    desc: {
      en: "Almond shells with pistachio ganache.",
      ru: "Миндальные половинки с фисташковым ганашем.",
      kk: "Пісте ганаші бар бадам безе."
    }
  },
  {
    id: "raspberry-macaron", category: "macarons", price: 800, image: "images/macarons.jpg", bestseller: false,
    name: { en: "Raspberry Macaron", ru: "Малиновый макарон", kk: "Таңқурай макароны" },
    desc: {
      en: "Raspberry purée with dark chocolate.",
      ru: "Малиновое пюре и тёмный шоколад.",
      kk: "Таңқурай езбесі және қара шоколад."
    }
  },

  // ----- Pastries -----
  {
    id: "butter-croissant", category: "pastries", price: 950, image: "images/croissants.jpg", bestseller: true,
    name: { en: "Butter Croissant", ru: "Сливочный круассан", kk: "Сары майлы круассан" },
    desc: {
      en: "French butter and flaky layers, baked every morning.",
      ru: "Французское масло и хрустящие слои, печём каждое утро.",
      kk: "Француз сары майы, әр таң сайын пісіреміз."
    }
  },
  {
    id: "almond-croissant", category: "pastries", price: 1350, image: "images/croissants.jpg", bestseller: false,
    name: { en: "Almond Croissant", ru: "Миндальный круассан", kk: "Бадамды круассан" },
    desc: {
      en: "Croissant with almond cream and flaked almonds.",
      ru: "Круассан с миндальным кремом и лепестками миндаля.",
      kk: "Бадам кремі мен жапырақшалары бар круассан."
    }
  },

  // ----- Sets (also shown on the Promotions page) -----
  {
    id: "cupcake-box", category: "sets", price: 6000, oldPrice: 7500, image: "images/cupcakess.jpeg", bestseller: false,
    name: { en: "Weekend Cupcake Box", ru: "Бокс капкейков", kk: "Капкейк бокс" },
    desc: {
      en: "Any 6 cupcakes in a gift box.",
      ru: "Любые 6 капкейков в подарочной коробке.",
      kk: "Сыйлық қорапшасындағы кез келген 6 капкейк."
    }
  },
  {
    id: "birthday-set", category: "sets", price: 13500, oldPrice: 15000, image: "images/birthdaycake.jpg", bestseller: false,
    name: { en: "Birthday Set", ru: "Набор «День рождения»", kk: "«Туған күн» жиынтығы" },
    desc: {
      en: "1 kg cake with an inscription and free candles.",
      ru: "Торт 1 кг с надписью и свечи в подарок.",
      kk: "Жазуы бар 1 кг торт және тегін шырағдандар."
    }
  },
  {
    id: "velvet-duo", category: "sets", price: 3200, oldPrice: 3600, image: "images/gallery-3.jpg", bestseller: false,
    name: { en: "Red Velvet Duo", ru: "Дуэт «Красный бархат»", kk: "«Қызыл барқыт» дуэті" },
    desc: {
      en: "Two slices of Red Velvet to go.",
      ru: "Два кусочка «Красного бархата» с собой.",
      kk: "Өзіңізбен алатын екі тілім «Қызыл барқыт»."
    }
  }
];

// Promo codes that work in the cart
const promoCodes = {
  SWEET15: 15,    // 15% off
  WEEKEND10: 10,  // 10% off
  STUDENT5: 5     // 5% off
};

const DELIVERY_PRICE = 1500;     // courier delivery in ₸
const FREE_DELIVERY_FROM = 20000; // free delivery from this sum
