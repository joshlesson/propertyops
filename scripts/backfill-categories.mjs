import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://rvpacnokfnvwscxvjsou.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cGFjbm9rZm52d3NjeHZqc291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjk4MjEsImV4cCI6MjA4OTg0NTgyMX0.KRYZU6mnQpfXtJjUwVV-QvRf-2Gl72gkQBKc_pq7YOw"
);

function inferCategory(desc) {
  const d = desc.toLowerCase();
  const rules = [
    ["Parking Lot",    /\b(parking\s*lot|asphalt|pothol|striping|seal\s*coat|pav(e|ing)|park\s*lot)\b/],
    ["Signage",        /\b(sign(s|age)?|banner|letter(s|ing)?|placard)\b/],
    ["Structural",     /\b(structur|beam|column|wall\s*crack|foundation|masonry|brick|block|tuck\s*point|lintel|steel|joist)\b/],
    ["Concrete / Hardscape", /\b(concret|sidewalk|curb|hardscape|stoop|step|flatwork|apron)\b/],
    ["Soffits / Panel Boards", /\b(soffit|fascia|panel\s*board|panelboard|eave)\b/],
    ["Doors",          /\b(door|entry|exit|storefront|glass\s*door)\b/],
    ["Painting / Finishes",  /\b(paint|stain|finish|coat(ing)?|rust|prime|primer|caulk|seal(ant)?|bollard.*paint)\b/],
    ["Dock / Loading", /\b(dock|loading|leveler|bumper|overhead\s*door|roll.up|coil.*door|dock\s*(door|seal|plate|light))\b/],
    ["Roofing",        /\b(roof|shingle|membrane|flashing|gutter|downspout|drain|leak.*roof|roof.*leak|ponding|skylight|cap\s*sheet)\b/],
    ["HVAC",           /\b(hvac|furnace|heat(er|ing)?|cool(ing)?|a\/?c\b|air\s*condition|thermostat|duct|condenser|compressor|rtu|rooftop\s*unit|boiler)\b/],
    ["Plumbing",       /\b(plumb|pipe|faucet|toilet|drain|sewer|water\s*heater|valve|spigot|hose\s*bib|backflow|sump|ejector)\b/],
    ["Electrical",     /\b(electri|wir(e|ing)|outlet|panel|breaker|circuit|light(s|ing|pole)?|ballast|fixture|switch|volt|amp|meter|transformer|receptacle)\b/],
    ["Landscaping",    /\b(landscap|tree|shrub|mulch|mow|grass|weed|trim|prun|irrigation|sprinkler|bush|planting|flower|sod|grade|erosion|drain.*yard)\b/],
    ["Safety",         /\b(safety|fire\s*(ext|alarm|door|escape|sprinkler)|handicap|ada\b|emergency|exit\s*(sign|light)|extinguish|smoke\s*detect|handrail|guardrail|trip\s*hazard)\b/],
  ];
  for (const [cat, re] of rules) if (re.test(d)) return cat;
  return "Other";
}

async function main() {
  // Fetch all items to re-evaluate categories
  const { data: items, error } = await sb
    .from("items")
    .select("id, description, category");

  if (error) { console.error("Fetch error:", error); process.exit(1); }

  console.log(`Found ${items.length} total items`);

  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    const newCat = inferCategory(item.description || "");
    if (newCat === item.category || newCat === "Other") { skipped++; continue; }

    const { error: upErr } = await sb
      .from("items")
      .update({ category: newCat })
      .eq("id", item.id);

    if (upErr) {
      console.error(`  FAIL [${item.id}]: ${upErr.message}`);
    } else {
      console.log(`  ${item.description.slice(0, 60).padEnd(60)} ${item.category} -> ${newCat}`);
      updated++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} remained "Other"`);
}

main();
