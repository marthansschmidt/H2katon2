import type { FoodArt } from '../types/game';
export function FoodIllustration({ type }: { type: FoodArt }) {
  const bowl = ['porridge', 'yogurt', 'bowl', 'soup', 'salad', 'pasta'].includes(type);
  return <svg viewBox="0 0 180 130" className={`food-illustration art-${type}`} aria-hidden="true" shapeRendering="crispEdges">
    <ellipse cx="90" cy="112" rx="53" ry="7" fill="#6e7b54" opacity=".12" />
    {bowl && <>
      <path d="M34 49h111v35h-9v14h-15v10H59V98H44V83H34Z" fill={type === 'yogurt' ? '#dac5dc' : '#e2a681'} />
      <path d="M42 79h94v8h-8v12H57V88H42Z" fill={type === 'yogurt' ? '#c5aac7' : '#c78268'} />
      <path d="M31 45h116v14H31Z" fill="#f8ecd6" /><path d="M41 44h97v10H41Z" fill={type === 'soup' ? '#e4ac65' : type === 'salad' ? '#9aba78' : '#d3bd86'} />
      {['porridge', 'yogurt'].includes(type) ? <><path d="M51 42h13v12H51m44-15h12v12H95m21-6h11v11h-11" fill="#716787" /><path d="M73 33h17v9H73v8h10v-8h-10m41-11h13v10h-13" fill="#cd7776" /><path d="M59 36h11v5H59m33 13h10v5H92" fill="#7c995d" /></> : <><path d="M46 43h20v12H46m51-22h15v20H97m22-13h12v15h-12" fill="#89a95f" /><path d="M69 32h15v15H69m-9 15h13v10H60m48-6h17v10h-17" fill="#d9905b" /><path d="M80 43h15v13H80m34-22h13v8h-13" fill={type === 'pasta' ? '#d7b46e' : '#ead8a5'} /></>}
      <path d="M145 38h5v-21h5v25h-5v17h-5" fill="#9a9c80" />
    </>}
    {['toast', 'wrap'].includes(type) && <><path d="M38 93h110v11H38Z" fill="#e3dec5" /><path d="M49 45h15V31h54v14h14v50H49Z" fill="#b78356" /><path d="M56 50h14V39h42v11h13v37H56Z" fill="#e8c58d" /><path d="M64 55h50v12H64m7 12h47v9H71" fill="#8da55b" /><path d="M85 48h19v15H85m-18 13h16v13H67" fill="#dd8b6a" /><path d="M88 71h23v13H88" fill="#f0dda6" /></>}
    {type === 'burger' && <><path d="M34 56h110v12H34m11-12V43h12V32h64v11h12v13" fill="#dab070" /><path d="M34 78h110v12H34m11 0h87v14H45" fill="#cb945c" /><path d="M35 66h108v11H35" fill="#709b5a" /><path d="M42 76h94v10H42" fill="#79513d" /><path d="M49 70h35v8h12v-8h33v10H49" fill="#e9c376" /><path d="M66 43h5v5h-5m26-9h5v5h-5m15 8h5v5h-5" fill="#f4dfb1" /></>}
    {type === 'pancakes' && <><path d="M30 101h120v8H30" fill="#d5d9bf" /><path d="M43 85h95v13H43m-5-29h104v12H38m6-29h93v12H44" fill="#dca267" /><path d="M43 81h95v6H43m-5-18h104v6H38m6-26h93v6H44" fill="#f3d39a" /><path d="M69 37h35v13H69m19 13h22v30H88" fill="#bb7850" /><path d="M100 26h15v15h-15m-36-9h13v14H64" fill="#d87670" /><path d="M102 21h15v6h-15" fill="#799959" /></>}
    {type === 'cake' && <><path d="M33 102h119v8H33" fill="#d1d9c6" /><path d="M45 51h90v51H45" fill="#8a6256" /><path d="M45 51l40-22h50v22Z" fill="#ae7d69" /><path d="M45 71h90v11H45" fill="#d9b098" /><path d="M45 94h90v8H45" fill="#624b43" /><path d="M91 25h12v17H91m16-12h11v16h-11" fill="#c87b76" /><path d="M96 21h17v5H96" fill="#839c62" /></>}
    {type === 'smoothie' && <><path d="M62 40h60v13h-5v56H68V53h-6Z" fill="#bd93b5" /><path d="M73 48h36v54H73" fill="#d0b1c7" /><path d="M57 33h68v10H57" fill="#e0c9da" /><path d="M100 10h6v29h-6m6-29h25v6h-25" fill="#7c9b68" /><path d="M73 62h6v26h-6" fill="#eddae3" /><path d="M49 36h12v13H49" fill="#799967" /></>}
    {type === 'fruit' && <><path d="M36 54h30v-9h18v9h10v33H84v16H49V90H36Z" fill="#d88566" /><path d="M64 36h6v21h-6" fill="#806a4a" /><path d="M69 35h18v8H69" fill="#819e61" /><path d="M106 33h13v32h13v29h-10v13h-26v-13H87V65h19Z" fill="#bfbc72" /><path d="M136 94h12v13h-12m-17-10h13v15h-13" fill="#9d805d" /></>}
    {type === 'fish' && <><path d="M26 90h131v19H26" fill="#d7ddc9" /><path d="M51 48h71v12h14v25h-14v10H51V85H39V60h12" fill="#dea184" /><path d="M64 55h9v29h-9m18-29h9v29h-9m18-29h9v29h-9" fill="#f1c2a5" /><path d="M35 80h21v19H35m85-2h25v18h-25m-64-2h20v16H81" fill="#b6bb73" /><path d="M33 41h10v-8h14v8h8v17H33" fill="#81a16b" /></>}
  </svg>;
}
