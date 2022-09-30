const iconLibraryAlternativeName = {};
const iconLibraryName = {};

const library = {
  add: (...icons) => {
    icons.forEach(({
      name, height, width, svgContent,
    }) => {
    // first check if icon is a valid icon
      if (!name || !height || !width || !svgContent) {
        console.error(`Trying to add unsupported icon to library "${name}"`);
      } else if (iconLibraryName[name]) {
        console.error(`Adding icon twice ${name}`);
      } else {
        const alternativeName = name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        const iconObj = {
          name, alternativeName, height, width, svgContent,
        };
        iconLibraryName[name] = iconObj;
        iconLibraryAlternativeName[alternativeName] = iconObj;
      }
    });
  },
  getIcon: (name) => {
    if (!iconLibraryName[name] && !iconLibraryAlternativeName[name]) {
      console.error(`Trying to load icon that was not put into iconLibrary before "${name}"`);
      return undefined;
    }
    return iconLibraryName[name] || iconLibraryAlternativeName[name];
  },
  getIcons: () => iconLibraryName,
};

export default library;
