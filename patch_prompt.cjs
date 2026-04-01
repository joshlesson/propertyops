const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldPrompt = `You are reviewing a SnapInspect property inspection report for Dembs Development Inc. Extract ALL actionable repair and maintenance items. For each item return description, category (one of ${CATEGORIES.join(", ")}), priority (Critical/High/Medium/Low), location. Also extract propertyName, inspectorName, inspectionDate (YYYY-MM-DD). Respond ONLY with valid JSON: {"propertyName":"","inspectorName":"","inspectionDate":"","items":[{"description":"","category":"","priority":"","location":""}]}`;

const newPrompt = `You are reviewing a SnapInspect property inspection report for Dembs Development Inc. Extract ALL actionable repair and maintenance items.
RULES:
- SKIP items that are NOT repairs: "Handicap spaces properly striped", "Overhead Doors Tested", "Dock Leveler Tested", "Irrigation system turned off" when there is no damage noted
- SKIP items with Condition = "No", "N/A", or blank with no comment
- description must be a clean sentence with NO parentheses and NO location info
- Keep descriptions concise and action-oriented
For each item return description, category (one of \${CATEGORIES.join(", ")}), priority (Critical/High/Medium/Low).
Also extract propertyName, inspectorName, inspectionDate (YYYY-MM-DD).
Respond ONLY with valid JSON: {"propertyName":"","inspectorName":"","inspectionDate":"","items":[{"description":"","category":"","priority":""}]}`;

if (c.includes(oldPrompt)) {
  c = c.replace(oldPrompt, newPrompt);
  console.log('prompt replaced');
} else {
  // Try to find and replace the prompt another way
  const promptStart = c.indexOf('You are reviewing a SnapInspect');
  const promptEnd = c.indexOf('Respond ONLY with valid JSON:');
  if (promptStart > -1 && promptEnd > -1) {
    const endOfPrompt = c.indexOf('`', promptEnd);
    c = c.slice(0, promptStart) + `You are reviewing a SnapInspect property inspection report for Dembs Development Inc. Extract ALL actionable repair and maintenance items.\nRULES:\n- SKIP: "Handicap spaces properly striped", "Overhead Doors Tested", "Dock Leveler Tested", "Irrigation system turned off" unless damage is noted\n- SKIP items with Condition = "No" or blank\n- Write descriptions as clean sentences with NO parentheses and NO location details\nFor each item return description, category (one of \${CATEGORIES.join(", ")}), priority (Critical/High/Medium/Low).\nAlso extract propertyName, inspectorName, inspectionDate (YYYY-MM-DD).\nRespond ONLY with valid JSON: {"propertyName":"","inspectorName":"","inspectionDate":"","items":[{"description":"","category":"","priority":""}]}` + c.slice(endOfPrompt);
    console.log('prompt replaced via slice');
  } else {
    console.log('ERROR - could not find prompt');
  }
}

// Also strip all parentheses from descriptions
c = c.replace(
  'description:item.description.replace(/\\s*\\([^)]*\\)\\s*$/,"").trim()',
  'description:item.description.replace(/\\s*\\([^)]*\\)/g,"").trim()'
);

fs.writeFileSync('src/App.jsx', c);
