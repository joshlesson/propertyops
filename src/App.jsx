import { useState, useMemo, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  "Roofing":             [{name:"TBD",email:""}],
  "Masonry":             [{name:"TBD",email:""}],
  "Concrete / Hardscape":[{name:"TBD",email:""}],
  "Painting / Finishes": [{name:"TBD",email:""}],
  "Asphalt":             [{name:"TBD",email:""}],
  "Striping":            [{name:"TBD",email:""}],
  "Dock / Loading":      [{name:"TBD",email:""}],
  "Signage":             [{name:"TBD",email:""}],
  "HVAC":                [{name:"TBD",email:""}],
  "Electrical":          [{name:"TBD",email:""}],
  "Plumbing":            [{name:"TBD",email:""}],
  "Landscaping":         [{name:"TBD",email:""}],
  "Structural":          [{name:"TBD",email:""}],
  "Safety":              [{name:"TBD",email:""}],
  "Other":               [{name:"TBD",email:""}],
};

const STATUSES   = ["Not Started","PO Issued","Scheduled","In Progress","Completed"];
const STATUS_NEXT= {"Not Started":"PO Issued","PO Issued":"Scheduled","Scheduled":"In Progress","In Progress":"Completed"};

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
  {id:"STMFRD", name:"13481–13489 Stamford Court", address:"13481–13489 Stamford Court, Livonia, MI 48150",     owner:"SGS Owner, LLC",                    group:"FDEMBS"},
  {id:"CANTON", name:"4280 Haggerty",              address:"4280 Haggerty Rd., Canton, MI 48188",               owner:"4280 Haggerty, LLC",                group:"FDRGRP"},
  {id:"DR2",    name:"45701 Mast St.",             address:"45701 Mast St., Plymouth, MI 48170",                owner:"45 Mast, LLC",                      group:"FDRGRP"},
  {id:"DR3",    name:"45801 Mast St.",             address:"45801 Mast St., Plymouth, MI 48170",                owner:"45 Mast, LLC",                      group:"FDRGRP"},
  {id:"BOARDW", name:"3005 Boardwalk",             address:"3005 Boardwalk, Ann Arbor, MI 48108",               owner:"Boardwalk, LLC",                    group:"FDRGRP"},
  {id:"DR5",    name:"14900 Galleon",              address:"14900 Galleon, Plymouth, MI 48170",                 owner:"D R Group LP",                      group:"FDRGRP"},
  {id:"DR6",    name:"40984 Concept Drive",        address:"40984 Concept Drive, Plymouth, MI 48170",           owner:"D R Group LP",                      group:"FDRGRP"},
  {id:"DR7",    name:"40985 Concept Drive",        address:"40985 Concept Drive, Plymouth, MI 48110",           owner:"D R Group LP",                      group:"FDRGRP"},
  {id:"DR8",    name:"44895 Helm Court",           address:"44895 Helm Ct., Plymouth, MI 48170",                owner:"Helm Owner, LLC",                   group:"FDRGRP"},
  {id:"DR9",    name:"45889 Mast St.",             address:"45889 Mast St., Plymouth, MI 48176",                owner:"MG Group, LLC",                     group:"FDRGRP"},
  {id:"DR10",   name:"44176–44190 Plymouth Oaks",  address:"44176–44190 Plymouth Oaks Dr., Plymouth, MI 48176", owner:"Oaks 44747, LLC",                   group:"FDRGRP"},
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
  {id:"AMRHEI", name:"37564–37584 Amrhein",        address:"37564–37584 Amrhein, Livonia, MI 48150",            owner:"Amrhein Property, LLC",             group:"FNEWBR"},
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
  bg:"#f0efe9", surface:"#ffffff", border:"#e0ddd5", borderMid:"#c0bdb5",
  text:"#111110", muted:"#555250", faint:"#888580",
  sidebar:"#141312", sideText:"#f5f2ec", sideMuted:"#8a8780",
};
const PCOLOR={Critical:"#b91c1c",High:"#b45309",Medium:"#1d4ed8",Low:"#16a34a"};
const PBG   ={Critical:"#fef2f2",High:"#fefce8",Medium:"#eff6ff",Low:"#f0fdf4"};
const PBDR  ={Critical:"#fecaca",High:"#fde68a",Medium:"#bfdbfe",Low:"#bbf7d0"};
const SCOLOR={"Not Started":"#71717a","PO Issued":"#7c3aed","Scheduled":"#1d4ed8","In Progress":"#d97706","Completed":"#16a34a"};
const SBG   ={"Not Started":"#fafafa","PO Issued":"#f5f3ff","Scheduled":"#eff6ff","In Progress":"#fffbeb","Completed":"#f0fdf4"};
const SBDR  ={"Not Started":"#e4e4e7","PO Issued":"#ddd6fe","Scheduled":"#bfdbfe","In Progress":"#fde68a","Completed":"#bbf7d0"};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2,9); }
function today() { return new Date().toISOString().slice(0,10); }

// ─── Supabase data layer ──────────────────────────────────────────────────────

async function loadAll() {
  try {
    const [{ data: insps }, { data: its }] = await Promise.all([
      sb.from("inspections").select("*").order("date", { ascending: false }),
      sb.from("items").select("*").order("created_at", { ascending: false }),
    ]);
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
  } catch(e) { console.error("loadAll error", e); return { inspections:[], items:[] }; }
}

async function saveInspection(insp) {
  await sb.from("inspections").upsert({
    id: insp.id, property_id: insp.propertyId, date: insp.date,
    inspector: insp.inspector, notes: insp.notes,
  });
}

async function saveItemToDB(item) {
  await sb.from("items").upsert({
    id: item.id, inspection_id: item.inspectionId || null,
    property_id: item.propertyId, description: item.description,
    category: item.category, priority: item.priority, status: item.status,
    assignee: item.assignee, vendor: item.vendor, notes: item.notes,
    scheduled_date: item.scheduledDate || "", completed_date: item.completedDate || "",
    created_at: item.createdAt, status_history: item.statusHistory,
    updated_at: new Date().toISOString(),
  });
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
    padding:"8px 11px",boxSizing:"border-box",outline:"none",
    resize:rows?"vertical":"none"};
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
      fontSize:22,color:C.faint,padding:0,marginLeft:12,lineHeight:1}}>×</button>
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
            fontSize:22,color:C.faint,lineHeight:1,padding:0,flexShrink:0}}>×</button>
        </div>
      </div>
      <div style={{padding:"20px 24px",flex:1}}>{children}</div>
    </div>
  </div>;
}

// ─── AI helpers ───────────────────────────────────────────────────────────────

function parsePDF({pdfBase64,propertyId,inspectionId,overrideDate,overrideInspector},setLoading,onResult) {
  setLoading(true);
  const prompt=`You are reviewing a property inspection PDF. Extract ALL actionable repair and maintenance items.

EXTRACT an item when ANY of these are true:
1. Condition column says "Yes" AND the item name describes a problem (e.g. "Overhead Doors Need of Repair", "Man Door Need of Repair", "Building Need of Painting", "Dumpster Area Trash Requires Clean Out")
2. Condition says "Yes" AND there is ANY comment text (even just "Paint" or "2026")
3. Condition says "Satisfactory" BUT the comment describes an issue (e.g. "catch basins settling / crack fill needed")
4. The Comment Section at the end has any actionable text

SKIP when:
- Condition is "No", "N/A", or blank
- Item is just confirming something exists with no problem: "Handicap spaces properly striped Yes", "Irrigation system turned off Yes", "Overhead Doors Tested No", "Dock Leveler Tested No", "Dumpster Coral Yes" (no comment), "Dumpster Pad Yes" (no comment)

For each extracted item return:
- description: clear actionable task combining item name + comment
- category: one of ${CATEGORIES.join(", ")}
- priority: Critical/High/Medium/Low
- location: specific location if mentioned (or "")
- photoNote: ""

From header extract: propertyName, inspectorName, inspectionDate (YYYY-MM-DD)

Return ONLY valid JSON with no markdown:
{"propertyName":"","inspectorName":"","inspectionDate":"","items":[{"description":"","category":"","priority":"","location":"","photoNote":""}]}`;

  fetch("/api/anthropic",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,
      messages:[{role:"user",content:[
        {type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},
        {type:"text",text:prompt}
      ]}]
    })
  }).then(r=>r.json()).then(data=>{
    const raw=data.content?.find(b=>b.type==="text")?.text||"{}";
    const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
    const now=today();
    const newItems=(parsed.items||[]).map(item=>({
      id:"r"+uid(),inspectionId,propertyId,
      description:item.description+(item.location?` (${item.location})`:""),
      category:item.category,priority:item.priority,
      status:"Not Started",assignee:"",vendor:"",
      notes:item.photoNote||"",
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
  }).catch(()=>{setLoading(false);alert("Failed to parse PDF. Check your connection.");});
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


// ─── Quote Request ────────────────────────────────────────────────────────────

function QuoteModal({item, onClose}) {
  const prop = PROPERTIES.find(p=>p.id===item.propertyId);
  const categoryVendors = VENDORS[item.category] || [];
  const [vendorName, setVendorName] = useState(categoryVendors[0]?.name!=="TBD" ? categoryVendors[0]?.name : "");
  const [vendorEmail, setVendorEmail] = useState(categoryVendors[0]?.name!=="TBD" ? categoryVendors[0]?.email : "");
  const [customVendor, setCustomVendor] = useState(false);

  const subject = `Quote Request — ${item.description.slice(0,60)} — ${prop?.name}`;
  const body = `Hello,

We are requesting a quote for the following repair at one of our properties.

PROPERTY: ${prop?.name}
ADDRESS: ${prop?.address}

SCOPE OF WORK: ${item.description}

PRIORITY: ${item.priority}

Please reply to this email with your quote at your earliest convenience. For questions, contact us at ${CONTACT_EMAIL}.

Thank you,
Dembs Development Inc.
${CONTACT_EMAIL}`;

  function openEmail() {
    const mailto = `mailto:${vendorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
  }

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
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:MUTED,padding:0}}>×</button>
        </div>

        {/* Work summary */}
        <div style={{background:"#f5f4f1",borderRadius:8,padding:"12px 14px",marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9c9a93",marginBottom:6}}>Scope of Work</div>
          <div style={{fontSize:14,color:TEXT,lineHeight:1.5}}>{item.description}</div>
          <div style={{marginTop:8,display:"flex",gap:8}}>
            <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:99,
              background:item.priority==="Critical"?"#fef2f2":item.priority==="High"?"#fefce8":"#eff6ff",
              color:item.priority==="Critical"?"#b91c1c":item.priority==="High"?"#b45309":"#1d4ed8",
              border:`1px solid ${item.priority==="Critical"?"#fecaca":item.priority==="High"?"#fde68a":"#bfdbfe"}`}}>
              {item.priority} Priority
            </span>
          </div>
        </div>

        {/* Vendor selection */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9c9a93",marginBottom:8}}>Vendor</div>
          {categoryVendors.length>0 && categoryVendors[0].name!=="TBD" && !customVendor && (
            <div style={{marginBottom:10}}>
              <select value={vendorName} onChange={e=>{
                const v=categoryVendors.find(v=>v.name===e.target.value);
                setVendorName(e.target.value);
                setVendorEmail(v?.email||"");
              }} style={INPUT}>
                {categoryVendors.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:11,color:MUTED,marginBottom:4}}>Vendor name</div>
              <input value={vendorName} onChange={e=>setVendorName(e.target.value)}
                placeholder="Enter vendor name" style={INPUT}/>
            </div>
            <div>
              <div style={{fontSize:11,color:MUTED,marginBottom:4}}>Vendor email</div>
              <input value={vendorEmail} onChange={e=>setVendorEmail(e.target.value)}
                placeholder="vendor@example.com" style={INPUT}/>
            </div>
          </div>
        </div>

        {/* Email preview */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9c9a93",marginBottom:8}}>Email Preview</div>
          <div style={{background:"#f5f4f1",borderRadius:8,padding:"12px 14px",fontSize:12,color:MUTED,lineHeight:1.7,maxHeight:180,overflowY:"auto"}}>
            <div><strong style={{color:TEXT}}>To:</strong> {vendorEmail||"(vendor email)"}</div>
            <div><strong style={{color:TEXT}}>Subject:</strong> {subject}</div>
            <div style={{marginTop:8,whiteSpace:"pre-wrap"}}>{body}</div>
          </div>
        </div>

        <div style={{display:"flex",gap:8}}>
          <button onClick={openEmail} disabled={!vendorEmail}
            style={{flex:1,fontSize:13,fontWeight:600,borderRadius:8,padding:"10px",
              background:vendorEmail?"#1a1a1a":"#d1d0cb",color:vendorEmail?"#fff":"#9c9a93",
              border:"none",cursor:vendorEmail?"pointer":"not-allowed"}}>
            Open in Email Client →
          </button>
          <button onClick={onClose}
            style={{fontSize:13,borderRadius:8,padding:"10px 16px",
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
        borderBottom:isLast?"none":`1px solid ${C.border}`,transition:"background 0.1s"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prop.name}</div>
        <div style={{fontSize:12,color:C.muted,marginTop:1,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prop.owner}</div>
      </div>
      <div style={{display:"flex",gap:14,alignItems:"center",flexShrink:0}}>
        {cr>0&&<Chip label={`${cr} critical`} tc={PCOLOR.Critical} bg={PBG.Critical} bc={PBDR.Critical}/>}
        {[[oi.length,"open",oi.length>0?C.text:C.faint],
          [pi.filter(it=>it.status==="Completed").length,"done",C.faint],
          [ins,"insp.",C.faint]].map(([n,l,c])=>(
          <div key={l} style={{textAlign:"right",minWidth:28}}>
            <div style={{fontSize:16,fontWeight:700,color:c,lineHeight:1}}>{n}</div>
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
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:3,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.description}</div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          {showProperty&&<>
            <span style={{fontSize:12,color:C.muted}}>{GROUPS[prop?.group]}</span>
            <span style={{color:C.border,fontSize:11}}>·</span>
          </>}
          <span style={{fontSize:11,color:C.muted}}>{item.category}</span>
          {item.assignee&&<>
            <span style={{color:C.border,fontSize:11}}>·</span>
            <span style={{fontSize:11,color:C.muted}}>{item.assignee.split(" ")[0]}</span>
          </>}
          {item.scheduledDate&&<>
            <span style={{color:C.border,fontSize:11}}>·</span>
            <span style={{fontSize:11,color:C.muted}}>{item.scheduledDate}</span>
          </>}
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
        <PPill p={item.priority}/>
        <SPill s={item.status}/>
        {next&&<button onClick={e=>{e.stopPropagation();onAdvance();}} style={{
          fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,
          padding:"3px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)",whiteSpace:"nowrap"}}>
          → {next}
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
    <SlideOver onClose={onClose}
      sub={`${GROUPS[prop?.group]} · ${prop?.name}`}
      title={item.description}>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        <PPill p={item.priority}/><SPill s={item.status}/>
        <Chip label={item.category} tc={C.muted} bg={C.bg} bc={C.border}/>
      </div>

      {next&&<button onClick={onAdvance} style={{width:"100%",marginBottom:20,padding:"10px 16px",
        background:SBG[next],color:SCOLOR[next],border:`1px solid ${SBDR[next]}`,
        borderRadius:8,cursor:"pointer",fontFamily:"var(--font-sans)",fontSize:13,fontWeight:600}}>
        Mark as {next} →
      </button>}

      {!editing ? <>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:20,
          border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          {[["Assignee",item.assignee||"Unassigned"],["Vendor",item.vendor||"—"],
            ["Created",item.createdAt],["Scheduled",item.scheduledDate||"—"],
            ["Completed",item.completedDate||"—"],["Inspection",insp?.date||"Manual"]
          ].map(([label,val],i)=>(
            <div key={label} style={{padding:"11px 14px",background:i%2===0?C.bg:C.surface}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",
                color:C.faint,marginBottom:4}}>{label}</div>
              <div style={{fontSize:14,color:C.text,fontWeight:600}}>{val}</div>
            </div>
          ))}
        </div>

        {item.notes&&<div style={{background:C.bg,borderRadius:8,padding:"12px 14px",marginBottom:20,
          borderLeft:`3px solid ${C.borderMid}`}}>
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
            Request Quote →
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
          <FInput label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional…" rows={3}/>
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
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,
      padding:"14px 18px",marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:text?10:0}}>
        <ULabel>AI Status Summary</ULabel>
        <button onClick={()=>genAISummary(prop,propItems,setText,setLoading)} disabled={loading}
          style={{fontSize:11,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,
            padding:"4px 10px",cursor:"pointer",color:C.muted,fontFamily:"var(--font-sans)"}}>
          {loading?"Generating…":text?"Refresh":"Generate"}
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
      // Check size — Vercel limit is 4.5MB, warn if over 3MB
      const sizeInMB = (base64.length * 0.75) / (1024 * 1024);
      if(sizeInMB > 4) {
        alert(`This PDF is ${sizeInMB.toFixed(1)}MB which may be too large. Try compressing it at smallpdf.com first, then re-upload.`);
        return;
      }
      setPdfBase64(base64);
    };
    r.readAsDataURL(file);
  }

  const prop=PROPERTIES.find(p=>p.id===propertyId);

  if(preview) return (
    <Overlay onClose={onClose}>
      <OverlayHeader title="Review extracted items"
        sub={`${preview.items.length} items from ${fileName}`} onClose={onClose}/>
      {preview.detectedProperty&&<div style={{fontSize:12,color:C.muted,background:C.bg,
        padding:"8px 12px",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:14}}>
        PDF property: <strong style={{color:C.text}}>{preview.detectedProperty}</strong> → {prop?.name}
      </div>}
      <div style={{maxHeight:420,overflowY:"auto",marginBottom:16,
        border:`1px solid ${C.border}`,borderRadius:10}}>
        {preview.items.map((item,i)=>(
          <div key={i} style={{padding:"11px 16px",background:i%2===0?C.surface:C.bg,
            borderBottom:i<preview.items.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:6,lineHeight:1.4}}>{item.description}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <PPill p={item.priority}/>
              <Chip label={item.category} tc={C.muted} bg={C.bg} bc={C.border}/>
              {item.notes&&<span style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>{item.notes}</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <PrimaryBtn onClick={()=>{
          onSubmit({id:"i"+uid(),propertyId,
            date:overrideDate||preview.date,
            inspector:overrideInspector||preview.inspector||"SnapInspect",
            notes:`SnapInspect PDF: ${fileName}`},
            preview.items);
        }}>Confirm & add {preview.items.length} items</PrimaryBtn>
        <GhostBtn onClick={()=>setPreview(null)}>Back</GhostBtn>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <OverlayHeader title="Import SnapInspect report"
        sub="Notes and photos extracted automatically" onClose={onClose}/>
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
            <div style={{fontSize:28,marginBottom:6}}>📄</div>
            <div style={{fontSize:13,fontWeight:600,color:C.text}}>{fileName}</div>
            <div style={{fontSize:11,color:C.faint,marginTop:2}}>Click to change</div>
          </>:<>
            <div style={{fontSize:22,color:C.faint,marginBottom:8}}>↑</div>
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
          {loading?"Extracting items from PDF…":"Extract repair items →"}
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
        <FInput label="Description" value={form.description}
          onChange={v=>setForm(f=>({...f,description:v}))}
          placeholder="Describe the repair task clearly…" rows={2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FSelect label="Category" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={CATEGORIES}/>
          <FSelect label="Priority" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={PRIORITIES}/>
          <FSelect label="Assignee" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))}
            options={[{v:"",l:"Unassigned"},...TEAM.map(t=>({v:t,l:t}))]}/>
          <FInput label="Vendor" value={form.vendor} onChange={v=>setForm(f=>({...f,vendor:v}))} placeholder="Optional"/>
        </div>
        <FInput label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional…" rows={2}/>
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
  const [loaded,setLoaded]         = useState(false);
  const [saving,setSaving]         = useState(false);
  const [inspections,setInspections] = useState([]);
  const [items,setItems]           = useState([]);
  const [view,setView]             = useState("portfolio");
  const [selProp,setSelProp]       = useState(null);
  const [selItem,setSelItem]       = useState(null);
  const [showImport,setShowImport] = useState(false);
  const [showAdd,setShowAdd]       = useState(false);
  const [fStatus,setFStatus]       = useState("All");
  const [fPriority,setFPriority]   = useState("All");
  const [fCategory,setFCategory]   = useState("All");
  const [fAssignee,setFAssignee]   = useState("All");
  const [search,setSearch]         = useState("");
  // Load from Supabase on mount
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
    await saveItemToDB(updated.find(i=>i.id===id));
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
    await Promise.all(newItems.map(saveItemToDB));
    setInspections(prev=>[insp,...prev]);
    setItems(prev=>[...newItems,...prev]);
    setSaving(false);
  }
  async function addItem(item) {
    setSaving(true);
    await saveItemToDB(item);
    setItems(prev=>[item,...prev]);
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
      Loading…
    </div>
  );

  return (
    <div style={{display:"flex",height:"100vh",width:"100vw",background:C.bg,
      fontFamily:"var(--font-sans)",overflow:"hidden",position:"relative"}}>

      {/* Sidebar */}
      <div style={{width:210,background:C.sidebar,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"16px 18px 14px",display:"flex",alignItems:"center",gap:10}}>
          <img src="data:image/jpeg;base64,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" 
            alt="Dembs Development" style={{width:36,height:36,objectFit:"contain",borderRadius:4,flexShrink:0}}/>
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
              background:view===n.id?"rgba(255,255,255,0.1)":"transparent",
              border:"none",borderRadius:7,cursor:"pointer",marginBottom:1,
              fontSize:14,fontWeight:view===n.id?600:400,
              color:view===n.id?C.sideText:C.sideMuted,transition:"all 0.1s"}}>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
          {[["48","properties"],[openItems.length,"open items"],[critical.length,"critical"]].map(([n,l])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:12,color:C.sideMuted}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,
                color:critical.length>0&&l==="critical"?"#fca5a5":C.sideText}}>{n}</span>
            </div>
          ))}
          {saving&&<div style={{fontSize:10,color:C.sideMuted,marginTop:6}}>Saving…</div>}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Topbar */}
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
          padding:"0 24px",height:52,display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0,zIndex:10}}>
          <div style={{fontSize:16,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:6}}>
            {view==="portfolio"&&selProp?(()=>{
              const p=PROPERTIES.find(pr=>pr.id===selProp);
              return <><span onClick={()=>setSelProp(null)} style={{color:C.muted,cursor:"pointer",fontWeight:400,fontSize:13}}>Portfolio</span>
                <span style={{color:C.border,margin:"0 4px"}}>›</span><span>{p?.name}</span></>;
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

          {/* ── Portfolio ── */}
          {view==="portfolio"&&!selProp&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12,marginBottom:24}}>
              {[
                {l:"Open Items",  v:openItems.length,              s:"across portfolio",      red:false},
                {l:"Critical",    v:critical.length,               s:"immediate action",      red:critical.length>0},
                {l:"Scheduled",   v:items.filter(i=>i.status==="Scheduled").length, s:"confirmed with vendors"},
                {l:"Completed",   v:items.filter(i=>i.status==="Completed").length, s:"all time"},
              ].map(k=>(
                <div key={k.l} style={{background:C.surface,border:`1px solid ${k.red?PBDR.Critical:C.border}`,
                  borderRadius:10,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
                    color:k.red?PCOLOR.Critical:C.faint,marginBottom:8}}>{k.l}</div>
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
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
                    color:C.faint,marginBottom:8}}>{gname}</div>
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

          {/* ── Property detail ── */}
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
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",
                        textTransform:"uppercase",color:PCOLOR[p]}}>{p}</span>
                      <span style={{fontSize:11,color:C.faint}}>({grp.length})</span>
                    </div>
                    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                      {grp.map(it=><ItemRow key={it.id} item={it}
                        onClick={()=>setSelItem(it)} onAdvance={()=>advance(it)}/>)}
                    </div>
                  </div>
                );
              })}
              {oi.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.faint,fontSize:13}}>
                No open items — this property is clear.
              </div>}

              {pInsp.length>0&&<div style={{marginTop:28}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",
                  color:C.faint,marginBottom:10}}>Inspection history</div>
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

          {/* ── All items ── */}
          {view==="items"&&<>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
                style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 11px",borderRadius:8,
                  border:`1px solid ${C.border}`,background:C.surface,color:C.text,width:200,outline:"none"}}/>
              {[
                [["All",...STATUSES],   fStatus,   setFStatus,   "Status"  ],
                [["All",...PRIORITIES], fPriority, setFPriority, "Priority"],
                [["All",...CATEGORIES],fCategory, setFCategory, "Category"],
                [["All",...TEAM],       fAssignee, setFAssignee, "Assignee"],
              ].map(([opts,val,setter,label])=>(
                <select key={label} value={val} onChange={e=>setter(e.target.value)}
                  style={{fontFamily:"var(--font-sans)",fontSize:13,padding:"7px 10px",borderRadius:8,
                    border:`1px solid ${C.border}`,background:C.surface,color:val==="All"?C.muted:C.text}}>
                  {opts.map(o=><option key={o} value={o}>{o==="All"?`All ${label === "Status" ? "Statuses" : label === "Priority" ? "Priorities" : label === "Category" ? "Categories" : label + "s"}`:o}</option>)}
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

          {/* ── Inspections ── */}
          {view==="inspections"&&<>
            <div style={{fontSize:12,color:C.faint,marginBottom:14}}>{inspections.length} inspections logged</div>
            {inspections.length===0
              ?<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,
                  padding:"48px 24px",textAlign:"center"}}>
                <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:6}}>No inspections yet</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Import your first SnapInspect PDF to get started.</div>
                <PrimaryBtn onClick={()=>setShowImport(true)}>Import inspection →</PrimaryBtn>
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
                    <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>
                      &ldquo;{insp.notes}&rdquo;
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {ii.slice(0,5).map(it=>(
                        <button key={it.id} onClick={()=>setSelItem(it)}
                          style={{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,
                            borderRadius:6,padding:"3px 9px",cursor:"pointer",color:C.muted,
                            fontFamily:"var(--font-sans)",maxWidth:220,
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {it.description.slice(0,45)}{it.description.length>45?"…":""}
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
