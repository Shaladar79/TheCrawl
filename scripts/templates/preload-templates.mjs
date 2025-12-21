// scripts/templates/preload-templates.mjs
export async function preloadHandlebarsTemplates() {
  // Add template paths here when you create .hbs files.
  const templatePaths = [
    // "systems/thecrawl/templates/actor/actor-sheet.hbs"
  ];

  if (templatePaths.length) {
    await loadTemplates(templatePaths);
  }
}
