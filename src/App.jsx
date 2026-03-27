import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://rvpacnokfnvwscxvjsou.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cGFjbm9rZm52d3NjeHZqc291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjk4MjEsImV4cCI6MjA4OTg0NTgyMX0.KRYZU6mnQpfXtJjUwVV-QvRf-2Gl72gkQBKc_pq7Yow"
);

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAM       = ["Kenny Perkins","Josh Lesson","Rob Stout","Spencer Vankirk","Dylan Dembs"];
const CATEGORIES = ["Signage","Structural","Concrete / Hardscape","Painting / Finishes","Dock / Loading","Roofing","HVAC","Plumbing","Electrical","Landscaping","Safety","Other"];
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

// ─── Theme ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid()   { return Math.random().toString(36).slice(2,9); }
function today() { return new Date().toISOString().slice(0,10); }

// ─── Supabase data layer ──────────────────────────────────────────────────────

async function loadAll() {
  try {
    const [{ data: insps, error: e1 }, { data: its, error: e2 }] = await Promise.all([
      sb.from("inspections").select("*").order("date", { ascending: false }),
      sb.from("items").select("*").order("created_at", { ascending: false }),
    ]);
    if (e1) console.error("inspections load error:", e1);
    if (e2) console.error("items load error:", e2);
    const inspections = (insps || []).map(r => ({
      id: r.id, propertyId: r.property_id, date: r.date,
      inspector: r.inspector, notes: r.notes,
    }));
    const items = (its || []).map(r => ({
      id: r.id, inspectionId: r.inspection_id, propertyId: r.property_id,
      description: r.description, category: r.category, priority: r.priority,
      status: r.status, assignee: r.assignee, vendor: r.vendor, notes: r.notes,
      scheduledDate: r.scheduled_date || "", completedDate: r.completed_date || "",
      createdAt: r.created_at, statusHistory: r.status_history || [],
    }));
    return { inspections, items };
  } catch(e) {
    console.error("loadAll error", e);
    return { inspections:[], items:[] };
  }
}

async function saveInspection(insp) {
  const { error } = await sb.from("inspections").upsert({
    id: insp.id, property_id: insp.propertyId, date: insp.date,
    inspector: insp.inspector, notes: insp.notes,
  });
  if (error) console.error("saveInspection error:", error);
}

async function saveItemToDB(item) {
  const { error } = await sb.from("items").upsert({
    id: item.id,
    inspection_id: item.inspectionId || null,
    property_id: item.propertyId,
    description: item.description,
    category: item.category,
    priority: item.priority,
    status: item.status,
    assignee: item.assignee || "",
    vendor: item.vendor || "",
    notes: item.notes || "",
    scheduled_date: item.scheduledDate || "",
    completed_date: item.completedDate || "",
    created_at: item.createdAt,
    status_history: item.statusHistory,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("saveItemToDB error:", error);
  return error;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Chip({label,tc,bg,bc}) {
  return <span style={{fontSize:11,fontWeight:500,padding:"2px 9px",borderRadius:99,
    background:bg,color:tc,border:`1px solid ${bc}`,whiteSpace:"nowrap"}}>{label}</span>;
}
function PPill({p}) { return <Chip label={p} tc={PCOLOR[p]} bg={PBG[p]} bc={PBDR[p]}/>; }
function SPill({s}) { return <Chip label={s} tc={SCOLOR[s]} bg={SBG[s]} bc={SBDR[s]}/>; }
function Dot({color,size=7}) {
  return <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,flexShrink:0}}/>;
}
function ULabel({children}) {
  return <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",
    color:C.faint,marginBottom:5}}>{children}</div>;
}
function PrimaryBtn({children,onClick,disabled,full}) {
  return <button onClick={disabled?undefined:onClick} style={{
    fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600,borderRadius:8,
    padding:"9px 20px",background:disabled?"#d1d0cb":C.text,
    color:disabled?"#9c9a93":"#fff",border:"none",
    cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto"}}>
    {children}
  </button>;
}
function GhostBtn({children,onClick}) {
  return <button onClick={onClick} style={{fontFamily:"var(--font-sans)",fontSize:13,
    borderRadius:8,padding:"9px 16px",background:"transparent",
    color:C.muted,border:`1px solid ${C.border}`,cursor:"pointer"}}>
    {children}
  </button>;
}
function FInput({label,value,onChange,type="text",placeholder,rows}) {
  const s={fontFamily:"var(--font-sans)",fontSize:13,width:"100%",borderRadius:8,
    border:`1px solid ${C.border}`,background:C.surface,color:C.text,
    padding:"8px 11px",boxSizing:"border-box",outline:"none",resize:rows?"vertical":"none"};
  return <div>
    {label&&<ULabel>{label}</ULabel>}
    {rows
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s}/>
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}
  </div>;
}
function FSelect({label,value,onChange,options}) {
  return <div>
    {label&&<ULabel>{label}</ULabel>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{
      fontFamily:"var(--font-sans)",fontSize:13,width:"100%",borderRadius:8,
      border:`1px solid ${C.border}`,background:C.surface,color:C.text,padding:"8px 11px"}}>
      {options.map(o=><option key={o.v??o} value={o.v??o}>{o.l??o}</option>)}
    </select>
  </div>;
}

// ─── Overlay primitives ───────────────────────────────────────────────────────

function Overlay({children,onClose}) {
  return <div onClick={e=>e.target===e.currentTarget&&onClose()}
    style={{position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.3)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"48px 16px",overflowY:"auto"}}>
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,
      width:"100%",maxWidth:560,padding:"24px 24px 20px",
      boxShadow:"0 12px 40px rgba(0,0,0,0.15)"}}>
      {children}
    </div>
  </div>;
}

function OverlayHeader({title,sub,onClose}) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
    <div>
      {sub&&<div style={{fontSize:11,color:C.faint,marginBottom:4}}>{sub}</div>}
      <div style={{fontSize:16,fontWeight:700,color:C.text}}>{title}</div>
    </div>
    <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
      fontSize:22,color:C.faint,padding:0,marginLeft:12,lineHeight:1}}>x</button>
  </div>;
}

function SlideOver({children,title,sub,onClose}) {
  return <div style={{position:"absolute",inset:0,zIndex:200,display:"flex"}}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{flex:1,background:"rgba(0,0,0,0.2)",cursor:"pointer"}} onClick={onClose}/>
    <div style={{width:500,background:C.surface,overflowY:"auto",
      borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",
      boxShadow:"-4px 0 24px rgba(0,0,0,0.1)"}}>
      <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{paddingRight:12}}>
            {sub&&<div style={{fontSize:11,color:C.faint,marginBottom:4}}>{sub}</div>}
            <div style={{fontSize:15,fontWeight:700,color:C.text,lineHeight:1.35}}>{title}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:22,color:C.faint,lineHeight:1,padding:0,flexShrink:0}}>x</button>
        </div>
      </div>
      <div style={{padding:"20px 24px",flex:1}}>{children}</div>
    </div>
  </div>;
}

// ─── AI helpers ───────────────────────────────────────────────────────────────

function parsePDF({pdfBase64,propertyId,inspectionId,overrideDate,overrideInspector},setLoading,onResult) {
  setLoading(true);
  const prompt=`You are reviewing a SnapInspect property inspection report for Dembs Development Inc.

Extract ALL actionable repair and maintenance items from this inspection.

RULES:
- Extract when Condition = "Yes" AND the item name describes a problem (repair, damage, needs painting, needs cleaning, etc.)
- Extract when Condition = "Yes" AND there is a comment
- Extract when Condition = "Satisfactory" but comment describes an issue
- Extract ALL items from the Comment Section at the end
- SKIP: Condition = "No", "N/A", or blank
- SKIP: "Overhead Doors Tested", "Dock Leveler Tested", "Handicap spaces properly striped", "Irrigation system turned off" when Yes with no damage comment
- SKIP: "Dumpster Coral", "Dumpster Pad", "Dumpster Gates" when Yes with no damage comment

For each item return:
- description: item name + comment combined into one clear actionable sentence
- category: one of ${CATEGORIES.join(", ")}
- priority: Critical/High/Medium/Low
- location: specific location if mentioned, else ""
- photoNote: ""

Also extract from header: propertyName, inspectorName, inspectionDate (YYYY-MM-DD format)

Respond ONLY with valid JSON, no markdown, no explanation:
{"propertyName":"","inspectorName":"","inspectionDate":"","items":[{"description":"","category":"","priority":"","location":"","photoNote":""}]}`;

  fetch("/api/anthropic",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,
      messages:[{role:"user",content:[
        {type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},
        {type:"text",text:prompt}
      ]}]
    })
  }).then(r=>r.json()).then(data=>{
    const raw=data.content?.find(b=>b.type==="text")?.text||"{}";
    let parsed={items:[]};
    try { parsed=JSON.parse(raw.replace(/```json|```/g,"").trim()); }
    catch(e) { console.error("Parse error:", e, raw); }
    const now=today();
    const newItems=(parsed.items||[]).map(item=>({
      id:"r"+uid(),inspectionId,propertyId,
      description:item.description+(item.location?` (${item.location})`:""),
      category:item.category,priority:item.priority,
      status:"Not Started",assignee:"",vendor:"",notes:item.photoNote||"",
      createdAt:now,scheduledDate:"",completedDate:"",
      statusHistory:[{status:"Not Started",date:now}],
    }));
    onResult({
      items:newItems,
      date:overrideDate||parsed.inspectionDate||now,
      inspector:overrideInspector||parsed.inspectorName||"",
      detectedProperty:parsed.propertyName,
    });
    setLoading(false);
  }).catch(e=>{setLoading(false);console.error("Fetch error:",e);alert("Failed to parse PDF. Check your connection.");});
}

function genAISummary(prop,propItems,cb,setLoading) {
  setLoading(true);
  const open=propItems.filter(i=>i.status!=="Completed");
  fetch("/api/anthropic",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:180,
      messages:[{role:"user",content:`Write a 2-3 sentence maintenance status summary for ${prop.name}. Open: ${open.length}. Critical: ${open.filter(i=>i.priority==="Critical").length}. Items: ${propItems.slice(0,5).map(i=>i.description).join("; ")}. Plain professional prose, no bullets.`}]
    })
  }).then(r=>r.json()).then(data=>{
    cb(data.content?.find(b=>b.type==="text")?.text||"");
    setLoading(false);
  }).catch(()=>setLoading(false));
}

// ─── Quote Modal ──────────────────────────────────────────────────────────────

function QuoteModal({item,onClose}) {
  const prop = PROPERTIES.find(p=>p.id===item.propertyId);
  const categoryVendors = (VENDORS[item.category]||[]).filter(v=>v.name!=="TBD");
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [selectedEmail,      setSelectedEmail]      = useState("");

  const selectedVendor  = categoryVendors.find(v=>v.name===selectedVendorName);
  const contactOptions  = selectedVendor?.contacts || [];

  const subject = `Quote Request - ${item.description.slice(0,60)} - ${prop?.name}`;
  const body    = `Hello,\n\nWe are requesting a quote for the following repair at one of our properties.\n\nPROPERTY: ${prop?.name}\nADDRESS: ${prop?.address}\n\nSCOPE OF WORK: ${item.description}\n\nPRIORITY: ${item.priority}\n\nPlease reply to this email with your quote at your earliest convenience. For questions, contact us at ${CONTACT_EMAIL}.\n\nThank you,\nDembs Development Inc.\n${CONTACT_EMAIL}`;

  const TEXT="#1a1a1a"; const MUTED="#555550"; const BORDER="#d0cec8";
  const INPUT={fontFamily:"var(--font-sans)",fontSize:13,width:"100%",borderRadius:7,
    border:`1px solid ${BORDER}`,background:"#fff",color:TEXT,padding:"8px 10px",boxSizing:"border-box"};

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"absolute",inset:0,zIndex:300,background:"rgba(0,0,0,0.35)",
        display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"52px 16px",overflowY:"auto"}}>
      <div style={{background:"#fff",borderRadius:12,border:`1px solid ${BORDER}`,
        width:"100%",maxWidth:580,padding:"26px 26px 22px",boxShadow:"0 12px 40px rgba(0,0,0,0.15)"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:TEXT}}>Request Vendor Quote</div>
            <div style={{fontSize:12,color:MUTED,marginTop:3}}>{prop?.name} · {item.category}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:MUTED,padding:0}}>x</button>
        </div>

        {/* Scope of work */}
        <div style={{background:"#f5f4f1",borderRadius:8,padding:"12px 14px",marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9c9a93",marginBottom:6}}>Scope of Work</div>
          <div style={{fontSize:14,color:TEXT,lineHeight:1.5}}>{item.description}</div>
          <div style={{marginTop:8}}>
            <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:99,
              background:item.priority==="Critical"?"#fef2f2":item.priority==="High"?"#fefce8":"#eff6ff",
              color:item.priority==="Critical"?"#b91c1c":item.priority==="High"?"#b45309":"#1d4ed8",
              border:`1px solid ${item.priority==="Critical"?"#fecaca":item.priority==="High"?"#fde68a":"#bfdbfe"}`}}>
              {item.priority} Priority
            </span>
          </div>
        </div>

        {/* Two dropdowns */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9c9a93",marginBottom:10}}>Vendor</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:11,color:MUTED,marginBottom:4}}>Company</div>
              {categoryVendors.length>0 ? (
                <select value={selectedVendorName} onChange={e=>{setSelectedVendorName(e.target.value);setSelectedEmail("");}} style={INPUT}>
                  <option value="">Select vendor...</option>
                  {categoryVendors.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
              ) : (
                <input placeholder="No vendors on file" style={{...INPUT,color:"#aaa"}} disabled/>
              )}
            </div>
            <div>
              <div style={{fontSize:11,color:MUTED,marginBottom:4}}>Contact email</div>
              {selectedVendorName && contactOptions.length>0 ? (
                <select value={selectedEmail} onChange={e=>setSelectedEmail(e.target.value)} style={INPUT}>
                  <option value="">Select contact...</option>
                  {contactOptions.map(c=><option key={c.email} value={c.email}>{c.person} — {c.email}</option>)}
                </select>
              ) : (
                <input placeholder={selectedVendorName?"No contacts on file":"Select vendor first"}
                  style={{...INPUT,color:"#aaa"}} disabled/>
              )}
            </div>
          </div>
        </div>

        {/* Email preview */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9c9a93",marginBottom:8}}>Email Preview</div>
          <div style={{background:"#f5f4f1",borderRadius:8,padding:"12px 14px",fontSize:12,color:MUTED,lineHeight:1.7,maxHeight:180,overflowY:"auto"}}>
            <div><strong style={{color:TEXT}}>To:</strong> {selectedEmail||"(select a vendor email above)"}</div>
            <div><strong style={{color:TEXT}}>Subject:</strong> {subject}</div>
            <div style={{marginTop:8,whiteSpace:"pre-wrap"}}>{body}</div>
          </div>
        </div>

        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{const m=`mailto:${selectedEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;window.open(m);}}
            disabled={!selectedEmail}
            style={{flex:1,fontSize:13,fontWeight:600,borderRadius:8,padding:"10px",
              background:selectedEmail?"#1a1a1a":"#d1d0cb",color:selectedEmail?"#fff":"#9c9a93",
              border:"none",cursor:selectedEmail?"pointer":"not-allowed"}}>
            Open in Email Client
          </button>
          <button onClick={onClose} style={{fontSize:13,borderRadius:8,padding:"10px 16px",
            background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,cursor:"pointer"}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function PropRow({prop,items,inspections,isLast,onClick}) {
  const [hov,setHov]=useState(false);
  const pi=items.filter(it=>it.propertyId===prop.id);
  const oi=pi.filter(it=>it.status!=="Completed");
  const cr=oi.filter(it=>it.priority==="Critical").length;
  const ins=inspections.filter(it=>it.propertyId===prop.id).length;
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",gap:16,padding:"11px 18px",
        background:hov?C.bg:C.surface,cursor:"pointer",
        borderBottom:isLast?"none":"1px solid #eaeaea",transition:"background 0.1s"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prop.name}</div>
        <div style={{fontSize:12,color:C.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prop.owner}</div>
      </div>
      <div style={{display:"flex",gap:14,alignItems:"center",flexShrink:0}}>
        {cr>0&&<Chip label={`${cr} critical`} tc={PCOLOR.Critical} bg={PBG.Critical} bc={PBDR.Critical}/>}
        {[[oi.length,"open",oi.length>0?C.text:C.faint],
          [pi.filter(it=>it.status==="Completed").length,"done",C.faint],
          [ins,"insp.",C.faint]].map(([n,l,cl])=>(
          <div key={l} style={{textAlign:"right",minWidth:28}}>
            <div style={{fontSize:16,fontWeight:700,color:cl,lineHeight:1}}>{n}</div>
            <div style={{fontSize:10,color:C.faint,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemRow({item,showProperty,onClick,onAdvance}) {
  const [hov,setHov]=useState(false);
  const prop=PROPERTIES.find(p=>p.id===item.propertyId);
  const next=STATUS_NEXT[item.status];
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",gap:14,padding:"11px 18px",
        background:hov?C.bg:C.surface,borderBottom:`1px solid ${C.border}`,
        cursor:"pointer",transition:"background 0.1s"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.description}</div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          {showProperty&&<>
            <span style={{fontSize:12,color:C.muted}}>{GROUPS[prop?.group]}</span>
            <span style={{color:C.border,fontSize:11}}>·</span>
          </>}
          <span style={{fontSize:11,color:C.muted}}>{item.category}</span>
          {item.assignee&&<><span style={{color:C.border,fontSize:11}}>·</span>
            <span style={{fontSize:11,color:C.muted}}>{item.assignee.split(" ")[0]}</span></>}
          {item.scheduledDate&&<><span style={{color:C.border,fontSize:11}}>·</span>
            <span style={{fontSize:11,color:C.muted}}>{item.scheduledDate}</span></>}
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
        <PPill p={item.priority}/>
        <SPill s={item.status}/>
        {next&&<button onClick={e=>{e.stopPropagation();onAdvance();}} style={{
          fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,
          padding:"3px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)",whiteSpace:"nowrap"}}>
          {next}
        </button>}
      </div>
    </div>
  );
}

function ItemDetail({item,inspections,onUpdate,onAdvance,onClose}) {
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({...item});
  const [showQuote,setShowQuote]=useState(false);
  const prop=PROPERTIES.find(p=>p.id===item.propertyId);
  const insp=inspections.find(i=>i.id===item.inspectionId);
  const next=STATUS_NEXT[item.status];
  function save(){onUpdate(form);setEditing(false);}
  return (
    <SlideOver onClose={onClose} sub={`${GROUPS[prop?.group]} · ${prop?.name}`} title={item.description}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        <PPill p={item.priority}/><SPill s={item.status}/>
        <Chip label={item.category} tc={C.muted} bg={C.bg} bc={C.border}/>
      </div>
      {next&&<button onClick={onAdvance} style={{width:"100%",marginBottom:20,padding:"10px 16px",
        background:SBG[next],color:SCOLOR[next],border:`1px solid ${SBDR[next]}`,
        borderRadius:8,cursor:"pointer",fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600}}>
        Mark as {next}
      </button>}
      {!editing ? <>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:20,
          border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          {[["Assignee",item.assignee||"Unassigned"],["Vendor",item.vendor||"—"],
            ["Created",item.createdAt],["Scheduled",item.scheduledDate||"—"],
            ["Completed",item.completedDate||"—"],["Inspection",insp?.date||"Manual"]
          ].map(([label,val],i)=>(
            <div key={label} style={{padding:"11px 14px",background:i%2===0?C.bg:C.surface}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.faint,marginBottom:4}}>{label}</div>
              <div style={{fontSize:14,color:C.text,fontWeight:600}}>{val}</div>
            </div>
          ))}
        </div>
        {item.notes&&<div style={{background:C.bg,borderRadius:8,padding:"12px 14px",marginBottom:20,borderLeft:`3px solid ${C.borderMid}`}}>
          <ULabel>Notes</ULabel>
          <div style={{fontSize:14,color:C.text,lineHeight:1.7}}>{item.notes}</div>
        </div>}
        <ULabel>Status history</ULabel>
        <div style={{marginBottom:20}}>
          {item.statusHistory.map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",
              borderBottom:i<item.statusHistory.length-1?`1px solid ${C.border}`:"none"}}>
              <Dot color={SCOLOR[h.status]} size={8}/>
              <span style={{fontSize:14,color:C.text,fontWeight:600,flex:1}}>{h.status}</span>
              <span style={{fontSize:13,color:C.faint}}>{h.date}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <GhostBtn onClick={()=>setEditing(true)}>Edit item</GhostBtn>
          <button onClick={()=>setShowQuote(true)} style={{fontFamily:"var(--font-sans)",fontSize:13,
            borderRadius:8,padding:"9px 16px",background:"#eff6ff",
            color:"#1d4ed8",border:"1px solid #bfdbfe",cursor:"pointer",fontWeight:500}}>
            Request Quote
          </button>
        </div>
        {showQuote&&<QuoteModal item={item} onClose={()=>setShowQuote(false)}/>}
      </> : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FInput label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} rows={2}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FSelect label="Assignee" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))}
              options={[{v:"",l:"Unassigned"},...TEAM.map(t=>({v:t,l:t}))]}/>
            <FSelect label="Priority" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={PRIORITIES}/>
            <FInput label="Vendor" value={form.vendor} onChange={v=>setForm(f=>({...f,vendor:v}))} placeholder="Optional"/>
            <FInput label="Scheduled date" value={form.scheduledDate} onChange={v=>setForm(f=>({...f,scheduledDate:v}))} type="date"/>
          </div>
          <FInput label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional..." rows={3}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <PrimaryBtn onClick={save}>Save changes</PrimaryBtn>
            <GhostBtn onClick={()=>setEditing(false)}>Cancel</GhostBtn>
          </div>
        </div>
      )}
    </SlideOver>
  );
}

function AISummaryCard({prop,propItems}) {
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  return (
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:text?10:0}}>
        <ULabel>AI Status Summary</ULabel>
        <button onClick={()=>genAISummary(prop,propItems,setText,setLoading)} disabled={loading}
          style={{fontSize:11,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,
            padding:"4px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>
          {loading?"Generating...":text?"Refresh":"Generate"}
        </button>
      </div>
      {text&&<p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.7}}>{text}</p>}
    </div>
  );
}

function ImportForm({selectedPropertyId,onSubmit,onClose}) {
  const [propertyId,setPropertyId]=useState(selectedPropertyId||PROPERTIES[0].id);
  const [overrideInspector,setOverrideInspector]=useState("");
  const [overrideDate,setOverrideDate]=useState("");
  const [fileName,setFileName]=useState("");
  const [pdfBase64,setPdfBase64]=useState("");
  const [loading,setLoading]=useState(false);
  const [preview,setPreview]=useState(null);
  const [dragOver,setDragOver]=useState(false);

  function handleFile(file) {
    if(!file||file.type!=="application/pdf"){alert("Please upload a PDF.");return;}
    setFileName(file.name);
    const r=new FileReader();
    r.onload=e=>{
      const base64=e.target.result.split(",")[1];
      const sizeInMB=(base64.length*0.75)/(1024*1024);
      if(sizeInMB>4){alert(`This PDF is ${sizeInMB.toFixed(1)}MB which may be too large. Try compressing at smallpdf.com first.`);return;}
      setPdfBase64(base64);
    };
    r.readAsDataURL(file);
  }

  const prop=PROPERTIES.find(p=>p.id===propertyId);

  if(preview) return (
    <Overlay onClose={onClose}>
      <OverlayHeader title="Review extracted items" sub={`${preview.items.length} items from ${fileName}`} onClose={onClose}/>
      {preview.detectedProperty&&<div style={{fontSize:12,color:C.muted,background:C.bg,
        padding:"8px 12px",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:14}}>
        PDF property: <strong style={{color:C.text}}>{preview.detectedProperty}</strong> → {prop?.name}
      </div>}
      <div style={{maxHeight:420,overflowY:"auto",marginBottom:16,border:`1px solid ${C.border}`,borderRadius:10}}>
        {preview.items.map((item,i)=>(
          <div key={i} style={{padding:"11px 16px",background:i%2===0?C.surface:C.bg,
            borderBottom:i<preview.items.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:6,lineHeight:1.4}}>{item.description}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <PPill p={item.priority}/>
              <Chip label={item.category} tc={C.muted} bg={C.bg} bc={C.border}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <PrimaryBtn onClick={()=>{
          onSubmit({id:"i"+uid(),propertyId,
            date:overrideDate||preview.date,
            inspector:overrideInspector||preview.inspector||"SnapInspect",
            notes:`SnapInspect PDF: ${fileName}`},preview.items);
        }}>Confirm & add {preview.items.length} items</PrimaryBtn>
        <GhostBtn onClick={()=>setPreview(null)}>Back</GhostBtn>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <OverlayHeader title="Import SnapInspect report" sub="Notes and photos extracted automatically" onClose={onClose}/>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>document.getElementById("pdf-upload-input").click()}
          style={{border:`2px dashed ${dragOver?C.text:C.borderMid}`,borderRadius:10,
            padding:"28px 20px",textAlign:"center",cursor:"pointer",
            background:dragOver?C.bg:"transparent",transition:"all 0.15s"}}>
          <input id="pdf-upload-input" type="file" accept="application/pdf" style={{display:"none"}}
            onChange={e=>handleFile(e.target.files[0])}/>
          {pdfBase64?<>
            <div style={{fontSize:28,marginBottom:6}}>PDF</div>
            <div style={{fontSize:13,fontWeight:600,color:C.text}}>{fileName}</div>
            <div style={{fontSize:11,color:C.faint,marginTop:2}}>Click to change</div>
          </>:<>
            <div style={{fontSize:22,color:C.faint,marginBottom:8}}>Upload</div>
            <div style={{fontSize:13,fontWeight:600,color:C.text}}>Drop SnapInspect PDF here</div>
            <div style={{fontSize:11,color:C.faint,marginTop:3}}>or click to browse</div>
          </>}
        </div>
        <FSelect label="Property" value={propertyId} onChange={setPropertyId}
          options={PROPERTIES.map(p=>({v:p.id,l:`${GROUPS[p.group]} — ${p.name}`}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FSelect label="Inspector (optional)" value={overrideInspector} onChange={setOverrideInspector}
            options={[{v:"",l:"Auto-detect from PDF"},...TEAM.map(t=>({v:t,l:t}))]}/>
          <FInput label="Date (optional)" value={overrideDate} onChange={setOverrideDate} type="date"/>
        </div>
        <PrimaryBtn full disabled={loading||!pdfBase64}
          onClick={()=>{const id="i"+uid();parsePDF({pdfBase64,propertyId,inspectionId:id,overrideDate,overrideInspector},setLoading,r=>setPreview({...r,inspId:id}));}}>
          {loading?"Extracting items from PDF...":"Extract repair items"}
        </PrimaryBtn>
      </div>
    </Overlay>
  );
}

function AddItemForm({onSubmit,onClose}) {
  const [form,setForm]=useState({
    propertyId:PROPERTIES[0].id,description:"",
    category:CATEGORIES[0],priority:"Medium",assignee:"",vendor:"",notes:""
  });
  return (
    <Overlay onClose={onClose}>
      <OverlayHeader title="Add repair item" onClose={onClose}/>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <FSelect label="Property" value={form.propertyId} onChange={v=>setForm(f=>({...f,propertyId:v}))}
          options={PROPERTIES.map(p=>({v:p.id,l:`${GROUPS[p.group]} — ${p.name}`}))}/>
        <FInput label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))}
          placeholder="Describe the repair task clearly..." rows={2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FSelect label="Category" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={CATEGORIES}/>
          <FSelect label="Priority" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={PRIORITIES}/>
          <FSelect label="Assignee" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))}
            options={[{v:"",l:"Unassigned"},...TEAM.map(t=>({v:t,l:t}))]}/>
          <FInput label="Vendor" value={form.vendor} onChange={v=>setForm(f=>({...f,vendor:v}))} placeholder="Optional"/>
        </div>
        <FInput label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional..." rows={2}/>
        <PrimaryBtn full disabled={!form.description.trim()} onClick={()=>{
          const now=today();
          onSubmit({id:"r"+uid(),inspectionId:null,...form,
            status:"Not Started",createdAt:now,scheduledDate:"",completedDate:"",
            statusHistory:[{status:"Not Started",date:now}]});
        }}>Add item</PrimaryBtn>
      </div>
    </Overlay>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loaded,setLoaded]           = useState(false);
  const [saving,setSaving]           = useState(false);
  const [inspections,setInspections] = useState([]);
  const [items,setItems]             = useState([]);
  const [view,setView]               = useState("portfolio");
  const [selProp,setSelProp]         = useState(null);
  const [selItem,setSelItem]         = useState(null);
  const [showImport,setShowImport]   = useState(false);
  const [showAdd,setShowAdd]         = useState(false);
  const [fStatus,setFStatus]         = useState("All");
  const [fPriority,setFPriority]     = useState("All");
  const [fCategory,setFCategory]     = useState("All");
  const [fAssignee,setFAssignee]     = useState("All");
  const [search,setSearch]           = useState("");

  useEffect(()=>{
    loadAll().then(({inspections:insp,items:its})=>{
      setInspections(insp);
      setItems(its);
      setLoaded(true);
    });
  },[]);

  async function updateItem(id,changes) {
    const updated=items.map(i=>i.id===id?{...i,...changes}:i);
    setItems(updated);
    if(selItem?.id===id) setSelItem(p=>({...p,...changes}));
    setSaving(true);
    const err = await saveItemToDB(updated.find(i=>i.id===id));
    if(err) console.error("updateItem save failed:", err);
    setSaving(false);
  }

  async function advance(item) {
    const next=STATUS_NEXT[item.status]; if(!next)return;
    const now=today();
    const h=[...item.statusHistory,{status:next,date:now}];
    const ch={status:next,statusHistory:h};
    if(next==="Completed") ch.completedDate=now;
    await updateItem(item.id,ch);
  }

  async function addInspectionAndItems(insp,newItems) {
    setSaving(true);
    await saveInspection(insp);
    for(const item of newItems){ await saveItemToDB(item); }
    setInspections(prev=>[insp,...prev]);
    setItems(prev=>[...newItems,...prev]);
    setSaving(false);
  }

  async function addItem(item) {
    setSaving(true);
    const err = await saveItemToDB(item);
    if(!err) setItems(prev=>[item,...prev]);
    else alert("Failed to save item. Please check your connection and try again.");
    setSaving(false);
  }

  const openItems=items.filter(i=>i.status!=="Completed");
  const critical =items.filter(i=>i.priority==="Critical"&&i.status!=="Completed");

  const filtered=useMemo(()=>items.filter(it=>{
    if(fStatus!=="All"&&it.status!==fStatus) return false;
    if(fPriority!=="All"&&it.priority!==fPriority) return false;
    if(fCategory!=="All"&&it.category!==fCategory) return false;
    if(fAssignee!=="All"&&it.assignee!==fAssignee) return false;
    if(selProp&&it.propertyId!==selProp) return false;
    if(search&&!it.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }),[items,fStatus,fPriority,fCategory,fAssignee,selProp,search]);

  const NAV=[{id:"portfolio",label:"Portfolio"},{id:"items",label:"All Items"},{id:"inspections",label:"Inspections"}];

  if(!loaded) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:C.bg,fontFamily:"var(--font-sans)",color:C.faint,fontSize:13}}>
      Loading...
    </div>
  );

  return (
    <div style={{display:"flex",height:"100vh",width:"100vw",background:C.bg,
      fontFamily:"var(--font-sans)",overflow:"hidden",position:"relative"}}>

      {/* Sidebar */}
      <div style={{width:220,background:"#000",display:"flex",flexDirection:"column",flexShrink:0,borderRight:"1px solid #1a1a1a"}}>
        <div style={{padding:"20px 20px 16px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"#222",borderRadius:6,flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center",
            border:"1px solid #333"}}>
            <span style={{color:"#fff",fontSize:15,fontWeight:800}}>D</span>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:C.sideText,letterSpacing:"-0.02em",lineHeight:1.1}}>PropertyOps</div>
            <div style={{fontSize:9,color:C.sideMuted,letterSpacing:"0.04em",textTransform:"uppercase",marginTop:1}}>Dembs Development</div>
          </div>
        </div>
        <div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"0 14px 8px"}}/>
        <nav style={{flex:1,padding:"4px 10px"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>{setView(n.id);setSelProp(null);}} style={{
              display:"block",width:"100%",textAlign:"left",padding:"8px 10px",
              background:view===n.id?"rgba(255,255,255,0.08)":"transparent",
              border:"none",borderRadius:7,cursor:"pointer",marginBottom:1,
              fontSize:14,fontWeight:view===n.id?600:400,
              color:view===n.id?C.sideText:C.sideMuted,transition:"all 0.1s"}}>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          {[["48","properties"],[openItems.length,"open items"],[critical.length,"critical"]].map(([n,l])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:12,color:C.sideMuted}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,
                color:critical.length>0&&l==="critical"?"#fca5a5":C.sideText}}>{n}</span>
            </div>
          ))}
          {saving&&<div style={{fontSize:10,color:C.sideMuted,marginTop:6}}>Saving...</div>}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Topbar */}
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
          padding:"0 24px",height:48,display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0,zIndex:10}}>
          <div style={{fontSize:16,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:6}}>
            {view==="portfolio"&&selProp?(()=>{
              const p=PROPERTIES.find(pr=>pr.id===selProp);
              return <><span onClick={()=>setSelProp(null)} style={{color:C.muted,cursor:"pointer",fontWeight:400,fontSize:13}}>Portfolio</span>
                <span style={{color:C.border,margin:"0 4px"}}>&rsaquo;</span><span>{p?.name}</span></>;
            })():view==="portfolio"?"Portfolio":view==="items"?"All Items":"Inspections"}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowAdd(true)} style={{fontSize:13,fontWeight:500,
              background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,
              padding:"6px 14px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>
              + Add item
            </button>
            <button onClick={()=>setShowImport(true)} style={{fontSize:13,fontWeight:600,
              background:C.text,border:"none",borderRadius:7,padding:"7px 16px",
              cursor:"pointer",color:"#fff",fontFamily:"var(--font-sans)"}}>
              + Import inspection
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>

          {/* Portfolio */}
          {view==="portfolio"&&!selProp&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12,marginBottom:24}}>
              {[
                {l:"Open Items", v:openItems.length,                                      s:"across portfolio", red:false},
                {l:"Critical",   v:critical.length,                                       s:"immediate action", red:critical.length>0},
                {l:"Scheduled",  v:items.filter(i=>i.status==="Scheduled").length,        s:"confirmed with vendors"},
                {l:"Completed",  v:items.filter(i=>i.status==="Completed").length,        s:"all time"},
              ].map(k=>(
                <div key={k.l} style={{background:C.surface,border:`1px solid ${k.red?PBDR.Critical:C.border}`,borderRadius:10,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:k.red?PCOLOR.Critical:C.faint,marginBottom:8}}>{k.l}</div>
                  <div style={{fontSize:36,fontWeight:800,color:k.red?PCOLOR.Critical:C.text,lineHeight:1,marginBottom:6}}>{k.v}</div>
                  <div style={{fontSize:12,color:C.muted}}>{k.s}</div>
                </div>
              ))}
            </div>

            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,
              padding:"12px 18px",marginBottom:24,display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.faint}}>Status</span>
              {STATUSES.map(s=>{
                const n=items.filter(i=>i.status===s).length;
                return <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
                  <Dot color={SCOLOR[s]} size={7}/>
                  <span style={{fontSize:13,color:C.muted}}>{s}</span>
                  <span style={{fontSize:14,fontWeight:700,color:C.text}}>{n}</span>
                </div>;
              })}
            </div>

            {Object.entries(GROUPS).map(([gkey,gname])=>{
              const gps=PROPERTIES.filter(p=>p.group===gkey);
              if(!gps.length) return null;
              return (
                <div key={gkey} style={{marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.faint,marginBottom:8}}>{gname}</div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                    {gps.map((prop,i)=>(
                      <PropRow key={prop.id} prop={prop} items={items} inspections={inspections}
                        isLast={i===gps.length-1}
                        onClick={()=>{setSelProp(prop.id);setView("portfolio");}}/>
                    ))}
                  </div>
                </div>
              );
            })}
          </>}

          {/* Property detail */}
          {view==="portfolio"&&selProp&&(()=>{
            const prop=PROPERTIES.find(p=>p.id===selProp);
            const pi=items.filter(i=>i.propertyId===selProp);
            const oi=pi.filter(i=>i.status!=="Completed");
            const pInsp=inspections.filter(i=>i.propertyId===selProp);
            return <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <div style={{fontSize:26,fontWeight:800,color:C.text,lineHeight:1.2}}>{prop.name}</div>
                  <div style={{fontSize:13,color:C.muted,marginTop:4}}>{prop.address}</div>
                  <div style={{fontSize:11,color:C.faint,marginTop:2}}>{prop.owner} · {GROUPS[prop.group]}</div>
                </div>
                <div style={{display:"flex",gap:20}}>
                  {[[oi.length,"open"],[pi.filter(i=>i.status==="Completed").length,"done"],[pInsp.length,"inspections"]].map(([n,l])=>(
                    <div key={l} style={{textAlign:"right"}}>
                      <div style={{fontSize:28,fontWeight:800,color:C.text}}>{n}</div>
                      <div style={{fontSize:11,color:C.faint}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <AISummaryCard prop={prop} propItems={pi}/>

              {PRIORITIES.map(p=>{
                const grp=oi.filter(i=>i.priority===p);
                if(!grp.length) return null;
                return (
                  <div key={p} style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                      <Dot color={PCOLOR[p]} size={7}/>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:PCOLOR[p]}}>{p}</span>
                      <span style={{fontSize:11,color:C.faint}}>({grp.length})</span>
                    </div>
                    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                      {grp.map(it=><ItemRow key={it.id} item={it} onClick={()=>setSelItem(it)} onAdvance={()=>advance(it)}/>)}
                    </div>
                  </div>
                );
              })}
              {oi.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.faint,fontSize:13}}>
                No open items — this property is clear.
              </div>}

              {pInsp.length>0&&<div style={{marginTop:28}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.faint,marginBottom:10}}>Inspection history</div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                  {pInsp.map((insp,i)=>{
                    const ii=items.filter(it=>it.inspectionId===insp.id);
                    return <div key={insp.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",
                      borderBottom:i<pInsp.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:500,color:C.text}}>{insp.date}</div>
                        <div style={{fontSize:11,color:C.faint,marginTop:2}}>{insp.inspector}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <Chip label={`${ii.length} items`} tc={SCOLOR.Scheduled} bg={SBG.Scheduled} bc={SBDR.Scheduled}/>
                        {ii.filter(it=>it.status==="Completed").length>0&&
                          <Chip label={`${ii.filter(it=>it.status==="Completed").length} done`}
                            tc={SCOLOR.Completed} bg={SBG.Completed} bc={SBDR.Completed}/>}
                      </div>
                    </div>;
                  })}
                </div>
              </div>}
            </>;
          })()}

          {/* All items */}
          {view==="items"&&<>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
                style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 11px",borderRadius:8,
                  border:`1px solid ${C.border}`,background:C.surface,color:C.text,width:200,outline:"none"}}/>
              {[
                [["All",...STATUSES],   fStatus,   setFStatus,   "Status"  ],
                [["All",...PRIORITIES], fPriority, setFPriority, "Priority"],
                [["All",...CATEGORIES], fCategory, setFCategory, "Category"],
                [["All",...TEAM],       fAssignee, setFAssignee, "Assignee"],
              ].map(([opts,val,setter,label])=>(
                <select key={label} value={val} onChange={e=>setter(e.target.value)}
                  style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 10px",borderRadius:8,
                    border:`1px solid ${C.border}`,background:C.surface,color:val==="All"?C.muted:C.text}}>
                  {opts.map(o=><option key={o} value={o}>{o==="All"?`All ${label==="Status"?"Statuses":label==="Priority"?"Priorities":label==="Category"?"Categories":label+"s"}`:o}</option>)}
                </select>
              ))}
              <span style={{fontSize:12,color:C.faint}}>{filtered.length} items</span>
            </div>
            {filtered.length===0
              ?<div style={{textAlign:"center",padding:"60px 0",color:C.faint,fontSize:13}}>No items match the current filters.</div>
              :<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                {filtered.map(it=><ItemRow key={it.id} item={it} showProperty
                  onClick={()=>setSelItem(it)} onAdvance={()=>advance(it)}/>)}
              </div>}
          </>}

          {/* Inspections */}
          {view==="inspections"&&<>
            <div style={{fontSize:12,color:C.faint,marginBottom:14}}>{inspections.length} inspections logged</div>
            {inspections.length===0
              ?<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"48px 24px",textAlign:"center"}}>
                <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:6}}>No inspections yet</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Import your first SnapInspect PDF to get started.</div>
                <PrimaryBtn onClick={()=>setShowImport(true)}>Import inspection</PrimaryBtn>
              </div>
              :<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                {inspections.map((insp,i)=>{
                  const prop=PROPERTIES.find(p=>p.id===insp.propertyId);
                  const ii=items.filter(it=>it.inspectionId===insp.id);
                  return <div key={insp.id} style={{padding:"14px 20px",
                    borderBottom:i<inspections.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{prop?.name}</div>
                        <div style={{fontSize:11,color:C.faint,marginTop:2}}>{insp.date} · {insp.inspector}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <Chip label={`${ii.length} items`} tc={SCOLOR.Scheduled} bg={SBG.Scheduled} bc={SBDR.Scheduled}/>
                        {ii.filter(it=>it.status==="Completed").length>0&&
                          <Chip label={`${ii.filter(it=>it.status==="Completed").length} done`}
                            tc={SCOLOR.Completed} bg={SBG.Completed} bc={SBDR.Completed}/>}
                      </div>
                    </div>
                    <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>{insp.notes}</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {ii.slice(0,5).map(it=>(
                        <button key={it.id} onClick={()=>setSelItem(it)}
                          style={{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,
                            borderRadius:6,padding:"3px 9px",cursor:"pointer",color:C.muted,
                            fontFamily:"var(--font-sans)",maxWidth:220,
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {it.description.slice(0,45)}{it.description.length>45?"...":""}
                        </button>
                      ))}
                      {ii.length>5&&<span style={{fontSize:11,color:C.faint,padding:"3px 0"}}>+{ii.length-5} more</span>}
                    </div>
                  </div>;
                })}
              </div>}
          </>}
        </div>
      </div>

      {/* Overlays */}
      {selItem&&<ItemDetail item={selItem} inspections={inspections}
        onUpdate={ch=>updateItem(selItem.id,ch)} onAdvance={()=>advance(selItem)}
        onClose={()=>setSelItem(null)}/>}
      {showImport&&<ImportForm selectedPropertyId={selProp}
        onSubmit={(insp,its)=>{addInspectionAndItems(insp,its);setShowImport(false);}}
        onClose={()=>setShowImport(false)}/>}
      {showAdd&&<AddItemForm
        onSubmit={it=>{addItem(it);setShowAdd(false);}}
        onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
