module.exports = {
  extends: ['@fengyinchao/eslint-config-fed/typescript-base', '@fengyinchao/eslint-config-fed/node'],
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'import/no-unresolved': [2, { ignore: ['vscode'] }],
  },
  settings: {
    node: {
      allowModules: ['vscode'],
      resolvePaths: [__dirname],
      tryExtensions: ['.js', '.json', '.node', '.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
};
