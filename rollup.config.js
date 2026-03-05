// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import { string } from 'rollup-plugin-string';

export default {
  input: './generated_js/index.js',
  output: {
    file: './dist/icons.js',
    format: 'es',
    name: 'svgs',
  },
  plugins: [
    string({ include: '**/*.svg' }),
    resolve(),
  ],
};
