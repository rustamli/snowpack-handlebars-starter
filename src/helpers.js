module.exports = {
    run(handlebars) {
        handlebars.registerHelper('sample_link_decorator', function (value) {
            return '↪ ' + value;
        })
    }
}
