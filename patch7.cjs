const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldStr = `fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},{type:"text",text:prompt}]}]})})`;

const newStr = `(async()=>{try{
      const keyRes=await fetch("/api/key");const{key}=await keyRes.json();
      const bytes=Uint8Array.from(atob(pdfBase64),c=>c.charCodeAt(0));
      const blob=new Blob([bytes],{type:"application/pdf"});
      const form=new FormData();form.append("file",blob,"inspection.pdf");form.append("purpose","assistants");
      const uploadRes=await fetch("https://api.anthropic.com/v1/files",{method:"POST",headers:{"x-api-key":key,"anthropic-version":"2023-06-01","anthropic-beta":"files-api-2025-04-14"},body:form});
      const uploadData=await uploadRes.json();const fileId=uploadData.id;
      const msgRes=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":key,"anthropic-version":"2023-06-01","anthropic-beta":"files-api-2025-04-14","content-type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:[{type:"document",source:{type:"file",file_id:fileId}},{type:"text",text:prompt}]}]})});
      Promise.resolve(msgRes.json())`;

if (c.includes(oldStr)) {
  c = c.replace(oldStr, newStr);
  c = c.replace(
    `.catch(e=>{setLoading(false);console.error("Fetch error:",e);alert("Failed to parse PDF.");});`,
    `.catch(e=>{setLoading(false);console.error("Fetch error:",e);alert("Failed to parse PDF: "+e.message);});
    }catch(e){setLoading(false);console.error("Fetch error:",e);alert("Failed to parse PDF: "+e.message);}})();`
  );
  fs.writeFileSync('src/App.jsx', c);
  console.log('done - replaced successfully');
} else {
  console.log('ERROR - target string not found');
  // Show first 200 chars around fetch to debug
  const idx = c.indexOf('fetch("/api/anthropic"');
  console.log('Context:', JSON.stringify(c.slice(idx, idx+200)));
}
