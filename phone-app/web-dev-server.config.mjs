// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import rollupReplace from '@rollup/plugin-replace';
import rolluplitcss from 'rollup-plugin-lit-css';
import { fromRollup } from '@web/dev-server-rollup';
const replace = fromRollup(rollupReplace);
const litcss = fromRollup(rolluplitcss);

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/',
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  // appIndex: 'demo/index.html',

  plugins: [
    litcss(),
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ],

  // See documentation for all available options
});
