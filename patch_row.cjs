const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Remove the advance button from ItemRow
c = c.replace(
  `        {next&&<button onClick={e=>{e.stopPropagation();onAdvance();}} style={{fontSize:11,background:"none",border:\`1px solid \${C.border}\`,borderRadius:6,padding:"3px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)",whiteSpace:"nowrap"}}>{next}</button>}`,
  ''
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
