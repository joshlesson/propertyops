const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Make pills bigger and bolder
c = c.replace(
  'function Chip({label,tc,bg,bc}){return<span style={{fontSize:11,fontWeight:500,padding:"2px 9px",borderRadius:99,background:bg,color:tc,border:`1px solid ${bc}`,whiteSpace:"nowrap"}}>{label}</span>;}',
  'function Chip({label,tc,bg,bc,large}){return<span style={{fontSize:large?12:11,fontWeight:large?700:500,padding:large?"4px 12px":"2px 9px",borderRadius:99,background:bg,color:tc,border:`1px solid ${bc}`,whiteSpace:"nowrap",letterSpacing:large?"-0.01em":"normal"}}>{label}</span>;}'
);

// Use large=true for PPill and SPill
c = c.replace(
  'function PPill({p}){return<Chip label={p} tc={PCOLOR[p]} bg={PBG[p]} bc={PBDR[p]}/>;}',
  'function PPill({p}){return<Chip label={p} tc={PCOLOR[p]} bg={PBG[p]} bc={PBDR[p]} large/>;}',
);
c = c.replace(
  'function SPill({s}){return<Chip label={s} tc={SCOLOR[s]} bg={SBG[s]} bc={SBDR[s]}/>;}',
  'function SPill({s}){return<Chip label={s} tc={SCOLOR[s]} bg={SBG[s]} bc={SBDR[s]} large/>;}',
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
