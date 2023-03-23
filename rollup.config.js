// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import inlineSvg from 'rollup-plugin-inline-svg';

export default {
  input: './generated_js/index.js',
  output: {
    file: './dist/icons.js',
    format: 'es',
    name: 'svgs'
  },
  plugins: [
    resolve(),
    inlineSvg()
  ]
};
