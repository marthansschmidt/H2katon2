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

Loogikatestid kontrollivad andmete piisavust, juhuvalikut, nähtud toitude eelistusi, kõiki üheksat valikut, päevade vahetust, skoori, enesetunde muutuse piiramist ja tagasisidet. Päeva eesmärgi testid kontrollivad kõiki võiduni viivaid valikute algusi kõigis 12 restoranis, nõrgemaid valikuid ning vana veegrupiga salvestuse taastamist. Brauseritestid läbivad mängu telefoni-, tahvelarvuti- ja arvutivaates, kontrollivad värskendamise järel jätkamist, menüü püsimist ning mängu nullimist. Mobiilitestid kontrollivad lisaks 375 ja 430 px puuteekraanidel nupusuurusi, püsivat progressikaarti ning dialoogide kerimist ja sulgemist. `tests/responsive.spec.ts` kontrollib kõiki vaateid ja dialooge 14 ekraanisuurusel, alates 320 × 568 telefonist ja 568 × 320 rõhtvaatest kuni 2560 × 1440 arvutiekraanini. Kontrollitakse ekraani täitmist, teksti ja dialoogide ülevoolu, kaardinuppude kattumist ja staatusekaardi taha jäämist ning kõnemulli loetavust. Ekraanipildid salvestatakse kausta `test-results/`.

## Projekti ülesehitus

- `src/types/game.ts`: TypeScripti andmemudelid.
- `src/data/`: 12 fiktiivset restorani, 40 erinevat toitu, 6 põhigruppi ja valikuline maiustuste grupp. Igal restoranil on näidismenüü; toidukorra kolm valikut kohandatakse päeva puuduvate mummude järgi.
- `src/services/restaurantService.ts`: vahetatav `RestaurantProvider`, praegune `MockRestaurantProvider` ja UI kasutatavad asünkroonsed teenusefunktsioonid, restoranide ja toidumenüüde jaoks.
- `src/game/`: juhuvalik, püramiidi arvutused, skoor, enesetunne, tagasiside, oleku muutused ja kohalik salvestamine.
- `src/components/`: korduvkasutatav kasutajaliides ja kohalikud pixel-art illustratsioonid.
- `src/pages/`: peamenüü, juhend, kaart, päeva kokkuvõte ja lõpptulemus.

Kõigil 40 menüütoidul on oma nimele ja koostisosadele vastav läbipaistva taustaga 320 × 320 PNG kaustas `public/art/foods/`. Fail `src/data/foodImages.ts` seob pildid toidu ID-ga; menüü ja päevakokkuvõte kasutavad sama pilti ka varem salvestatud mängudes. Pildid loodi sisseehitatud imagegen-tööriistaga; genereerimispromptid on failis `docs/food-images-prompts.md`.

Kaustas `public/art/` on ka pesukaru nelja poosi atlas, üldine 15 pildiga toiduatlas püramiidi jaoks, taimse võileiva lisapilt ning kolm Tartu stseeni. Atlased ja kaardid loodi imagegen-tööriistaga ja pakiti WebP-vormingusse algses resolutsioonis. SVG viewBox eraldab atlasest vajalikud tegelased ja toidud; HTML-tekstid ja nupud jäävad interaktiivseteks elementideks. Nende genereerimispromptid on failis `docs/art-prompts.md`.

Kaustas `public/art/moods/` on kolm läbipaistva taustaga 512 × 512 pesukaru pilti: murelik, väsinud ja turgutust vajav. Need loodi imagegeniga algse atlase järgi; promptid on failis `docs/raccoon-moods-prompts.md`. Mängus on kaks enesetunde olekut: „Hea olla“ ja „Kõht on paha“. Kaardi portree, toiduvaliku kinnituspilt ning päeva- ja lõppkokkuvõtte tegelane kasutavad olekule vastavat rõõmsat või halva enesetunde pilti. Dinosauruse väsinud ja halva enesetunde poos on failis `public/art/moods/dinosaur-unwell.png`, loodud sisseehitatud imagegeniga; prompt on failis `docs/dinosaur-unwell-prompt.md`. Halva enesetunde kaardiportree näitab sama tegelase nägu lähemalt; taastumisel tuleb rõõmus portree tagasi. Algus-, söömis- ja lõpupoosid säilivad. Enesetunde arvutus, tekstid ja vihjed kasutavad toiduvalikutest sõltuvaid enesetunde olekuid.

Kõigil 12 söögikohal on oma 1200 × 400 WebP-bänner kaustas `public/art/restaurants/`. Bännerid loodi imagegeniga mängu pildistiilis, lähtudes söögikohtade üldisest iseloomust; need on kunstilised tõlgendused. Toiduvaliku vaate ülaosas on valitud söögikoha bänner ja olemasolev logo. `src/data/restaurantBanners.ts` seob pildid säilitatud restorani ID-dega. Genereerimispromptid ja inspiratsiooniallikad on failis `docs/restaurant-banners-prompts.md`.

Komponendid ei impordi mock-restoranide andmeid. Tulevase REST-integratsiooni jaoks loo `RestaurantProvider` liidest täitev `ApiRestaurantProvider` ja ühenda see `setRestaurantProvider()` kaudu. Ülejäänud mäng ei vaja andmeallika vahetamisel muudatusi. Praegune rakendus ei kasuta scrapingut, päevapakkumised.ee-d, taustaserverit ega väliseid API-sid. Kõik fondid ja illustratsioonid töötavad lokaalselt; infoallika link avatakse ainult mängija soovil.

## Mängureeglid

Pärast toidu kinnitamist kaob valitud söögikoht sama toidukorra kaardilt. Teiste mullide asukohad jäävad paigale ning kinnitatud toidukorra menüüd ei saa uuesti avada. Peitmine säilib lehe värskendamisel. Järgmisele toidukorrale liikudes loositakse kõik viis söögikohta uuesti ning menüüd tühjendatakse.

Magusat pakuvad mängus Werner, Kolm Tilli, Humal, Kampus, Fii ja Vilde ja Vine. Nende menüüs on iga toidukorra ajal vähemalt üks magus valik; ülejäänud söögikohtade menüüs maiustustega toite ei ole. Igas kaardile loositud viisikus on mõlemat tüüpi söögikohti. Varem söödud magusad toidud jäävad järgmiste toidukordade menüüdes lubatuks, arvestades toidu sobivust hommiku-, lõuna- või õhtusöögiks. Põhigruppide mummud ja skoor on endiselt piiratud päeva eesmärkidega; maiustuste mummud võivad üle piiri koguneda; iga söödud magusa toidu tegelik kogus mõjutab enesetunnet ka pärast valikulise maiustuste mummu täitumist.

Päevas on kolm kohustuslikku toiduvalikut. Viis restorani loositakse iga hommiku-, lõuna- ja õhtusöögi jaoks. Eelmise toidukorra kohad jäetakse kõrvale ning ülejäänute seas eelistatakse varem näitamata kohti. 12 restoraniga võivad varasemate voorude kohad hiljem tagasi tulla, kuid järjestikused viisikud ei kattu. Väiksema andmeallika puhul on puuduvate alternatiivide asemel lubatud kordused. Loositud kohtade komplekt ja avatud menüüd püsivad sama toidukorra jooksul ka lehe värskendamisel. `usedFoodIds` salvestab nähtud menüütoidud; uued menüüd eelistavad nägemata toite, kuid sobivate valikute lõppedes on kordused lubatud.

Päeva eesmärgid on köögiviljad 4, puuviljad 4, teraviljad 4, piimatooted 3, valguallikad 2 ja toidurasvad 3 mummu. Kõigi kuue põhigrupi read on kolme sobiva toiduga täidetavad. Maiustuste ja näkside päeva mängupiir on üks mummu, kuid tegelik kogus võib seda ületada. Iga magus toiduvalik lisab kuni ühe maiustuste mummu, ka teisel ja kolmandal toidukorral. Päevas saab nii koguneda kuni kolm mummu. Üle piiri mummud kuvatakse püramiidis eraldi ning need ei mõjuta põhigruppide eesmärgi täituvust ega anna lisapunkte; vee ja jookide gruppi mängus praegu ei ole.

Igas söögikohas on kolm eri toitu, millest üks lisab rangelt rohkem puuduvaid põhigruppide mummusid kui ülejäänud kaks. Menüü koostamisel kontrollitakse ka ülejäänud toidukordi: parim valik säilitab võimaluse kõik kuus eesmärki täita. Kahe väiksema mummude juurdekasvuga valiku seas eelistatakse toite, mis seda võimalust ei säilita; magusat pakkuvas söögikohas jäetakse menüüsse alati magus valik. Vajaduse korral täiendatakse restorani näidismenüüd kogu toidukataloogist. Valikud segatakse juhuslikku järjekorda ja salvestatakse toidukorra lõpuni. Pärast nõrgemat valikut on järgmistel toidukordadel endiselt üks suurima võimaliku juurdekasvuga valik.

Täidetud põhigrupi rida rohkem mummusid ei kogu. Maiustuste ja näkside rida kogub ühe mummu iga magusa valiku eest ka üle päeva piiri. Toidukaart ja valiku tagasiside näitavad tegelikult lisanduvaid mummusid. Iga uus põhigrupi mummu annab 50 punkti; kõik 20 põhigrupi mummu annavad kokku 1000 punkti. Kolme päeva maksimum on 3000 punkti. Lõpptulemuse hinnang on 1–5 tärni: 1 tärn 0–599, 2 tärni 600–1199, 3 tärni 1200–1799, 4 tärni 1800–2399 ja 5 tärni 2400–3000 punkti eest. Lõppekraan näitab viit tärni, millest teenitud tärnid on kuldsed. Varasemate salvestuste toitude mummud ja punktid viiakse uutele eesmärkidele vastavusse; pooleli jäänud menüüd koostatakse uuesti. Enesetunne muutub sujuvalt, kuni 14 punkti toidukorra kohta. Päevakokkuvõte näitab täidetud ridu ja puuduvaid gruppe; lõpptulemus näitab koguskoori, tärne, seikluse lõpu enesetunnet ja soovitust järgmiseks seikluseks.

Mäng salvestab oleku brauseri `localStorage`-isse. Kui salvestamine on keelatud, saab mängida samas aknas. Uus mäng nullib päevad, punktid, menüüd ja kasutatud ID-d.

Enesetunne arvestab põhigruppide mummude kogumist võrreldes juba söödud toidukordadega ja gruppide mitmekesisust. Veel proovimata grupid mõjutavad enesetunnet rohkem päeva lõpupoole. Kuvatav enesetunne on ainult hea või halb. Liigne magus teeb mõlema tegelase kõhu pahaks ning mitmekesine toit aitab sellest taastuda. Muutus on kuni 14 punkti iga toidukorra kohta. Uus päev säilitab eelmise päeva enesetunde ja võimaliku halva enesetunde oleku; päeva mummud nullitakse. Kaardil muutuvad enesetunde tekst ja portree koos; hea ja halva enesetunde pildid on mõlema tegelase jaoks erinevad. Mõlema tegelase enesetunne taastatakse ka varem salvestatud toiduvalikutest. Maiustuste ja näkside tegelik kogus arvutatakse kõigist söödud toitudest, sõltumata püramiidi ühe mummu piirist. Iga magus toiduvalik lisab ühe mummu nii püramiidi kui ka enesetunde arvestusse. Üks mummu ei põhjusta liigse magusa halba enesetunnet. Kui päeva kogus ületab ühe mummu, langeb enesetunne ja tekstiks saab „Kõht on paha“. Päevakokkuvõttes muutub tegelane visuaalselt väsinuks või halva enesetundega tegelaseks. Sõnum viitab järgmisel päeval uutele valikutele; kolmanda päeva järel viitab see järgmisele seiklusele. See on mängureegel, mitte toitumisnorm. Halb enesetunne tuleb järgmisesse hommikusse kaasa ja säilib ka lehe värskendamisel. Mitmekesine toidukord, mis lisab mummusid vähemalt kolmest põhigrupist, aitab enesetunnet järk-järgult parandada, kui selle päeva näkside piir pole ületatud. Selline valik aitab ka päritud halvast enesetundest väljuda; energia taastub sujuvalt järgmiste valikutega. Uus mäng algab rahuliku enesetundega. Lõppkokkuvõtte enesetunde plokk näitab ainult hetke enesetunnet paksus kirjas. Kõik päevad arvutatakse järjekorras, nii et varasemate valikute mõju ja hilisem taastumine jõuavad ka lõpptulemusse. Salvestatud enesetunne taastatakse kogu seikluse toiduvalikutest.

## Toitumise alus

Sisuline alus on Tervise Arengu Instituudi [toitumine.ee toidusoovitused](https://toitumine.ee/kuidas-tervislikult-toituda/toidusoovitused): mitmekesine menüü, gruppide proportsioonid, puhas joogivesi ja pikema perioodi tervik. Mängu mummud ja nende päeva vahemikud on hariduslik abstraktsioon, mitte portsjonid, kalorid, toitumisnormid ega meditsiiniline nõuanne. Päris toidupüramiid kirjeldab pikemat perioodi kui üks päev. Mäng jaotab köögiviljad ning puuviljad eraldi gruppideks ning liidab taimsed valguallikad valguallikate gruppi.

Kõik illustratsioonid ja fondid serveeritakse kohalikult; mäng ei vaja töö ajal pildi- ega fonditeenuseid.
