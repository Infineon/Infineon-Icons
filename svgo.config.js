// svgo.config.js
module.exports = {
  multipass: true,
  js2svg: {
    indent: 2,
    pretty: true,
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertShapeToPath: { active: true },
          convertEllipseToCircle: { active: true },
          convertPathData: { active: true },
          strokeToPath: { active: true }, // Include the strokeToPath plugin
        },
      },
    },
  ],
};
