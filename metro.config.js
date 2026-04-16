const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const nativeOverrideRoots = [
  path.join(__dirname, 'node_modules/expo/src/async-require'),
  path.join(__dirname, 'node_modules/expo-router/node_modules/@expo/metro-runtime/src'),
];

const nativeOverrideExtensions = ['.native.ts', '.native.tsx', '.native.js', '.native.jsx'];

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform &&
    platform !== 'web' &&
    moduleName.startsWith('.') &&
    !path.extname(moduleName) &&
    nativeOverrideRoots.some((root) => context.originModulePath.startsWith(root))
  ) {
    const candidateBasePath = path.resolve(path.dirname(context.originModulePath), moduleName);

    for (const extension of nativeOverrideExtensions) {
      const candidatePath = `${candidateBasePath}${extension}`;
      if (fs.existsSync(candidatePath)) {
        return {
          type: 'sourceFile',
          filePath: candidatePath,
        };
      }
    }
  }

  if (typeof defaultResolveRequest === 'function') {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
