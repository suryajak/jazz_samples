/**
	@module: dateFormat.js
    @description: helper functions for date formatting
	@author: suryajak
	@version: 1.0
**/

const moment = require("moment");

class DateFormat {
    
    static toEpoch(date) {
        return moment(date).valueOf();
    }

    static toYear(date) {
        return moment(date).format('YYYY');
    }

    static toMonth(date) {
        return moment(date).format('MMM YYYY');
    }

    static toWeek(date) {
        return moment(date).format('GGGG-[W]WW');
    }

    static toDay(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    static beautify(date) {
        return moment(date).format('Do MMMM YYYY');
    }

    static epochNow() {
        return moment().valueOf();
    }
}

module.exports = DateFormat;
