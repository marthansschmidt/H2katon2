# Individual food illustrations

Generated with the built-in imagegen tool. `public/art/food-atlas.webp` was supplied as a style reference for each separate generation. Every dish has its own transparent 320 × 320 PNG in `public/art/foods/`; original generated PNGs are retained in the tool's generated-images library. Images were resized with macOS `sips` while preserving transparency.

`src/data/foodImages.ts` maps food IDs to images. Menu cards and day summaries look up images by ID, including foods restored from older saved games. The existing atlas remains in use for generic food-group illustrations in the pyramid.

## Shared prompt

The following shared prompt is followed by `Dish: <dish>` and `Ingredient and identity constraints: <constraints>` from each entry below.

```text
Use case: stylized-concept.
Asset type: one standalone food illustration for an existing Estonian nutrition game.
Input image 1: existing food atlas is a STYLE REFERENCE ONLY. Do not reproduce the atlas or its layout.
Style: match its polished detailed pixel-art, warm rich colors, crisp dark pixel outlines, small readable shading clusters, appetizing casual adventure-game food art. Three-quarter view from slightly above, consistent soft upper-left lighting. One dish centered at the same visual scale, filling 78–84 percent of a square canvas with transparent padding. True transparent alpha background outside the dish and its serving plate or bowl. Entire dish and every side fully within the canvas.
No text, no labels, no numbers, no frames, no grid, no UI, no people, no hands, no raccoon, no realistic photography, no baked checkerboard, no colored background. Single finished illustration only, not variants or a collage.
```

## Dish prompts

### oats.png

Dish: A warm bowl of oatmeal topped with blueberries and a spoonful of mixed seeds.

Ingredient and identity constraints: No strawberries or other fruit.

### eggs.png

Dish: A soft-boiled egg cut in half with a soft golden yolk, dark wholegrain rye bread slices and crisp cucumber slices, arranged on one plate.

Ingredient and identity constraints: No avocado, cheese or hummus.

### yogurt.png

Dish: A bowl of plain creamy yogurt with banana slices and crunchy oat granola.

Ingredient and identity constraints: No berries.

### pancakes.png

Dish: A stack of fluffy golden pancakes with fresh strawberries and a dollop of plain yogurt.

Ingredient and identity constraints: No maple syrup or other fruit.

### avotoast.png

Dish: A slice of dark rye toast topped with creamy green avocado, red tomato slices and mixed seeds.

Ingredient and identity constraints: Entirely plant based. No egg, cheese, meat or hummus.

### omelette.png

Dish: A folded golden egg omelette with colorful bell pepper pieces and spinach leaves, with a slice of dark rye bread on the same plate.

Ingredient and identity constraints: An omelette, not a fried egg on toast.

### buckwheat.png

Dish: A bowl of brown buckwheat porridge with glossy baked apple wedges and a dusting of cinnamon.

Ingredient and identity constraints: Entirely plant based. Clearly buckwheat grains, not oatmeal. No berries.

### quark.png

Dish: A bowl of thick white quark curd cheese with fresh red raspberries and toasted rolled oats.

Ingredient and identity constraints: No banana or blueberries.

### hummustoast.png

Dish: An open wholegrain bread sandwich with pale hummus, red tomato slices and leafy green lettuce.

Ingredient and identity constraints: Entirely plant based. No avocado, egg, cheese or meat.

### fruitnuts.png

Dish: Apple and pear slices with a small handful of walnuts and hazelnuts, arranged on a small plate.

Ingredient and identity constraints: Entirely plant based. Show sliced fruit, not whole fruit. No berries.

### smoothie.png

Dish: A tall clear glass filled with purple blueberry-banana kefir smoothie, blueberries and a banana slice at the rim.

Ingredient and identity constraints: No strawberries. Not a pink strawberry smoothie.

### ryecheese.png

Dish: An open dark rye bread sandwich with yellow cheese slices and fresh red tomato slices.

Ingredient and identity constraints: No egg, avocado, hummus or meat.

### carrotcake.png

Dish: One small slice of spiced carrot cake with visibly orange carrot flecks and chopped walnut topping on a small plate.

Ingredient and identity constraints: Carrot cake, not chocolate cake. No berries.

### chococake.png

Dish: One rich dark chocolate layer cake slice with smooth cocoa cream frosting on a small plate.

Ingredient and identity constraints: No berries, carrots or other garnish.

### berrymuffin.png

Dish: One soft golden muffin in a paper baking cup with visible blueberries and raspberries.

Ingredient and identity constraints: A muffin, not a cake slice or cupcake with frosting.

### icecream.png

Dish: Scoops of vanilla ice cream with fresh summer strawberries, blueberries and raspberries in a small dessert bowl.

Ingredient and identity constraints: Ice cream scoops, not yogurt. No banana.

### oatcookie.png

Dish: A crunchy golden oatmeal cookie on a small saucer beside a small clear glass of white milk.

Ingredient and identity constraints: Both cookie and glass must be completely visible.

### chickenrice.png

Dish: One plate of juicy golden cooked chicken pieces, a mound of white rice, and cucumber-tomato salad.

Ingredient and identity constraints: Clearly chicken, not tofu or fish.

### salmon.png

Dish: One plate of oven-baked salmon fish fillet, potatoes and steamed green broccoli florets.

Ingredient and identity constraints: Potatoes, not rice. Broccoli, not generic lettuce.

### vegpasta.png

Dish: One plate of penne pasta with red tomato pieces, green zucchini pieces and a light olive oil sheen.

Ingredient and identity constraints: Entirely plant based. Penne tubes, not spaghetti. No cheese or meat.

### soup.png

Dish: A bowl of chunky vegetable soup with carrots, cabbage and beans, beside one slice of dark rye bread.

Ingredient and identity constraints: Entirely plant based. Not a smooth pumpkin soup. Include bread.

### burger.png

Dish: A beef cheeseburger with a beef patty, yellow cheese and lettuce, accompanied by golden oven-baked potato wedges on the same plate.

Ingredient and identity constraints: Include wedges, not thin fries. Not a bean burger.

### falafel.png

Dish: A cut-open tortilla wrap stuffed with visible brown chickpea falafel balls, fresh leafy salad and creamy tahini sauce.

Ingredient and identity constraints: Entirely plant based. No chicken, cheese or avocado.

### lentils.png

Dish: A bowl with creamy golden lentil curry, a mound of white rice, and white cauliflower florets.

Ingredient and identity constraints: Entirely plant based. No meat, tofu or broccoli. Lentils visibly present.

### caesar.png

Dish: A leafy green chicken salad with cooked chicken pieces, golden bread croutons and shaved cheese.

Ingredient and identity constraints: No avocado or beetroot.

### tofubowl.png

Dish: A wok bowl with golden tofu cubes, pale rice noodles, cabbage strips and scattered sesame seeds.

Ingredient and identity constraints: Entirely plant based. Rice noodles, not rice grains. No meat or egg.

### beet.png

Dish: A salad with roasted ruby-red beetroot pieces, white goat cheese, pear slices and walnuts.

Ingredient and identity constraints: Show beetroot, goat cheese, pear and nuts distinctly. No meat.

### meatballs.png

Dish: A plate of browned meatballs with brown buckwheat grains and bright grated carrot salad.

Ingredient and identity constraints: Buckwheat, not rice. Carrot salad clearly separate.

### pizza.png

Dish: A small round vegetable pizza with a crisp crust, melted mozzarella cheese, colorful bell pepper strips and sliced mushrooms.

Ingredient and identity constraints: A pizza, not a pasta plate. No meat or pepperoni.

### risotto.png

Dish: A shallow bowl of creamy rice risotto with woodland mushroom pieces and parmesan shavings.

Ingredient and identity constraints: Rice grains clearly visible. No meat or noodles.

### fishsoup.png

Dish: A bowl of light chunky fish soup with fish pieces, carrot rounds, potato chunks and fresh dill.

Ingredient and identity constraints: Fish pieces visible. Not creamy orange pumpkin soup.

### chickpeasalad.png

Dish: A salad bowl with fluffy quinoa grains, chickpeas, cucumber pieces and light lemon dressing.

Ingredient and identity constraints: Entirely plant based. No feta, cheese or meat.

### bakedpotato.png

Dish: One large baked potato split open and filled with white cottage cheese curds, with fresh leafy salad alongside on one plate.

Ingredient and identity constraints: Show a single whole split potato, not potato wedges. No bacon.

### chickenwrap.png

Dish: A cut-open tortilla wrap with cooked chicken pieces, avocado slices and fresh tomato and leafy vegetables.

Ingredient and identity constraints: Chicken and avocado both visible. No falafel.

### beanburger.png

Dish: A burger in a wholegrain bun with a dark bean patty, red tomato slices and leafy lettuce.

Ingredient and identity constraints: Entirely plant based. No cheese, egg, meat or potato wedges.

### pumpkinsoup.png

Dish: A bowl of smooth orange pumpkin soup sprinkled with toasted green pumpkin seeds, beside a slice of bread.

Ingredient and identity constraints: Entirely plant based. Smooth soup, no chunky vegetables or dairy swirl.

### sushi.png

Dish: A plate of salmon-avocado sushi rolls showing white rice, orange salmon and green avocado, with a small cucumber salad on the same plate.

Ingredient and identity constraints: Sushi rolls, not a grilled fish fillet. No other fillings.

### stew.png

Dish: A bowl of thick red-bean vegetable stew with visible red kidney beans, carrots, tomatoes and pearl barley grains.

Ingredient and identity constraints: Entirely plant based. Not a smooth soup. No meat.

### noodles.png

Dish: A bowl of stir-fried noodles with pieces of cooked egg, cabbage strips and crisp colorful bell pepper.

Ingredient and identity constraints: Egg visible, no meat, tofu or broccoli.

### herring.png

Dish: A plate of silvery herring fillet pieces, boiled potatoes and a separate ruby beetroot and apple salad.

Ingredient and identity constraints: Herring, not orange salmon. No rice.
