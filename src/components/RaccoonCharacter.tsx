export function RaccoonCharacter({ moodScore = 75, className = '', small = false }: { moodScore?: number; className?: string; small?: boolean }) {
  const tired = moodScore < 50;
  return <svg className={`raccoon ${className} ${moodScore >= 85 ? 'raccoon-happy' : ''}`} viewBox="0 0 240 258" role="img" aria-label={tired ? 'Veidi väsinud pesukaru' : 'Sõbralik pesukaru rohelise seljakotiga'} shapeRendering="crispEdges">
    {!small && <ellipse cx="121" cy="241" rx="72" ry="10" fill="#455d44" opacity=".12" />}
    <g className="raccoon-body">
      <path d="M164 153h22v8h17v17h11v20h-10v15h-21v-8h-19Z" fill="#77817b" />
      <path d="M182 159h17v18h-17m12 10h19v15h-19m-27 2h19v12h-19" fill="#3e4a43" />
      <path d="M149 122h28v8h14v68h-38Z" fill="#557956" />
      <path d="M169 135h15v40h-15v-9h-7v-21h7Z" fill="#7f9c68" />
      <path d="M75 130h83v17h10v65h-16v18h-29v-14h-13v14H78v-18H65v-63h10Z" fill="#929c92" />
      <path d="M93 147h39v10h14v48H84v-47h9Z" fill="#d8d8c7" />
      <path d="M79 218h29v17H71v-9h8m47-8h28v9h9v8h-37" fill="#3c4b41" />
      <path d="M62 112V76H48V40h10V26h29v10h18v22h41V36h19V24h27v15h10v38h-15v44h-13v21H80v-15H62Z" fill="#89958e" />
      <path d="M60 38h20v13h12v22H63V58h-3m103-8h14V36h14v23h-9v16h-19Z" fill="#4c5950" />
      <path d="M65 77h31V64h51v12h37v40h-18v20H85v-16H65Z" fill="#dfdfcd" />
      <path d="M57 82h36V72h21v12h18V72h21v10h37v24h-14v13h-26v-9h-14V99h-24v12H98v9H70v-13H57Z" fill="#394a40" />
      <path d={tired ? 'M77 96h16v5H77m76-5h16v5h-16' : 'M80 87h9v16h-9m66-16h9v16h-9'} fill="#fffced" />
      {!tired && <path d="M83 91h6v10h-6m63-10h6v10h-6" fill="#20372c" />}
      <path d="M98 114h13v-8h26v8h13v18h-14v10h-24v-10H98Z" fill="#f4efdc" />
      <path d="M115 111h18v9h-6v6h-6v-6h-6" fill="#2c4032" />
      <path d={tired ? 'M114 134h20v4h-20' : 'M111 128h7v6h14v-6h7v10h-8v5h-12v-5h-8Z'} fill="#4e5b49" />
      <path d="M73 110h18v7H73m85-7h17v7h-17" fill="#d99582" opacity=".7" />
      <path d="M76 137h89v12h-9v9H82v-9h-6Z" fill="#eaac72" />
      <path d="M148 151h15v31h-18v-9h-7v-12h10" fill="#dc925c" />
      <path d="M66 157h18v16h10v21H76v-10H65m89-27h14v21h-11v13h-19v-19h16" fill="#89958d" />
      {!small && <g><path d="M102 167h25v7h10v24h-10v8h-27v-8H91v-22h11Z" fill="#d97056" /><path d="M104 177h7v17h-7" fill="#efa38a" /><path d="M114 155h7v18h-7" fill="#685946" /><path d="M123 153h17v7h-7v7h-12v-7h2Z" fill="#699152" /></g>}
    </g>
  </svg>;
}
