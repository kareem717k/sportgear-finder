(function () {
  var BASE = '/sportgear-finder/';

  var INDEX = [
    // ── Hubs
    { title: 'Tennis Hub', sub: 'All tennis categories', tag: 'Tennis', url: BASE + 'tennis/' },
    // ── Equipment categories
    { title: 'Tennis Rackets', sub: 'Budget · Best Value · Premium', tag: 'Rackets', url: BASE + 'tennis/rackets.html' },
    { title: 'Tennis Balls', sub: 'Budget · Best Value · Premium', tag: 'Balls', url: BASE + 'tennis/balls.html' },
    { title: 'Tennis Shoes', sub: 'Budget · Best Value · Premium', tag: 'Shoes', url: BASE + 'tennis/shoes.html' },
    { title: 'Tennis Bags', sub: 'Budget · Best Value · Premium', tag: 'Bags', url: BASE + 'tennis/bags.html' },
    { title: 'Tennis Strings', sub: 'Budget · Best Value · Premium', tag: 'Strings', url: BASE + 'tennis/strings.html' },
    { title: 'Grips & Overgrips', sub: 'Budget · Best Value · Premium', tag: 'Grips', url: BASE + 'tennis/grips.html' },
    { title: 'Tennis Accessories', sub: 'Dampeners · wristbands · headbands', tag: 'Accessories', url: BASE + 'tennis/accessories.html' },
    // ── Clothing categories
    { title: 'Tennis Shirts & Polos', sub: 'Budget · Best Value · Premium', tag: 'Shirts', url: BASE + 'tennis/shirts.html' },
    { title: 'Tennis Shorts', sub: 'Budget · Best Value · Premium', tag: 'Shorts', url: BASE + 'tennis/shorts.html' },
    { title: 'Tennis Skirts & Dresses', sub: 'Budget · Best Value · Premium', tag: 'Skirts', url: BASE + 'tennis/skirts.html' },
    { title: 'Tennis Socks', sub: 'Budget · Best Value · Premium', tag: 'Socks', url: BASE + 'tennis/socks.html' },
    { title: 'Tennis Hats & Visors', sub: 'Budget · Best Value · Premium', tag: 'Hats', url: BASE + 'tennis/hats.html' },
    // ── Racket products
    { title: 'Wilson Tour Slam Adult Strung', sub: 'Rackets — Budget', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Head Ti.S6 Strung', sub: 'Rackets — Budget', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Babolat EVO Drive Gen 2', sub: 'Rackets — Best Value', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Yonex EZONE 100', sub: 'Rackets — Best Value', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Babolat Pure Drive 2025', sub: 'Rackets — Premium', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Babolat Pure Aero 98 2026', sub: 'Rackets — Premium', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    // ── Ball products
    { title: 'Penn Championship Extra Duty', sub: 'Balls — Budget', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Wilson Championship Extra Duty', sub: 'Balls — Budget', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Wilson US Open Extra Duty', sub: 'Balls — Best Value', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Penn Tour Extra Duty', sub: 'Balls — Best Value', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Babolat Roland Garros All Court', sub: 'Balls — Premium', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Dunlop Australian Open Extra Duty', sub: 'Balls — Premium', tag: 'Product', url: BASE + 'tennis/balls.html' },
    // ── Shoe products
    { title: 'ASICS Gel Dedicate 8', sub: 'Shoes — Budget', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'NikeCourt Lite 4', sub: 'Shoes — Budget', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'ASICS Court FF 3', sub: 'Shoes — Best Value', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'Mizuno Wave Enforce Tour 2', sub: 'Shoes — Best Value', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'ASICS Gel-Resolution 9', sub: 'Shoes — Premium', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'Nike Air Zoom Vapor Pro 2', sub: 'Shoes — Premium', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    // ── Bag products
    { title: 'Wilson Federer Team III Bag', sub: 'Bags — Budget', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Head Core Club 6 Racket Bag', sub: 'Bags — Budget', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Babolat Pure Aero Backpack', sub: 'Bags — Best Value', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Head Tour Team Backpack', sub: 'Bags — Best Value', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Wilson Pro Staff Super Tour Bag', sub: 'Bags — Premium', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Geau Sport Axiom 2.0', sub: 'Bags — Premium', tag: 'Product', url: BASE + 'tennis/bags.html' },
    // ── String products
    { title: 'Wilson Synthetic Gut Power 16', sub: 'Strings — Budget', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Prince Synthetic Gut Original 16', sub: 'Strings — Budget', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Babolat RPM Blast 16', sub: 'Strings — Best Value', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Solinco Hyper-G 16L', sub: 'Strings — Best Value', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Luxilon ALU Power 125', sub: 'Strings — Premium', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Wilson Natural Gut 16', sub: 'Strings — Premium', tag: 'Product', url: BASE + 'tennis/strings.html' },
    // ── Grip products
    { title: 'Wilson Pro Overgrip 3-pack', sub: 'Grips — Budget', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Tourna Grip Original 10-pack', sub: 'Grips — Budget', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Yonex Super Grap 30-pack', sub: 'Grips — Best Value', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Babolat VS Original Overgrip 12-pack', sub: 'Grips — Best Value', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Head Hydrosorb Pro Replacement Grip', sub: 'Grips — Premium', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Wilson Leather Grip Replacement', sub: 'Grips — Premium', tag: 'Product', url: BASE + 'tennis/grips.html' },
    // ── Accessory products
    { title: 'Wilson Pro Feel Vibration Dampener', sub: 'Accessories — Budget', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Babolat Custom Damp', sub: 'Accessories — Budget', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Nike Dri-FIT Wristbands', sub: 'Accessories — Best Value', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Adidas AeroReady Headband', sub: 'Accessories — Best Value', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Nike Elite Doublewide Wristbands', sub: 'Accessories — Premium', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Babolat Logo Wristband', sub: 'Accessories — Premium', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    // ── Shirt products
    { title: 'Decathlon Artengo Dry Tennis Polo', sub: 'Shirts — Budget', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'ASICS Club Polo Shirt', sub: 'Shirts — Budget', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Nike Dri-FIT Advantage Polo', sub: 'Shirts — Best Value', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Adidas Club Tennis Polo', sub: 'Shirts — Best Value', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Lacoste Ultra-Dry Polo', sub: 'Shirts — Premium', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'lululemon Metal Vent Tech Polo', sub: 'Shirts — Premium', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    // ── Shorts products
    { title: 'Decathlon Artengo TSH500 Shorts', sub: 'Shorts — Budget', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Dri-FIT Training Shorts 7"', sub: 'Shorts — Budget', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Adidas Club Tennis Shorts', sub: 'Shorts — Best Value', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Court Dri-FIT Advantage Shorts', sub: 'Shorts — Best Value', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'lululemon Pace Breaker Short 7"', sub: 'Shorts — Premium', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Court Flex Ace Shorts', sub: 'Shorts — Premium', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    // ── Skirt products
    { title: 'Decathlon Artengo Soft Tennis Skirt', sub: 'Skirts — Budget', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Wilson Team Tennis Skirt', sub: 'Skirts — Budget', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Nike Court Dri-FIT Victory Skirt', sub: 'Skirts — Best Value', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Adidas Match Tennis Skirt', sub: 'Skirts — Best Value', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'lululemon Pace Rival Skirt', sub: 'Skirts — Premium', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Nike Court Dri-FIT Advantage Pleated Skirt', sub: 'Skirts — Premium', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    // ── Sock products
    { title: 'Decathlon Artengo RS 160 Low Socks', sub: 'Socks — Budget', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Wilson Quarter Socks 3-pack', sub: 'Socks — Budget', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Nike Court Multiplier Cushioned Socks', sub: 'Socks — Best Value', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Adidas Tour Crew Tennis Socks', sub: 'Socks — Best Value', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Balega Hidden Comfort Socks', sub: 'Socks — Premium', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Thorlo Tennis Crew Socks', sub: 'Socks — Premium', tag: 'Product', url: BASE + 'tennis/socks.html' },
    // ── Hat products
    { title: 'Nike Dri-FIT Legacy91 Cap', sub: 'Hats — Budget', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Adidas Sport Performance Cap', sub: 'Hats — Budget', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Nike Court AeroBill Heritage86 Cap', sub: 'Hats — Best Value', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Wilson Ultralight Tennis Cap', sub: 'Hats — Best Value', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Nike Court Advantage Cap', sub: 'Hats — Premium', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Lacoste Sport Microfibre Player Cap', sub: 'Hats — Premium', tag: 'Product', url: BASE + 'tennis/hats.html' },
    // ── Gym Hub
    { title: 'Gym & Fitness Hub', sub: 'All gym categories', tag: 'Gym', url: BASE + 'gym/' },
    // ── Gym categories
    { title: 'Dumbbells', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/dumbbells.html' },
    { title: 'Resistance Bands', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/resistance-bands.html' },
    { title: 'Training Shoes', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/training-shoes.html' },
    { title: 'Gym Bags', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/gym-bags.html' },
    { title: 'Weightlifting Gloves', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/gloves.html' },
    { title: 'Jump Ropes', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/jump-ropes.html' },
    // ── Dumbbell products
    { title: 'Yes4All Rubber Hex Dumbbells', sub: 'Dumbbells — Budget', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'CAP Barbell Rubber-Coated Hex', sub: 'Dumbbells — Budget', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'PowerBlock Sport 24 Adjustable', sub: 'Dumbbells — Best Value', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'Bowflex SelectTech 552', sub: 'Dumbbells — Best Value', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'REP Fitness Quickdraw Adjustable', sub: 'Dumbbells — Premium', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'Bowflex SelectTech 1090', sub: 'Dumbbells — Premium', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    // ── Resistance Band products
    { title: 'Fit Simplify Resistance Loop Bands', sub: 'Resistance Bands — Budget', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'TheraBand Resistance Bands Set', sub: 'Resistance Bands — Budget', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'WODFitters Pull-Up Assist Bands', sub: 'Resistance Bands — Best Value', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'Bodylastics Resistance Band Set', sub: 'Resistance Bands — Best Value', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'EliteFTS Pro Stretch Bands', sub: 'Resistance Bands — Premium', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'Perform Better Superband', sub: 'Resistance Bands — Premium', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    // ── Training Shoe products
    { title: 'New Balance 608 V5 Cross Trainer', sub: 'Training Shoes — Budget', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Skechers Max Cushioning Arch Fit', sub: 'Training Shoes — Budget', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Reebok Nano X3', sub: 'Training Shoes — Best Value', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'NOBULL Training Shoe', sub: 'Training Shoes — Best Value', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Nike Metcon 9', sub: 'Training Shoes — Premium', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Nike Metcon 9 AMP', sub: 'Training Shoes — Premium', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    // ── Gym Bag products
    { title: 'Amazon Basics Duffel Gym Bag', sub: 'Gym Bags — Budget', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'DALIX 21" Sports Duffle Bag', sub: 'Gym Bags — Budget', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'Nike Brasilia 9.5 Training Duffel', sub: 'Gym Bags — Best Value', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'Under Armour Undeniable 5.0 Duffle', sub: 'Gym Bags — Best Value', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'Nike Hoops Elite Duffel Bag', sub: 'Gym Bags — Premium', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'lululemon Early Embark Duffel 27L', sub: 'Gym Bags — Premium', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    // ── Weightlifting Glove products
    { title: 'RIMSports Workout Gloves', sub: 'Weightlifting Gloves — Budget', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'FREETOO Workout Gloves with Wrist Support', sub: 'Weightlifting Gloves — Budget', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Trideer Workout Gloves', sub: 'Weightlifting Gloves — Best Value', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Pro Wristwrap Weightlifting Gloves', sub: 'Weightlifting Gloves — Best Value', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Harbinger Training Grip Gloves 3.0', sub: 'Weightlifting Gloves — Premium', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Schiek Sports Platinum Lifting Gloves', sub: 'Weightlifting Gloves — Premium', tag: 'Product', url: BASE + 'gym/gloves.html' },
    // ── Jump Rope products
    { title: 'XYLsports Jump Rope', sub: 'Jump Ropes — Budget', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'DEGOL Skipping Rope with Ball Bearings', sub: 'Jump Ropes — Budget', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'WOD Nation Attack Speed Jump Rope', sub: 'Jump Ropes — Best Value', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'RPM Speed Jump Rope 3.0', sub: 'Jump Ropes — Best Value', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'Crossrope Get Lean Set', sub: 'Jump Ropes — Premium', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'Crossrope Get Strong Set', sub: 'Jump Ropes — Premium', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    // Boxing
    { title: 'Boxing Hub', sub: 'All boxing categories', tag: 'Boxing', url: BASE + 'boxing/' },
    { title: 'Boxing Gloves', sub: 'Budget · Best Value · Premium', tag: 'Boxing', url: BASE + 'boxing/gloves.html' },
    { title: 'Everlast Pro Style Training Gloves', sub: 'Boxing Gloves — Budget', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Sanabul Essential Gel Boxing Gloves', sub: 'Boxing Gloves — Budget', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Venum Challenger 2.0 Boxing Gloves', sub: 'Boxing Gloves — Budget', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Everlast Elite Pro Style Training Gloves', sub: 'Boxing Gloves — Best Value', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Ringside Competition Boxing Gloves', sub: 'Boxing Gloves — Best Value', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Hayabusa T3 Boxing Gloves', sub: 'Boxing Gloves — Premium', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Cleto Reyes Hook and Loop Training Gloves', sub: 'Boxing Gloves — Premium', tag: 'Product', url: BASE + 'boxing/gloves.html' },
    { title: 'Punching Bags', sub: 'Budget · Best Value · Premium', tag: 'Boxing', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Ringside 40-Pound Boxing Heavy Bag Kit', sub: 'Punching Bags — Budget', tag: 'Product', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Everlast PowerCore Freestanding Heavy Bag', sub: 'Punching Bags — Budget', tag: 'Product', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Ringside 100-Pound Powerhide Heavy Bag', sub: 'Punching Bags — Best Value', tag: 'Product', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Ringside 100-Pound Leather Heavy Bag', sub: 'Punching Bags — Premium', tag: 'Product', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Outslayer 100-Pound Filled Heavy Bag', sub: 'Punching Bags — Premium', tag: 'Product', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Century BOB Body Opponent Bag', sub: 'Punching Bags — Premium', tag: 'Product', url: BASE + 'boxing/punching-bags.html' },
    { title: 'Hand Wraps', sub: 'Budget · Best Value · Premium', tag: 'Boxing', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Everlast 108-Inch Boxing Hand Wraps', sub: 'Hand Wraps — Budget', tag: 'Product', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Sanabul Elastic 180-Inch Hand Wraps', sub: 'Hand Wraps — Budget', tag: 'Product', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Ringside Apex 180-Inch Hand Wraps', sub: 'Hand Wraps — Budget', tag: 'Product', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Title Boxing Mexican Style Hand Wraps', sub: 'Hand Wraps — Best Value', tag: 'Product', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Hayabusa 180-Inch Perfect Stretch Wraps', sub: 'Hand Wraps — Best Value', tag: 'Product', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Ringside Pro Mexican Handwraps 200-Inch', sub: 'Hand Wraps — Premium', tag: 'Product', url: BASE + 'boxing/hand-wraps.html' },
    { title: 'Boxing Shoes', sub: 'Budget · Best Value · Premium', tag: 'Boxing', url: BASE + 'boxing/shoes.html' },
    { title: 'Ringside Diablo Boxing Shoes', sub: 'Boxing Shoes — Budget', tag: 'Product', url: BASE + 'boxing/shoes.html' },
    { title: 'Everlast PIVT Low Top Boxing Shoes', sub: 'Boxing Shoes — Budget', tag: 'Product', url: BASE + 'boxing/shoes.html' },
    { title: 'Adidas Box Hog 4 Boxing Shoes', sub: 'Boxing Shoes — Best Value', tag: 'Product', url: BASE + 'boxing/shoes.html' },
    { title: 'Everlast Elite High Top Boxing Shoes', sub: 'Boxing Shoes — Best Value', tag: 'Product', url: BASE + 'boxing/shoes.html' },
    { title: 'Nike HyperKO 2 Boxing Shoes', sub: 'Boxing Shoes — Premium', tag: 'Product', url: BASE + 'boxing/shoes.html' },
    { title: 'Hayabusa Pro Leather Boxing Shoes', sub: 'Boxing Shoes — Premium', tag: 'Product', url: BASE + 'boxing/shoes.html' },
    { title: 'Headgear', sub: 'Budget · Best Value · Premium', tag: 'Boxing', url: BASE + 'boxing/headgear.html' },
    { title: 'Venum Challenger 2.0 Headgear', sub: 'Headgear — Budget', tag: 'Product', url: BASE + 'boxing/headgear.html' },
    { title: 'RDX Headgear with Removable Face Grill', sub: 'Headgear — Budget', tag: 'Product', url: BASE + 'boxing/headgear.html' },
    { title: 'Ringside Competition-Like Headgear with Cheeks', sub: 'Headgear — Best Value', tag: 'Product', url: BASE + 'boxing/headgear.html' },
    { title: 'Venum Elite Headgear', sub: 'Headgear — Best Value', tag: 'Product', url: BASE + 'boxing/headgear.html' },
    { title: 'Hayabusa T3 Boxing Headgear', sub: 'Headgear — Premium', tag: 'Product', url: BASE + 'boxing/headgear.html' },
    { title: 'Hayabusa Pro Leather Headgear', sub: 'Headgear — Premium', tag: 'Product', url: BASE + 'boxing/headgear.html' },
    { title: 'Speed Bags', sub: 'Budget · Best Value · Premium', tag: 'Boxing', url: BASE + 'boxing/speed-bags.html' },
    { title: 'Everlast Everhide Speed Bag', sub: 'Speed Bags — Budget', tag: 'Product', url: BASE + 'boxing/speed-bags.html' },
    { title: 'Contender Fight Sports Speed Bag', sub: 'Speed Bags — Budget', tag: 'Product', url: BASE + 'boxing/speed-bags.html' },
    { title: 'Title Boxing Gyro Balanced Speed Bag', sub: 'Speed Bags — Best Value', tag: 'Product', url: BASE + 'boxing/speed-bags.html' },
    { title: 'Ringside Heritage Speed Bag', sub: 'Speed Bags — Best Value', tag: 'Product', url: BASE + 'boxing/speed-bags.html' },
    { title: 'Everlast Elite Speed Bag', sub: 'Speed Bags — Premium', tag: 'Product', url: BASE + 'boxing/speed-bags.html' },
    { title: 'Cleto Reyes Leather Speed Bag', sub: 'Speed Bags — Premium', tag: 'Product', url: BASE + 'boxing/speed-bags.html' },
    // Swimming
    { title: 'Swimming Hub', sub: 'All swimming categories', tag: 'Swimming', url: BASE + 'swimming/' },
    { title: 'Goggles', sub: 'Budget · Best Value · Premium', tag: 'Swimming', url: BASE + 'swimming/goggles.html' },
    { title: 'Speedo Vanquisher 2.0', sub: 'Goggles — Budget', tag: 'Product', url: BASE + 'swimming/goggles.html' },
    { title: 'FINIS Bolt Goggle', sub: 'Goggles — Budget', tag: 'Product', url: BASE + 'swimming/goggles.html' },
    { title: 'TYR Socket Rockets 2.0', sub: 'Goggles — Best Value', tag: 'Product', url: BASE + 'swimming/goggles.html' },
    { title: 'Aqua Sphere Vista', sub: 'Goggles — Best Value', tag: 'Product', url: BASE + 'swimming/goggles.html' },
    { title: 'Arena Cobra Ultra Swipe', sub: 'Goggles — Premium', tag: 'Product', url: BASE + 'swimming/goggles.html' },
    { title: 'Speedo Fastskin Pure Focus', sub: 'Goggles — Premium', tag: 'Product', url: BASE + 'swimming/goggles.html' },
    { title: 'Swimsuits', sub: 'Budget · Best Value · Premium', tag: 'Swimming', url: BASE + 'swimming/suits.html' },
    { title: 'Speedo Endurance+ One Piece', sub: 'Swimsuits — Budget', tag: 'Product', url: BASE + 'swimming/suits.html' },
    { title: 'TYR Durafast One Diamondfit', sub: 'Swimsuits — Budget', tag: 'Product', url: BASE + 'swimming/suits.html' },
    { title: 'Speedo Flyback Training Suit', sub: 'Swimsuits — Best Value', tag: 'Product', url: BASE + 'swimming/suits.html' },
    { title: 'Speedo Endurance+ Jammer', sub: 'Swimsuits — Best Value', tag: 'Product', url: BASE + 'swimming/suits.html' },
    { title: 'Arena Powerskin Carbon-Flex VX', sub: 'Swimsuits — Premium', tag: 'Product', url: BASE + 'swimming/suits.html' },
    { title: 'Speedo LZR Racer X Jammer', sub: 'Swimsuits — Premium', tag: 'Product', url: BASE + 'swimming/suits.html' },
    { title: 'Swim Caps', sub: 'Budget · Best Value · Premium', tag: 'Swimming', url: BASE + 'swimming/caps.html' },
    { title: 'Speedo Silicone Swim Cap', sub: 'Swim Caps — Budget', tag: 'Product', url: BASE + 'swimming/caps.html' },
    { title: 'Arena Classic Silicone Cap', sub: 'Swim Caps — Budget', tag: 'Product', url: BASE + 'swimming/caps.html' },
    { title: 'Speedo Long Hair Swim Cap', sub: 'Swim Caps — Best Value', tag: 'Product', url: BASE + 'swimming/caps.html' },
    { title: 'FINIS Neoprene Swim Cap', sub: 'Swim Caps — Best Value', tag: 'Product', url: BASE + 'swimming/caps.html' },
    { title: 'Speedo Fastskin Racing Cap', sub: 'Swim Caps — Premium', tag: 'Product', url: BASE + 'swimming/caps.html' },
    { title: 'Arena Powerskin Racing Cap', sub: 'Swim Caps — Premium', tag: 'Product', url: BASE + 'swimming/caps.html' },
    { title: 'Fins & Flippers', sub: 'Budget · Best Value · Premium', tag: 'Swimming', url: BASE + 'swimming/fins.html' },
    { title: 'Speedo Short Training Fin', sub: 'Fins & Flippers — Budget', tag: 'Product', url: BASE + 'swimming/fins.html' },
    { title: 'TYR Crossblade Fin', sub: 'Fins & Flippers — Budget', tag: 'Product', url: BASE + 'swimming/fins.html' },
    { title: 'FINIS Zoomers Gold', sub: 'Fins & Flippers — Best Value', tag: 'Product', url: BASE + 'swimming/fins.html' },
    { title: 'Speedo Biofuse Fin', sub: 'Fins & Flippers — Best Value', tag: 'Product', url: BASE + 'swimming/fins.html' },
    { title: 'Arena Powerfin Pro', sub: 'Fins & Flippers — Premium', tag: 'Product', url: BASE + 'swimming/fins.html' },
    { title: 'FINIS Long Floating Fin', sub: 'Fins & Flippers — Premium', tag: 'Product', url: BASE + 'swimming/fins.html' },
    { title: 'Training Aids', sub: 'Budget · Best Value · Premium', tag: 'Swimming', url: BASE + 'swimming/training-aids.html' },
    { title: 'Speedo Kickboard', sub: 'Training Aids — Budget', tag: 'Product', url: BASE + 'swimming/training-aids.html' },
    { title: 'Speedo Pull Buoy', sub: 'Training Aids — Budget', tag: 'Product', url: BASE + 'swimming/training-aids.html' },
    { title: 'FINIS Alignment Kickboard', sub: 'Training Aids — Best Value', tag: 'Product', url: BASE + 'swimming/training-aids.html' },
    { title: 'TYR Pull Float', sub: 'Training Aids — Best Value', tag: 'Product', url: BASE + 'swimming/training-aids.html' },
    { title: 'Speedo Power Paddle', sub: 'Training Aids — Premium', tag: 'Product', url: BASE + 'swimming/training-aids.html' },
    { title: 'Arena Training Bundle', sub: 'Training Aids — Premium', tag: 'Product', url: BASE + 'swimming/training-aids.html' },
    { title: 'Swim Bags', sub: 'Budget · Best Value · Premium', tag: 'Swimming', url: BASE + 'swimming/bags.html' },
    { title: 'Speedo Mesh Bag', sub: 'Swim Bags — Budget', tag: 'Product', url: BASE + 'swimming/bags.html' },
    { title: 'Arena Mesh Bag', sub: 'Swim Bags — Budget', tag: 'Product', url: BASE + 'swimming/bags.html' },
    { title: 'Speedo Teamster 35L', sub: 'Swim Bags — Best Value', tag: 'Product', url: BASE + 'swimming/bags.html' },
    { title: 'Arena Spiky 3 Backpack', sub: 'Swim Bags — Best Value', tag: 'Product', url: BASE + 'swimming/bags.html' },
    { title: 'Speedo Teamster 2.0 50L', sub: 'Swim Bags — Premium', tag: 'Product', url: BASE + 'swimming/bags.html' },
    { title: 'TYR Alliance Team Backpack', sub: 'Swim Bags — Premium', tag: 'Product', url: BASE + 'swimming/bags.html' },
    // Football
    { title: 'Football Hub', sub: 'All football categories', tag: 'Football', url: BASE + 'football/' },
    { title: 'Boots', sub: 'Budget · Best Value · Premium', tag: 'Football', url: BASE + 'football/boots.html' },
    { title: 'adidas Goletto VIII FG', sub: 'Boots — Budget', tag: 'Product', url: BASE + 'football/boots.html' },
    { title: 'PUMA Tacto II TT', sub: 'Boots — Budget', tag: 'Product', url: BASE + 'football/boots.html' },
    { title: 'Nike Tiempo Legend 10 Club FG', sub: 'Boots — Best Value', tag: 'Product', url: BASE + 'football/boots.html' },
    { title: 'adidas Predator Club FG', sub: 'Boots — Best Value', tag: 'Product', url: BASE + 'football/boots.html' },
    { title: 'Nike Phantom GX 2 Elite FG', sub: 'Boots — Premium', tag: 'Product', url: BASE + 'football/boots.html' },
    { title: 'adidas Predator Elite FG', sub: 'Boots — Premium', tag: 'Product', url: BASE + 'football/boots.html' },
    { title: 'Footballs', sub: 'Budget · Best Value · Premium', tag: 'Football', url: BASE + 'football/balls.html' },
    { title: 'adidas Starlancer', sub: 'Footballs — Budget', tag: 'Product', url: BASE + 'football/balls.html' },
    { title: 'Wilson NCAA Forte Fybrid II', sub: 'Footballs — Budget', tag: 'Product', url: BASE + 'football/balls.html' },
    { title: 'Nike Academy Team', sub: 'Footballs — Best Value', tag: 'Product', url: BASE + 'football/balls.html' },
    { title: 'adidas MLS Competition', sub: 'Footballs — Best Value', tag: 'Product', url: BASE + 'football/balls.html' },
    { title: 'Nike Flight', sub: 'Footballs — Premium', tag: 'Product', url: BASE + 'football/balls.html' },
    { title: 'adidas UCL Pro', sub: 'Footballs — Premium', tag: 'Product', url: BASE + 'football/balls.html' },
    { title: 'Shin Guards', sub: 'Budget · Best Value · Premium', tag: 'Football', url: BASE + 'football/shin-guards.html' },
    { title: 'Vizari Malaga', sub: 'Shin Guards — Budget', tag: 'Product', url: BASE + 'football/shin-guards.html' },
    { title: 'Nike Charge', sub: 'Shin Guards — Budget', tag: 'Product', url: BASE + 'football/shin-guards.html' },
    { title: 'Nike Mercurial Lite', sub: 'Shin Guards — Best Value', tag: 'Product', url: BASE + 'football/shin-guards.html' },
    { title: 'adidas Predator Match', sub: 'Shin Guards — Best Value', tag: 'Product', url: BASE + 'football/shin-guards.html' },
    { title: 'Storelli BodyShield', sub: 'Shin Guards — Premium', tag: 'Product', url: BASE + 'football/shin-guards.html' },
    { title: 'G-Form Pro-S Elite 2', sub: 'Shin Guards — Premium', tag: 'Product', url: BASE + 'football/shin-guards.html' },
    { title: 'Goalkeeper Gloves', sub: 'Budget · Best Value · Premium', tag: 'Football', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'adidas Predator Training', sub: 'Goalkeeper Gloves — Budget', tag: 'Product', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'Nike Match', sub: 'Goalkeeper Gloves — Budget', tag: 'Product', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'Reusch Attrakt Grip', sub: 'Goalkeeper Gloves — Best Value', tag: 'Product', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'adidas Predator Match', sub: 'Goalkeeper Gloves — Best Value', tag: 'Product', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'Nike Vapor Grip3', sub: 'Goalkeeper Gloves — Premium', tag: 'Product', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'Reusch Attrakt Gold X', sub: 'Goalkeeper Gloves — Premium', tag: 'Product', url: BASE + 'football/goalkeeper-gloves.html' },
    { title: 'Jerseys', sub: 'Budget · Best Value · Premium', tag: 'Football', url: BASE + 'football/jerseys.html' },
    { title: 'adidas Entrada 22', sub: 'Jerseys — Budget', tag: 'Product', url: BASE + 'football/jerseys.html' },
    { title: 'Nike Park VII', sub: 'Jerseys — Budget', tag: 'Product', url: BASE + 'football/jerseys.html' },
    { title: 'adidas Tiro 24', sub: 'Jerseys — Best Value', tag: 'Product', url: BASE + 'football/jerseys.html' },
    { title: 'Nike Dri-FIT Stadium', sub: 'Jerseys — Best Value', tag: 'Product', url: BASE + 'football/jerseys.html' },
    { title: 'Nike Dri-FIT ADV Match', sub: 'Jerseys — Premium', tag: 'Product', url: BASE + 'football/jerseys.html' },
    { title: 'adidas Authentic Player', sub: 'Jerseys — Premium', tag: 'Product', url: BASE + 'football/jerseys.html' },
    { title: 'Socks & Grip Socks', sub: 'Budget · Best Value · Premium', tag: 'Football', url: BASE + 'football/socks.html' },
    { title: 'adidas Formotion Cushioned', sub: 'Socks & Grip Socks — Budget', tag: 'Product', url: BASE + 'football/socks.html' },
    { title: 'Nike Academy OTC', sub: 'Socks & Grip Socks — Budget', tag: 'Product', url: BASE + 'football/socks.html' },
    { title: 'Tapedesign Allround Classic', sub: 'Socks & Grip Socks — Best Value', tag: 'Product', url: BASE + 'football/socks.html' },
    { title: 'Nike Strike', sub: 'Socks & Grip Socks — Best Value', tag: 'Product', url: BASE + 'football/socks.html' },
    { title: 'SOXPro Classic Grip', sub: 'Socks & Grip Socks — Premium', tag: 'Product', url: BASE + 'football/socks.html' },
    { title: 'Trusox 3.0 Mid-Calf', sub: 'Socks & Grip Socks — Premium', tag: 'Product', url: BASE + 'football/socks.html' }
  ];

  // ── DOM ──────────────────────────────────────────────────
  var overlay, input, resultsList;
  var highlighted = -1;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="search-box">' +
        '<div class="search-input-row">' +
          '<svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 14.5L19 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          '<input type="text" placeholder="Search products, categories…" autocomplete="off" spellcheck="false" />' +
          '<button class="search-esc" aria-label="Close search">ESC</button>' +
        '</div>' +
        '<hr class="search-divider">' +
        '<div class="search-results"><p class="search-hint">Type to search 217 products across 36 categories</p></div>' +
      '</div>';
    document.body.appendChild(overlay);

    input = overlay.querySelector('input');
    resultsList = overlay.querySelector('.search-results');

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKey);
    overlay.querySelector('.search-esc').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  }

  function onInput() {
    var q = input.value.trim().toLowerCase();
    highlighted = -1;
    if (!q) {
      resultsList.innerHTML = '<p class="search-hint">Type to search 217 products across 36 categories</p>';
      return;
    }
    var matches = INDEX.filter(function (item) {
      return item.title.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q);
    }).slice(0, 12);

    if (!matches.length) {
      resultsList.innerHTML = '<p class="search-empty">No results for "<strong>' + esc(input.value) + '</strong>"</p>';
      return;
    }
    resultsList.innerHTML = matches.map(function (item, i) {
      var isProduct = item.tag === 'Product';
      return '<a class="search-result" href="' + item.url + '" data-idx="' + i + '">' +
        '<span class="sr-tag' + (isProduct ? ' tag-product' : '') + '">' + esc(item.tag) + '</span>' +
        '<span class="sr-info"><span class="sr-title">' + esc(item.title) + '</span><span class="sr-sub">' + esc(item.sub) + '</span></span>' +
        '</a>';
    }).join('');
  }

  function onKey(e) {
    var items = resultsList.querySelectorAll('.search-result');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlighted = Math.min(highlighted + 1, items.length - 1);
      updateHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
      updateHighlight(items);
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      items[highlighted].click();
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  }

  function updateHighlight(items) {
    items.forEach(function (el, i) { el.classList.toggle('highlighted', i === highlighted); });
    if (items[highlighted]) items[highlighted].scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    overlay.classList.add('open');
    input.value = '';
    resultsList.innerHTML = '<p class="search-hint">Type to search 217 products across 36 categories</p>';
    highlighted = -1;
    setTimeout(function () { input.focus(); }, 50);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── INIT ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    buildOverlay();

    // Wire up search button(s)
    document.querySelectorAll('.nav-search-btn').forEach(function (btn) {
      btn.addEventListener('click', openSearch);
    });

    // Global keyboard shortcut: / or Ctrl+K
    document.addEventListener('keydown', function (e) {
      if (overlay.classList.contains('open')) return;
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        openSearch();
      }
    });
  });
})();
