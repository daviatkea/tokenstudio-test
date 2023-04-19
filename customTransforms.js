import StyleDictionary from "style-dictionary";

function boxShadowToCSS(boxShadowArray) {
  return boxShadowArray
    .map((shadow) => {
      const { x, y, blur, spread, color, type } = shadow;
      return `${
        type === "innerShadow" ? "inset" : ""
      } ${x}px ${y}px ${blur}px ${spread}px ${color}`;
    })
    .join(", ");
}

StyleDictionary.registerTransform({
  name: "box-shadow/css",
  type: "value",
  matcher: (prop) => prop.attributes.category === "boxShadow",
  transformer: (prop) => boxShadowToCSS(prop.value),
});

StyleDictionary.registerTransform({
  name: "typography/css",
  type: "name",
  matcher: (prop) => prop.attributes.category === "typography",
  transformer: (prop) => {
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

    const output = [];

    for (const [key, value] of Object.entries(propertyToVariable)) {
      if (prop.value[key] !== undefined) {
        output.push(`${prop.path.join("-")}-${value}`);
      }
    }

    return output;
  },
});

export default StyleDictionary;
