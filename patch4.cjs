const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add deleteItem function after addItem
c = c.replace(
  'async function saveTenant(tenant)',
  sync function deleteItem(id) {
  if(!window.confirm("Delete this item? This cannot be undone.")) return;
  const{error}=await sb.from("items").delete().eq("id",id);
  if(!error){setItems(prev=>prev.filter(i=>i.id!==id));setSelItem(null);}
  else setSaveError("Delete failed: "+error.message);
}
async function saveTenant(tenant)
);

// 2. Add Delete button in ItemDetail next to Edit item
c = c.replace(
  '<GhostBtn onClick={()=>setEditing(true)}>Edit item</GhostBtn>',
  <GhostBtn onClick={()=>setEditing(true)}>Edit item</GhostBtn>
          <button onClick={()=>deleteItem(item.id)} style={{fontFamily:"var(--font-sans)",fontSize:13,borderRadius:8,padding:"9px 16px",background:"#fff0f0",color:"#e00",border:"1px solid #ffcccc",cursor:"pointer"}}>Delete item</button>
);

// 3. Pass deleteItem to ItemDetail
c = c.replace(
  '{selItem&&<ItemDetail item={selItem} inspections={inspections} onUpdate={ch=>updateItem(selItem.id,ch)} onAdvance={()=>advance(selItem)} onClose={()=>setSelItem(null)}/>}',
  '{selItem&&<ItemDetail item={selItem} inspections={inspections} onUpdate={ch=>updateItem(selItem.id,ch)} onAdvance={()=>advance(selItem)} onDelete={deleteItem} onClose={()=>setSelItem(null)}/>}'
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
