const ExcelJS = require("exceljs");

const GROUPS = {
  "2925":"2925 Jagar","STANSB":"Stansbury","FCHRIS":"Christopher",
  "FDEMBS":"Dembs Roth","FDRGRP":"DR Group","FDRP":"DRP",
  "FLIVGR":"Livonia Group","FNEWBR":"Newburgh",
};

const PROPERTIES = [
  {id:"2925",   name:"2925 Boardwalk",            group:"2925"  },
  {id:"STANSB", name:"27750 Stansbury",            group:"STANSB"},
  {id:"FC1",    name:"13550 Otterson Court",       group:"FCHRIS"},
  {id:"FC2",    name:"13623 Otterson Court",       group:"FCHRIS"},
  {id:"FC3",    name:"32567 Schoolcraft",          group:"FCHRIS"},
  {id:"FC4",    name:"35245 Schoolcraft",          group:"FCHRIS"},
  {id:"FC5",    name:"35301 Schoolcraft",          group:"FCHRIS"},
  {id:"FC6",    name:"35355 Schoolcraft",          group:"FCHRIS"},
  {id:"FC7",    name:"35367 Schoolcraft",          group:"FCHRIS"},
  {id:"FC8",    name:"13685 Otterson Court",       group:"FCHRIS"},
  {id:"FD1",    name:"35015 Glendale",             group:"FDEMBS"},
  {id:"FD2",    name:"35255 Glendale",             group:"FDEMBS"},
  {id:"FD3",    name:"13455 Stamford Court",       group:"FDEMBS"},
  {id:"STMFRD", name:"13481-13489 Stamford Court", group:"FDEMBS"},
  {id:"CANTON", name:"4280 Haggerty",              group:"FDRGRP"},
  {id:"DR2",    name:"45701 Mast St.",             group:"FDRGRP"},
  {id:"DR3",    name:"45801 Mast St.",             group:"FDRGRP"},
  {id:"BOARDW", name:"3005 Boardwalk",             group:"FDRGRP"},
  {id:"DR5",    name:"14900 Galleon",              group:"FDRGRP"},
  {id:"DR6",    name:"40984 Concept Drive",        group:"FDRGRP"},
  {id:"DR7",    name:"40985 Concept Drive",        group:"FDRGRP"},
  {id:"DR8",    name:"44895 Helm Court",           group:"FDRGRP"},
  {id:"DR9",    name:"45889 Mast St.",             group:"FDRGRP"},
  {id:"DR10",   name:"44176-44190 Plymouth Oaks",  group:"FDRGRP"},
  {id:"DR11",   name:"44330 Plymouth Oaks Blvd.",  group:"FDRGRP"},
  {id:"DR12",   name:"44747 Helm Court",           group:"FDRGRP"},
  {id:"DR13",   name:"44064 Plymouth Oaks",        group:"FDRGRP"},
  {id:"DR14",   name:"44160 Plymouth Oaks Dr.",    group:"FDRGRP"},
  {id:"DHTS1",  name:"6938 Telegraph Road",        group:"FDRP"  },
  {id:"DHTS2",  name:"6923 Waverly",               group:"FDRP"  },
  {id:"WARREN", name:"14517 Eight Mile Road",      group:"FDRP"  },
  {id:"WTRFRD", name:"6680 Highland Road",         group:"FDRP"  },
  {id:"LG1",    name:"13500 Ashurst Court",        group:"FLIVGR"},
  {id:"LG2",    name:"13501 Ashurst Court",        group:"FLIVGR"},
  {id:"LG3",    name:"34425 Schoolcraft",          group:"FLIVGR"},
  {id:"LG4",    name:"34450 Industrial Road",      group:"FLIVGR"},
  {id:"NB1",    name:"12623 Newburgh Road",        group:"FNEWBR"},
  {id:"AMRHEI", name:"37564-37584 Amrhein",        group:"FNEWBR"},
  {id:"NB3",    name:"12649 Richfield Court",      group:"FNEWBR"},
  {id:"NB4",    name:"12671 Richfield Court",      group:"FNEWBR"},
  {id:"NB5",    name:"12749 Richfield Court",      group:"FNEWBR"},
  {id:"NB6",    name:"37666 Amrhein Road",         group:"FNEWBR"},
  {id:"NB7",    name:"37720 Amrhein Road",         group:"FNEWBR"},
  {id:"NB8",    name:"12866 Richfield Court",      group:"FNEWBR"},
  {id:"NB9",    name:"12900 Richfield Court",      group:"FNEWBR"},
  {id:"NB10",   name:"37770 Amrhein Road",         group:"FNEWBR"},
  {id:"NB11",   name:"12665 Richfield Court",      group:"FNEWBR"},
  {id:"NB12",   name:"12754 Richfield Court",      group:"FNEWBR"},
];

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { items } = req.body;
  if (!items) return res.status(400).json({ error: "No items provided" });

  const NAVY   = "1C2B3A";
  const LBLUE  = "E8F0F8";
  const WHITE  = "FFFFFF";
  const LGRAY  = "F8F6F2";

  const wb = new ExcelJS.Workbook();
  wb.creator = "PropertyOps";
  const ws = wb.addWorksheet("Action Items", { views:[{state:"frozen",ySplit:3}] });

  // Column widths
  ws.columns = [
    {key:"category",  width:22},
    {key:"property",  width:30},
    {key:"portfolio", width:16},
    {key:"issue",     width:48},
    {key:"notes",     width:28},
    {key:"status",    width:14},
    {key:"created",   width:14},
    {key:"assignee",  width:14},
  ];

  const COLS = 8;

  function navyCell(cell, text, bold=false) {
    cell.value = text;
    cell.font = { name:"Calibri", size:bold?11:10, bold, color:{argb:"FFFFFFFF"} };
    cell.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FF"+NAVY} };
    cell.alignment = { vertical:"middle", horizontal:"left", wrapText:false };
  }

  function headerCell(cell, text) {
    cell.value = text;
    cell.font = { name:"Calibri", size:10, bold:true, color:{argb:"FFFFFFFF"} };
    cell.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FF"+NAVY} };
    cell.alignment = { vertical:"middle", horizontal:"left" };
  }

  function groupCell(cell, text) {
    cell.value = text;
    cell.font = { name:"Calibri", size:10, bold:true, color:{argb:"FF"+NAVY} };
    cell.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FF"+LBLUE} };
    cell.alignment = { vertical:"middle", horizontal:"left" };
  }

  function dataCell(cell, text, bold=false, bg=WHITE) {
    cell.value = text;
    cell.font = { name:"Calibri", size:10, bold, color:{argb:"FF000000"} };
    cell.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FF"+bg} };
    cell.alignment = { vertical:"middle", horizontal:"left", wrapText:true };
  }

  function addBorder(row) {
    for(let c=1;c<=COLS;c++){
      const cell = row.getCell(c);
      cell.border = {
        bottom:{style:"thin",color:{argb:"FFD4D4D4"}},
      };
    }
  }

  // Group & sort items by category
  const grouped = {};
  for(const item of items) {
    const cat = item.category||"Other";
    if(!grouped[cat]) grouped[cat]=[];
    grouped[cat].push(item);
  }
  const sortedCats = Object.keys(grouped).sort();

  const total = items.length;
  const today = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

  // Row 1 — Title
  ws.mergeCells(1,1,1,COLS);
  navyCell(ws.getCell("A1"), `Dembs Development Inc. — Exterior Action Items`, true);
  ws.getRow(1).height = 22;

  // Row 2 — Subtitle
  ws.mergeCells(2,1,2,COLS);
  navyCell(ws.getCell("A2"), `Sorted by Trade & Category  ·  ${total} items  ·  Exported ${today}`);
  ws.getRow(2).height = 18;

  // Row 3 — Headers
  const headers = ["Trade / Category","Property","Portfolio","Issue / Item","Notes","Status","Created","Assignee"];
  const hRow = ws.addRow([]);
  headers.forEach((h,i) => headerCell(hRow.getCell(i+1), h));
  hRow.height = 18;

  let rowIndex = 4;
  let oddEven = 0;

  for(const cat of sortedCats) {
    const catItems = grouped[cat];

    // Category group header
    const gRow = ws.getRow(rowIndex++);
    ws.mergeCells(rowIndex-1, 1, rowIndex-1, COLS);
    groupCell(gRow.getCell(1), `  ${cat}  (${catItems.length} item${catItems.length!==1?"s":""})`);
    gRow.height = 17;

    // Sort by property name within category
    catItems.sort((a,b)=>{
      const pa = PROPERTIES.find(p=>p.id===a.propertyId)?.name||"";
      const pb = PROPERTIES.find(p=>p.id===b.propertyId)?.name||"";
      return pa.localeCompare(pb);
    });

    for(const item of catItems) {
      const prop = PROPERTIES.find(p=>p.id===item.propertyId);
      const group = prop ? (GROUPS[prop.group]||"") : "";
      const bg = oddEven%2===0 ? WHITE : LGRAY;
      oddEven++;

      const dRow = ws.getRow(rowIndex++);
      dRow.height = 16;

      dataCell(dRow.getCell(1), item.category||"",         false, bg);
      dataCell(dRow.getCell(2), prop?.name||"",            false, bg);
      dataCell(dRow.getCell(3), group,                      true,  bg);
      dataCell(dRow.getCell(4), item.description||"",      false, bg);
      dataCell(dRow.getCell(5), item.notes||"",            false, bg);
      dataCell(dRow.getCell(6), item.status||"",           false, bg);
      dataCell(dRow.getCell(7), item.createdAt ? item.createdAt.slice(0,10) : "", false, bg);
      dataCell(dRow.getCell(8), item.assignee||"",         false, bg);
      addBorder(dRow);
    }
  }

  // Auto-filter on header row
  ws.autoFilter = { from:"A3", to:`H3` };

  const buffer = await wb.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  res.status(200).json({ file: base64 });
};
