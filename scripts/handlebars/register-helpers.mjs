// scripts/handlebars/register-helpers.mjs
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("or", function () {
    // Usage: (or cond1 cond2 cond3 ...)
    const args = Array.from(arguments).slice(0, -1);
    return args.some(Boolean);
  });
}
