const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update saveItemToDB to include quote_url
c = c.replace(
  'scheduled_date:item.scheduledDate||"",completed_date:item.completedDate||"",',
  'scheduled_date:item.scheduledDate||"",completed_date:item.completedDate||"",quote_url:item.quoteUrl||"",'
);

// 2. Update loadAll items mapping to include quoteUrl
c = c.replace(
  'scheduledDate:r.scheduled_date||"",completedDate:r.completed_date||"",',
  'scheduledDate:r.scheduled_date||"",completedDate:r.completed_date||"",quoteUrl:r.quote_url||"",'
);

// 3. Add uploadQuote function after uploadPDF
c = c.replace(
  'async function loadAll() {',
  `async function uploadQuote(file, itemId) {
  try {
    const path = itemId + "/" + file.name;
    const{error} = await sb.storage.from("quotes").upload(path, file, {contentType: file.type, upsert:true});
    if(error){console.error("uploadQuote error:",error);return "";}
    const{data} = sb.storage.from("quotes").getPublicUrl(path);
    return data.publicUrl||"";
  } catch(e){console.error("uploadQuote error:",e);return "";}
}
async function loadAll() {`
);

// 4. Add Upload Quote button and View Quote link to ItemDetail
c = c.replace(
  `        <button onClick={()=>setShowQuote(true)} style={{fontFamily:"var(--font-sans)",fontSize:13,borderRadius:8,padding:"9px 16px",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",cursor:"pointer",fontWeight:500}}>Request Quote</button>`,
  `        <button onClick={()=>setShowQuote(true)} style={{fontFamily:"var(--font-sans)",fontSize:13,borderRadius:8,padding:"9px 16px",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",cursor:"pointer",fontWeight:500}}>Request Quote</button>
          <label style={{fontFamily:"var(--font-sans)",fontSize:13,borderRadius:8,padding:"9px 16px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",cursor:"pointer",fontWeight:500}}>
            Upload Quote
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{display:"none"}} onChange={async e=>{
              const file=e.target.files[0];if(!file)return;
              const url=await uploadQuote(file,item.id);
              if(url)onUpdate({...item,quoteUrl:url});
            }}/>
          </label>
          {item.quoteUrl&&<a href={item.quoteUrl} target="_blank" rel="noreferrer" style={{fontFamily:"var(--font-sans)",fontSize:13,borderRadius:8,padding:"9px 16px",background:"#faf5ff",color:"#6d28d9",border:"1px solid #ddd6fe",cursor:"pointer",textDecoration:"none",fontWeight:500}}>View Quote</a>}`
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
