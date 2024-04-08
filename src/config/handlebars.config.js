import handlebars from 'express-handlebars';
import moment from 'moment';

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
        formatDate: function (datetime) {
            return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
        },
        getFirstImage: function (images) {
            return images && images.length ? images[0] : null;
        },
        truncateWords: function (description) {
            const len = 48;
            if (description.length > len) {
                return description.substring(0, len) + '...';
            }
            return description;
        }
        // otros helpers...
    }
});

export default hbs;