import handlebars from 'express-handlebars';

const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        lessorequal: function (lvalue, rvalue, options) {
            if (lvalue <= rvalue) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        truncate: function (str, len) {
            if (str.length > len) {
                return str.substring(0, len) + '...';
            }
            return str;
        },
        eq: function (a, b) {
            return a === b;
        },
        // otros helpers...
    }
});

export default hbs;