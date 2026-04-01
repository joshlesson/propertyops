const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add deleteInspection function
c = c.replace(
  'async function deleteTenant(id)',
  `async function deleteInspection(id){
    if(!window.confirm('Delete this inspection record? Items from this inspection will remain.'))return;
    const{error}=await sb.from('inspections').delete().eq('id',id);
    if(!error)setInspections(prev=>prev.filter(i=>i.id!==id));
    else setSaveError('Delete failed: '+error.message);
  }
  async function deleteTenant(id)`
);

// 2. Add delete button next to inspection header
c = c.replace(
  `<div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{prop?.name}</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>{insp.date} - {insp.inspector}</div></div>`,
  `<div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{prop?.name}</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>{insp.date} - {insp.inspector}</div></div>
                    <button onClick={()=>deleteInspection(insp.id)} style={{fontSize:11,background:"#fff0f0",border:"1px solid #ffcccc",borderRadius:6,padding:"4px 10px",cursor:"pointer",color:"#e00",fontFamily:"var(--font-sans)",flexShrink:0,marginLeft:8}}>Delete</button>`
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
