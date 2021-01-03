module.exports = {
    devOptions: {
        port: 7500
    },
    mount: process.env.NODE_ENV === 'development' ? {
        dist: '/',
        src: '/', 
        public: '/'
    } : {
        dist: '/',
        public: '/'
    },
    plugins: [
        '@snowpack/plugin-postcss',
        ['./snowpack-handlebars-plugin/index.js', {
            srcPath: './src',
            outputPath: './dist'
            // data: {
            //     'posts': './data/posts.csv',
            //     'posts_enriched': {
            //         source: ['posts'],
            //         script: './data/scripts/enrich_posts.js'
            //     },
            //     'posts_at': {
            //         script: './data/scripts/at-posts.js'
            //     }
            // },
            // dataTransforms: './data/transforms'
        }]
    ],
}
