# Pesukaru toiduseiklus

Responsiivne eestikeelne häkatonimäng 16–19-aastastele: kolm päeva Tartus, üheksa toiduvalikut, mänguline toidupüramiid ja pesukaru tagasiside.

## Käivitamine

```sh
npm install
npm run dev
```

Vite kuvab kohaliku aadressi. Tootmisversioon: `npm run build`; selle eelvaade: `npm run preview`.

## Kontrollimine

```sh
npm test
npx playwright install chromium
npx playwright test
```

Loogikatestid kontrollivad andmete piisavust, juhuvalikut, nähtud toitude eelistusi, kõiki üheksat valikut, päevade vahetust, skoori, enesetunde muutuse piiramist ning ala- ja ületarbimise tagasisidet. Brauseritestid läbivad mängu telefoni-, tahvelarvuti- ja arvutivaates, kontrollivad värskendamise järel jätkamist, menüü püsimist ning mängu nullimist.

## Projekti ülesehitus

- `src/types/game.ts`: TypeScripti andmemudelid.
- `src/data/`: 12 fiktiivset restorani, 40 erinevat toitu ja 8 toidugruppi. Igal restoranil on 6 toitu; toidukorra jaoks näidatakse 3 sobivat valikut.
- `src/services/restaurantService.ts`: vahetatav `RestaurantProvider`, praegune `MockRestaurantProvider` ja UI kasutatavad asünkroonsed teenusefunktsioonid.
- `src/game/`: juhuvalik, püramiidi arvutused, skoor, enesetunne, tagasiside, oleku muutused ja kohalik salvestamine.
- `src/components/`: korduvkasutatav kasutajaliides ja kohalikud SVG-illustratsioonid.
- `src/pages/`: peamenüü, juhend, kaart, päeva kokkuvõte ja lõpptulemus.

Komponendid ei impordi mock-restoranide andmeid. Tulevase REST-integratsiooni jaoks loo `RestaurantProvider` liidest täitev `ApiRestaurantProvider` ja ühenda see `setRestaurantProvider()` kaudu. Ülejäänud mäng ei vaja andmeallika vahetamisel muudatusi. Praegune rakendus ei kasuta scrapingut, päevapakkumised.ee-d, taustaserverit ega väliseid API-sid. Kõik fondid ja illustratsioonid töötavad lokaalselt; infoallika link avatakse ainult mängija soovil.

## Mängureeglid

Päevas on kolm kohustuslikku toiduvalikut. Iga toidukorra ajal saab lisaks võtta ühe klaasi vett. Restoranid valitakse päeva alguses: esmalt näitamata kohad, siis vajaduse korral kordused. 12 koha ja 15 päevakoha puhul on kolmandal päeval osa kordusi paratamatu. `usedFoodIds` salvestab nähtud menüütoidud; uued menüüd eelistavad nägemata toite, kuid sobivate valikute lõppedes on kordused lubatud. Sama restorani menüü püsib sama toidukorra jooksul ja ka lehe värskendamisel.

Mäng premeerib uusi igapäevaseid toidugruppe (+50), vähemalt kolme grupiga toidukorda (+100) ja vähemalt 75% mängutasakaaluga päeva (+150). Juba tugevalt täidetud gruppidele toetuvate toidukordade boonus väheneb. Maiustuste söömist ei nõuta ega premeerita uue igapäevase grupina. Burger võib anda mitmekesisuspunkte samadel alustel kui teised toidud.

Enesetunne hindab päevast mitmekesisust ja toidugruppide proportsioone vastavalt söödud toidukordade arvule. Ühe toiduvaliku mõju on piiratud 14 punktiga. Päeva tasakaal ja enesetunne on eri näitajad: enesetunne muutub sujuvalt. Päevakokkuvõte arvestab nii puuduvaid kui ka üle mänguvahemiku täitunud gruppe. Lõputulemus kuvab päevade keskmise tasakaalu, kõigi gruppide suurima mummude arvu ja igapäevaste gruppide väikseima arvu. Mitmekesisusprotsent näitab kasutatud igapäevaste gruppide osakaalu.

Mäng salvestab oleku brauseri `localStorage`-isse. Kui salvestamine on keelatud, saab mängida samas aknas. Uus mäng nullib päevad, punktid, menüüd ja kasutatud ID-d.

## Toitumise alus

Sisuline alus on Tervise Arengu Instituudi [toitumine.ee toidusoovitused](https://toitumine.ee/kuidas-tervislikult-toituda/toidusoovitused): mitmekesine menüü, gruppide proportsioonid, puhas joogivesi ja pikema perioodi tervik. Mängu mummud ja nende päeva vahemikud on hariduslik abstraktsioon, mitte portsjonid, kalorid, toitumisnormid ega meditsiiniline nõuanne. Päris toidupüramiid kirjeldab pikemat perioodi kui üks päev. Mäng jaotab köögiviljad ning puuviljad eraldi gruppideks ning liidab taimsed valguallikad valguallikate gruppi.

Visuaalid on originaalsed Reacti SVG-komponendid; kolmanda osapoole pildi- või fonditeenuseid pole vaja.
