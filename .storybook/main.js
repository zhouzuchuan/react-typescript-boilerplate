const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '../' + dir)
}

module.exports = {
    stories: ['../src/**/*.stories.js'],
    addons: [
        '@storybook/addon-docs',
        '@storybook/addon-links',
        '@storybook/addon-actions',
    ],
    webpackFinal: async (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@a': resolve('src/assets'),
            '@m': resolve('src/models'),
            '@c': resolve('src/components'),
            '@cn': resolve('src/containers'),
            '@s': resolve('src/styles'),
            '@p': resolve('src/plugins'),
            '@u': resolve('src/utils'),
            '@rw': resolve('src/serviceWorker.ts'),
            '@': resolve('src'),
        }
        config.resolve.extensions.push('.ts', '.tsx')
        return config
    },
}
