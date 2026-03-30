const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const exportFn = 
async function doExport(filtered) {
  const mod = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
  const X = mod.default || mod;
  const getProp = id => PROPERTIES.find(p => p.id === id);
  const rows = filtered.map(it => ({
    Category: it.category || '',
    Property: getProp(it.propertyId)?.name || '',
    Partnership: GROUPS[getProp(it.propertyId)?.group] || '',
    Description: it.description || '',
    Notes: it.notes || '',
    Status: it.status || '',
    Priority: it.priority || '',
    Assignee: it.assignee || '',
    Scheduled: it.scheduledDate || '',
    Created: it.createdAt?.slice(0,10) || '',
  }));
  const ws = X.utils.json_to_sheet(rows);
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, ws, 'Action Items');
  X.writeFile(wb, 'PropertyOps_Items_' + new Date().toISOString().slice(0,10) + '.xlsx');
}
;
c = c.replace('async function loadAll()', exportFn + '\nasync function loadAll()');
c = c.replace('{view==="items"&&<button onClick={()=>setShowAdd(true)}', '{view==="items"&&<button onClick={()=>doExport(filtered)} style={{fontSize:13,fontWeight:500,background:"#f0fff4",border:"1px solid #bbf7d0",borderRadius:7,padding:"6px 14px",cursor:"pointer",color:"#16a34a",fontFamily:"var(--font-sans)"}}>Export to Excel</button>}{view==="items"&&<button onClick={()=>setShowAdd(true)}');
fs.writeFileSync('src/App.jsx', c);
console.log('done');
