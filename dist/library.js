const iconLibrary = {};

const library = {
  add: ({
    name, svgSuffix, height, width, svgContent,
  }) => {
    // first check if icon is a valid icon
    if (!name || !svgSuffix || !height || !width || !svgContent) {
      console.error(`Trying to add unsupported icon to library${`${name}_${svgSuffix}`}`);
    } else if (iconLibrary[name] && iconLibrary[name][svgSuffix]) {
      console.error(`Adding icon twice ${name}_${svgSuffix}`);
    } else {
      if (!iconLibrary[name]) {
        iconLibrary[name] = {};
      }
      iconLibrary[name][svgSuffix] = { height, width, svgContent };

      console.log('hell yeah');
    }
  },
  getIcon: (name, svgSuffix) => {
    if (!iconLibrary[name] || !iconLibrary[name][svgSuffix]) {
      console.error(`Trying to load icon that was not put into iconLibrary before.${name}_${svgSuffix}`);
      return undefined;
    }
    return iconLibrary[name][svgSuffix];
  },
};

export { library as default };
