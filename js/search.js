(function () {
  var BASE = '/';

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
    { title: 'ASICS Club Polo Shirt', sub: 'Shirts — Budget', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Nike Dri-FIT Advantage Polo', sub: 'Shirts — Best Value', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Adidas Club Tennis Polo', sub: 'Shirts — Best Value', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Lacoste Ultra-Dry Polo', sub: 'Shirts — Premium', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'lululemon Metal Vent Tech Polo', sub: 'Shirts — Premium', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    // ── Shorts products
    { title: 'Nike Dri-FIT Training Shorts 7"', sub: 'Shorts — Budget', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Adidas Club Tennis Shorts', sub: 'Shorts — Best Value', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Court Dri-FIT Advantage Shorts', sub: 'Shorts — Best Value', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'lululemon Pace Breaker Short 7"', sub: 'Shorts — Premium', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Court Flex Ace Shorts', sub: 'Shorts — Premium', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    // ── Skirt products
    { title: 'Wilson Team Tennis Skirt', sub: 'Skirts — Budget', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Nike Court Dri-FIT Victory Skirt', sub: 'Skirts — Best Value', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Adidas Match Tennis Skirt', sub: 'Skirts — Best Value', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'lululemon Pace Rival Skirt', sub: 'Skirts — Premium', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Nike Court Dri-FIT Advantage Pleated Skirt', sub: 'Skirts — Premium', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    // ── Sock products
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
    { title: 'Trusox 3.0 Mid-Calf', sub: 'Socks & Grip Socks — Premium', tag: 'Product', url: BASE + 'football/socks.html' },

    // Volleyball
    { title: 'Volleyball Hub', sub: 'All volleyball categories', tag: 'Volleyball', url: BASE + 'volleyball/' },
    { title: 'Volleyballs', sub: 'Budget · Best Value · Premium', tag: 'Volleyball', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Tachikara SV-5WSC', sub: 'Volleyballs — Budget', tag: 'Product', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Wilson AVP Official Beach', sub: 'Volleyballs — Budget', tag: 'Product', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Mikasa VQ2000 Micro Cell', sub: 'Volleyballs — Best Value', tag: 'Product', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Molten V5M5000 FLISTATEC', sub: 'Volleyballs — Best Value', tag: 'Product', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Molten Super Touch IV58L', sub: 'Volleyballs — Premium', tag: 'Product', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Mikasa V200W', sub: 'Volleyballs — Premium', tag: 'Product', url: BASE + 'volleyball/volleyballs.html' },
    { title: 'Volleyball Shoes', sub: 'Budget · Best Value · Premium', tag: 'Volleyball', url: BASE + 'volleyball/shoes.html' },
    { title: 'ASICS Upcourt 5 (Men’s)', sub: 'Volleyball Shoes — Budget', tag: 'Product', url: BASE + 'volleyball/shoes.html' },
    { title: 'ASICS Upcourt 5 (Women’s)', sub: 'Volleyball Shoes — Budget', tag: 'Product', url: BASE + 'volleyball/shoes.html' },
    { title: 'ASICS Gel-Rocket 11', sub: 'Volleyball Shoes — Best Value', tag: 'Product', url: BASE + 'volleyball/shoes.html' },
    { title: 'Nike Zoom HyperSpeed Court', sub: 'Volleyball Shoes — Best Value', tag: 'Product', url: BASE + 'volleyball/shoes.html' },
    { title: 'Mizuno Wave Lightning Z8', sub: 'Volleyball Shoes — Premium', tag: 'Product', url: BASE + 'volleyball/shoes.html' },
    { title: 'ASICS Sky Elite FF 3', sub: 'Volleyball Shoes — Premium', tag: 'Product', url: BASE + 'volleyball/shoes.html' },
    { title: 'Knee Pads', sub: 'Budget · Best Value · Premium', tag: 'Volleyball', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'ASICS Ace Low Profile', sub: 'Knee Pads — Budget', tag: 'Product', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'Mizuno T10 Plus', sub: 'Knee Pads — Budget', tag: 'Product', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'ASICS Gel-Conform II', sub: 'Knee Pads — Best Value', tag: 'Product', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'Nike Streak', sub: 'Knee Pads — Best Value', tag: 'Product', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'Mizuno LR6', sub: 'Knee Pads — Premium', tag: 'Product', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'Mizuno VS-1', sub: 'Knee Pads — Premium', tag: 'Product', url: BASE + 'volleyball/knee-pads.html' },
    { title: 'Ankle Braces', sub: 'Budget · Best Value · Premium', tag: 'Volleyball', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'McDavid Lace-Up Ankle Brace', sub: 'Ankle Braces — Budget', tag: 'Product', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'McDavid 195 Ultralight', sub: 'Ankle Braces — Budget', tag: 'Product', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'ASO Ankle Stabilizing Orthosis', sub: 'Ankle Braces — Best Value', tag: 'Product', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'Active Ankle T2', sub: 'Ankle Braces — Best Value', tag: 'Product', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'Ultra Zoom', sub: 'Ankle Braces — Premium', tag: 'Product', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'Zamst A2-DX', sub: 'Ankle Braces — Premium', tag: 'Product', url: BASE + 'volleyball/ankle-braces.html' },
    { title: 'Nets & Systems', sub: 'Budget · Best Value · Premium', tag: 'Volleyball', url: BASE + 'volleyball/nets.html' },
    { title: 'Baden Champions Net Set', sub: 'Nets & Systems — Budget', tag: 'Product', url: BASE + 'volleyball/nets.html' },
    { title: 'Park & Sun Tournament 179', sub: 'Nets & Systems — Budget', tag: 'Product', url: BASE + 'volleyball/nets.html' },
    { title: 'Park & Sun Spectrum Classic', sub: 'Nets & Systems — Best Value', tag: 'Product', url: BASE + 'volleyball/nets.html' },
    { title: 'Park & Sun Spiker Flex', sub: 'Nets & Systems — Best Value', tag: 'Product', url: BASE + 'volleyball/nets.html' },
    { title: 'Park & Sun Tournament Flex 1000', sub: 'Nets & Systems — Premium', tag: 'Product', url: BASE + 'volleyball/nets.html' },
    { title: 'Park & Sun Spectrum 2000', sub: 'Nets & Systems — Premium', tag: 'Product', url: BASE + 'volleyball/nets.html' },
    { title: 'Volleyball Training Aids', sub: 'Budget · Best Value · Premium', tag: 'Volleyball', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Tandem Volleyball Pal', sub: 'Training Aids — Budget', tag: 'Product', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Tandem Pass Rite', sub: 'Training Aids — Budget', tag: 'Product', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Tandem Spike Pal', sub: 'Training Aids — Best Value', tag: 'Product', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Tandem Net Extender', sub: 'Training Aids — Best Value', tag: 'Product', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Tandem Spike Trainer', sub: 'Training Aids — Premium', tag: 'Product', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Tandem Collapsible Spike Trainer', sub: 'Training Aids — Premium', tag: 'Product', url: BASE + 'volleyball/training-aids.html' },
    { title: 'Pickleball Hub', sub: 'All pickleball categories', tag: 'Pickleball', url: BASE + 'pickleball/' },
    { title: 'Pickleball Paddles', sub: 'Budget · Best Value · Premium', tag: 'Pickleball', url: BASE + 'pickleball/paddles.html' },
    { title: 'Niupipo Graphite Pickleball Paddle', sub: 'Paddles — Budget', tag: 'Product', url: BASE + 'pickleball/paddles.html' },
    { title: 'Amazin\' Aces Signature Graphite Paddle', sub: 'Paddles — Budget', tag: 'Product', url: BASE + 'pickleball/paddles.html' },
    { title: 'ONIX Graphite Z5', sub: 'Paddles — Best Value', tag: 'Product', url: BASE + 'pickleball/paddles.html' },
    { title: 'Selkirk SLK Evo Hybrid 2.0', sub: 'Paddles — Best Value', tag: 'Product', url: BASE + 'pickleball/paddles.html' },
    { title: 'JOOLA Ben Johns Hyperion CFS 16', sub: 'Paddles — Premium', tag: 'Product', url: BASE + 'pickleball/paddles.html' },
    { title: 'Selkirk Vanguard Power Air Invikta', sub: 'Paddles — Premium', tag: 'Product', url: BASE + 'pickleball/paddles.html' },
    { title: 'Pickleball Balls', sub: 'Budget · Best Value · Premium', tag: 'Pickleball', url: BASE + 'pickleball/balls.html' },
    { title: 'Franklin Sports X-40 Outdoor Pickleballs', sub: 'Balls — Budget', tag: 'Product', url: BASE + 'pickleball/balls.html' },
    { title: 'ONIX Fuse G2 Outdoor Pickleballs', sub: 'Balls — Budget', tag: 'Product', url: BASE + 'pickleball/balls.html' },
    { title: 'Dura Fast 40 Outdoor Pickleballs', sub: 'Balls — Best Value', tag: 'Product', url: BASE + 'pickleball/balls.html' },
    { title: 'ONIX Fuse Indoor Pickleballs', sub: 'Balls — Best Value', tag: 'Product', url: BASE + 'pickleball/balls.html' },
    { title: 'Franklin X-26 Indoor Pickleballs', sub: 'Balls — Premium', tag: 'Product', url: BASE + 'pickleball/balls.html' },
    { title: 'GAMMA Photon Indoor Pickleballs', sub: 'Balls — Premium', tag: 'Product', url: BASE + 'pickleball/balls.html' },
    { title: 'Pickleball Shoes', sub: 'Budget · Best Value · Premium', tag: 'Pickleball', url: BASE + 'pickleball/shoes.html' },
    { title: 'FILA Volley Zone Pickleball Shoe', sub: 'Shoes — Budget', tag: 'Product', url: BASE + 'pickleball/shoes.html' },
    { title: 'Skechers Viper Court', sub: 'Shoes — Budget', tag: 'Product', url: BASE + 'pickleball/shoes.html' },
    { title: 'K-Swiss Express Light Pickleball', sub: 'Shoes — Best Value', tag: 'Product', url: BASE + 'pickleball/shoes.html' },
    { title: 'Skechers Viper Court Pro 2.0', sub: 'Shoes — Best Value', tag: 'Product', url: BASE + 'pickleball/shoes.html' },
    { title: 'ASICS Gel-Resolution X', sub: 'Shoes — Premium', tag: 'Product', url: BASE + 'pickleball/shoes.html' },
    { title: 'K-Swiss Hypercourt Express 2', sub: 'Shoes — Premium', tag: 'Product', url: BASE + 'pickleball/shoes.html' },
    { title: 'Pickleball Nets', sub: 'Budget · Best Value · Premium', tag: 'Pickleball', url: BASE + 'pickleball/nets.html' },
    { title: 'A11N Portable Pickleball Net System', sub: 'Nets — Budget', tag: 'Product', url: BASE + 'pickleball/nets.html' },
    { title: 'Boulder Portable Pickleball Net', sub: 'Nets — Budget', tag: 'Product', url: BASE + 'pickleball/nets.html' },
    { title: 'Franklin Sports Portable Pickleball Net', sub: 'Nets — Best Value', tag: 'Product', url: BASE + 'pickleball/nets.html' },
    { title: 'Rally Portable Pickleball Net', sub: 'Nets — Best Value', tag: 'Product', url: BASE + 'pickleball/nets.html' },
    { title: 'ONIX Portable Pickleball Net', sub: 'Nets — Premium', tag: 'Product', url: BASE + 'pickleball/nets.html' },
    { title: 'Franklin X-26 Portable Pickleball Net', sub: 'Nets — Premium', tag: 'Product', url: BASE + 'pickleball/nets.html' },
    { title: 'Pickleball Bags', sub: 'Budget · Best Value · Premium', tag: 'Pickleball', url: BASE + 'pickleball/bags.html' },
    { title: 'Athletico Pickleball Paddle Bag', sub: 'Bags — Budget', tag: 'Product', url: BASE + 'pickleball/bags.html' },
    { title: 'Franklin Sports Pickleball Paddle Bag', sub: 'Bags — Budget', tag: 'Product', url: BASE + 'pickleball/bags.html' },
    { title: 'JOOLA Tour Elite Pickleball Bag', sub: 'Bags — Best Value', tag: 'Product', url: BASE + 'pickleball/bags.html' },
    { title: 'Selkirk Core Series Team Backpack', sub: 'Bags — Best Value', tag: 'Product', url: BASE + 'pickleball/bags.html' },
    { title: 'JOOLA Vision Pickleball Backpack', sub: 'Bags — Premium', tag: 'Product', url: BASE + 'pickleball/bags.html' },
    { title: 'Selkirk Pro Line Tour Bag', sub: 'Bags — Premium', tag: 'Product', url: BASE + 'pickleball/bags.html' },
    { title: 'Pickleball Grips & Covers', sub: 'Budget · Best Value · Premium', tag: 'Pickleball', url: BASE + 'pickleball/grips.html' },
    { title: 'Tourna Grip Original Overgrip', sub: 'Grips & Covers — Budget', tag: 'Product', url: BASE + 'pickleball/grips.html' },
    { title: 'GAMMA Supreme Overgrip', sub: 'Grips & Covers — Budget', tag: 'Product', url: BASE + 'pickleball/grips.html' },
    { title: 'HEAD Xtremesoft Overgrip', sub: 'Grips & Covers — Best Value', tag: 'Product', url: BASE + 'pickleball/grips.html' },
    { title: 'Wilson Pro Overgrip', sub: 'Grips & Covers — Best Value', tag: 'Product', url: BASE + 'pickleball/grips.html' },
    { title: 'Franklin Sports Pickleball Paddle Cover', sub: 'Grips & Covers — Premium', tag: 'Product', url: BASE + 'pickleball/grips.html' },
    { title: 'ONIX Pickleball Paddle Cover', sub: 'Grips & Covers — Premium', tag: 'Product', url: BASE + 'pickleball/grips.html' },
    { title: 'Ping Pong Hub', sub: 'All ping pong categories', tag: 'Ping Pong', url: BASE + 'ping-pong/' },
    { title: 'Ping Pong Paddles', sub: 'Budget · Best Value · Premium', tag: 'Ping Pong', url: BASE + 'ping-pong/paddles.html' },
    { title: 'PRO-SPIN Carbon Fibre Ping Pong Paddle', sub: 'Ping Pong Paddles — Budget', tag: 'Product', url: BASE + 'ping-pong/paddles.html' },
    { title: 'Idoraz Professional Ping Pong Paddle', sub: 'Ping Pong Paddles — Budget', tag: 'Product', url: BASE + 'ping-pong/paddles.html' },
    { title: 'Killerspin Jet 600 Spin N2', sub: 'Ping Pong Paddles — Best Value', tag: 'Product', url: BASE + 'ping-pong/paddles.html' },
    { title: 'JOOLA Match Pro', sub: 'Ping Pong Paddles — Best Value', tag: 'Product', url: BASE + 'ping-pong/paddles.html' },
    { title: 'JOOLA Infinity Overdrive', sub: 'Ping Pong Paddles — Premium', tag: 'Product', url: BASE + 'ping-pong/paddles.html' },
    { title: 'STIGA Pro Carbon Blast', sub: 'Ping Pong Paddles — Premium', tag: 'Product', url: BASE + 'ping-pong/paddles.html' },
    { title: 'Ping Pong Balls', sub: 'Budget · Best Value · Premium', tag: 'Ping Pong', url: BASE + 'ping-pong/balls.html' },
    { title: 'KEVENZ 3-Star 40+ Table Tennis Balls', sub: 'Ping Pong Balls — Budget', tag: 'Product', url: BASE + 'ping-pong/balls.html' },
    { title: 'MAPOL 100-Count 3-Star Orange Balls', sub: 'Ping Pong Balls — Budget', tag: 'Product', url: BASE + 'ping-pong/balls.html' },
    { title: 'PRO-SPIN High-Performance 40+ Balls', sub: 'Ping Pong Balls — Best Value', tag: 'Product', url: BASE + 'ping-pong/balls.html' },
    { title: 'STIGA 3-Star Table Tennis Balls', sub: 'Ping Pong Balls — Best Value', tag: 'Product', url: BASE + 'ping-pong/balls.html' },
    { title: 'Nittaku 3-Star Premium Balls', sub: 'Ping Pong Balls — Premium', tag: 'Product', url: BASE + 'ping-pong/balls.html' },
    { title: 'DHS D40+ 3-Star ITTF Balls', sub: 'Ping Pong Balls — Premium', tag: 'Product', url: BASE + 'ping-pong/balls.html' },
    { title: 'Nets & Posts', sub: 'Budget · Best Value · Premium', tag: 'Ping Pong', url: BASE + 'ping-pong/nets.html' },
    { title: 'Sportout Retractable Ping Pong Net', sub: 'Nets & Posts — Budget', tag: 'Product', url: BASE + 'ping-pong/nets.html' },
    { title: 'Comesee Ping Pong Net and Post Set', sub: 'Nets & Posts — Budget', tag: 'Product', url: BASE + 'ping-pong/nets.html' },
    { title: 'PRO-SPIN Retractable Ping Pong Net', sub: 'Nets & Posts — Best Value', tag: 'Product', url: BASE + 'ping-pong/nets.html' },
    { title: 'JOOLA Retractable Ping Pong Net', sub: 'Nets & Posts — Best Value', tag: 'Product', url: BASE + 'ping-pong/nets.html' },
    { title: 'JOOLA Professional WX Aluminium Net Set', sub: 'Nets & Posts — Premium', tag: 'Product', url: BASE + 'ping-pong/nets.html' },
    { title: 'STIGA Premium Clipper Net and Post Set', sub: 'Nets & Posts — Premium', tag: 'Product', url: BASE + 'ping-pong/nets.html' },
    { title: 'Paddle Sets', sub: 'Budget · Best Value · Premium', tag: 'Ping Pong', url: BASE + 'ping-pong/sets.html' },
    { title: 'Glymnis Ping Pong Paddle Set of 4', sub: 'Paddle Sets — Budget', tag: 'Product', url: BASE + 'ping-pong/sets.html' },
    { title: 'Franklin Sports Table Tennis to Go', sub: 'Paddle Sets — Budget', tag: 'Product', url: BASE + 'ping-pong/sets.html' },
    { title: 'STIGA All-in-One Retractable Net Set', sub: 'Paddle Sets — Best Value', tag: 'Product', url: BASE + 'ping-pong/sets.html' },
    { title: 'FBSPORT Ping Pong Set with Retractable Net', sub: 'Paddle Sets — Best Value', tag: 'Product', url: BASE + 'ping-pong/sets.html' },
    { title: 'PRO-SPIN Portable Ping Pong Set', sub: 'Paddle Sets — Premium', tag: 'Product', url: BASE + 'ping-pong/sets.html' },
    { title: 'JOOLA Family Premium Paddle Set of 4', sub: 'Paddle Sets — Premium', tag: 'Product', url: BASE + 'ping-pong/sets.html' },
    { title: 'Training Aids', sub: 'Budget · Best Value · Premium', tag: 'Ping Pong', url: BASE + 'ping-pong/training.html' },
    { title: 'JOOLA iPong Carbon Fibre Ball Catch Net', sub: 'Training Aids — Budget', tag: 'Product', url: BASE + 'ping-pong/training.html' },
    { title: 'Retractable Ping Pong Ball Collector', sub: 'Training Aids — Budget', tag: 'Product', url: BASE + 'ping-pong/training.html' },
    { title: 'Suz S102 Wireless Remote Table Tennis Robot', sub: 'Training Aids — Best Value', tag: 'Product', url: BASE + 'ping-pong/training.html' },
    { title: 'iPong Original Table Tennis Trainer Robot', sub: 'Training Aids — Best Value', tag: 'Product', url: BASE + 'ping-pong/training.html' },
    { title: 'PONGBOT App-Control Table Tennis Robot', sub: 'Training Aids — Premium', tag: 'Product', url: BASE + 'ping-pong/training.html' },
    { title: 'Suz S201 Robot with Recycling Net', sub: 'Training Aids — Premium', tag: 'Product', url: BASE + 'ping-pong/training.html' },
    { title: 'Blades & Rubbers', sub: 'Budget · Best Value · Premium', tag: 'Ping Pong', url: BASE + 'ping-pong/custom.html' },
    { title: 'DHS Hurricane 3-NEO Table Tennis Rubber', sub: 'Blades & Rubbers — Budget', tag: 'Product', url: BASE + 'ping-pong/custom.html' },
    { title: 'Loki RXTON 1 Table Tennis Rubber', sub: 'Blades & Rubbers — Budget', tag: 'Product', url: BASE + 'ping-pong/custom.html' },
    { title: 'Butterfly SK Carbon Blade', sub: 'Blades & Rubbers — Best Value', tag: 'Product', url: BASE + 'ping-pong/custom.html' },
    { title: 'STIGA DNA Dragon Grip 55 Rubber', sub: 'Blades & Rubbers — Best Value', tag: 'Product', url: BASE + 'ping-pong/custom.html' },
    { title: 'Butterfly Dignics 05 Rubber', sub: 'Blades & Rubbers — Premium', tag: 'Product', url: BASE + 'ping-pong/custom.html' },
    { title: 'Butterfly Innerforce Layer ALC Blade', sub: 'Blades & Rubbers — Premium', tag: 'Product', url: BASE + 'ping-pong/custom.html' },
    // ── Badminton
    { title: 'Badminton Hub', sub: 'All badminton categories', tag: 'Badminton', url: BASE + 'badminton/' },
    { title: 'Badminton Rackets', sub: 'Budget · Best Value · Premium', tag: 'Badminton', url: BASE + 'badminton/rackets.html' },
    { title: 'Yonex GR 303i Badminton Racquet', sub: 'Badminton Rackets — Budget', tag: 'Product', url: BASE + 'badminton/rackets.html' },
    { title: 'Yonex Astrox Attack 9', sub: 'Badminton Rackets — Budget', tag: 'Product', url: BASE + 'badminton/rackets.html' },
    { title: 'Senston N80 Carbon Fibre Badminton Racket', sub: 'Badminton Rackets — Best Value', tag: 'Product', url: BASE + 'badminton/rackets.html' },
    { title: 'Yonex Nanoray 10F', sub: 'Badminton Rackets — Best Value', tag: 'Product', url: BASE + 'badminton/rackets.html' },
    { title: 'Yonex Astrox Smash', sub: 'Badminton Rackets — Premium', tag: 'Product', url: BASE + 'badminton/rackets.html' },
    { title: 'Yonex NanoFlare 1000 Play', sub: 'Badminton Rackets — Premium', tag: 'Product', url: BASE + 'badminton/rackets.html' },
    { title: 'Shuttlecocks', sub: 'Budget · Best Value · Premium', tag: 'Badminton', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'HIRALIY Nylon Badminton Shuttlecocks', sub: 'Shuttlecocks — Budget', tag: 'Product', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'EAGLES Nylon Badminton Birdies', sub: 'Shuttlecocks — Budget', tag: 'Product', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'Yonex Mavis 200i Nylon Shuttlecocks', sub: 'Shuttlecocks — Best Value', tag: 'Product', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'Yonex Mavis 350 Nylon Shuttlecocks', sub: 'Shuttlecocks — Best Value', tag: 'Product', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'Goose Feather Badminton Shuttlecocks (12-Pack)', sub: 'Shuttlecocks — Premium', tag: 'Product', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'Yonex Aeroclear 30 Feather Shuttlecocks', sub: 'Shuttlecocks — Premium', tag: 'Product', url: BASE + 'badminton/shuttlecocks.html' },
    { title: 'Badminton Sets', sub: 'Budget · Best Value · Premium', tag: 'Badminton', url: BASE + 'badminton/sets.html' },
    { title: 'HIRALIY Badminton Racket Set', sub: 'Badminton Sets — Budget', tag: 'Product', url: BASE + 'badminton/sets.html' },
    { title: 'Yonex GR 303 Combo Set of 2', sub: 'Badminton Sets — Budget', tag: 'Product', url: BASE + 'badminton/sets.html' },
    { title: 'Yonex ZR 100 Light Set of 2', sub: 'Badminton Sets — Best Value', tag: 'Product', url: BASE + 'badminton/sets.html' },
    { title: 'Senston 90g Badminton Set of 4', sub: 'Badminton Sets — Best Value', tag: 'Product', url: BASE + 'badminton/sets.html' },
    { title: 'Senston N80 Carbon Fibre 2-Player Set', sub: 'Badminton Sets — Premium', tag: 'Product', url: BASE + 'badminton/sets.html' },
    { title: 'Li-Ning XP Series Set of 2', sub: 'Badminton Sets — Premium', tag: 'Product', url: BASE + 'badminton/sets.html' },
    { title: 'Badminton Nets', sub: 'Budget · Best Value · Premium', tag: 'Badminton', url: BASE + 'badminton/nets.html' },
    { title: 'SONGMICS Height-Adjustable Badminton Net', sub: 'Badminton Nets — Budget', tag: 'Product', url: BASE + 'badminton/nets.html' },
    { title: 'BAGAIL Height-Adjustable Badminton Net', sub: 'Badminton Nets — Budget', tag: 'Product', url: BASE + 'badminton/nets.html' },
    { title: 'EastPoint Badminton Set with 15ft Net', sub: 'Badminton Nets — Best Value', tag: 'Product', url: BASE + 'badminton/nets.html' },
    { title: 'Boulder Portable Badminton Net', sub: 'Badminton Nets — Best Value', tag: 'Product', url: BASE + 'badminton/nets.html' },
    { title: 'Stainless Steel Portable Badminton Net Set', sub: 'Badminton Nets — Premium', tag: 'Product', url: BASE + 'badminton/nets.html' },
    { title: 'Amazon Basics Volleyball and Badminton Combo Net', sub: 'Badminton Nets — Premium', tag: 'Product', url: BASE + 'badminton/nets.html' },
    { title: 'Badminton Bags', sub: 'Budget · Best Value · Premium', tag: 'Badminton', url: BASE + 'badminton/bags.html' },
    { title: 'Yonex Badminton Racket Case AC541', sub: 'Badminton Bags — Budget', tag: 'Product', url: BASE + 'badminton/bags.html' },
    { title: 'Athletico Sling Bag', sub: 'Badminton Bags — Budget', tag: 'Product', url: BASE + 'badminton/bags.html' },
    { title: 'Athletico City Racket Bag', sub: 'Badminton Bags — Best Value', tag: 'Product', url: BASE + 'badminton/bags.html' },
    { title: 'HUNDRED Cosmogear Badminton Kit-Bag', sub: 'Badminton Bags — Best Value', tag: 'Product', url: BASE + 'badminton/bags.html' },
    { title: 'Yonex Badminton Kit-Bag', sub: 'Badminton Bags — Premium', tag: 'Product', url: BASE + 'badminton/bags.html' },
    { title: 'Wilson Super Tour 9-Pack Racket Bag', sub: 'Badminton Bags — Premium', tag: 'Product', url: BASE + 'badminton/bags.html' },
    { title: 'Strings & Grips', sub: 'Budget · Best Value · Premium', tag: 'Badminton', url: BASE + 'badminton/strings-grips.html' },
    { title: 'Pangda Racket Grip Tape (12-Pack)', sub: 'Strings & Grips — Budget', tag: 'Product', url: BASE + 'badminton/strings-grips.html' },
    { title: 'Senston Perforated Racket Overgrips', sub: 'Strings & Grips — Budget', tag: 'Product', url: BASE + 'badminton/strings-grips.html' },
    { title: 'Yonex BG65 Ti Badminton String (10m Set)', sub: 'Strings & Grips — Best Value', tag: 'Product', url: BASE + 'badminton/strings-grips.html' },
    { title: 'Yonex BG65 Badminton String 0.70mm', sub: 'Strings & Grips — Best Value', tag: 'Product', url: BASE + 'badminton/strings-grips.html' },
    { title: 'Yonex Super GRAP Overgrips (30-Pack)', sub: 'Strings & Grips — Premium', tag: 'Product', url: BASE + 'badminton/strings-grips.html' },
    { title: 'Yonex BG-65 Ti String Reel', sub: 'Strings & Grips — Premium', tag: 'Product', url: BASE + 'badminton/strings-grips.html' },
    // ── Ski
    { title: 'Ski Hub', sub: 'All ski categories', tag: 'Ski', url: BASE + 'ski/' },
    { title: 'Ski Goggles', sub: 'Budget · Best Value · Premium', tag: 'Ski', url: BASE + 'ski/goggles.html' },
    { title: 'findway Ski Goggles OTG', sub: 'Ski Goggles — Budget', tag: 'Product', url: BASE + 'ski/goggles.html' },
    { title: 'OutdoorMaster OTG Ski Goggles', sub: 'Ski Goggles — Budget', tag: 'Product', url: BASE + 'ski/goggles.html' },
    { title: 'OutdoorMaster Ski Goggles PRO', sub: 'Ski Goggles — Best Value', tag: 'Product', url: BASE + 'ski/goggles.html' },
    { title: 'ZIONOR X4 Magnetic Lens', sub: 'Ski Goggles — Best Value', tag: 'Product', url: BASE + 'ski/goggles.html' },
    { title: 'ZIONOR X11 Magnetic Cylindrical', sub: 'Ski Goggles — Premium', tag: 'Product', url: BASE + 'ski/goggles.html' },
    { title: 'Smith Squad ChromaPop', sub: 'Ski Goggles — Premium', tag: 'Product', url: BASE + 'ski/goggles.html' },
    { title: 'Ski Helmets', sub: 'Budget · Best Value · Premium', tag: 'Ski', url: BASE + 'ski/helmets.html' },
    { title: 'Retrospec Comstock', sub: 'Ski Helmets — Budget', tag: 'Product', url: BASE + 'ski/helmets.html' },
    { title: 'OutdoorMaster Kelvin II', sub: 'Ski Helmets — Budget', tag: 'Product', url: BASE + 'ski/helmets.html' },
    { title: 'OutdoorMaster Kelvin', sub: 'Ski Helmets — Best Value', tag: 'Product', url: BASE + 'ski/helmets.html' },
    { title: 'OutdoorMaster ELK MIPS', sub: 'Ski Helmets — Best Value', tag: 'Product', url: BASE + 'ski/helmets.html' },
    { title: 'Smith Holt', sub: 'Ski Helmets — Premium', tag: 'Product', url: BASE + 'ski/helmets.html' },
    { title: 'Giro Ledge', sub: 'Ski Helmets — Premium', tag: 'Product', url: BASE + 'ski/helmets.html' },
    { title: 'Ski Gloves & Mittens', sub: 'Budget · Best Value · Premium', tag: 'Ski', url: BASE + 'ski/gloves.html' },
    { title: 'ihuan Waterproof Ski Gloves', sub: 'Ski Gloves & Mittens — Budget', tag: 'Product', url: BASE + 'ski/gloves.html' },
    { title: 'Carhartt GL0910M Thermal-Lined', sub: 'Ski Gloves & Mittens — Budget', tag: 'Product', url: BASE + 'ski/gloves.html' },
    { title: 'MCTi Mens Ski Gloves', sub: 'Ski Gloves & Mittens — Best Value', tag: 'Product', url: BASE + 'ski/gloves.html' },
    { title: 'Carhartt Waterproof Insulated Knit Cuff', sub: 'Ski Gloves & Mittens — Best Value', tag: 'Product', url: BASE + 'ski/gloves.html' },
    { title: 'Gordini Gore Gauntlet Mitten', sub: 'Ski Gloves & Mittens — Premium', tag: 'Product', url: BASE + 'ski/gloves.html' },
    { title: 'Burton Gore-Tex Insulated', sub: 'Ski Gloves & Mittens — Premium', tag: 'Product', url: BASE + 'ski/gloves.html' },
    { title: 'Ski Socks', sub: 'Budget · Best Value · Premium', tag: 'Ski', url: BASE + 'ski/socks.html' },
    { title: 'WEIERYA Merino Wool Ski Socks', sub: 'Ski Socks — Budget', tag: 'Product', url: BASE + 'ski/socks.html' },
    { title: 'Smartwool Ski Full Cushion OTC', sub: 'Ski Socks — Budget', tag: 'Product', url: BASE + 'ski/socks.html' },
    { title: 'OutdoorMaster Merino Ski Socks', sub: 'Ski Socks — Best Value', tag: 'Product', url: BASE + 'ski/socks.html' },
    { title: 'Smartwool Ski Targeted Cushion OTC', sub: 'Ski Socks — Best Value', tag: 'Product', url: BASE + 'ski/socks.html' },
    { title: 'Darn Tough Yeti OTC Womens', sub: 'Ski Socks — Premium', tag: 'Product', url: BASE + 'ski/socks.html' },
    { title: 'Darn Tough Solstice OTC', sub: 'Ski Socks — Premium', tag: 'Product', url: BASE + 'ski/socks.html' },
    { title: 'Ski Bags & Boot Bags', sub: 'Budget · Best Value · Premium', tag: 'Ski', url: BASE + 'ski/bags.html' },
    { title: 'Athletico Ski and Boot Bag Combo', sub: 'Ski Bags & Boot Bags — Budget', tag: 'Product', url: BASE + 'ski/bags.html' },
    { title: 'RESVIN 65L Ski Boot Bag', sub: 'Ski Bags & Boot Bags — Budget', tag: 'Product', url: BASE + 'ski/bags.html' },
    { title: 'KEMIMOTO Ski and Boot Bag Combo', sub: 'Ski Bags & Boot Bags — Best Value', tag: 'Product', url: BASE + 'ski/bags.html' },
    { title: 'Athletico Mogul Padded Ski Bag', sub: 'Ski Bags & Boot Bags — Best Value', tag: 'Product', url: BASE + 'ski/bags.html' },
    { title: 'Athletico Ski Boot Bag', sub: 'Ski Bags & Boot Bags — Premium', tag: 'Product', url: BASE + 'ski/bags.html' },
    { title: 'Unigear Ski Boot Bag Backpack', sub: 'Ski Bags & Boot Bags — Premium', tag: 'Product', url: BASE + 'ski/bags.html' },
    { title: 'Ski Base Layers', sub: 'Budget · Best Value · Premium', tag: 'Ski', url: BASE + 'ski/base-layers.html' },
    { title: 'JZCreater Fleece-Lined Base Layer Set', sub: 'Ski Base Layers — Budget', tag: 'Product', url: BASE + 'ski/base-layers.html' },
    { title: 'HEROBIKER Fleece-Lined Base Layer', sub: 'Ski Base Layers — Budget', tag: 'Product', url: BASE + 'ski/base-layers.html' },
    { title: 'Spyder Thermal Base Layer Set', sub: 'Ski Base Layers — Best Value', tag: 'Product', url: BASE + 'ski/base-layers.html' },
    { title: 'WEERTI Thermal Base Layer Set', sub: 'Ski Base Layers — Best Value', tag: 'Product', url: BASE + 'ski/base-layers.html' },
    { title: 'Merino.tech Merino Base Layer Pants', sub: 'Ski Base Layers — Premium', tag: 'Product', url: BASE + 'ski/base-layers.html' },
    { title: 'Merino.tech Merino Base Layer Set', sub: 'Ski Base Layers — Premium', tag: 'Product', url: BASE + 'ski/base-layers.html' },
    // ── Running
    { title: 'Running Hub', sub: 'All running categories', tag: 'Running', url: BASE + 'running/' },
    { title: 'Running Shoes', sub: 'Budget · Best Value · Premium', tag: 'Running', url: BASE + 'running/shoes.html' },
    { title: 'Under Armour Charged Assert 10', sub: 'Running Shoes — Budget', tag: 'Product', url: BASE + 'running/shoes.html' },
    { title: 'ASICS Gel-Excite 11', sub: 'Running Shoes — Budget', tag: 'Product', url: BASE + 'running/shoes.html' },
    { title: 'Brooks Revel 8', sub: 'Running Shoes — Best Value', tag: 'Product', url: BASE + 'running/shoes.html' },
    { title: 'Brooks Ghost 17', sub: 'Running Shoes — Best Value', tag: 'Product', url: BASE + 'running/shoes.html' },
    { title: 'Brooks Adrenaline GTS 25', sub: 'Running Shoes — Premium', tag: 'Product', url: BASE + 'running/shoes.html' },
    { title: 'Hoka Bondi 9', sub: 'Running Shoes — Premium', tag: 'Product', url: BASE + 'running/shoes.html' },
    { title: 'Running Socks', sub: 'Budget · Best Value · Premium', tag: 'Running', url: BASE + 'running/socks.html' },
    { title: 'Saucony RunDry No-Show Socks (6-Pack)', sub: 'Running Socks — Budget', tag: 'Product', url: BASE + 'running/socks.html' },
    { title: 'CS Celersport Cushioned Ankle Socks (6-Pack)', sub: 'Running Socks — Budget', tag: 'Product', url: BASE + 'running/socks.html' },
    { title: 'Balega Hidden Comfort No-Show', sub: 'Running Socks — Best Value', tag: 'Product', url: BASE + 'running/socks.html' },
    { title: 'Feetures Elite Max Cushion No-Show Tab', sub: 'Running Socks — Best Value', tag: 'Product', url: BASE + 'running/socks.html' },
    { title: 'Darn Tough Run No-Show Tab Ultra-Lightweight', sub: 'Running Socks — Premium', tag: 'Product', url: BASE + 'running/socks.html' },
    { title: 'Smartwool Run Targeted Cushion Ankle', sub: 'Running Socks — Premium', tag: 'Product', url: BASE + 'running/socks.html' },
    { title: 'Running Belts & Armbands', sub: 'Budget · Best Value · Premium', tag: 'Running', url: BASE + 'running/belts.html' },
    { title: 'GUZACK Running Armband', sub: 'Running Belts & Armbands — Budget', tag: 'Product', url: BASE + 'running/belts.html' },
    { title: 'Fitgriff Running Belt', sub: 'Running Belts & Armbands — Budget', tag: 'Product', url: BASE + 'running/belts.html' },
    { title: 'WATERFLY Running Belt', sub: 'Running Belts & Armbands — Best Value', tag: 'Product', url: BASE + 'running/belts.html' },
    { title: 'SPIbelt Original', sub: 'Running Belts & Armbands — Best Value', tag: 'Product', url: BASE + 'running/belts.html' },
    { title: 'FlipBelt Classic', sub: 'Running Belts & Armbands — Premium', tag: 'Product', url: BASE + 'running/belts.html' },
    { title: 'FlipBelt Zipper', sub: 'Running Belts & Armbands — Premium', tag: 'Product', url: BASE + 'running/belts.html' },
    { title: 'Running Hydration', sub: 'Budget · Best Value · Premium', tag: 'Running', url: BASE + 'running/hydration.html' },
    { title: 'AiRunTech Hydration Running Belt', sub: 'Running Hydration — Budget', tag: 'Product', url: BASE + 'running/hydration.html' },
    { title: 'INOXTO Hydration Vest with 1.5L Bladder', sub: 'Running Hydration — Budget', tag: 'Product', url: BASE + 'running/hydration.html' },
    { title: 'Nathan SpeedDraw Plus Insulated Handheld', sub: 'Running Hydration — Best Value', tag: 'Product', url: BASE + 'running/hydration.html' },
    { title: 'Zelvot Running Vest with 2L Bladder', sub: 'Running Hydration — Best Value', tag: 'Product', url: BASE + 'running/hydration.html' },
    { title: 'Nathan ExoDraw 2.0 Handheld', sub: 'Running Hydration — Premium', tag: 'Product', url: BASE + 'running/hydration.html' },
    { title: 'Salomon ADV Hydra Vest 4', sub: 'Running Hydration — Premium', tag: 'Product', url: BASE + 'running/hydration.html' },
    { title: 'Running Recovery', sub: 'Budget · Best Value · Premium', tag: 'Running', url: BASE + 'running/recovery.html' },
    { title: 'Massage Lacrosse Balls (Set of 2)', sub: 'Running Recovery — Budget', tag: 'Product', url: BASE + 'running/recovery.html' },
    { title: 'Idson Muscle Roller Stick', sub: 'Running Recovery — Budget', tag: 'Product', url: BASE + 'running/recovery.html' },
    { title: 'Amazon Basics High-Density Foam Roller 18"', sub: 'Running Recovery — Best Value', tag: 'Product', url: BASE + 'running/recovery.html' },
    { title: '321 STRONG 3-Zone Massage Roller', sub: 'Running Recovery — Best Value', tag: 'Product', url: BASE + 'running/recovery.html' },
    { title: 'TriggerPoint GRID Foam Roller', sub: 'Running Recovery — Premium', tag: 'Product', url: BASE + 'running/recovery.html' },
    { title: 'TriggerPoint GRID X Extra Firm', sub: 'Running Recovery — Premium', tag: 'Product', url: BASE + 'running/recovery.html' },
    { title: 'Running Lights & Visibility', sub: 'Budget · Best Value · Premium', tag: 'Running', url: BASE + 'running/visibility.html' },
    { title: 'Reflective Running Vest (2-Pack)', sub: 'Running Lights & Visibility — Budget', tag: 'Product', url: BASE + 'running/visibility.html' },
    { title: 'Lepro Rechargeable LED Headlamp', sub: 'Running Lights & Visibility — Budget', tag: 'Product', url: BASE + 'running/visibility.html' },
    { title: 'ISEYOU 500-Lumen Running Light Vest', sub: 'Running Lights & Visibility — Best Value', tag: 'Product', url: BASE + 'running/visibility.html' },
    { title: 'Viccux 500-Lumen Running Light Vest', sub: 'Running Lights & Visibility — Best Value', tag: 'Product', url: BASE + 'running/visibility.html' },
    { title: 'Noxgear Tracer2 Light-Up Vest', sub: 'Running Lights & Visibility — Premium', tag: 'Product', url: BASE + 'running/visibility.html' },
    { title: 'Petzl Swift RL Headlamp', sub: 'Running Lights & Visibility — Premium', tag: 'Product', url: BASE + 'running/visibility.html' },
    // ── Articles — the long-form guides, searchable by title
    { title: 'Best Tennis Bags for Beginners (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-bags-beginners.html' },
    { title: 'Best Tennis Balls for Training vs Matches (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-balls-training-vs-matches.html' },
    { title: 'Best Tennis Gear Bundle for Beginners (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-gear-bundle-beginners.html' },
    { title: 'Best Tennis Grip Tape for Sweaty Hands (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-grip-tape-sweaty-hands.html' },
    { title: 'Best Lightweight Tennis Rackets for Control (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-lightweight-rackets-control.html' },
    { title: 'Best Power Tennis Rackets for Aggressive Players (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-power-rackets-aggressive.html' },
    { title: 'Best Tennis Racket Overall (Updated 2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-racket-overall-2026.html' },
    { title: 'Best Tennis Rackets for Beginners (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-rackets-beginners-2026.html' },
    { title: 'Best Tennis Rackets for Intermediate Players (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-rackets-intermediate.html' },
    { title: 'Best Tennis Rackets Under $100 (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-rackets-under-100.html' },
    { title: 'Best Tennis Shoes for Hard Courts (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-shoes-hard-courts.html' },
    { title: 'Best Tennis Shoes Under $150 (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-shoes-under-150.html' },
    { title: 'Best Tennis Shoes for Wide Feet (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-shoes-wide-feet.html' },
    { title: 'Best Tennis Strings for Spin (2026)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/best-strings-spin.html' },
    { title: 'Polyester vs Multifilament Strings (Which Is Better?)', sub: 'Tennis guide', tag: 'Guide', url: BASE + 'articles/tennis/polyester-vs-multifilament.html' },
    { title: 'Best Adjustable Dumbbells Under $300 (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-adjustable-dumbbells-under-300.html' },
    { title: 'Best Dumbbells for Home Gym (Adjustable vs Fixed)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-dumbbells-home-gym.html' },
    { title: 'Best Gym Gloves for Beginners (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-gym-gloves-beginners.html' },
    { title: 'Best Pre-Workout Supplements (Beginner-Safe) 2026', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-pre-workout-beginners.html' },
    { title: 'Best Protein Shaker Bottles (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-protein-shaker-bottles.html' },
    { title: 'Best Resistance Bands for Muscle Gain (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-resistance-bands-muscle-gain.html' },
    { title: 'Best Weight Benches for Small Spaces (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-weight-benches-small-spaces.html' },
    { title: 'Best Workout Shoes for Lifting (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/best-workout-shoes-lifting.html' },
    { title: 'Home Gym Setup Under $1,000 (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/home-gym-setup-under-1000.html' },
    { title: 'Home Gym Setup Under $500 (2026)', sub: 'Gym guide', tag: 'Guide', url: BASE + 'articles/gym/home-gym-setup-under-500.html' },
    { title: 'Best Boxing Gloves for Beginners (2026)', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-boxing-gloves-beginners.html' },
    { title: 'Best Boxing Gloves for Heavy Bag (2026)', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-boxing-gloves-heavy-bag.html' },
    { title: 'Best Boxing Headgear 2026', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-boxing-headgear-2026.html' },
    { title: 'Best Boxing Shoes 2026 — Ranked', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-boxing-shoes-2026.html' },
    { title: 'Best Cheap Boxing Shoes (2026)', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-budget-boxing-shoes.html' },
    { title: 'Best Hand Wraps for Boxing (2026)', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-hand-wraps-boxing.html' },
    { title: 'Best Punching Bag Under $1,000 (2026)', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-punching-bag-under-1000.html' },
    { title: 'Best Punching Bags for Home (2026)', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/best-punching-bags-home.html' },
    { title: 'Boxing Gloves Size Guide — What Oz Do You Need?', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/boxing-gloves-size-guide.html' },
    { title: 'Heavy Bag vs Speed Bag — Which Should You Get?', sub: 'Boxing guide', tag: 'Guide', url: BASE + 'articles/boxing/heavy-bag-vs-speed-bag.html' },
    { title: 'Best Swim Bags (2026)', sub: 'Swimming guide', tag: 'Guide', url: BASE + 'articles/swimming/best-swim-bags.html' },
    { title: 'Best Swimming Fins (2026)', sub: 'Swimming guide', tag: 'Guide', url: BASE + 'articles/swimming/best-swimming-fins.html' },
    { title: 'Best Swimming Training Equipment (2026)', sub: 'Swimming guide', tag: 'Guide', url: BASE + 'articles/swimming/best-swimming-training-equipment.html' },
    { title: 'Best Footballs Under $50 (2026)', sub: 'Football guide', tag: 'Guide', url: BASE + 'articles/football/best-footballs-under-50.html' },
    { title: 'Best Volleyball Ankle Braces (2026)', sub: 'Volleyball guide', tag: 'Guide', url: BASE + 'articles/volleyball/best-volleyball-ankle-braces.html' },
    { title: 'Best Volleyball Knee Pads (2026)', sub: 'Volleyball guide', tag: 'Guide', url: BASE + 'articles/volleyball/best-volleyball-knee-pads.html' },
    { title: 'Best Volleyball Shoes for Beginners (2026)', sub: 'Volleyball guide', tag: 'Guide', url: BASE + 'articles/volleyball/best-volleyball-shoes-beginners.html' },
    { title: 'Best Volleyballs for Beginners (2026)', sub: 'Volleyball guide', tag: 'Guide', url: BASE + 'articles/volleyball/best-volleyballs-beginners.html' },
    { title: 'Indoor vs Beach Volleyball: Key Differences Explained', sub: 'Volleyball guide', tag: 'Guide', url: BASE + 'articles/volleyball/indoor-vs-beach-volleyball.html' },
    { title: 'Volleyball Gear for Beginners: Complete Buying Guide', sub: 'Volleyball guide', tag: 'Guide', url: BASE + 'articles/volleyball/volleyball-gear-beginners-guide.html' },
    { title: 'Best Pickleball Paddles for Beginners (2026)', sub: 'Pickleball guide', tag: 'Guide', url: BASE + 'articles/pickleball/best-pickleball-paddles-beginners.html' },
    { title: 'Best Pickleball Shoes for Beginners (2026)', sub: 'Pickleball guide', tag: 'Guide', url: BASE + 'articles/pickleball/best-pickleball-shoes-beginners.html' },
    { title: 'Indoor vs Outdoor Pickleballs', sub: 'Pickleball guide', tag: 'Guide', url: BASE + 'articles/pickleball/indoor-vs-outdoor-pickleballs.html' },
    { title: 'Pickleball Gear for Beginners', sub: 'Pickleball guide', tag: 'Guide', url: BASE + 'articles/pickleball/pickleball-gear-beginners-guide.html' },
    { title: 'Pickleball Paddle Weight & Core Explained', sub: 'Pickleball guide', tag: 'Guide', url: BASE + 'articles/pickleball/pickleball-paddle-weight-guide.html' },
    { title: 'Pickleball vs Tennis Gear', sub: 'Pickleball guide', tag: 'Guide', url: BASE + 'articles/pickleball/pickleball-vs-tennis-gear.html' },
    { title: 'Best Ping Pong Paddles for Beginners (2026)', sub: 'Ping Pong guide', tag: 'Guide', url: BASE + 'articles/ping-pong/best-ping-pong-paddles-beginners.html' },
    { title: 'Best Ping Pong Sets for Families (2026)', sub: 'Ping Pong guide', tag: 'Guide', url: BASE + 'articles/ping-pong/best-ping-pong-sets-families.html' },
    { title: 'Blades & Rubbers vs Pre-Made Paddles', sub: 'Ping Pong guide', tag: 'Guide', url: BASE + 'articles/ping-pong/blades-rubbers-vs-premade-paddles.html' },
    { title: 'Is a Table Tennis Robot Worth It?', sub: 'Ping Pong guide', tag: 'Guide', url: BASE + 'articles/ping-pong/is-a-table-tennis-robot-worth-it.html' },
    { title: 'Ping Pong Ball Star Ratings Explained', sub: 'Ping Pong guide', tag: 'Guide', url: BASE + 'articles/ping-pong/ping-pong-ball-star-ratings.html' },
    { title: 'Ping Pong Gear: The Complete Beginner\'s Guide', sub: 'Ping Pong guide', tag: 'Guide', url: BASE + 'articles/ping-pong/ping-pong-gear-beginners-guide.html' },
    { title: 'Badminton Gear: The Complete Beginner Guide', sub: 'Badminton guide', tag: 'Guide', url: BASE + 'articles/badminton/badminton-gear-beginners-guide.html' },
    { title: 'Badminton String Tension Guide', sub: 'Badminton guide', tag: 'Guide', url: BASE + 'articles/badminton/badminton-string-tension-guide.html' },
    { title: 'Badminton vs Tennis Gear', sub: 'Badminton guide', tag: 'Guide', url: BASE + 'articles/badminton/badminton-vs-tennis-gear.html' },
    { title: 'Best Badminton Rackets for Beginners (2026)', sub: 'Badminton guide', tag: 'Guide', url: BASE + 'articles/badminton/best-badminton-rackets-beginners.html' },
    { title: 'Best Badminton Sets for Families (2026)', sub: 'Badminton guide', tag: 'Guide', url: BASE + 'articles/badminton/best-badminton-sets-families.html' },
    { title: 'Feather vs Nylon Shuttlecocks', sub: 'Badminton guide', tag: 'Guide', url: BASE + 'articles/badminton/feather-vs-nylon-shuttlecocks.html' },
    { title: '7 Beginner Mistakes in Boxing (and How to Fix Them)', sub: 'How-To guide', tag: 'Guide', url: BASE + 'articles/guides/beginner-mistakes-boxing.html' },
    { title: 'Gym Equipment You Don\'t Need (Avoid These)', sub: 'How-To guide', tag: 'Guide', url: BASE + 'articles/guides/gym-equipment-you-dont-need.html' },
    { title: 'How to Choose a Tennis Racket — Complete Guide', sub: 'How-To guide', tag: 'Guide', url: BASE + 'articles/guides/how-to-choose-tennis-racket.html' },
    { title: 'How to Know Your Tennis Skill Level (NTRP Guide)', sub: 'How-To guide', tag: 'Guide', url: BASE + 'articles/guides/how-to-know-tennis-skill-level.html' },
    { title: 'How to Set Up a Home Gym — Step by Step', sub: 'How-To guide', tag: 'Guide', url: BASE + 'articles/guides/how-to-set-up-home-gym.html' },
    { title: 'Why Your Tennis Shots Have No Power (and How to Fix It)', sub: 'How-To guide', tag: 'Guide', url: BASE + 'articles/guides/why-tennis-shots-have-no-power.html' },
    { title: 'Best Ski Goggles for Beginners (2026)', sub: 'Ski guide', tag: 'Guide', url: BASE + 'articles/ski/best-ski-goggles-beginners.html' },
    { title: 'Do You Need a Ski Helmet?', sub: 'Ski guide', tag: 'Guide', url: BASE + 'articles/ski/do-you-need-a-ski-helmet.html' },
    { title: 'Merino vs Synthetic Base Layers', sub: 'Ski guide', tag: 'Guide', url: BASE + 'articles/ski/merino-vs-synthetic-base-layers.html' },
    { title: 'Ski Gear: Complete Beginner Guide', sub: 'Ski guide', tag: 'Guide', url: BASE + 'articles/ski/ski-gear-beginners-guide.html' },
    { title: 'Ski Goggle Lens Tint and VLT Guide', sub: 'Ski guide', tag: 'Guide', url: BASE + 'articles/ski/ski-goggle-lens-vlt-guide.html' },
    { title: 'What to Pack for a Ski Trip', sub: 'Ski guide', tag: 'Guide', url: BASE + 'articles/ski/what-to-pack-ski-trip.html' },
    { title: 'Running Gear: Complete Beginner Guide', sub: 'Running guide', tag: 'Guide', url: BASE + 'articles/running/running-gear-beginners-guide.html' },
    { title: 'Best Running Shoes for Beginners (2026)', sub: 'Running guide', tag: 'Guide', url: BASE + 'articles/running/best-running-shoes-beginners.html' },
    { title: 'Neutral vs Stability Running Shoes', sub: 'Running guide', tag: 'Guide', url: BASE + 'articles/running/neutral-vs-stability-running-shoes.html' },
    { title: 'How to Stop Blisters When Running', sub: 'Running guide', tag: 'Guide', url: BASE + 'articles/running/how-to-stop-running-blisters.html' },
    { title: 'How to Carry Your Phone and Water on a Run', sub: 'Running guide', tag: 'Guide', url: BASE + 'articles/running/how-to-carry-phone-water-running.html' },
    { title: 'Running in the Dark: What to Wear to Be Seen', sub: 'Running guide', tag: 'Guide', url: BASE + 'articles/running/running-in-the-dark-what-to-wear.html' }
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
        '<div class="search-results"><p class="search-hint">Type to search 363 products, 60 categories and 69 guides</p></div>' +
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
      resultsList.innerHTML = '<p class="search-hint">Type to search 363 products, 60 categories and 69 guides</p>';
      return;
    }
    /* Every word in the query has to appear somewhere in the entry, but not
     * as one contiguous run — testing the raw string meant "swimming goggles"
     * found nothing while "goggles" found seven. Order does not matter, so
     * "goggles swimming" works too. */
    var terms = q.split(/\s+/).filter(Boolean);

    var matches = INDEX.map(function (item) {
      var title = item.title.toLowerCase();
      // The URL carries the sport, which the tier line does not: without it
      // "swimming goggles" finds the category page but none of the goggles.
      var hay = title + ' ' + item.tag.toLowerCase() + ' ' + item.sub.toLowerCase() +
                ' ' + item.url.toLowerCase().replace(/[\/\-_.]+/g, ' ');
      var score = 0;

      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return null;
        // A word in the title beats the same word buried in the tier line.
        if (title.indexOf(terms[i]) === 0) score += 3;
        else if (title.indexOf(terms[i]) !== -1) score += 2;
        else score += 1;
      }
      // Hubs and category pages answer a broad query better than one product
      // out of six does, so they sit above products on an equal score.
      if (item.tag !== 'Product') score += 1;
      return { item: item, score: score };
    }).filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 12)
      .map(function (r) { return r.item; });

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
    resultsList.innerHTML = '<p class="search-hint">Type to search 363 products, 60 categories and 69 guides</p>';
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
