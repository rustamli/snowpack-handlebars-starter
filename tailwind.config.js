module.exports = {
    purge: [
        './dist/**/*.html',
        './public/**/*.js'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {},
    plugins: [
      require('@tailwindcss/typography')
    ]
}
