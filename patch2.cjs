const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const oldBtn = '{view!=="tenants"&&<button onClick={()=>setShowAdd(true)}';
const newBtn = '{view==="items"&&<button onClick={()=>doExport(filtered)} style={{fontSize:13,fontWeight:500,background:"#f0fff4",border:"1px solid #bbf7d0",borderRadius:7,padding:"6px 14px",cursor:"pointer",color:"#16a34a",fontFamily:"var(--font-sans)"}}>Export to Excel</button>}' + oldBtn;
c = c.replace(oldBtn, newBtn);
fs.writeFileSync('src/App.jsx', c);
console.log('done');
