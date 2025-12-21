// scripts/handlebars/register-helpers.mjs
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("eq", (a, b) => a === b);

  Handlebars.registerHelper("or", function () {
    const args = Array.from(arguments).slice(0, -1);
    return args.some(Boolean);
  });

  Handlebars.registerHelper("json", (context) =>
    JSON.stringify(context ?? {}, null, 2)
  );
}
