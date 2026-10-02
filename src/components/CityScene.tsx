// Original code-native artwork, kept local so the game works without an image service.
function Tree({ x, y, scale = 1, dark = false }: { x: number; y: number; scale?: number; dark?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cx="0" cy="32" rx="25" ry="7" fill="#70976a" opacity=".15" /><path d="M-5 5h10v32H-5Z" fill="#a68a63" /><path d="M-20-23h9v-12h21v10h12v13h8v22h-9v10h-41V9h-10v-21h10Z" fill={dark ? '#5eaa63' : '#8fc969'} /><path d="M-13-25h15v-8h10v14h-12v13h-15Z" fill="#c0e092" opacity=".65" /></g>;
}
function Building({ x, y, color = '#e6c0a3', roof = '#a66f58', width = 72 }: { x: number; y: number; color?: string; roof?: string; width?: number }) {
  return <g transform={`translate(${x} ${y})`}><path d={`M0 0h${width}v68H0Z`} fill={color} /><path d={`M-6 0l${width / 2 + 6}-31L${width + 6} 0Z`} fill={roof} /><path d={`M${width} 0h14v68h-14Z`} fill="#ae967c" opacity=".35" /><path d={`M${width / 2 - 7} 44h14v24h-14Z`} fill="#8b927f" /><path d={`M10 13h12v18H10m${width - 32} -18h12v18h-12`} fill="#f8edcf" /><path d={`M10 22h12m${width - 32} 0h12`} fill="none" stroke="#b49c7d" strokeWidth="2" /></g>;
}
export function CityScene({ map = false }: { map?: boolean }) {
  return <svg viewBox="0 0 760 540" className="city-art" role="img" aria-label="Stiliseeritud Tartu: Emajõgi, Kaarsild, raekoda, värvilised majad ja rohelised pargid">
    <defs><pattern id={map ? 'map-grid' : 'hero-grid'} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="#78966b" opacity=".055" /></pattern></defs>
    <path d="M65 103Q178 32 359 59T672 131Q754 230 694 368T440 481Q191 530 61 393T65 103Z" fill="#dbeab9" />
    <path d="M65 103Q178 32 359 59T672 131Q754 230 694 368T440 481Q191 530 61 393T65 103Z" fill={`url(#${map ? 'map-grid' : 'hero-grid'})`} />
    <path d="M29 298Q150 234 225 292T405 317Q545 213 742 236L754 317Q563 300 455 387T233 368Q111 307 39 369Z" fill="#79cee2" />
    <path d="M30 295Q151 231 226 289T405 314Q545 210 742 233" fill="none" stroke="#d0e3d8" strokeWidth="12" />
    <path d="M41 368Q113 306 233 367T453 389Q563 300 753 317" fill="none" stroke="#43aec9" strokeWidth="4" />
    <g stroke="#d0e7e4" strokeWidth="3" opacity=".8"><path d="M83 319h35m34 16h28m117 4h36m210-47h35m90-22h42m-42 23h18m-251 61h25" /></g>
    <path d="M96 195L302 143l129 60 194-27M132 434l171-50 171 54 155-69M304 98l-3 161M480 97l32 158M621 180l21 75" fill="none" stroke="#f4ebd4" strokeWidth="25" strokeLinejoin="round" />
    <path d="M96 195L302 143l129 60 194-27M132 434l171-50 171 54 155-69" fill="none" stroke="#d7cbae" strokeWidth="2" strokeDasharray="5 8" />
    <g transform="translate(442 260) rotate(-30)"><path d="M-14 0h91v99h-91Z" fill="#ece4cb" /><path d="M-16 0h6v99h-6m85-99h6v99h-6" fill="#c2baa4" /><path d="M-13 65Q32-31 78 65" fill="none" stroke="#f9f2de" strokeWidth="8" /><path d="M0 43v30m18-48v48m20-51v51m20-37v37" fill="none" stroke="#d8d0b8" strokeWidth="4" /></g>
    <Building x={158} y={146} width={65} color="#e5c68d" roof="#b08e60" />
    <Building x={231} y={115} width={56} color="#d8b5a1" roof="#a27765" />
    <Building x={544} y={146} width={60} color="#c8d2b4" roof="#89976e" />
    <Building x={605} y={127} width={52} color="#e8cfa6" roof="#ac7b61" />
    <Building x={146} y={397} width={56} color="#d9b3a0" roof="#a87566" />
    <Building x={216} y={422} width={62} color="#e5d8b2" roof="#968e6c" />
    <Building x={568} y={399} width={57} color="#d2bdab" roof="#b1826c" />
    <g transform="translate(346 144)"><path d="M-29 4h125v79H-29Z" fill="#f3b5a1" /><path d="M-37 5l29-28h84l28 28Z" fill="#bb6957" /><path d="M9-27h44v-44H40v-17H23v17H9Z" fill="#eed5b8" /><path d="M5-72l26-23 26 23Z" fill="#9b7562" /><path d="M23-90v-20h4v20" fill="#8a7d5e" /><circle cx="31" cy="-48" r="11" fill="#fbf1d7" /><path d="M31-55v8h6" fill="none" stroke="#82745f" strokeWidth="2" /><path d="M18 48h26v35H18Z" fill="#9a8b75" /><path d="M-13 18h13v20h-13m28-20h13v20H15m28-20h13v20H43m28-20h13v20H71m-84 11h13v20h-13m84-20h13v20H71" fill="#f8e5ca" /><path d="M-35 81H99v7H-35Z" fill="#ceac91" /></g>
    <g fill="#acbd8f"><path d="M64 222h26v11h-26m21-17h31v9H85m534 221h25v9h-25m-13-19h28v9h-28" /></g>
    <Tree x={108} y={131} scale={1.2} /><Tree x={65} y={214} scale={.8} dark /><Tree x={130} y={247} scale={.85} />
    <Tree x={300} y={220} scale={.7} /><Tree x={528} y={105} scale={.85} dark /><Tree x={686} y={191} scale={1.05} />
    <Tree x={85} y={392} scale={1.15} dark /><Tree x={322} y={431} scale={.8} /><Tree x={521} y={438} scale={1.2} /><Tree x={669} y={358} dark />
    <g fill="#f4ead0"><path d="M118 79h31v7h-31m19-18h8v29h-8m491-2h23v6h-23m8-9h6v23h-6" /></g>
    <g fill="#6d8f61"><path d="M61 434h4v4h-4m81 24h4v4h-4m434 15h4v4h-4m102-229h4v4h-4" /></g>
    <g fill="#e4a478"><path d="M81 239h5v5h-5m24 172h5v5h-5m569-73h5v5h-5m-106 55h5v5h-5" /></g>
    {map && <g fontSize="12" fontWeight="600" fill="#627c71" fontFamily="Arial, sans-serif"><text x="565" y="302" transform="rotate(-9 565 302)">E M A J Õ G I</text><text x="318" y="248">RAEKOJA PLATS</text><text x="72" y="105">TOOMEMÄGI</text><text x="189" y="495">KARLOVA</text><text x="535" y="83">ÜLEJÕE</text></g>}
  </svg>;
}
