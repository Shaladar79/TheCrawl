// scripts/templates/preload-templates.mjs
export async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/thecrawl/templates/actor/actor-sheet.hbs"
  ];

  await loadTemplates(templatePaths);
}
