# Meal-time map illustrations

Generated with the built-in imagegen tool. The previous `public/art/tartu-map.webp` was used as a style reference for a new town plan with buildings across the center and a narrow river on the right. The resulting base map was reused as the edit target for each lighting variant; house positions and camera framing were preserved. The original map remains available.

Final assets (1024 × 1536, WebP at original dimensions, quality 0.93):

- `public/art/tartu-map-morning.webp`: breakfast, peach dawn light and soft haze.
- `public/art/tartu-map-noon-v2.webp`: lunch, soft natural greens, earthy terracotta roofs and calm blue-teal water in neutral-warm midday light. The original `tartu-map-noon.webp` is retained.
- `public/art/tartu-map-night.webp`: dinner, dark blue ambient light, glowing windows and existing lamps.

WebP encoding changes the delivery format only. Color and lighting changes were generated with imagegen. `src/data/mapScenes.ts` selects the asset from the current meal. `src/components/mapLayout.ts` records roof coordinates in the shared original image geometry; restaurant identity and menus remain independent of the lighting variant.

## Base town plan prompt

Use case: stylized-concept.
Asset type: standalone landscape 1536 × 1024 game-map background, morning variant, no UI.
Primary request: Create a new Tartu, Estonia inspired town map with MANY usable houses in the CENTER as well as the edges, so five restaurant buttons can point to separate roofs. Input image is a STYLE REFERENCE ONLY; redesign the geography.
Style: match the reference's beautiful detailed softly shaded pixel-art / polished isometric casual adventure game, warm cream paving, salmon pink town hall, yellow ochre and cream historic facades, orange and slate pitched roofs, leafy green trees, small flower beds, wrought iron lamps.
Composition: high oblique aerial view, edge-to-edge town illustration, no horizon or sky band. The CENTRAL 70% MUST BE LAND AND BUILDINGS rather than water. Several distinct blocks of small historic restaurant/cafe houses spread across the middle: around x=30%, x=50%, x=70%, with streets separating them, several rows at y=25%, 45%, 65%, 80%. Buildings must remain clearly distinct and have large visible roof surfaces. Five or more usable buildings must be visible in the central horizontal strip y=30%–70%, and also in the central vertical strip x=35%–65%, for responsive cropping. Do not replace central buildings with an empty park or a vast square. Tartu town hall towards upper-left, compact plaza, winding cobblestone pedestrian lanes weaving between houses, a few cafe terraces. Emajõgi is a NARROW river along the FAR RIGHT EDGE, with a pale pedestrian bridge at lower-right, never through the center. Dense charming urban street plan but roofs separated by lanes so markers can be placed.
Morning light: fresh early morning, pale peach sunrise light from upper-left, gentle long shadows, light warm haze, clear readable houses, soft turquoise river, calm inviting mood.
Constraints: one full image, not a montage; consistent isometric scale; no UI, no cards, no pins, no restaurant logos, no text, no labels, no borders, no watermark, no prominent characters. Keep the center dense with houses. This exact street/building layout will be reused for noon and night lighting variants.

## Final morning lighting prompt

Use case: lighting-weather.
Asset type: full-bleed 1024 × 1536 game-map illustration, EARLY MORNING / breakfast variant.
Input image: supplied Tartu town map is the EDIT TARGET.
Only relight this exact map into recognizably early morning, shortly after sunrise. This must be visibly different from the bright white noon version: low-angle SOFT PEACH AND APRICOT dawn sunlight from upper-left, rosy highlights on roofs and cobblestones, gentle lavender-blue long shadows, delicate warm sunrise haze in the lanes and along the right-hand river, muted fresh sage foliage with warm tips, soft pastel turquoise water. A calm cozy fresh dawn, not high-saturation white midday, not night. Keep all roofs and house edges crisp and readable rather than hiding them in fog. Reduce noon's harsh brightness, soften colors, preserve enough light for a game background.
CRITICAL INVARIANTS: keep EXACTLY the same 1024 × 1536 image, camera, crop, street layout and EVERY building/roof at the identical coordinates. Central buildings and right-edge river unchanged. Do not move/add/remove/resize any house, roof, tree, lamp, terrace, bridge, flower bed, statue or street. Change only lighting/color/atmosphere. Match the polished detailed pixel-art style. No UI, no markers, no text, no logos, no border, no watermark. One single image.

## Initial noon lighting prompt (retained)

Use case: lighting-weather.
Asset type: full-bleed 1024 × 1536 game-map illustration, noon / lunch variant.
Input image: the supplied MORNING MAP IS THE EDIT TARGET.
Change ONLY illumination and atmosphere to bright clear midday/early afternoon: neutral golden-white overhead sunlight, shorter softer shadows, vibrant clean greens, luminous pale cream cobbles, vivid turquoise water, slightly cooler neutral roof highlights than morning. Clearly a warm sunny noon rather than sunrise or dusk.
CRITICAL INVARIANTS: keep EXACTLY the same image size, camera, crop, pixel-art style, street layout and every building/roof outline at exactly the same coordinates. Keep all central buildings. Keep the river narrowly along the right edge. Do not move, add, remove or resize ANY house, tree, lamp, terrace, bridge, flower bed or street. Restaurant marker coordinates depend on roof alignment between variants. This is a relighting pass only, not a redesign. No UI, no restaurant markers, no text, no logo, no border, no watermark. Produce one complete image.

## Revised noon lighting and palette prompt

Generated with the built-in imagegen tool using `public/art/tartu-map-noon.webp` as the edit target. Saved as `public/art/tartu-map-noon-v2.webp` at the same dimensions, with shared roof coordinates and the other meal scenes preserved.

Use case: lighting-weather.
Asset type: replacement lunch / midday game map, 1024 × 1536, full bleed.
Input image: supplied Tartu noon map is the EDIT TARGET. The user dislikes its suspicious/artificial oversaturated colors. Correct ONLY its palette and daylight to feel natural, calm, tasteful and coherent while retaining its detailed pixel-art illustration style.
Lighting: pleasant clear midday / early afternoon with soft neutral-warm daylight, restrained highlights and gentle short shadows. Still visibly daytime, brighter and more neutral than peach sunrise, no dusk glow or night lighting.
Palette: muted natural leafy sage and olive greens rather than neon yellow-green; warm ivory and light limestone paving rather than glaring white; soft ochre, cream and pale warm peach facades; earthy brick-red and terracotta roofs instead of candy-orange; blue-grey slate rather than highly saturated royal blue; calm blue-teal river rather than electric cyan. Harmonize the entire scene with slightly warm balanced colors, medium contrast, less saturation. Preserve cheerful detailed game art, do not turn it dull grey or photorealistic. Flowers retain restrained little colorful accents. No magenta/cyan color cast, no fluorescent greens, no blown highlights. Lamps and windows do not emit light in daytime.
CRITICAL INVARIANTS: EXACT same 1024 × 1536 dimensions, original camera, framing, pixel-art style, all building silhouettes and rooftop coordinates, every street, tree, cafe terrace, statue, bridge, flowerbed and narrow river on the right. Do not add, remove, shift, resize or redesign any objects or architecture. The restaurant bubbles must still align to the same roofs. Change color/lighting only. No text, no logos, no labels, no pins, no overlays, no frames, no UI, no watermark. Produce one complete image.

## Late evening lighting prompt

Use case: lighting-weather.
Asset type: full-bleed 1024 × 1536 game-map illustration, late evening / dinner variant.
Input image: supplied morning Tartu town map is the EDIT TARGET.
Change ONLY the illumination and atmosphere into LATE EVENING AFTER SUNSET, distinctly darker than both morning and noon. Blue-hour edging into night: deep navy and indigo ambient light, subdued blue-green trees, violet/slate roofs, dark blue river, warmly glowing amber house windows, warm yellow pools of light under the EXISTING street lamps and around the existing cafe terraces, gentle golden reflections on the right-edge river. There is no remaining direct white sunlight. Make it atmospheric and dark enough to unmistakably feel late, while still preserving readable buildings and streets for interactive gameplay, not pitch black. Not an orange sunny sunset and not daytime.
CRITICAL INVARIANTS: keep EXACTLY the same image size, camera, crop, street plan and EVERY building/roof outline at exactly the same coordinates as the input. Keep central houses and river along the right edge. Do not move, add, remove, resize or redesign any house, roof, tree, lamp, terrace, bridge, flower bed, statue or street. Only lighting/colors change; glowing windows and existing lamps are allowed. Match polished detailed pixel-art. No UI, no restaurant cards or markers, no text, no signs, no logo, no border, no watermark. Produce one complete image, not a collage.
