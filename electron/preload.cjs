const { contextBridge } = require('electron');

// Keep the renderer isolated. Add narrowly scoped, reviewed APIs here as features are implemented.
contextBridge.exposeInMainWorld('aiStudio', {
  platform: process.platform,
  version: '0.1.0',
});
