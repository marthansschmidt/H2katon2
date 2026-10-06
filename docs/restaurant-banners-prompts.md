# Restaurant banners

All 12 banners were generated individually with the built-in imagegen tool. `public/art/tartu-day.webp` was supplied only as a style reference. These images are artistic game-world interpretations inspired by each restaurant's general character, rather than documentary depictions of its actual interior. Restaurant names and logos are rendered by React, not generated into the images.

The original 2172 × 724 PNGs remain in the generated-images library. Final project assets are 1200 × 400 WebPs in `public/art/restaurants/`, encoded at quality 0.88 without changing the 3:1 composition. `src/data/restaurantBanners.ts` maps the existing restaurant IDs to banner paths and image descriptions, preserving compatibility with saved games.

## Prompts and sources

The following prompts were used in separate imagegen calls with an opaque background. Official sites were checked on 6 October 2026 for general inspiration. Furnishing, color and framing choices are illustrative.

### Werner

Asset: `public/art/restaurants/werner.webp`. Existing restaurant ID: `raekoja`.

Inspiration: [Werner official site](https://www.werner.ee/et).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: an elegant historic Viennese-style patisserie café, warm cream plaster vaulted ceilings, dark walnut counters, a glass display of beautifully arranged cakes and pastries, small espresso cups, brass sconces, intimate café tables. Amber, cream and walnut tones. Main focal point: curved pastry display centered beneath plaster arches.
```

### Joyce

Asset: `public/art/restaurants/joyce.webp`. Existing restaurant ID: `emajoe`.

Inspiration: [Joyce official site](https://joyce.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a playful contemporary restaurant with refined seasonal cuisine, turquoise upholstered booths, tall leafy houseplants, sculptural round pendant lamps, pale wood and tasteful modern tables with colorful small vegetable dishes. Teal, blush pink, pale oak and gold tones. Main focal point: teal booth seating and decorative pendant lights in a spacious modern room.
```

### Kolm Tilli

Asset: `public/art/restaurants/kolm-tilli.webp`. Existing restaurant ID: `karlova`.

Inspiration: [Kolm Tilli official site](https://sevensons.ee/kohad/kolm-tilli/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a lively industrial street-food restaurant inside a repurposed factory, exposed warm red brick, large black steel windows, open kitchen, a glowing round pizza oven, pizza preparation counter and racks of freshly baked bread, casual wood tables. Rust orange, dark green and charcoal tones. Main focal point: round pizza oven and open kitchen along the center.
```

### Hõlm

Asset: `public/art/restaurants/holm.webp`. Existing restaurant ID: `supilinna`.

Inspiration: [Hõlm official site](https://holmrestoran.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: an elegant Nordic fine-dining room, open chef's counter without people, white linen tables, forest-green upholstered chairs, natural wood, carefully plated seasonal vegetables, a calm garden visible through broad windows, delicate pendant lights. Cream, sage, forest green and warm silver tones. Main focal point: immaculate dining tables against a peaceful garden view.
```

### Aparaat

Asset: `public/art/restaurants/aparaat.webp`. Existing restaurant ID: `aparaadi`.

Inspiration: [Aparaat official site](https://www.aparaadiresto.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a friendly community restaurant in a creative repurposed factory courtyard, generous brick-framed factory windows, mismatched colorful chairs around communal oak tables, hanging plants, simple amber lamps, relaxed green terrace visible outside. Warm red brick, mustard yellow, olive green and brown. Main focal point: welcoming communal tables beside industrial windows.
```

### La Dolce Vita

Asset: `public/art/restaurants/la-dolce-vita.webp`. Existing restaurant ID: `vanalinna`.

Inspiration: [La Dolce Vita official site](https://ladolcevita.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a warm traditional Italian trattoria, ochre plaster and brick arches, a wood-fired pizza oven with gentle orange glow, rustic wooden tables, cream checked table runners, potted basil, baskets of bread, tomatoes and fresh pizza on a preparation counter. Terracotta, basil green, cream and warm red palette. Main focal point: brick oven and rustic Italian kitchen, visually distinct from a factory.
```

### Humal

Asset: `public/art/restaurants/humal.webp`. Existing restaurant ID: `toome`.

Inspiration: [Humal official site](https://humalbistro.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a lively French-inspired bistro, moss-green velvet banquettes, round marble café tables, brass lamp fixtures, classic tall windows, dark timber wall panels, framed botanical pictures without writing, bread baskets and small bistro dishes. Moss green, cream marble, warm brass and chestnut tones. Main focal point: graceful green banquette and marble tables.
```

### Kampus

Asset: `public/art/restaurants/kampus.webp`. Existing restaurant ID: `ulikooli`.

Inspiration: [Kampus official site](https://kampustartu.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: an airy urban food-court restaurant with soaring two-storey glass windows, pale concrete and warm oak, multiple small open food counters, colorful fresh poke bowls and burger dishes at separate counters, big leafy potted plants and bright modern seating, old-town street visible through glass. Sky blue, leaf green, pale wood and cream palette. Main focal point: tall glass wall and colorful urban food counters.
```

### Pompei

Asset: `public/art/restaurants/pompei.webp`. Existing restaurant ID: `joeaarne`.

Inspiration: [Pompei official site](https://pompei.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a contemporary artisanal Italian restaurant, pale stone walls, terracotta archways, a beautiful handmade pasta counter with flour and fresh pasta, cream mozzarella bowls, lemon trees in pots and a convivial long table. Soft terracotta, lemon yellow, sage green and cream palette. Main focal point: pasta preparation counter framed by a warm stone arch, no pizza oven.
```

### Fii

Asset: `public/art/restaurants/fii.webp`. Existing restaurant ID: `kesklinna`.

Inspiration: [Fii official site](https://fiiresto.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a warm minimalist Nordic restaurant, floor-to-ceiling windows, pale oak slatted walls, soft copper pendant lamps, light cream seating, uncluttered tables with elegant locally inspired vegetable and fish dishes, tall potted herbs. Sand beige, copper, pine green and pale oak. Main focal point: refined open dining space with broad windows and sculptural copper lights, no arches.
```

### Vilde ja Vine

Asset: `public/art/restaurants/vilde-ja-vine.webp`. Existing restaurant ID: `maitsed`.

Inspiration: [Vilde ja Vine official site](https://vilde.ee/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: an artistic old-town gallery restaurant with warm burgundy upholstered chairs, tasteful framed colorful paintings, dark timber bookshelves, tall veranda windows, cream tablecloths and an inviting dining table with bread and seasonal vegetables. Burgundy, walnut, amber and cream. Main focal point: gallery wall of colorful paintings and cozy veranda tables.
```

### Tacora

Asset: `public/art/restaurants/tacora.webp`. Existing restaurant ID: `roheline`.

Inspiration: [Tacora official site](https://sevensons.ee/kohad/tacora/).

```text
Use case: stylized-concept. Asset type: one unique restaurant banner illustration for an existing cozy pixel-art food adventure game in Tartu, Estonia. Input image is a STYLE REFERENCE ONLY: match the detailed hand-painted pixel clusters, crisp dark edges, warm cheerful palette and inviting game-world atmosphere. Create a VERY WIDE 3:1 LANDSCAPE panoramic illustration, never square or portrait. Depict a distinct cozy restaurant interior as an artistic interpretation, not a photographic or exact architectural reconstruction. All key objects, tables and the main focal feature must be centered in the middle horizontal band so a shallow desktop crop and a narrower mobile crop both work. Keep upper and lower edges expendable. Eye-level wide room view, warm inviting daylight and soft amber practical lighting, detailed but visually calm. NO people, no raccoon, no UI, no text, no lettering, no logos, no watermarks, no readable signs, no borders. No alcoholic drinks or alcohol bottles. A restaurant logo will be added later by real HTML at the lower-left corner, so leave a calm slightly darker small area there. Opaque full-bleed backdrop. Distinct theme: a bright Mexican-inspired taqueria in an old-town setting, terracotta walls, turquoise and cobalt patterned ceramic tiles, an open tortilla counter with fresh tacos and bowls of salsa, lime wedges, warm lamps, colorful simple chairs and small cactus pots. Terracotta, turquoise, cobalt and lime green palette. Main focal point: colorful tiled taco counter, no drinks or bottles.
```

