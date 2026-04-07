import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs",import.meta.url).href;

const sb = createClient(
  "https://rvpacnokfnvwscxvjsou.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cGFjbm9rZm52d3NjeHZqc291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjk4MjEsImV4cCI6MjA4OTg0NTgyMX0.KRYZU6mnQpfXtJjUwVV-QvRf-2Gl72gkQBKc_pq7YOw"
);

const TEAM       = ["Kenny Perkins","Josh Lesson","Rob Stout","Spencer Vankirk","Dylan Dembs"];
const CATEGORIES = ["Signage","Structural","Concrete / Hardscape","Painting / Finishes","Dock / Loading","Roofing","HVAC","Plumbing","Electrical","Landscaping","Safety","Parking Lot","Other"];
const PRIORITIES = ["Critical","High","Medium","Low"];
const CONTACT_EMAIL = "management@dembsroth.com";

const VENDORS = {
  "Roofing":             [{name:"Lutz Roofing",             contacts:[{person:"Brandon Tomayko",   email:"btomayko@lutzroofing.com"}]}],
  "Masonry":             [{name:"Custom Masonry",            contacts:[{person:"Jim Borchardt",     email:"jimcustommasonry@gmail.com"}]}],
  "Concrete / Hardscape":[{name:"Custom Masonry",            contacts:[{person:"Jim Borchardt",     email:"jimcustommasonry@gmail.com"}]},
                          {name:"S&J Asphalt",               contacts:[{person:"Jeffrey Gossett",   email:"jeff_sandjasphalt@yahoo.com"}]}],
  "Painting / Finishes": [{name:"Ray's Paint",               contacts:[{person:"Rich Sawulski",     email:"bitnerpaintman@yahoo.com"}]}],
  "Asphalt":             [{name:"S&J Asphalt",               contacts:[{person:"Jeffrey Gossett",   email:"jeff_sandjasphalt@yahoo.com"}]}],
  "Striping":            [{name:"TBD",                       contacts:[]}],
  "Dock / Loading":      [{name:"West Metro Door",           contacts:[{person:"Paul Toner",        email:"office@westmetrodoor.com"}]},
                          {name:"Raynor Overhead Door",      contacts:[{person:"Charles Wikentiew", email:"clwikentiew@ameritech.net"}]}],
  "Signage":             [{name:"TBD",                       contacts:[]}],
  "HVAC":                [{name:"AFM Heating & Cooling",     contacts:[{person:"Kevin Champagne",   email:"kevin@afmheatcool.com"}]}],
  "Electrical":          [{name:"DMS Electric",              contacts:[{person:"Matt Stabnick",     email:"dmselectric@comcast.net"}]}],
  "Plumbing":            [{name:"JLM Plumbing",              contacts:[{person:"Jim Marsalese",     email:"jlmplumbingllc@gmail.com"}]}],
  "Landscaping":         [{name:"Excell Landscape",          contacts:[{person:"Rob Simon",         email:"rob-excell@comcast.net"}]}],
  "Structural":          [{name:"Inter-Office Construction", contacts:[{person:"Pat Carney",        email:"patcarneyioc@aol.com"}]}],
  "Safety":              [{name:"TBD",                       contacts:[]}],
  "Other":               [{name:"Inter-Office Construction", contacts:[{person:"Pat Carney",        email:"patcarneyioc@aol.com"}]}],
};

const STATUSES    = ["Not Started","PO Issued","Scheduled","In Progress","Completed"];
const STATUS_NEXT = {"Not Started":"PO Issued","PO Issued":"Scheduled","Scheduled":"In Progress","In Progress":"Completed"};

const PROPERTIES = [
  {id:"2925",   name:"2925 Boardwalk",            address:"2925 Boardwalk, Ann Arbor, MI 48104",               owner:"2925 Jagar, L.L.C.",                group:"2925"  },
  {id:"STANSB", name:"27750 Stansbury",            address:"27750 Stansbury, Farmington Hills, MI 48334",       owner:"Stansbury Partners, LLC",           group:"STANSB"},
  {id:"FC1",    name:"13550 Otterson Court",       address:"13550 Otterson Court, Livonia, MI 48150",           owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC2",    name:"13623 Otterson Court",       address:"13623 Otterson Court, Livonia, MI 48150",           owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC3",    name:"32567 Schoolcraft",          address:"32567 Schoolcraft Rd., Livonia, MI 48150",          owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC4",    name:"35245 Schoolcraft",          address:"35245 Schoolcraft Road, Livonia, MI 48150",         owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC5",    name:"35301 Schoolcraft",          address:"35301 Schoolcraft Rd., Livonia, MI 48150",          owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC6",    name:"35355 Schoolcraft",          address:"35355 Schoolcraft Rd., Livonia, MI 48150",          owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC7",    name:"35367 Schoolcraft",          address:"35367 Schoolcraft Road, Livonia, MI 48150",         owner:"Christopher Management LP",         group:"FCHRIS"},
  {id:"FC8",    name:"13685 Otterson Court",       address:"13685 Otterson Court, Livonia, MI 48150",           owner:"GOS LLC",                           group:"FCHRIS"},
  {id:"FD1",    name:"35015 Glendale",             address:"35015 Glendale, Livonia, MI 48150",                 owner:"Dembs Roth Management Company LP",  group:"FDEMBS"},
  {id:"FD2",    name:"35255 Glendale",             address:"35255 Glendale, Livonia, MI 48150",                 owner:"Dembs Roth Management Company LP",  group:"FDEMBS"},
  {id:"FD3",    name:"13455 Stamford Court",       address:"13455 Stamford Ct., Livonia, MI 48150",             owner:"SGS Owner, LLC",                    group:"FDEMBS"},
  {id:"STMFRD", name:"13481-13489 Stamford Court", address:"13481-13489 Stamford Court, Livonia, MI 48150",     owner:"SGS Owner, LLC",                    group:"FDEMBS"},
  {id:"CANTON", name:"4280 Haggerty",              address:"4280 Haggerty Rd., Canton, MI 48188",               owner:"4280 Haggerty, LLC",                group:"FDRGRP"},
  {id:"DR2",    name:"45701 Mast St.",             address:"45701 Mast St., Plymouth, MI 48170",                owner:"45 Mast, LLC",                      group:"FDRGRP"},
  {id:"DR3",    name:"45801 Mast St.",             address:"45801 Mast St., Plymouth, MI 48170",                owner:"45 Mast, LLC",                      group:"FDRGRP"},
  {id:"BOARDW", name:"3005 Boardwalk",             address:"3005 Boardwalk, Ann Arbor, MI 48108",               owner:"Boardwalk, LLC",                    group:"FDRGRP"},
  {id:"DR5",    name:"14900 Galleon",              address:"14900 Galleon, Plymouth, MI 48170",                 owner:"D R Group LP",                      group:"FDRGRP"},
  {id:"DR6",    name:"40984 Concept Drive",        address:"40984 Concept Drive, Plymouth, MI 48170",           owner:"D R Group LP",                      group:"FDRGRP"},
  {id:"DR7",    name:"40985 Concept Drive",        address:"40985 Concept Drive, Plymouth, MI 48110",           owner:"D R Group LP",                      group:"FDRGRP"},
  {id:"DR8",    name:"44895 Helm Court",           address:"44895 Helm Ct., Plymouth, MI 48170",                owner:"Helm Owner, LLC",                   group:"FDRGRP"},
  {id:"DR9",    name:"45889 Mast St.",             address:"45889 Mast St., Plymouth, MI 48176",                owner:"MG Group, LLC",                     group:"FDRGRP"},
  {id:"DR10",   name:"44176-44190 Plymouth Oaks",  address:"44176-44190 Plymouth Oaks Dr., Plymouth, MI 48176", owner:"Oaks 44747, LLC",                   group:"FDRGRP"},
  {id:"DR11",   name:"44330 Plymouth Oaks Blvd.",  address:"44330 Plymouth Oaks Blvd., Plymouth, MI 48176",     owner:"Oaks 44747, LLC",                   group:"FDRGRP"},
  {id:"DR12",   name:"44747 Helm Court",           address:"44747 Helm Ct., Plymouth, MI 48176",                owner:"Oaks 44747, LLC",                   group:"FDRGRP"},
  {id:"DR13",   name:"44064 Plymouth Oaks",        address:"44064 Plymouth Oaks, Plymouth, MI 48176",           owner:"Plymouth Oaks Owner, LLC",          group:"FDRGRP"},
  {id:"DR14",   name:"44160 Plymouth Oaks Dr.",    address:"44160 Plymouth Oaks Dr., Plymouth, MI 48176",       owner:"Plymouth Oaks Owner, LLC",          group:"FDRGRP"},
  {id:"DHTS1",  name:"6938 Telegraph Road",        address:"6938 Telegraph Road, Dearborn Heights, MI 48127",   owner:"DRP, LLC",                          group:"FDRP"  },
  {id:"DHTS2",  name:"6923 Waverly",               address:"6923 Waverly, Dearborn Heights, MI 48127",          owner:"DRP, LLC",                          group:"FDRP"  },
  {id:"WARREN", name:"14517 Eight Mile Road",      address:"14517 Eight Mile Road, Warren, MI 48089",           owner:"DRP, LLC",                          group:"FDRP"  },
  {id:"WTRFRD", name:"6680 Highland Road",         address:"6680 Highland Road, Waterford, MI 48327",           owner:"DRP, LLC",                          group:"FDRP"  },
  {id:"LG1",    name:"13500 Ashurst Court",        address:"13500 Ashurst Court, Livonia, MI 48150",            owner:"Ashurst LLC",                       group:"FLIVGR"},
  {id:"LG2",    name:"13501 Ashurst Court",        address:"13501 Ashurst Ct., Livonia, MI 48150",              owner:"Ashurst LLC",                       group:"FLIVGR"},
  {id:"LG3",    name:"34425 Schoolcraft",          address:"34425 Schoolcraft Road, Livonia, MI 48150",         owner:"Ashurst LLC",                       group:"FLIVGR"},
  {id:"LG4",    name:"34450 Industrial Road",      address:"34450 Industrial Road, Livonia, MI 48150",          owner:"Livonia Industrial Group, LLC",     group:"FLIVGR"},
  {id:"NB1",    name:"12623 Newburgh Road",        address:"12623 Newburgh Road, Livonia, MI 48150",            owner:"12623 Newburgh, LLC",               group:"FNEWBR"},
  {id:"AMRHEI", name:"37564-37584 Amrhein",        address:"37564-37584 Amrhein, Livonia, MI 48150",            owner:"Amrhein Property, LLC",             group:"FNEWBR"},
  {id:"NB3",    name:"12649 Richfield Court",      address:"12649 Richfield Court, Livonia, MI 48150",          owner:"Newburgh Industrial Group, LLC",    group:"FNEWBR"},
  {id:"NB4",    name:"12671 Richfield Court",      address:"12671 Richfield Court, Livonia, MI 48150",          owner:"Newburgh Industrial Group, LLC",    group:"FNEWBR"},
  {id:"NB5",    name:"12749 Richfield Court",      address:"12749 Richfield Court, Livonia, MI 48150",          owner:"Newburgh Industrial Group, LLC",    group:"FNEWBR"},
  {id:"NB6",    name:"37666 Amrhein Road",         address:"37666 Amrhein Road, Livonia, MI 48150",             owner:"Newburgh Industrial Group, LLC",    group:"FNEWBR"},
  {id:"NB7",    name:"37720 Amrhein Road",         address:"37720 Amrhein Road, Livonia, MI 48150",             owner:"Newburgh Industrial Group, LLC",    group:"FNEWBR"},
  {id:"NB8",    name:"12866 Richfield Court",      address:"12866 Richfield Court, Livonia, MI 48150",          owner:"Richfield AM, LLC",                 group:"FNEWBR"},
  {id:"NB9",    name:"12900 Richfield Court",      address:"12900 Richfield Court, Livonia, MI 48150",          owner:"Richfield AM, LLC",                 group:"FNEWBR"},
  {id:"NB10",   name:"37770 Amrhein Road",         address:"37770 Amrhein Road, Livonia, MI 48150",             owner:"Richfield AM, LLC",                 group:"FNEWBR"},
  {id:"NB11",   name:"12665 Richfield Court",      address:"12665 Richfield Court, Livonia, MI 48150",          owner:"Richfield Property Group, LLC",     group:"FNEWBR"},
  {id:"NB12",   name:"12754 Richfield Court",      address:"12754 Richfield Court, Livonia, MI 48150",          owner:"Richfield Property Group, LLC",     group:"FNEWBR"},
];

const GROUPS = {
  "2925":"2925 Jagar","STANSB":"Stansbury","FCHRIS":"Christopher",
  "FDEMBS":"Dembs Roth","FDRGRP":"DR Group","FDRP":"DRP",
  "FLIVGR":"Livonia Group","FNEWBR":"Newburgh",
};
const GROUP_COLOR = {
  "2925":  {bg:"#eff6ff",tc:"#1d4ed8",bc:"#bfdbfe"},
  "STANSB":{bg:"#f0fdf4",tc:"#15803d",bc:"#bbf7d0"},
  "FCHRIS":{bg:"#fdf4ff",tc:"#7e22ce",bc:"#e9d5ff"},
  "FDEMBS":{bg:"#fff7ed",tc:"#c2410c",bc:"#fed7aa"},
  "FDRGRP":{bg:"#fefce8",tc:"#a16207",bc:"#fde68a"},
  "FDRP":  {bg:"#fff0f0",tc:"#b91c1c",bc:"#fecaca"},
  "FLIVGR":{bg:"#f0fdfa",tc:"#0f766e",bc:"#99f6e4"},
  "FNEWBR":{bg:"#faf5ff",tc:"#6d28d9",bc:"#ddd6fe"},
};

const C = {
  bg:"#fafafa", surface:"#ffffff", border:"#eaeaea", borderMid:"#d4d4d4",
  text:"#000000", muted:"#666666", faint:"#999999",
  sidebar:"#000000", sideText:"#ffffff", sideMuted:"#888888",
};
const PCOLOR = {Critical:"#e00",High:"#f5a623",Medium:"#0070f3",Low:"#50c878"};
const PBG    = {Critical:"#fff0f0",High:"#fff8ee",Medium:"#f0f7ff",Low:"#f0fff4"};
const PBDR   = {Critical:"#ffcccc",High:"#fde68a",Medium:"#bfdbfe",Low:"#bbf7d0"};
const SCOLOR = {"Not Started":"#666666","PO Issued":"#7c3aed","Scheduled":"#0070f3","In Progress":"#f5a623","Completed":"#16a34a"};
const SBG    = {"Not Started":"#fafafa","PO Issued":"#f5f3ff","Scheduled":"#f0f7ff","In Progress":"#fff8ee","Completed":"#f0fff4"};
const SBDR   = {"Not Started":"#eaeaea","PO Issued":"#ddd6fe","Scheduled":"#bfdbfe","In Progress":"#fde68a","Completed":"#bbf7d0"};

function uid()   { return Math.random().toString(36).slice(2,9); }
function nowISO(){ return new Date().toISOString(); }
function today() { return new Date().toISOString().slice(0,10); }
function fmtDate(iso) { if(!iso)return""; const[y,m,d]=iso.split("-"); return`${m}/${d}/${y}`; }
function leaseExpiringSoon(iso,days=90){if(!iso)return false;const end=new Date(iso+"T00:00:00");const now=new Date();const diff=(end-now)/(1000*60*60*24);return diff>=0&&diff<=days;}

async function compressPdfToImages(base64){
  const bin=atob(base64);const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  const pdf=await pdfjsLib.getDocument({data:bytes}).promise;
  const images=[];
  for(let p=1;p<=pdf.numPages;p++){
    const page=await pdf.getPage(p);
    const scale=1.5;const vp=page.getViewport({scale});
    const canvas=document.createElement("canvas");
    canvas.width=vp.width;canvas.height=vp.height;
    await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;
    const dataUrl=canvas.toDataURL("image/jpeg",0.7);
    images.push(dataUrl.split(",")[1]);
  }
  return images;
}

async function doExport(filtered) {
  const mod = await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
  const X = mod.default || mod;
  const getProp = (id) => PROPERTIES.find(p=>p.id===id);
  const rows = filtered.map(it=>({
    "Category":    it.category||"",
    "Property":    getProp(it.propertyId)?.name||"",
    "Partnership": GROUPS[getProp(it.propertyId)?.group]||"",
    "Description": it.description||"",
    "Notes":       it.notes||"",
    "Status":      it.status||"",
    "Priority":    it.priority||"",
    "Assignee":    it.assignee||"",
    "Scheduled":   it.scheduledDate||"",
    "Created":     it.createdAt?.slice(0,10)||"",
  }));
  const ws = X.utils.json_to_sheet(rows);
  ws["!cols"] = [{wch:22},{wch:30},{wch:16},{wch:50},{wch:28},{wch:14},{wch:10},{wch:14},{wch:12},{wch:12}];
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, ws, "Action Items");
  X.writeFile(wb, "PropertyOps_Items_"+new Date().toISOString().slice(0,10)+".xlsx");
}

async function uploadQuote(file, itemId) {
  try {
    const path = itemId + "/" + file.name;
    const{error} = await sb.storage.from("quotes").upload(path, file, {contentType: file.type, upsert:true});
    if(error){console.error("uploadQuote error:",error);return "";}
    const{data} = sb.storage.from("quotes").getPublicUrl(path);
    return data.publicUrl||"";
  } catch(e){console.error("uploadQuote error:",e);return "";}
}
async function loadAll() {
  try {
    const [r1,r2,r3] = await Promise.all([
      sb.from("inspections").select("*").order("date",{ascending:false}),
      sb.from("items").select("*").order("created_at",{ascending:false}),
      sb.from("tenants").select("*").order("company_name",{ascending:true}),
    ]);
    if(r1.error){console.error("inspections error:",r1.error);return null;}
    if(r2.error){console.error("items error:",r2.error);return null;}
    if(r3.error){console.error("tenants error:",r3.error);}
    const inspections=(r1.data||[]).map(r=>({id:r.id,propertyId:r.property_id,date:r.date,inspector:r.inspector,notes:r.notes,pdfUrl:r.pdf_url||""}));
    const items=(r2.data||[]).map(r=>({
      id:r.id,inspectionId:r.inspection_id,propertyId:r.property_id,
      description:r.description,category:r.category,priority:r.priority,
      status:r.status,assignee:r.assignee||"",vendor:r.vendor||"",notes:r.notes||"",
      scheduledDate:(r.scheduled_date&&/^\d{4}-\d{2}-\d{2}$/.test(r.scheduled_date))?r.scheduled_date:"",completedDate:(r.completed_date&&/^\d{4}-\d{2}-\d{2}$/.test(r.completed_date))?r.completed_date:"",quoteUrl:r.quote_url||"",
      createdAt:r.created_at,statusHistory:r.status_history||[],
    }));
    const tenants=(r3.data||[]).map(r=>({
      id:r.id,propertyId:r.property_id,companyName:r.company_name||"",
      unit:r.unit||"",leaseEnd:r.lease_end||"",contacts:r.contacts||[],
    }));
    return {inspections,items,tenants};
  } catch(e){console.error("loadAll error:",e);return null;}
}

async function saveInspection(insp) {
  const{error}=await sb.from("inspections").upsert({id:insp.id,property_id:insp.propertyId,date:insp.date,inspector:insp.inspector,notes:insp.notes,pdf_url:insp.pdfUrl||""},{onConflict:"id"});
  if(error)console.error("saveInspection error:",error); return error;
}
async function uploadPDF(pdfBase64,fileName,inspectionId) {
  try {
    const bytes=Uint8Array.from(atob(pdfBase64),c=>c.charCodeAt(0));
    const blob=new Blob([bytes],{type:"application/pdf"});
    const path=inspectionId+"/"+fileName;
    const{error}=await sb.storage.from("inspections").upload(path,blob,{contentType:"application/pdf",upsert:true});
    if(error){console.error("uploadPDF error:",error);return "";}
    const{data}=sb.storage.from("inspections").getPublicUrl(path);
    return data.publicUrl||"";
  } catch(e){console.error("uploadPDF error:",e);return "";}
}
async function saveItemToDB(item) {
  const{error}=await sb.from("items").upsert({
    id:item.id,inspection_id:item.inspectionId||null,property_id:item.propertyId,
    description:item.description.replace(/\s*\([^)]*\)\s*$/,"").trim(),category:item.category,priority:item.priority,
    status:item.status,assignee:item.assignee||"",vendor:item.vendor||"",notes:item.notes||"",
    scheduled_date:item.scheduledDate||"",completed_date:item.completedDate||"",quote_url:item.quoteUrl||"",
    created_at:item.createdAt,status_history:item.statusHistory,
  },{onConflict:"id"});
  if(error)console.error("saveItemToDB error:",error); return error;
}
async function saveTenantToDB(tenant) {
  const{error}=await sb.from("tenants").upsert({
    id:tenant.id,property_id:tenant.propertyId,company_name:tenant.companyName||"",
    unit:tenant.unit||"",lease_end:tenant.leaseEnd||null,contacts:tenant.contacts||[],
  },{onConflict:"id"});
  if(error)console.error("saveTenantToDB error:",error); return error;
}
async function deleteTenantFromDB(id) {
  const{error}=await sb.from("tenants").delete().eq("id",id);
  if(error)console.error("deleteTenant error:",error); return error;
}

function Chip({label,tc,bg,bc,large}){return<span style={{fontSize:large?12:11,fontWeight:large?700:500,padding:large?"4px 12px":"2px 9px",borderRadius:99,background:bg,color:tc,border:`1px solid ${bc}`,whiteSpace:"nowrap",letterSpacing:large?"-0.01em":"normal"}}>{label}</span>;}
function PPill({p}){return<Chip label={p} tc={PCOLOR[p]} bg={PBG[p]} bc={PBDR[p]} large/>;}
function SPill({s}){return<Chip label={s} tc={SCOLOR[s]} bg={SBG[s]} bc={SBDR[s]} large/>;}
function Dot({color,size=7}){return<span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,flexShrink:0}}/>;}
function ULabel({children}){return<div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.faint,marginBottom:5}}>{children}</div>;}
function PrimaryBtn({children,onClick,disabled,full}){return<button onClick={disabled?undefined:onClick} style={{fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600,borderRadius:8,padding:"9px 20px",background:disabled?"#d1d0cb":C.text,color:disabled?"#9c9a93":"#fff",border:"none",cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto"}}>{children}</button>;}
function GhostBtn({children,onClick}){return<button onClick={onClick} style={{fontFamily:"var(--font-sans)",fontSize:13,borderRadius:8,padding:"9px 16px",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,cursor:"pointer"}}>{children}</button>;}
function FInput({label,value,onChange,type="text",placeholder,rows}){
  const s={fontFamily:"var(--font-sans)",fontSize:13,width:"100%",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,padding:"8px 11px",boxSizing:"border-box",outline:"none",resize:rows?"vertical":"none"};
  return<div>{label&&<ULabel>{label}</ULabel>}{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}</div>;
}
function FSelect({label,value,onChange,options}){
  return<div>{label&&<ULabel>{label}</ULabel>}<select value={value} onChange={e=>onChange(e.target.value)} style={{fontFamily:"var(--font-sans)",fontSize:13,width:"100%",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,padding:"8px 11px"}}>{options.map(o=><option key={o.v??o} value={o.v??o}>{o.l??o}</option>)}</select></div>;
}
function Overlay({children,onClose}){
  return<div style={{position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"48px 16px",overflowY:"auto"}}>
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,width:"100%",maxWidth:580,padding:"24px 24px 20px",boxShadow:"0 12px 40px rgba(0,0,0,0.15)"}}>{children}</div>
  </div>;
}
function OverlayHeader({title,sub,onClose}){
  return<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
    <div>{sub&&<div style={{fontSize:11,color:C.faint,marginBottom:4}}>{sub}</div>}<div style={{fontSize:16,fontWeight:700,color:C.text}}>{title}</div></div>
    <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.faint,padding:0,marginLeft:12,lineHeight:1}}>x</button>
  </div>;
}
function SlideOver({children,title,sub,onClose}){
  return<div style={{position:"absolute",inset:0,zIndex:200,display:"flex"}}>
    <div style={{flex:1,background:"rgba(0,0,0,0.2)",cursor:"pointer"}} onClick={onClose}/>
    <div style={{width:500,background:C.surface,overflowY:"auto",borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",boxShadow:"-4px 0 24px rgba(0,0,0,0.1)"}}>
      <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{paddingRight:12}}>{sub&&<div style={{fontSize:11,color:C.faint,marginBottom:4}}>{sub}</div>}<div style={{fontSize:15,fontWeight:700,color:C.text,lineHeight:1.35}}>{title}</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.faint,lineHeight:1,padding:0,flexShrink:0}}>x</button>
        </div>
      </div>
      <div style={{padding:"20px 24px",flex:1}}>{children}</div>
    </div>
  </div>;
}

function TenantForm({tenant,propertyId,onSave,onClose}){
  const[form,setForm]=useState(tenant||{propertyId:propertyId||PROPERTIES[0].id,companyName:"",unit:"",leaseEnd:"",contacts:[{name:"",email:"",phone:""}]});
  function updateContact(i,field,val){setForm(f=>({...f,contacts:f.contacts.map((c,idx)=>idx===i?{...c,[field]:val}:c)}));}
  function addContact(){setForm(f=>({...f,contacts:[...f.contacts,{name:"",email:"",phone:""}]}));}
  function removeContact(i){setForm(f=>({...f,contacts:f.contacts.filter((_,idx)=>idx!==i)}));}
  return(
    <Overlay onClose={onClose}>
      <OverlayHeader title={tenant?"Edit Tenant":"Add Tenant"} onClose={onClose}/>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {!tenant&&<FSelect label="Property" value={form.propertyId} onChange={v=>setForm(f=>({...f,propertyId:v}))} options={PROPERTIES.map(p=>({v:p.id,l:`${GROUPS[p.group]} - ${p.name}`}))}/>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <FInput label="Company name" value={form.companyName} onChange={v=>setForm(f=>({...f,companyName:v}))} placeholder="Acme Corp"/>
          <FInput label="Unit / Suite" value={form.unit} onChange={v=>setForm(f=>({...f,unit:v}))} placeholder="Suite 100"/>
          <FInput label="Lease end date" value={form.leaseEnd} onChange={v=>setForm(f=>({...f,leaseEnd:v}))} type="date"/>
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <ULabel>Contacts</ULabel>
            <button onClick={addContact} style={{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>+ Add contact</button>
          </div>
          {form.contacts.map((c,i)=>(
            <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px",marginBottom:8}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <FInput label="Name" value={c.name} onChange={v=>updateContact(i,"name",v)} placeholder="John Smith"/>
                <FInput label="Phone" value={c.phone} onChange={v=>updateContact(i,"phone",v)} placeholder="(734) 555-0100"/>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}><FInput label="Email" value={c.email} onChange={v=>updateContact(i,"email",v)} placeholder="john@acme.com"/></div>
                {form.contacts.length>1&&<button onClick={()=>removeContact(i)} style={{fontSize:11,background:"#fff0f0",border:"1px solid #ffcccc",borderRadius:6,padding:"8px 10px",cursor:"pointer",color:"#e00",fontFamily:"var(--font-sans)",flexShrink:0}}>Remove</button>}
              </div>
            </div>
          ))}
        </div>
        <PrimaryBtn full disabled={!form.companyName.trim()} onClick={()=>onSave({...form,id:tenant?.id||"t"+uid()})}>{tenant?"Save changes":"Add tenant"}</PrimaryBtn>
      </div>
    </Overlay>
  );
}

function TenantsSection({propertyId,tenants,onEdit,onDelete}){
  const propTenants=tenants.filter(t=>t.propertyId===propertyId);
  return(
    <div style={{marginTop:28}}>
      <div style={{marginBottom:10}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.faint}}>Tenants</div></div>
      {propTenants.length===0
        ?<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 18px",textAlign:"center",fontSize:13,color:C.faint}}>No tenants on file for this property.</div>
        :<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          {propTenants.map((t,i)=>{const expSoon=leaseExpiringSoon(t.leaseEnd);return(
            <div key={t.id} style={{padding:"14px 18px",borderBottom:i<propTenants.length-1?`1px solid ${C.border}`:"none",background:expSoon?"#fff8e1":undefined}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.text}}>{t.companyName}{t.unit&&<span style={{fontSize:12,fontWeight:400,color:C.muted,marginLeft:8}}>{t.unit}</span>}</div>
                  {t.leaseEnd&&<div style={{fontSize:11,color:expSoon?"#e65100":C.faint,fontWeight:expSoon?600:400,marginTop:2}}>{expSoon&&"⚠ "}Lease ends: {fmtDate(t.leaseEnd)}</div>}
                  {(t.contacts||[]).length>0&&<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                    {t.contacts.map((c,ci)=>(
                      <div key={ci} style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                        {c.name&&<span style={{fontSize:12,fontWeight:500,color:C.text}}>{c.name}</span>}
                        {c.email&&<a href={`mailto:${c.email}`} style={{fontSize:12,color:"#0070f3",textDecoration:"none"}}>{c.email}</a>}
                        {c.phone&&<span style={{fontSize:12,color:C.muted}}>{c.phone}</span>}
                      </div>
                    ))}
                  </div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:12}}>
                  <button onClick={()=>onEdit(t)} style={{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>Edit</button>
                  <button onClick={()=>onDelete(t.id)} style={{fontSize:11,background:"#fff0f0",border:"1px solid #ffcccc",borderRadius:6,padding:"4px 10px",cursor:"pointer",color:"#e00",fontFamily:"var(--font-sans)"}}>Remove</button>
                </div>
              </div>
            </div>
          );})}
        </div>}
    </div>
  );
}

function parsePDF({pdfBase64,pdfImages,propertyId,inspectionId,overrideDate,overrideInspector},setLoading,onResult){
  setLoading(true);
  const prompt=`You are reviewing a SnapInspect property inspection report for Dembs Development Inc. Extract ALL actionable repair and maintenance items. For each item return description, category (one of ${CATEGORIES.join(", ")}), priority (Critical/High/Medium/Low), location. Also extract propertyName, inspectorName, inspectionDate (YYYY-MM-DD). Respond ONLY with valid JSON: {"propertyName":"","inspectorName":"","inspectionDate":"","items":[{"description":"","category":"","priority":"","location":""}]}`;
  const contentBlocks=pdfImages
    ?[...pdfImages.map(img=>({type:"image",source:{type:"base64",media_type:"image/jpeg",data:img}})),{type:"text",text:prompt}]
    :[{type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},{type:"text",text:prompt}];
  fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:contentBlocks}]})})
  .then(r=>r.json()).then(data=>{
    const raw=data.content?.find(b=>b.type==="text")?.text||"{}";
    let parsed={items:[]};
    try{parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());}catch(e){console.error("Parse error:",e);}
    const ts=nowISO();const dateOnly=today();
    const newItems=(parsed.items||[]).map(item=>({
      id:"r"+uid(),inspectionId,propertyId,
      description:item.description.replace(/\s*\([^)]*\)\s*$/,"").trim()+(item.location?` (${item.location})`:""),
      category:item.category,priority:item.priority,
      status:"Not Started",assignee:"",vendor:"",notes:"",
      createdAt:ts,scheduledDate:"",completedDate:"",
      statusHistory:[{status:"Not Started",date:dateOnly}],
    }));
    onResult({items:newItems,date:overrideDate||parsed.inspectionDate||dateOnly,inspector:overrideInspector||parsed.inspectorName||"",detectedProperty:parsed.propertyName});
    setLoading(false);
  }).catch(e=>{setLoading(false);console.error("Fetch error:",e);alert("Failed to parse PDF.");});
}

function genAISummary(prop,propItems,cb,setLoading){
  setLoading(true);
  const open=propItems.filter(i=>i.status!=="Completed");
  fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:180,messages:[{role:"user",content:`Write a 2-3 sentence maintenance status summary for ${prop.name}. Open: ${open.length}. Critical: ${open.filter(i=>i.priority==="Critical").length}. Items: ${propItems.slice(0,5).map(i=>i.description).join("; ")}. Plain professional prose, no bullets.`}]})})
  .then(r=>r.json()).then(data=>{cb(data.content?.find(b=>b.type==="text")?.text||"");setLoading(false);}).catch(()=>setLoading(false));
}

function QuoteModal({item,onClose}){
  const prop=PROPERTIES.find(p=>p.id===item.propertyId);
  const categoryVendors=(VENDORS[item.category]||[]).filter(v=>v.name!=="TBD");
  const[selVendor,setSelVendor]=useState("");const[selEmail,setSelEmail]=useState("");
  const vendor=categoryVendors.find(v=>v.name===selVendor);const contacts=vendor?.contacts||[];
  const subject=`Quote Request - ${item.description.slice(0,60)} - ${prop?.name}`;
  const body=`Hello,\n\nWe are requesting a quote for the following repair at one of our properties.\n\nPROPERTY: ${prop?.name}\nADDRESS: ${prop?.address}\n\nSCOPE OF WORK: ${item.description}\n\nPRIORITY: ${item.priority}\n\nPlease reply with your quote at your earliest convenience. For questions contact us at ${CONTACT_EMAIL}.\n\nThank you,\nDembs Development Inc.\n${CONTACT_EMAIL}`;
  const T="#1a1a1a";const M="#555550";const B="#d0cec8";
  const I={fontFamily:"var(--font-sans)",fontSize:13,width:"100%",borderRadius:7,border:`1px solid ${B}`,background:"#fff",color:T,padding:"8px 10px",boxSizing:"border-box"};
  return(
    <div style={{position:"absolute",inset:0,zIndex:300,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"52px 16px",overflowY:"auto"}}>
      <div style={{background:"#fff",borderRadius:12,border:`1px solid ${B}`,width:"100%",maxWidth:580,padding:"26px 26px 22px",boxShadow:"0 12px 40px rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div><div style={{fontSize:16,fontWeight:700,color:T}}>Request Vendor Quote</div><div style={{fontSize:12,color:M,marginTop:3}}>{prop?.name} - {item.category}</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:M,padding:0}}>x</button>
        </div>
        <div style={{background:"#f5f4f1",borderRadius:8,padding:"12px 14px",marginBottom:18}}>
          <div style={{fontSize:14,color:T,lineHeight:1.5}}>{item.description}</div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div style={{fontSize:11,color:M,marginBottom:4}}>Company</div>
              {categoryVendors.length>0?<select value={selVendor} onChange={e=>{setSelVendor(e.target.value);setSelEmail("");}} style={I}><option value="">Select vendor...</option>{categoryVendors.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}</select>:<input placeholder="No vendors on file" style={{...I,color:"#aaa"}} disabled/>}
            </div>
            <div><div style={{fontSize:11,color:M,marginBottom:4}}>Contact email</div>
              {selVendor&&contacts.length>0?<select value={selEmail} onChange={e=>setSelEmail(e.target.value)} style={I}><option value="">Select contact...</option>{contacts.map(c=><option key={c.email} value={c.email}>{c.person} - {c.email}</option>)}</select>:<input placeholder={selVendor?"No contacts on file":"Select vendor first"} style={{...I,color:"#aaa"}} disabled/>}
            </div>
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{background:"#f5f4f1",borderRadius:8,padding:"12px 14px",fontSize:12,color:M,lineHeight:1.7,maxHeight:180,overflowY:"auto"}}>
            <div><strong style={{color:T}}>To:</strong> {selEmail||"(select a vendor email above)"}</div>
            <div><strong style={{color:T}}>Subject:</strong> {subject}</div>
            <div style={{marginTop:8,whiteSpace:"pre-wrap"}}>{body}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>window.open(`mailto:${selEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)} disabled={!selEmail} style={{flex:1,fontSize:13,fontWeight:600,borderRadius:8,padding:"10px",background:selEmail?"#1a1a1a":"#d1d0cb",color:selEmail?"#fff":"#9c9a93",border:"none",cursor:selEmail?"pointer":"not-allowed"}}>Open in Email Client</button>
          <button onClick={onClose} style={{fontSize:13,borderRadius:8,padding:"10px 16px",background:"transparent",color:M,border:`1px solid ${B}`,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function PropRow({prop,items,inspections,isLast,onClick}){
  const[hov,setHov]=useState(false);
  const pi=items.filter(it=>it.propertyId===prop.id);
  const oi=pi.filter(it=>it.status!=="Completed");
  const cr=oi.filter(it=>it.priority==="Critical").length;
  const ins=inspections.filter(it=>it.propertyId===prop.id).length;
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{display:"flex",alignItems:"center",gap:16,padding:"11px 18px",background:hov?C.bg:C.surface,cursor:"pointer",borderBottom:isLast?"none":"1px solid #eaeaea",transition:"background 0.1s"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prop.name}</div>
        <div style={{fontSize:12,color:C.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prop.owner}</div>
      </div>
      <div style={{display:"flex",gap:14,alignItems:"center",flexShrink:0}}>
        {cr>0&&<Chip label={`${cr} critical`} tc={PCOLOR.Critical} bg={PBG.Critical} bc={PBDR.Critical}/>}
        {[[oi.length,"open",oi.length>0?C.text:C.faint],[pi.filter(it=>it.status==="Completed").length,"done",C.faint],[ins,"insp.",C.faint]].map(([n,l,cl])=>(
          <div key={l} style={{textAlign:"right",minWidth:28}}>
            <div style={{fontSize:16,fontWeight:700,color:cl,lineHeight:1}}>{n}</div>
            <div style={{fontSize:10,color:C.faint,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemRow({item,showProperty,onClick}){
  const[hov,setHov]=useState(false);
  const prop=PROPERTIES.find(p=>p.id===item.propertyId);
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 18px",background:hov?C.bg:C.surface,borderBottom:`1px solid ${C.border}`,cursor:"pointer",transition:"background 0.1s"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.description}</div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          {showProperty&&prop?.name&&<><span style={{fontSize:12,color:C.muted}}>{prop.name}</span><span style={{color:C.border,fontSize:11}}>·</span></>}
          <span style={{fontSize:11,color:C.muted}}>{item.category}</span>
          {item.assignee&&<><span style={{color:C.border,fontSize:11}}>·</span><span style={{fontSize:11,color:C.muted}}>{item.assignee.split(" ")[0]}</span></>}
          {item.scheduledDate&&<><span style={{color:C.border,fontSize:11}}>·</span><span style={{fontSize:11,color:C.muted}}>{item.scheduledDate}</span></>}
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
        <PPill p={item.priority}/><SPill s={item.status}/>
      </div>
    </div>
  );
}

function ItemDetail({item,inspections,onUpdate,onAdvance,onDelete,onClose}){
  const[editing,setEditing]=useState(false);const[form,setForm]=useState({...item});const[showQuote,setShowQuote]=useState(false);
  const prop=PROPERTIES.find(p=>p.id===item.propertyId);const insp=inspections.find(i=>i.id===item.inspectionId);const next=STATUS_NEXT[item.status];
  function save(){onUpdate(form);setEditing(false);}
  return(
    <SlideOver onClose={onClose} sub={`${GROUPS[prop?.group]} - ${prop?.name}`} title={item.description}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}><PPill p={item.priority}/><SPill s={item.status}/><Chip label={item.category} tc={C.muted} bg={C.bg} bc={C.border}/></div>
      {next&&<button onClick={onAdvance} style={{width:"100%",marginBottom:20,padding:"10px 16px",background:SBG[next],color:SCOLOR[next],border:`1px solid ${SBDR[next]}`,borderRadius:8,cursor:"pointer",fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600}}>Mark as {next}</button>}
      {!editing?<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:20,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          {[["Assignee",item.assignee||"Unassigned"],["Vendor",item.vendor||"-"],["Created",insp?.date||item.createdAt?.slice(0,10)||""],["Scheduled",item.scheduledDate||"-"],["Completed",item.completedDate||"-"],["Inspection",insp?.date||"Manual"]].map(([label,val],i)=>(
            <div key={label} style={{padding:"11px 14px",background:i%2===0?C.bg:C.surface}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.faint,marginBottom:4}}>{label}</div>
              <div style={{fontSize:14,color:C.text,fontWeight:600}}>{val}</div>
            </div>
          ))}
        </div>
        {item.notes&&<div style={{background:C.bg,borderRadius:8,padding:"12px 14px",marginBottom:20,borderLeft:`3px solid ${C.borderMid}`}}><ULabel>Notes</ULabel><div style={{fontSize:14,color:C.text,lineHeight:1.7}}>{item.notes}</div></div>}
        <ULabel>Status history</ULabel>
        <div style={{marginBottom:20}}>
          {item.statusHistory.map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<item.statusHistory.length-1?`1px solid ${C.border}`:"none"}}>
              <Dot color={SCOLOR[h.status]} size={8}/><span style={{fontSize:14,color:C.text,fontWeight:600,flex:1}}>{h.status}</span><span style={{fontSize:13,color:C.faint}}>{h.date}</span>
            </div>
          ))}
        </div>

        {/* Primary actions */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button onClick={()=>setShowQuote(true)} style={{flex:1,fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600,borderRadius:8,padding:"10px 16px",background:C.text,color:"#fff",border:"none",cursor:"pointer"}}>Request Quote</button>
          <label style={{flex:1,fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600,borderRadius:8,padding:"10px 16px",background:C.text,color:"#fff",border:"none",cursor:"pointer",textAlign:"center"}}>
            {item.quoteUrl?"Replace Quote":"Upload Quote"}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{display:"none"}} onChange={async e=>{
              const file=e.target.files[0];if(!file)return;
              const url=await uploadQuote(file,item.id);
              if(url)onUpdate({...item,quoteUrl:url});
            }}/>
          </label>
          {item.quoteUrl&&<a href={item.quoteUrl} target="_blank" rel="noreferrer" style={{fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600,borderRadius:8,padding:"10px 16px",background:"#faf5ff",color:"#6d28d9",border:"1px solid #ddd6fe",cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap"}}>View Quote</a>}
        </div>

        {/* Secondary actions */}
        <div style={{display:"flex",gap:16,alignItems:"center",paddingTop:4}}>
          <button onClick={()=>setEditing(true)} style={{fontFamily:"var(--font-sans)",fontSize:12,background:"none",border:"none",cursor:"pointer",color:C.muted,padding:0,textDecoration:"underline",textUnderlineOffset:3}}>Edit item</button>
          <button onClick={()=>onDelete(item.id)} style={{fontFamily:"var(--font-sans)",fontSize:12,background:"none",border:"none",cursor:"pointer",color:"#e00",padding:0,textDecoration:"underline",textUnderlineOffset:3}}>Delete item</button>
        </div>

        {showQuote&&<QuoteModal item={item} onClose={()=>setShowQuote(false)}/>}
      </>:(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FInput label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} rows={2}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FSelect label="Assignee" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))} options={[{v:"",l:"Unassigned"},...TEAM.map(t=>({v:t,l:t}))]}/>
            <FSelect label="Priority" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={PRIORITIES}/>
            <FInput label="Vendor" value={form.vendor} onChange={v=>setForm(f=>({...f,vendor:v}))} placeholder="Optional"/>
            <FInput label="Scheduled date" value={form.scheduledDate} onChange={v=>setForm(f=>({...f,scheduledDate:v}))} type="date"/>
          </div>
          <FInput label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional..." rows={3}/>
          <div style={{display:"flex",gap:8,marginTop:4}}><PrimaryBtn onClick={save}>Save changes</PrimaryBtn><GhostBtn onClick={()=>setEditing(false)}>Cancel</GhostBtn></div>
        </div>
      )}
    </SlideOver>
  );
}

function AISummaryCard({prop,propItems}){
  const[text,setText]=useState("");const[loading,setLoading]=useState(false);
  return(
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:text?10:0}}>
        <ULabel>AI Status Summary</ULabel>
        <button onClick={()=>genAISummary(prop,propItems,setText,setLoading)} disabled={loading} style={{fontSize:11,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>{loading?"Generating...":text?"Refresh":"Generate"}</button>
      </div>
      {text&&<p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.7}}>{text}</p>}
    </div>
  );
}

function ImportForm({selectedPropertyId,onSubmit,onClose}){
  const[propertyId,setPropertyId]=useState(selectedPropertyId||PROPERTIES[0].id);
  const[overrideInspector,setOverrideInspector]=useState("");const[overrideDate,setOverrideDate]=useState("");
  const[fileName,setFileName]=useState("");const[pdfBase64,setPdfBase64]=useState("");
  const[loading,setLoading]=useState(false);const[preview,setPreview]=useState(null);const[dragOver,setDragOver]=useState(false);
  const[pdfImages,setPdfImages]=useState(null);const[compressing,setCompressing]=useState(false);
  function handleFile(file){
    if(!file||file.type!=="application/pdf"){alert("Please upload a PDF.");return;}
    setFileName(file.name);setPdfImages(null);
    const r=new FileReader();
    r.onload=async e=>{
      const base64=e.target.result.split(",")[1];
      const sizeInMB=(base64.length*0.75)/(1024*1024);
      if(sizeInMB>4){
        setCompressing(true);
        try{const images=await compressPdfToImages(base64);setPdfImages(images);setPdfBase64(base64);}
        catch(err){console.error("Compression error:",err);alert("Failed to compress PDF.");}
        setCompressing(false);
      }else{setPdfBase64(base64);}
    };
    r.readAsDataURL(file);
  }
  const prop=PROPERTIES.find(p=>p.id===propertyId);
  if(preview)return(
    <Overlay onClose={onClose}>
      <OverlayHeader title="Review extracted items" sub={`${preview.items.length} items from ${fileName}`} onClose={onClose}/>
      {preview.detectedProperty&&<div style={{fontSize:12,color:C.muted,background:C.bg,padding:"8px 12px",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:14}}>PDF property: <strong style={{color:C.text}}>{preview.detectedProperty}</strong> - {prop?.name}</div>}
      <div style={{maxHeight:420,overflowY:"auto",marginBottom:16,border:`1px solid ${C.border}`,borderRadius:10}}>
        {preview.items.map((item,i)=>(
          <div key={i} style={{padding:"11px 16px",background:i%2===0?C.surface:C.bg,borderBottom:i<preview.items.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:6,lineHeight:1.4}}>{item.description}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><PPill p={item.priority}/><Chip label={item.category} tc={C.muted} bg={C.bg} bc={C.border}/></div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <PrimaryBtn onClick={async()=>{const id="i"+uid();const url=await uploadPDF(pdfBase64,fileName,id);onSubmit({id,propertyId,date:overrideDate||preview.date,inspector:overrideInspector||preview.inspector||"SnapInspect",notes:"SnapInspect PDF: "+fileName,pdfUrl:url},preview.items);}}>Confirm and add {preview.items.length} items</PrimaryBtn>
        <GhostBtn onClick={()=>setPreview(null)}>Back</GhostBtn>
      </div>
    </Overlay>
  );
  return(
    <Overlay onClose={onClose}>
      <OverlayHeader title="Import SnapInspect report" sub="Notes and photos extracted automatically" onClose={onClose}/>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>document.getElementById("pdf-upload-input").click()} style={{border:`2px dashed ${dragOver?C.text:C.borderMid}`,borderRadius:10,padding:"28px 20px",textAlign:"center",cursor:"pointer",background:dragOver?C.bg:"transparent",transition:"all 0.15s"}}>
          <input id="pdf-upload-input" type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          {compressing?<><div style={{fontSize:13,fontWeight:600,color:"#e65100"}}>Compressing large PDF...</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>This may take a moment</div></>:pdfBase64?<><div style={{fontSize:13,fontWeight:600,color:C.text}}>{fileName}</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>{pdfImages?`Compressed to ${pdfImages.length} page image${pdfImages.length===1?"":"s"} — `:""}Click to change</div></>:<><div style={{fontSize:13,fontWeight:600,color:C.text}}>Drop SnapInspect PDF here</div><div style={{fontSize:11,color:C.faint,marginTop:3}}>or click to browse</div></>}
        </div>
        <FSelect label="Property" value={propertyId} onChange={setPropertyId} options={PROPERTIES.map(p=>({v:p.id,l:`${GROUPS[p.group]} - ${p.name}`}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FSelect label="Inspector (optional)" value={overrideInspector} onChange={setOverrideInspector} options={[{v:"",l:"Auto-detect from PDF"},...TEAM.map(t=>({v:t,l:t}))]}/>
          <FInput label="Date (optional)" value={overrideDate} onChange={setOverrideDate} type="date"/>
        </div>
        <PrimaryBtn full disabled={loading||compressing||!pdfBase64} onClick={()=>{const id="i"+uid();parsePDF({pdfBase64:pdfImages?null:pdfBase64,pdfImages,propertyId,inspectionId:id,overrideDate,overrideInspector},setLoading,r=>setPreview({...r,inspId:id}));}}>{loading?"Extracting items from PDF...":compressing?"Compressing PDF...":"Extract repair items"}</PrimaryBtn>
      </div>
    </Overlay>
  );
}

function AddItemForm({selectedPropertyId,onSubmit,onClose}){
  const[form,setForm]=useState({propertyId:selectedPropertyId||PROPERTIES[0].id,description:"",category:CATEGORIES[0],priority:"Medium",assignee:"",vendor:"",notes:""});
  return(
    <Overlay onClose={onClose}>
      <OverlayHeader title="Add repair item" onClose={onClose}/>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <FSelect label="Property" value={form.propertyId} onChange={v=>setForm(f=>({...f,propertyId:v}))} options={PROPERTIES.map(p=>({v:p.id,l:`${GROUPS[p.group]} - ${p.name}`}))}/>
        <FInput label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="Describe the repair task clearly..." rows={2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FSelect label="Category" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={CATEGORIES}/>
          <FSelect label="Priority" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={PRIORITIES}/>
          <FSelect label="Assignee" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))} options={[{v:"",l:"Unassigned"},...TEAM.map(t=>({v:t,l:t}))]}/>
          <FInput label="Vendor" value={form.vendor} onChange={v=>setForm(f=>({...f,vendor:v}))} placeholder="Optional"/>
        </div>
        <FInput label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional..." rows={2}/>
        <PrimaryBtn full disabled={!form.description.trim()} onClick={()=>{const ts=nowISO();onSubmit({id:"r"+uid(),inspectionId:null,...form,status:"Not Started",createdAt:ts,scheduledDate:"",completedDate:"",statusHistory:[{status:"Not Started",date:today()}]});}}>Add item</PrimaryBtn>
      </div>
    </Overlay>
  );
}

function ExcelImportForm({onSubmit,onClose}){
  const[step,setStep]=useState("upload");// upload | preview
  const[parsed,setParsed]=useState([]);
  const[error,setError]=useState("");
  const[sheetNames,setSheetNames]=useState([]);
  const[selSheet,setSelSheet]=useState("");
  const[wbRef,setWbRef]=useState(null);
  const[xlsxRef,setXlsxRef]=useState(null);

  function resolveGroup(portfolioRaw){
    if(!portfolioRaw)return null;
    const lower=portfolioRaw.toLowerCase().trim();
    // exact match on GROUPS values
    const exact=Object.entries(GROUPS).find(([,v])=>v.toLowerCase()===lower);
    if(exact)return exact[0];
    // partial / alias matches for known spreadsheet names
    for(const[k,v]of Object.entries(GROUPS)){
      if(v.toLowerCase().includes(lower)||lower.includes(v.toLowerCase()))return k;
    }
    // specific aliases: spreadsheet uses "DRM" for "Dembs Roth", "Livonia" for "Livonia Group", "Jagar" for "2925 Jagar"
    const aliases={"drm":"FDEMBS","dembs roth":"FDEMBS","livonia":"FLIVGR","jagar":"2925","2925 jagar":"2925"};
    if(aliases[lower])return aliases[lower];
    return null;
  }

  function matchProperty(propName,groupKey){
    if(!propName)return null;
    const lower=propName.toLowerCase().trim();
    // strip tenant name after em dash: "44064 Plymouth Oaks Blvd — Alfing" -> "44064 Plymouth Oaks Blvd"
    const addrPart=lower.split(/\s*[—–-]\s*/)[0].trim();
    // candidates narrowed by group if available
    const candidates=groupKey?PROPERTIES.filter(p=>p.group===groupKey):PROPERTIES;
    const all=PROPERTIES;// fallback pool

    // exact name match within group
    let m=candidates.find(p=>p.name.toLowerCase()===lower)||candidates.find(p=>p.name.toLowerCase()===addrPart);if(m)return m;
    // exact name match across all
    m=all.find(p=>p.name.toLowerCase()===lower)||all.find(p=>p.name.toLowerCase()===addrPart);if(m)return m;

    // address number match: extract leading number from the spreadsheet value and match against property addresses
    const numMatch=addrPart.match(/^(\d+)/);
    if(numMatch){
      const num=numMatch[1];
      // within group: address starts with this number
      m=candidates.find(p=>p.address.toLowerCase().startsWith(num));if(m)return m;
      m=candidates.find(p=>p.name.toLowerCase().startsWith(num));if(m)return m;
      // across all
      m=all.find(p=>p.address.toLowerCase().startsWith(num));if(m)return m;
      m=all.find(p=>p.name.toLowerCase().startsWith(num));if(m)return m;
    }

    // address substring match
    if(addrPart.length>3){
      m=candidates.find(p=>p.address.toLowerCase().includes(addrPart));if(m)return m;
      m=candidates.find(p=>p.name.toLowerCase().includes(addrPart));if(m)return m;
      m=all.find(p=>p.address.toLowerCase().includes(addrPart));if(m)return m;
    }

    // prop ID match
    m=candidates.find(p=>p.id.toLowerCase()===lower);if(m)return m;
    m=all.find(p=>p.id.toLowerCase()===lower);if(m)return m;

    // if group is known but property value is a tenant name (no number), and group has only one property, use it
    if(groupKey&&!numMatch&&candidates.length===1)return candidates[0];

    return null;
  }

  function matchAssignee(raw){
    if(!raw)return"";
    const lower=raw.toLowerCase().trim();
    // exact match
    let m=TEAM.find(t=>t.toLowerCase()===lower);if(m)return m;
    // first name match
    m=TEAM.find(t=>t.split(" ")[0].toLowerCase()===lower);if(m)return m;
    // last name match
    m=TEAM.find(t=>t.split(" ").pop().toLowerCase()===lower);if(m)return m;
    return"";
  }

  function parseSheet(X,ws){
    // Get all rows as arrays to auto-detect header row
    const allRows=X.utils.sheet_to_json(ws,{header:1,defval:""});
    if(!allRows.length)return[];

    // Find the header row: look for a row containing recognizable column names
    const KNOWN_HEADERS=["trade / category","category","property","issue / item","description","repair item","prop #","status","notes"];
    let headerIdx=-1;
    for(let i=0;i<Math.min(10,allRows.length);i++){
      const cells=allRows[i].map(c=>(c||"").toString().toLowerCase().trim());
      const matches=cells.filter(c=>KNOWN_HEADERS.some(h=>c===h||c.includes(h)));
      if(matches.length>=2){headerIdx=i;break;}
    }
    if(headerIdx===-1)return[];

    const headers=allRows[headerIdx].map(c=>(c||"").toString().trim());
    const dataRows=allRows.slice(headerIdx+1);

    // Build column index map — normalize to canonical names
    const colMap={};
    headers.forEach((h,i)=>{
      const lc=h.toLowerCase();
      if(lc==="trade / category"||lc==="category")colMap.category=i;
      else if(lc==="property"||lc==="property address")colMap.property=i;
      else if(lc==="prop #")colMap.propId=i;
      else if(lc==="portfolio"||lc==="partnership"||lc==="pmt co")colMap.portfolio=i;
      else if(lc==="issue / item"||lc==="description"||lc==="repair item")colMap.description=i;
      else if(lc==="notes"||lc==="comments")colMap.notes=i;
      else if(lc==="status")colMap.status=i;
      else if(lc==="priority")colMap.priority=i;
      else if(lc==="start date"||lc==="scheduled")colMap.scheduled=i;
      else if(lc==="responsible"||lc==="assignee")colMap.assignee=i;
      else if(lc==="close")colMap.close=i;
    });

    const get=(row,key)=>{const i=colMap[key];if(i==null)return"";const v=row[i];if(v==null)return"";if(typeof v==="object"&&v.text)return v.text;return v.toString().trim();};

    const ts=nowISO();
    return dataRows.map(row=>{
      const desc=get(row,"description");
      if(!desc)return null;

      // Skip section divider rows (e.g. "  Building  (11 items)")
      if(/^\s+\S.*\(\d+\s+items?\)\s*$/.test((row[0]||"").toString()))return null;

      const propRaw=get(row,"property");
      const propIdRaw=get(row,"propId");
      const portfolioRaw=get(row,"portfolio");
      const groupKey=resolveGroup(portfolioRaw);
      const match=matchProperty(propIdRaw,groupKey)||matchProperty(propRaw,groupKey);

      const catRaw=get(row,"category");
      const validCat=CATEGORIES.find(c=>c.toLowerCase()===catRaw.toLowerCase())||inferCategory(get(row,"description"));

      function inferCategory(desc){
        const d=desc.toLowerCase();
        const rules=[
          ["Parking Lot",/\b(parking\s*lot|asphalt|pothol|striping|seal\s*coat|pav(e|ing)|park\s*lot)\b/],
          ["Signage",/\b(sign(s|age)?|banner|letter(s|ing)?|placard)\b/],
          ["Structural",/\b(structur|beam|column|wall\s*crack|foundation|masonry|brick|block|tuck\s*point|lintel|steel|joist)\b/],
          ["Concrete / Hardscape",/\b(concret|sidewalk|curb|hardscape|stoop|step|flatwork|apron)\b/],
          ["Painting / Finishes",/\b(paint|stain|finish|coat(ing)?|rust|prime|primer|caulk|seal(ant)?|bollard.*paint|fascia|soffit)\b/],
          ["Dock / Loading",/\b(dock|loading|leveler|bumper|overhead\s*door|roll.up|coil.*door|dock\s*(door|seal|plate|light))\b/],
          ["Roofing",/\b(roof|shingle|membrane|flashing|gutter|downspout|drain|leak.*roof|roof.*leak|ponding|skylight|cap\s*sheet)\b/],
          ["HVAC",/\b(hvac|furnace|heat(er|ing)?|cool(ing)?|a\/?c\b|air\s*condition|thermostat|duct|condenser|compressor|rtu|rooftop\s*unit|boiler)\b/],
          ["Plumbing",/\b(plumb|pipe|faucet|toilet|drain|sewer|water\s*heater|valve|spigot|hose\s*bib|backflow|sump|ejector)\b/],
          ["Electrical",/\b(electri|wir(e|ing)|outlet|panel|breaker|circuit|light(s|ing|pole)?|ballast|fixture|switch|volt|amp|meter|transformer|receptacle)\b/],
          ["Landscaping",/\b(landscap|tree|shrub|mulch|mow|grass|weed|trim|prun|irrigation|sprinkler|bush|planting|flower|sod|grade|erosion|drain.*yard)\b/],
          ["Safety",/\b(safety|fire\s*(ext|alarm|door|escape|sprinkler)|handicap|ada\b|emergency|exit\s*(sign|light)|extinguish|smoke\s*detect|handrail|guardrail|trip\s*hazard)\b/],
        ];
        for(const[cat,re]of rules)if(re.test(d))return cat;
        return"Other";
      }

      const priRaw=get(row,"priority");
      const validPri=PRIORITIES.find(p=>p.toLowerCase()===priRaw.toLowerCase())||"Medium";

      const stRaw=get(row,"status");
      const validStatus=STATUSES.find(s=>s.toLowerCase()===stRaw.toLowerCase())||(stRaw.toLowerCase()==="open"?"Not Started":stRaw.toLowerCase()==="closed"||stRaw.toLowerCase()==="done"?"Completed":"Not Started");

      const assigneeRaw=get(row,"assignee");
      const validAssignee=matchAssignee(assigneeRaw);

      function parseExcelDate(raw){
        if(!raw)return"";
        const n=Number(raw);
        if(Number.isFinite(n)&&n>1&&n<2958466){const d=new Date(Date.UTC(1899,11,30+Math.round(n)));return d.toISOString().slice(0,10);}
        const d=new Date(raw);
        if(!isNaN(d.getTime())&&d.getFullYear()>1900&&d.getFullYear()<2200)return d.toISOString().slice(0,10);
        return"";
      }

      const schedRaw=get(row,"scheduled");
      const schedDate=parseExcelDate(schedRaw);

      const closeRaw=get(row,"close");
      let completedDate=parseExcelDate(closeRaw);
      if(validStatus==="Completed"&&!completedDate)completedDate=today();

      return{
        id:"r"+uid(),inspectionId:null,
        propertyId:match?.id||"",propertyMatch:match?.name||"",propertyInput:propRaw||propIdRaw,
        description:desc,category:validCat,priority:validPri,status:validStatus,
        assignee:validAssignee,vendor:"",
        notes:get(row,"notes"),
        scheduledDate:schedDate,completedDate,quoteUrl:"",createdAt:ts,
        statusHistory:[{status:validStatus,date:today()}],
      };
    }).filter(Boolean);
  }

  async function handleFile(e){
    const file=e.target.files?.[0];if(!file)return;
    setError("");
    try{
      const mod=await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
      const X=mod.default||mod;
      const buf=await file.arrayBuffer();
      const wb=X.read(buf,{type:"array"});
      setXlsxRef(X);setWbRef(wb);

      // If multiple sheets, let user pick; otherwise parse first sheet
      const names=wb.SheetNames.filter(n=>n.toLowerCase()!=="summary");
      if(names.length>1){
        setSheetNames(names);setSelSheet(names[0]);
        const items=parseSheet(X,wb.Sheets[names[0]]);
        setParsed(items);
        setStep("preview");
      }else{
        const items=parseSheet(X,wb.Sheets[wb.SheetNames[0]]);
        if(!items.length){setError("No items found. Check that the spreadsheet has recognizable column headers.");return;}
        setParsed(items);
        setStep("preview");
      }
    }catch(err){setError("Failed to parse file: "+err.message);}
  }

  function switchSheet(name){
    setSelSheet(name);
    if(xlsxRef&&wbRef){setParsed(parseSheet(xlsxRef,wbRef.Sheets[name]));}
  }

  function updateParsedProp(idx,propId){
    setParsed(prev=>prev.map((it,i)=>i===idx?{...it,propertyId:propId,propertyMatch:PROPERTIES.find(p=>p.id===propId)?.name||""}:it));
  }

  const unmatched=parsed.filter(it=>!it.propertyId);
  const valid=parsed.filter(it=>it.propertyId&&it.description);

  return(
    <Overlay onClose={onClose}>
      <OverlayHeader title="Import from Excel" sub={step==="preview"?`${parsed.length} items parsed, ${valid.length} ready to import`:""} onClose={onClose}/>
      {step==="upload"&&<div>
        <div style={{background:C.bg,border:`2px dashed ${C.borderMid}`,borderRadius:10,padding:"40px 20px",textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Upload an .xlsx file. Supported columns include Trade / Category, Property, Issue / Item, Notes, Status, Priority, Assignee, Scheduled, and more.</div>
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{fontFamily:"var(--font-sans)",fontSize:13}}/>
        </div>
        {error&&<div style={{color:"#e00",fontSize:13,marginTop:8}}>{error}</div>}
      </div>}
      {step==="preview"&&<div>
        {sheetNames.length>1&&<div style={{display:"flex",gap:6,marginBottom:14}}>
          {sheetNames.map(n=><button key={n} onClick={()=>switchSheet(n)} style={{fontSize:12,fontWeight:selSheet===n?600:400,padding:"5px 12px",borderRadius:6,border:`1px solid ${selSheet===n?C.text:C.border}`,background:selSheet===n?C.text:"transparent",color:selSheet===n?"#fff":C.muted,cursor:"pointer",fontFamily:"var(--font-sans)"}}>{n}</button>)}
        </div>}
        {unmatched.length>0&&<div style={{background:"#fff8ee",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#92400e"}}>
          {unmatched.length} item{unmatched.length>1?"s":""} could not be matched to a property. Please select the correct property below or they will be skipped.
        </div>}
        <div style={{maxHeight:400,overflowY:"auto",border:`1px solid ${C.border}`,borderRadius:8,marginBottom:16}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:"var(--font-sans)"}}>
            <thead><tr style={{background:C.bg,position:"sticky",top:0}}>
              {["Property","Description","Category","Priority","Status","Assignee"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",color:C.faint,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}
            </tr></thead>
            <tbody>{parsed.map((it,i)=><tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:!it.propertyId?"#fff8ee":"transparent"}}>
              <td style={{padding:"6px 10px"}}>{it.propertyId
                ?<span style={{color:"#16a34a",fontWeight:500}}>{it.propertyMatch}</span>
                :<select value={it.propertyId} onChange={e=>updateParsedProp(i,e.target.value)} style={{fontSize:11,padding:"3px 6px",borderRadius:4,border:"1px solid #fde68a",background:"#fffbeb",fontFamily:"var(--font-sans)"}}>
                  <option value="">-- Select property --</option>
                  {PROPERTIES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>}
                {!it.propertyId&&it.propertyInput&&<div style={{fontSize:10,color:"#92400e",marginTop:2}}>"{it.propertyInput}"</div>}
              </td>
              <td style={{padding:"6px 10px",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.description}</td>
              <td style={{padding:"6px 10px"}}>{it.category}</td>
              <td style={{padding:"6px 10px"}}><span style={{color:PCOLOR[it.priority]}}>{it.priority}</span></td>
              <td style={{padding:"6px 10px"}}><span style={{color:SCOLOR[it.status]}}>{it.status}</span></td>
              <td style={{padding:"6px 10px"}}>{it.assignee}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <GhostBtn onClick={()=>{setStep("upload");setParsed([]);setRows([]);}}>Back</GhostBtn>
          <PrimaryBtn disabled={valid.length===0} onClick={()=>{
            const final=valid.map(({propertyMatch,propertyInput,...rest})=>rest);
            onSubmit(final);
          }}>Import {valid.length} item{valid.length!==1?"s":""}</PrimaryBtn>
        </div>
      </div>}
    </Overlay>
  );
}

export default function App(){
  const[loaded,setLoaded]=useState(false);const[saveError,setSaveError]=useState("");const[saving,setSaving]=useState(false);
  const[inspections,setInspections]=useState([]);const[items,setItems]=useState([]);const[tenants,setTenants]=useState([]);
  const[view,setView]=useState("portfolio");const[selProp,setSelProp]=useState(null);const[selItem,setSelItem]=useState(null);
  const[showImport,setShowImport]=useState(false);const[showAdd,setShowAdd]=useState(false);const[tenantForm,setTenantForm]=useState(null);const[showExcelImport,setShowExcelImport]=useState(false);
  const[fStatus,setFStatus]=useState("All");const[fPriority,setFPriority]=useState("All");const[fCategory,setFCategory]=useState("All");const[fAssignee,setFAssignee]=useState("All");const[fPartnership,setFPartnership]=useState("All");const[fProperty,setFProperty]=useState("All");
  const[search,setSearch]=useState("");const[tenantSearch,setTenantSearch]=useState("");const[tenantSort,setTenantSort]=useState("tenant");

  useEffect(()=>{
    loadAll().then(result=>{
      if(result===null){setSaveError("Could not connect to database.");setLoaded(true);return;}
      setInspections(result.inspections);setItems(result.items);setTenants(result.tenants);setLoaded(true);
    });
  },[]);

  async function updateItem(id,changes){
    const updated=items.map(i=>i.id===id?{...i,...changes}:i);
    setItems(updated);if(selItem?.id===id)setSelItem(p=>({...p,...changes}));
    setSaving(true);setSaveError("");
    const err=await saveItemToDB(updated.find(i=>i.id===id));
    if(err)setSaveError("Save failed: "+err.message);
    setSaving(false);
  }
  async function deleteItem(id){
    if(!window.confirm("Delete this item? This cannot be undone."))return;
    const{error}=await sb.from("items").delete().eq("id",id);
    if(!error){setItems(prev=>prev.filter(i=>i.id!==id));setSelItem(null);}
    else setSaveError("Delete failed: "+error.message);
  }
  async function advance(item){
    const next=STATUS_NEXT[item.status];if(!next)return;
    const d=today();const h=[...item.statusHistory,{status:next,date:d}];
    const ch={status:next,statusHistory:h};if(next==="Completed")ch.completedDate=d;
    await updateItem(item.id,ch);
  }
  async function addInspectionAndItems(insp,newItems){
    setSaving(true);setSaveError("");
    const e1=await saveInspection(insp);
    if(e1){setSaveError("Failed to save inspection: "+e1.message);setSaving(false);return;}
    for(const item of newItems){const e2=await saveItemToDB(item);if(e2)setSaveError("Failed to save item: "+e2.message);}
    setInspections(prev=>[insp,...prev]);setItems(prev=>[...newItems,...prev]);setSaving(false);
  }
  async function addItem(item){
    setSaving(true);setSaveError("");
    const err=await saveItemToDB(item);
    if(err){setSaveError("Save failed: "+err.message);setSaving(false);return;}
    setItems(prev=>[item,...prev]);setSaving(false);
  }
  async function saveTenant(tenant){
    setSaving(true);setSaveError("");
    const err=await saveTenantToDB(tenant);
    if(err){setSaveError("Save failed: "+err.message);setSaving(false);return;}
    setTenants(prev=>{const exists=prev.find(t=>t.id===tenant.id);return exists?prev.map(t=>t.id===tenant.id?tenant:t):[...prev,tenant];});
    setTenantForm(null);setSaving(false);
  }
  async function deleteInspection(id){
    if(!window.confirm('Delete this inspection record? Items from this inspection will remain.'))return;
    const{error}=await sb.from('inspections').delete().eq('id',id);
    if(!error)setInspections(prev=>prev.filter(i=>i.id!==id));
    else setSaveError('Delete failed: '+error.message);
  }
  async function deleteTenant(id){
    if(!window.confirm("Remove this tenant?"))return;
    const err=await deleteTenantFromDB(id);
    if(!err)setTenants(prev=>prev.filter(t=>t.id!==id));
  }

  const openItems=items.filter(i=>i.status!=="Completed");
  const critical=items.filter(i=>i.priority==="Critical"&&i.status!=="Completed");
  const filtered=useMemo(()=>items.filter(it=>{
    if(fStatus!=="All"&&it.status!==fStatus)return false;
    if(fPriority!=="All"&&it.priority!==fPriority)return false;
    if(fCategory!=="All"&&it.category!==fCategory)return false;
    if(fAssignee!=="All"&&it.assignee!==fAssignee)return false;
    if(fPartnership!=="All"){const prop=PROPERTIES.find(p=>p.id===it.propertyId);if(!prop||prop.group!==fPartnership)return false;}
    if(fProperty!=="All"&&it.propertyId!==fProperty)return false;
    if(selProp&&it.propertyId!==selProp)return false;
    if(search&&!it.description.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }),[items,fStatus,fPriority,fCategory,fAssignee,fPartnership,fProperty,selProp,search]);

  const filteredTenants=useMemo(()=>{
    const f=tenants.filter(t=>{
      if(!tenantSearch)return true;
      const q=tenantSearch.toLowerCase();
      const prop=PROPERTIES.find(p=>p.id===t.propertyId);
      return t.companyName?.toLowerCase().includes(q)||(t.contacts||[]).some(c=>c.name?.toLowerCase().includes(q)||c.email?.toLowerCase().includes(q))||prop?.name?.toLowerCase().includes(q)||prop?.address?.toLowerCase().includes(q);
    });
    return[...f].sort((a,b)=>{
      if(tenantSort==="tenant")return(a.companyName||"").localeCompare(b.companyName||"");
      if(tenantSort==="partnership"){const pa=PROPERTIES.find(p=>p.id===a.propertyId)?.group||"";const pb=PROPERTIES.find(p=>p.id===b.propertyId)?.group||"";return pa.localeCompare(pb)||((a.companyName||"").localeCompare(b.companyName||""));}
      if(tenantSort==="lease"){if(!a.leaseEnd&&!b.leaseEnd)return 0;if(!a.leaseEnd)return 1;if(!b.leaseEnd)return -1;return a.leaseEnd.localeCompare(b.leaseEnd);}
      return 0;
    });
  },[tenants,tenantSearch,tenantSort]);

  const NAV=[{id:"portfolio",label:"Portfolio"},{id:"items",label:"All Items"},{id:"tenants",label:"Tenants"},{id:"inspections",label:"Inspections"}];
  if(!loaded)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:"var(--font-sans)",color:C.faint,fontSize:13}}>Loading...</div>;

  return(
    <div style={{display:"flex",height:"100vh",width:"100vw",background:C.bg,fontFamily:"var(--font-sans)",overflow:"hidden",position:"relative"}}>
      <div style={{width:220,background:"#000",display:"flex",flexDirection:"column",flexShrink:0,borderRight:"1px solid #1a1a1a"}}>
        <div style={{padding:"20px 20px 16px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"#222",borderRadius:6,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #333"}}><span style={{color:"#fff",fontSize:15,fontWeight:800}}>D</span></div>
          <div><div style={{fontSize:15,fontWeight:800,color:C.sideText,letterSpacing:"-0.02em",lineHeight:1.1}}>PropertyOps</div><div style={{fontSize:9,color:C.sideMuted,letterSpacing:"0.04em",textTransform:"uppercase",marginTop:1}}>Dembs Development</div></div>
        </div>
        <div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"0 14px 8px"}}/>
        <nav style={{flex:1,padding:"4px 10px"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>{setView(n.id);setSelProp(null);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",background:view===n.id?"rgba(255,255,255,0.12)":"transparent",border:"none",borderRadius:7,cursor:"pointer",marginBottom:1,fontSize:14,fontWeight:view===n.id?700:400,color:view===n.id?"#ffffff":C.sideMuted,transition:"all 0.1s"}}>{n.label}</button>
          ))}
        </nav>
        <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          {[["48","properties"],[openItems.length,"open items"],[critical.length,"critical"],[tenants.length,"tenants"]].map(([n,l])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:12,color:C.sideMuted}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,color:critical.length>0&&l==="critical"?"#fca5a5":C.sideText}}>{n}</span>
            </div>
          ))}
          {saving&&<div style={{fontSize:10,color:"#86efac",marginTop:6}}>Saving...</div>}
          {saveError&&<div style={{fontSize:10,color:"#fca5a5",marginTop:6,lineHeight:1.4}}>{saveError}</div>}
        </div>
      </div>

      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:10}}>
          <div style={{fontSize:16,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:6}}>
            {view==="portfolio"&&selProp?(()=>{const p=PROPERTIES.find(pr=>pr.id===selProp);return<><span onClick={()=>setSelProp(null)} style={{color:C.muted,cursor:"pointer",fontWeight:400,fontSize:13}}>Portfolio</span><span style={{color:C.border,margin:"0 4px"}}>&rsaquo;</span><span>{p?.name}</span></>;})():view==="portfolio"?"Portfolio":view==="items"?"All Items":view==="tenants"?"Tenants":"Inspections"}
          </div>
          <div style={{display:"flex",gap:8}}>
            {view==="tenants"&&<button onClick={()=>setTenantForm({mode:"add",propertyId:selProp})} style={{fontSize:13,fontWeight:500,background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 14px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>+ Add tenant</button>}
            {view!=="tenants"&&<button onClick={()=>setShowAdd(true)} style={{fontSize:13,fontWeight:500,background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 14px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>+ Add item</button>}
            {view==="items"&&<button onClick={()=>setShowExcelImport(true)} style={{fontSize:13,fontWeight:500,background:"#f0f7ff",border:"1px solid #bfdbfe",borderRadius:7,padding:"6px 14px",cursor:"pointer",color:"#0070f3",fontFamily:"var(--font-sans)"}}>Import from Excel</button>}
            {view==="items"&&<button onClick={()=>doExport(filtered)} style={{fontSize:13,fontWeight:500,background:"#f0fff4",border:"1px solid #bbf7d0",borderRadius:7,padding:"6px 14px",cursor:"pointer",color:"#16a34a",fontFamily:"var(--font-sans)"}}>Export to Excel</button>}
            <button onClick={()=>setShowImport(true)} style={{fontSize:13,fontWeight:600,background:C.text,border:"none",borderRadius:7,padding:"7px 16px",cursor:"pointer",color:"#fff",fontFamily:"var(--font-sans)"}}>+ Import inspection</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
          {view==="portfolio"&&!selProp&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12,marginBottom:24}}>
              {[{l:"Open Items",v:openItems.length,s:"across portfolio",red:false},{l:"Critical",v:critical.length,s:"immediate action",red:critical.length>0},{l:"Scheduled",v:items.filter(i=>i.status==="Scheduled").length,s:"confirmed with vendors"},{l:"Completed",v:items.filter(i=>i.status==="Completed").length,s:"all time"}].map(k=>(
                <div key={k.l} style={{background:C.surface,border:`1px solid ${k.red?PBDR.Critical:C.border}`,borderRadius:10,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:k.red?PCOLOR.Critical:C.faint,marginBottom:8}}>{k.l}</div>
                  <div style={{fontSize:36,fontWeight:800,color:k.red?PCOLOR.Critical:C.text,lineHeight:1,marginBottom:6}}>{k.v}</div>
                  <div style={{fontSize:12,color:C.muted}}>{k.s}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 18px",marginBottom:24,display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.faint}}>Status</span>
              {STATUSES.map(s=>{const n=items.filter(i=>i.status===s).length;return<div key={s} style={{display:"flex",alignItems:"center",gap:6}}><Dot color={SCOLOR[s]} size={7}/><span style={{fontSize:13,color:C.muted}}>{s}</span><span style={{fontSize:14,fontWeight:700,color:C.text}}>{n}</span></div>;})}
            </div>
            {Object.entries(GROUPS).map(([gkey,gname])=>{
              const gps=PROPERTIES.filter(p=>p.group===gkey);if(!gps.length)return null;
              return(<div key={gkey} style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.faint,marginBottom:8}}>{gname}</div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                  {gps.map((prop,i)=><PropRow key={prop.id} prop={prop} items={items} inspections={inspections} isLast={i===gps.length-1} onClick={()=>{setSelProp(prop.id);setView("portfolio");}}/>)}
                </div>
              </div>);
            })}
          </>}

          {view==="portfolio"&&selProp&&(()=>{
            const prop=PROPERTIES.find(p=>p.id===selProp);
            const pi=items.filter(i=>i.propertyId===selProp);
            const oi=pi.filter(i=>i.status!=="Completed");
            const pInsp=inspections.filter(i=>i.propertyId===selProp);
            return<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <div style={{fontSize:26,fontWeight:800,color:C.text,lineHeight:1.2}}>{prop.name}</div>
                  <div style={{fontSize:13,color:C.muted,marginTop:4}}>{prop.address}</div>
                  <div style={{fontSize:11,color:C.faint,marginTop:2}}>{prop.owner} - {GROUPS[prop.group]}</div>
                </div>
                <div style={{display:"flex",gap:20}}>
                  {[[oi.length,"open"],[pi.filter(i=>i.status==="Completed").length,"done"],[pInsp.length,"inspections"],[tenants.filter(t=>t.propertyId===selProp).length,"tenants"]].map(([n,l])=>(
                    <div key={l} style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:800,color:C.text}}>{n}</div><div style={{fontSize:11,color:C.faint}}>{l}</div></div>
                  ))}
                </div>
              </div>
              <AISummaryCard prop={prop} propItems={pi}/>
              {PRIORITIES.map(p=>{
                const grp=oi.filter(i=>i.priority===p);if(!grp.length)return null;
                return(<div key={p} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><Dot color={PCOLOR[p]} size={7}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:PCOLOR[p]}}>{p}</span><span style={{fontSize:11,color:C.faint}}>({grp.length})</span></div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>{grp.map(it=><ItemRow key={it.id} item={it} onClick={()=>setSelItem(it)}/>)}</div>
                </div>);
              })}
              {oi.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.faint,fontSize:13}}>No open items - this property is clear.</div>}
              <TenantsSection propertyId={selProp} tenants={tenants} onEdit={(t)=>setTenantForm({mode:"edit",tenant:t})} onDelete={deleteTenant}/>
              {pInsp.length>0&&<div style={{marginTop:28}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.faint,marginBottom:10}}>Inspection history</div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                  {pInsp.map((insp,i)=>{const ii=items.filter(it=>it.inspectionId===insp.id);return(
                    <div key={insp.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",borderBottom:i<pInsp.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:C.text}}>{insp.date}</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>{insp.inspector}</div></div>
                      <div style={{display:"flex",gap:6}}><Chip label={`${ii.length} items`} tc={SCOLOR.Scheduled} bg={SBG.Scheduled} bc={SBDR.Scheduled}/>{ii.filter(it=>it.status==="Completed").length>0&&<Chip label={`${ii.filter(it=>it.status==="Completed").length} done`} tc={SCOLOR.Completed} bg={SBG.Completed} bc={SBDR.Completed}/>}</div>
                    </div>
                  );})}
                </div>
              </div>}
            </>;
          })()}

          {view==="items"&&<>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 11px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,width:200,outline:"none"}}/>
              {[[["All",...STATUSES],fStatus,setFStatus,"Status"],[["All",...PRIORITIES],fPriority,setFPriority,"Priority"],[["All",...CATEGORIES],fCategory,setFCategory,"Category"],[["All",...TEAM],fAssignee,setFAssignee,"Assignee"]].map(([opts,val,setter,label])=>(
                <select key={label} value={val} onChange={e=>setter(e.target.value)} style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:val==="All"?C.muted:C.text}}>
                  {opts.map(o=><option key={o} value={o}>{o==="All"?`All ${label==="Status"?"Statuses":label==="Priority"?"Priorities":label==="Category"?"Categories":label+"s"}`:o}</option>)}
                </select>
              ))}
              <select value={fPartnership} onChange={e=>{setFPartnership(e.target.value);setFProperty("All");}} style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:fPartnership==="All"?C.muted:C.text}}>
                <option value="All">All Partnerships</option>
                {Object.entries(GROUPS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
              <select value={fProperty} onChange={e=>setFProperty(e.target.value)} style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:fProperty==="All"?C.muted:C.text,maxWidth:220}}>
                <option value="All">All Properties</option>
                {Object.entries(GROUPS).map(([gk,gv])=>{const gProps=PROPERTIES.filter(p=>p.group===gk&&(fPartnership==="All"||fPartnership===gk));return gProps.length>0?<optgroup key={gk} label={gv}>{gProps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</optgroup>:null;})}
              </select>
              <span style={{fontSize:12,color:C.faint}}>{filtered.length} items</span>
            </div>
            {filtered.length===0?<div style={{textAlign:"center",padding:"60px 0",color:C.faint,fontSize:13}}>No items match the current filters.</div>:
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>{filtered.map(it=><ItemRow key={it.id} item={it} showProperty onClick={()=>setSelItem(it)}/>)}</div>}
          </>}

          {view==="tenants"&&<>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <input value={tenantSearch} onChange={e=>setTenantSearch(e.target.value)} placeholder="Search tenants..." style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 11px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,width:240,outline:"none"}}/>
              <select value={tenantSort} onChange={e=>setTenantSort(e.target.value)} style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text}}>
                <option value="tenant">Sort: Tenant A-Z</option>
                <option value="partnership">Sort: Partnership</option>
                <option value="lease">Sort: Lease Expiration</option>
              </select>
              <span style={{fontSize:12,color:C.faint}}>{filteredTenants.length} tenants</span>
            </div>
            {filteredTenants.length===0?
            <div style={{textAlign:"center",padding:"60px 0",color:C.faint,fontSize:13}}>{tenants.length===0?"No tenants on file yet. Add your first tenant using the button above.":"No tenants match your search."}</div>:
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              {filteredTenants.map((t,i)=>{
                const prop=PROPERTIES.find(p=>p.id===t.propertyId);
                const expSoon=leaseExpiringSoon(t.leaseEnd);
                return(
                  <div key={t.id} style={{padding:"14px 18px",borderBottom:i<filteredTenants.length-1?`1px solid ${C.border}`:"none",background:expSoon?"#fff8e1":undefined}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                          {prop?.group&&<span style={{fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:99,background:GROUP_COLOR[prop.group]?.bg,color:GROUP_COLOR[prop.group]?.tc,border:`1px solid ${GROUP_COLOR[prop.group]?.bc}`,whiteSpace:"nowrap"}}>{GROUPS[prop.group]}</span>}
                          <span style={{fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-0.01em"}}>{t.companyName}</span>
                          {t.unit&&<span style={{fontSize:12,fontWeight:500,color:C.muted}}>{t.unit}</span>}
                        </div>
                        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                          <span style={{fontSize:12,fontWeight:600,color:C.text}}>{prop?.name}</span>
                          {t.leaseEnd&&<><span style={{fontSize:11,color:C.faint}}>·</span><span style={{fontSize:12,fontWeight:600,color:expSoon?"#e65100":C.text}}>{expSoon?"⚠ ":""}Exp. {fmtDate(t.leaseEnd)}</span></>}
                        </div>
                        {(t.contacts||[]).length>0&&<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                          {t.contacts.map((c,ci)=>(
                            <div key={ci} style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                              {c.name&&<span style={{fontSize:12,fontWeight:500,color:C.text}}>{c.name}</span>}
                              {c.email&&<a href={`mailto:${c.email}`} style={{fontSize:12,color:"#0070f3",textDecoration:"none"}}>{c.email}</a>}
                              {c.phone&&<span style={{fontSize:12,color:C.muted}}>{c.phone}</span>}
                            </div>
                          ))}
                        </div>}
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:12}}>
                        <button onClick={()=>setTenantForm({mode:"edit",tenant:t})} style={{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>Edit</button>
                        <button onClick={()=>deleteTenant(t.id)} style={{fontSize:11,background:"#fff0f0",border:"1px solid #ffcccc",borderRadius:6,padding:"4px 10px",cursor:"pointer",color:"#e00",fontFamily:"var(--font-sans)"}}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>}
          </>}

          {view==="inspections"&&<>
            <div style={{fontSize:12,color:C.faint,marginBottom:14}}>{inspections.length} inspections logged</div>
            {inspections.length===0?
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"48px 24px",textAlign:"center"}}>
              <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:6}}>No inspections yet</div>
              <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Import your first SnapInspect PDF to get started.</div>
              <PrimaryBtn onClick={()=>setShowImport(true)}>Import inspection</PrimaryBtn>
            </div>:
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              {inspections.map((insp,i)=>{
                const prop=PROPERTIES.find(p=>p.id===insp.propertyId);const ii=items.filter(it=>it.inspectionId===insp.id);
                return(<div key={insp.id} style={{padding:"14px 20px",borderBottom:i<inspections.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{prop?.name}</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>{insp.date} - {insp.inspector}</div></div>
                    <button onClick={()=>deleteInspection(insp.id)} style={{fontSize:11,background:"#fff0f0",border:"1px solid #ffcccc",borderRadius:6,padding:"4px 10px",cursor:"pointer",color:"#e00",fontFamily:"var(--font-sans)",flexShrink:0,marginLeft:8}}>Delete</button>
                    <div style={{display:"flex",gap:6}}><Chip label={`${ii.length} items`} tc={SCOLOR.Scheduled} bg={SBG.Scheduled} bc={SBDR.Scheduled}/>{ii.filter(it=>it.status==="Completed").length>0&&<Chip label={`${ii.filter(it=>it.status==="Completed").length} done`} tc={SCOLOR.Completed} bg={SBG.Completed} bc={SBDR.Completed}/>}</div>
                  </div>
                  <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>{insp.notes}</div>
                  {insp.pdfUrl&&<div style={{display:"flex",gap:8,marginBottom:8}}>
                    <a href={insp.pdfUrl} target="_blank" rel="noreferrer" style={{fontSize:12,fontWeight:500,padding:"4px 12px",borderRadius:6,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",textDecoration:"none",cursor:"pointer"}}>View PDF</a>
                    <a href={insp.pdfUrl} download style={{fontSize:12,fontWeight:500,padding:"4px 12px",borderRadius:6,background:C.bg,color:C.muted,border:`1px solid ${C.border}`,textDecoration:"none",cursor:"pointer"}}>Download</a>
                  </div>}
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {ii.slice(0,5).map(it=>(<button key={it.id} onClick={()=>setSelItem(it)} style={{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 9px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.description.slice(0,45)}{it.description.length>45?"...":""}</button>))}
                    {ii.length>5&&<span style={{fontSize:11,color:C.faint,padding:"3px 0"}}>+{ii.length-5} more</span>}
                  </div>
                </div>);
              })}
            </div>}
          </>}
        </div>
      </div>

      {selItem&&<ItemDetail item={selItem} inspections={inspections} onUpdate={ch=>updateItem(selItem.id,ch)} onAdvance={()=>advance(selItem)} onDelete={deleteItem} onClose={()=>setSelItem(null)}/>}
      {showImport&&<ImportForm selectedPropertyId={selProp} onSubmit={(insp,its)=>{addInspectionAndItems(insp,its);setShowImport(false);}} onClose={()=>setShowImport(false)}/>}
      {showAdd&&<AddItemForm selectedPropertyId={selProp} onSubmit={it=>{addItem(it);setShowAdd(false);}} onClose={()=>setShowAdd(false)}/>}
      {tenantForm&&<TenantForm tenant={tenantForm.mode==="edit"?tenantForm.tenant:null} propertyId={tenantForm.mode==="add"?tenantForm.propertyId:null} onSave={saveTenant} onClose={()=>setTenantForm(null)}/>}
      {showExcelImport&&<ExcelImportForm onSubmit={async(newItems)=>{setSaving(true);setSaveError("");for(const item of newItems){const e=await saveItemToDB(item);if(e){setSaveError("Failed to save item: "+e.message);}}setItems(prev=>[...newItems,...prev]);setSaving(false);setShowExcelImport(false);}} onClose={()=>setShowExcelImport(false)}/>}
    </div>
  );
}
