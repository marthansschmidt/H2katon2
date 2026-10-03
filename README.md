# Toiduseiklus

Responsiivne eestikeelne häkatonimäng 16–19-aastastele: kolm päeva Tartus, üheksa toiduvalikut, mänguline toidupüramiid ja pesukaru tagasiside.

Kaart vahetub koos toidukorraga: hommikusöögi ajal on pehme koiduvalgus, lõunasöögi ajal loomulike mahedate värvidega keskpäev ning õhtusöögi ajal hämar linn valgustatud akende ja laternatega. Kõigis kolmes vaates on sama tänavapaigutus ja majad ka kaardi keskel. Söögikohtade mullid kasutavad majade katusepunkte ning kohanduvad ekraani suuruse järgi. Kaardid asuvad failides `public/art/tartu-map-morning.webp`, `public/art/tartu-map-noon-v2.webp` ja `public/art/tartu-map-night.webp`; genereerimispromptid on failis `docs/map-variants-prompts.md`.

## Kujundus

Mäng täidab ekraani laiuse ja vähemalt ekraani kõrguse. Telefonis paikneb sisu ühes veerus; tahvlil ja arvutis kasutavad avaleht, juhend, menüü ja lõpptulemus mitut veergu. Päevakokkuvõte läheb kahte veergu alates 900 px laiusest, et menüükaardid jääksid loetavaks. Avaleht kasutab täisekraanilist Tartu stseeni, erksat mängulogo ning suuri ruumilisi nuppe. Kreemitaust, rohelised tegevusnupud, ümarad kaardid ja värvilised progressimummud moodustavad ühise süsteemi. Kaardivaates püsib pesukaru staatusekaart all nähtaval ning söögikohtade nupud paiknevad ülemiste juhtnuppude ja staatusekaardi vahel. Madalas rõhtvaates on kaardinupud ühes reas. Juhendis ja päevakokkuvõttes on kleepuv tegevusnupp. Restoranimenüü täidab telefoni ekraani ning pikem sisu kerib dialoogi sees.

Ühised komponendid: `GameShell`, `MobileHeader`, `PrimaryButton`, `SecondaryButton`, `Card`, `FoodCard`, `RestaurantMarker`, `RaccoonStatus`, `FoodGroupDot`, `FoodGroupProgress`, `DayProgress`, `MealBadge`, `FeedbackModal` ja `SummaryCard`. Värvid, vahed, nurgad ja varjud on määratud failis `src/styles.css`. Nunito fondifail on kohalik (`public/fonts/`), SIL Open Font License on kõrval failis `OFL.txt`. Vähendatud animatsioonide eelistust ja telefoni turvaalasid arvestatakse CSS-is. Mänguloogika ja toitumisvahemikud jäid kujundustöö käigus samaks.

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

Loogikatestid kontrollivad andmete piisavust, juhuvalikut, nähtud toitude eelistusi, kõiki üheksat valikut, päevade vahetust, skoori, enesetunde muutuse piiramist ning ala- ja ületarbimise tagasisidet. Brauseritestid läbivad mängu telefoni-, tahvelarvuti- ja arvutivaates, kontrollivad värskendamise järel jätkamist, menüü püsimist ning mängu nullimist. Mobiilitestid kontrollivad lisaks 375 ja 430 px puuteekraanidel nupusuurusi, püsivat progressikaarti ning dialoogide kerimist ja sulgemist. `tests/responsive.spec.ts` kontrollib kõiki vaateid ja dialooge 14 ekraanisuurusel, alates 320 × 568 telefonist ja 568 × 320 rõhtvaatest kuni 2560 × 1440 arvutiekraanini. Kontrollitakse ekraani täitmist, teksti ja dialoogide ülevoolu, kaardinuppude kattumist ja staatusekaardi taha jäämist ning kõnemulli loetavust. Ekraanipildid salvestatakse kausta `test-results/`.

## Projekti ülesehitus

- `src/types/game.ts`: TypeScripti andmemudelid.
- `src/data/`: 12 fiktiivset restorani, 40 erinevat toitu ja 8 toidugruppi. Igal restoranil on 6 toitu; toidukorra jaoks näidatakse 3 sobivat valikut.
- `src/services/restaurantService.ts`: vahetatav `RestaurantProvider`, praegune `MockRestaurantProvider` ja UI kasutatavad asünkroonsed teenusefunktsioonid.
- `src/game/`: juhuvalik, püramiidi arvutused, skoor, enesetunne, tagasiside, oleku muutused ja kohalik salvestamine.
- `src/components/`: korduvkasutatav kasutajaliides ja kohalikud pixel-art illustratsioonid.
- `src/pages/`: peamenüü, juhend, kaart, päeva kokkuvõte ja lõpptulemus.

Illustratsioonid asuvad kaustas `public/art/`: pesukaru nelja poosi atlas, 15 toidupildi atlas, taimse võileiva lisapilt ning kolm Tartu stseeni. Need loodi sisseehitatud imagegen-tööriistaga ja pakiti WebP-vormingusse algses resolutsioonis. SVG viewBox eraldab atlasest vajalikud tegelased ja toidud; HTML-tekstid ja nupud jäävad päris interaktiivseteks elementideks. Genereerimispromptid on failis `docs/art-prompts.md`.

Komponendid ei impordi mock-restoranide andmeid. Tulevase REST-integratsiooni jaoks loo `RestaurantProvider` liidest täitev `ApiRestaurantProvider` ja ühenda see `setRestaurantProvider()` kaudu. Ülejäänud mäng ei vaja andmeallika vahetamisel muudatusi. Praegune rakendus ei kasuta scrapingut, päevapakkumised.ee-d, taustaserverit ega väliseid API-sid. Kõik fondid ja illustratsioonid töötavad lokaalselt; infoallika link avatakse ainult mängija soovil.

## Mängureeglid

Pärast toidu kinnitamist kaob valitud söögikoht sama toidukorra kaardilt. Teiste mullide asukohad jäävad paigale ning kinnitatud toidukorra menüüd ei saa uuesti avada. Peitmine säilib lehe värskendamisel. Järgmisele toidukorrale liikudes loositakse kõik viis söögikohta uuesti ning menüüd tühjendatakse.

Päevas on kolm kohustuslikku toiduvalikut. Viis restorani loositakse iga hommiku-, lõuna- ja õhtusöögi jaoks. Eelmise toidukorra kohad jäetakse kõrvale ning ülejäänute seas eelistatakse varem näitamata kohti. 12 restoraniga võivad varasemate voorude kohad hiljem tagasi tulla, kuid järjestikused viisikud ei kattu. Väiksema andmeallika puhul on puuduvate alternatiivide asemel lubatud kordused. Loositud kohtade komplekt ja avatud menüüd püsivad sama toidukorra jooksul ka lehe värskendamisel. `usedFoodIds` salvestab nähtud menüütoidud; uued menüüd eelistavad nägemata toite, kuid sobivate valikute lõppedes on kordused lubatud.

Mäng premeerib uusi igapäevaseid toidugruppe (+50), vähemalt kolme grupiga toidukorda (+100) ja vähemalt 75% mängutasakaaluga päeva (+150). Juba tugevalt täidetud gruppidele toetuvate toidukordade boonus väheneb. Maiustuste söömist ei nõuta ega premeerita uue igapäevase grupina. Burger võib anda mitmekesisuspunkte samadel alustel kui teised toidud.

Enesetunne hindab päevast mitmekesisust ja toidugruppide proportsioone vastavalt söödud toidukordade arvule. Ühe toiduvaliku mõju on piiratud 14 punktiga. Päeva tasakaal ja enesetunne on eri näitajad: enesetunne muutub sujuvalt. Päevakokkuvõte arvestab nii puuduvaid kui ka üle mänguvahemiku täitunud gruppe. Lõputulemus kuvab päevade keskmise tasakaalu, kõigi gruppide suurima mummude arvu ja igapäevaste gruppide väikseima arvu. Mitmekesisusprotsent näitab kasutatud igapäevaste gruppide osakaalu.

Mäng salvestab oleku brauseri `localStorage`-isse. Kui salvestamine on keelatud, saab mängida samas aknas. Uus mäng nullib päevad, punktid, menüüd ja kasutatud ID-d.

## Toitumise alus

Sisuline alus on Tervise Arengu Instituudi [toitumine.ee toidusoovitused](https://toitumine.ee/kuidas-tervislikult-toituda/toidusoovitused): mitmekesine menüü, gruppide proportsioonid, puhas joogivesi ja pikema perioodi tervik. Mängu mummud ja nende päeva vahemikud on hariduslik abstraktsioon, mitte portsjonid, kalorid, toitumisnormid ega meditsiiniline nõuanne. Päris toidupüramiid kirjeldab pikemat perioodi kui üks päev. Mäng jaotab köögiviljad ning puuviljad eraldi gruppideks ning liidab taimsed valguallikad valguallikate gruppi.

Kõik illustratsioonid ja fondid serveeritakse kohalikult; mäng ei vaja töö ajal pildi- ega fonditeenuseid.
