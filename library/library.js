const iconLibrary = {};

const library = {
  add: (...icons) => {
    icons.forEach(({
      name, height, width, svgContent,
    }) => {
    // first check if icon is a valid icon
      if (!name || !height || !width || !svgContent) {
        console.error(`Trying to add unsupported icon to library "${name}"`);
      } else if (iconLibrary[name] && iconLibrary[name]) {
        console.error(`Adding icon twice ${name}`);
      } else {
        if (!iconLibrary[name]) {
          iconLibrary[name] = {};
        }
        const iconObj = { height, width, svgContent };
        iconLibrary[name] = iconObj;
        iconLibrary[name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())] = iconObj;
      }
    });
  },
  getIcon: (name) => {
    if (!iconLibrary[name]) {
      console.error(`Trying to load icon that was not put into iconLibrary before "${name}"`);
      return undefined;
    }
    return iconLibrary[name];
  },
};

export default library;
