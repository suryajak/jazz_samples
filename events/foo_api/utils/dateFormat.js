const moment = require("moment");

function dateToEpoch(date) {
    return moment(date).valueOf();
}

function dateToYear(date) {
    return moment(date).format('YYYY');
}

function dateToYear(date) {
    return moment(date).format('YYYY');
}

function dateToMonth(date) {
    return moment(date).format('MMM YYYY');
}

function dateToWeek(date) {
    return moment(date).format('GGGG-[W]WW');
}

function dateToDay(date) {
    return moment(date).format('YYYY-MM-DD');
}

function dateBeautify(date) {
    return moment(date).format('Do MMMM YYYY');
}

function epochNow() {
    return moment().valueOf();
}
module.exports = {
	dateToEpoch,
	dateToYear,
	dateToMonth,
	dateToWeek,
	dateToDay,
	dateBeautify,
	epochNow
};
