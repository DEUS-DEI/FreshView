// Service worker entry for MV3. Imports the same helper scripts that were
// previously loaded in the background page via the "scripts" array.
// The imported scripts will populate the global scope with the same
// constructors/variables used by `js/background.js`.

importScripts(
    'js/constants.js',
    'js/logger.js',
    'js/storage.js',
    'js/background.js'
);
