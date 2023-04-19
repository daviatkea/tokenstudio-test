// build.js

import StyleDictionary from "./customTransforms.js";

StyleDictionary.registerFormat({
  name: "css/variables-typography",
  formatter: function (dictionary) {
    const { allProperties } = dictionary;
    const customProperties = allProperties.filter(
      (prop) => prop.attributes.category !== "typography"
    );

    let output = ":root {\n";

    for (const prop of customProperties) {
      output += `  --${prop.name}: ${prop.value};\n`;
    }

    for (const prop of allProperties.filter(
      (prop) => prop.attributes.category === "typography"
    )) {
      const {
        fontFamily,
        fontWeight,
        lineHeight,
        fontSize,
        paragraphSpacing,
        letterSpacing,
      } = prop.value;

      const propertyToVariable = {
        fontFamily: "font-family",
        fontWeight: "font-weight",
        lineHeight: "line-height",
        fontSize: "font-size",
        paragraphSpacing: "margin-bottom",
        letterSpacing: "letter-spacing",
      };

      for (const [key, value] of Object.entries(propertyToVariable)) {
        if (prop.value[key] !== undefined) {
          const name = `${prop.path.join("-")}-${value}`;
          let cssValue;

          switch (key) {
            case "lineHeight":
              cssValue = `${parseFloat(lineHeight) / 100}`;
              break;
            case "letterSpacing":
              const letterSpacingInRem =
                (parseFloat(letterSpacing) / 100) * fontSize;
              cssValue = `${letterSpacingInRem / 16}rem`;
              break;
            default:
              cssValue = prop.value[key];
          }

          output += `  --${name}: ${cssValue};\n`;
        }
      }
    }

    output += "}\n";

    return output;
  },
});

StyleDictionary.extend({
  source: ["output.json"],
  platforms: {
    css: {
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "time/seconds",
        "content/icon",
        "color/css",
        "size/rem",
        "typography/css",
        "box-shadow/css",
      ],
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables-typography",
        },
      ],
    },
  },
}).buildAllPlatforms();
