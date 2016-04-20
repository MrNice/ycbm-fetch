var request     = require('request')
var queryString = require('query-string')

function pad(num) {
  var str = '' + num
  var pad = '00'
  return pad.substring(0, pad.length - str.length) + str
}

function parseDate(format) {
  var date = new Date(format)
  // Note: Double Equals for string equivalence not 'strict equality'
  if (date == 'Invalid Date') throw new Error("Error: Date format failed")
  return date
}

function formatDate(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
}

// Note:
  // cookie: Cookie string with a JSESSION and an AWSELB key/value
  // calendar: your unique calendar ID, pulled from you can book me
  // start / end: JavaScript Date Objects (use new Date())
  // takesTSV: callback which receives the TSV from YCBM as a unicode string
const baseLink = 'https://classic.youcanbook.me/lin/bookings/ycbm-data.tsv'
function extract(cookie, calendar, start, end, takesTSV) {
  var qs = queryString.stringify({start: formatDate(start),
                                  end:   formatDate(end),
                                  cal:   calendar,
                                  datesField: 'start'})

  request({url: baseLink + '?' + qs,
           followAllRedirects: true,
           headers: {
             'cookie': cookie,
             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10) AppleWebKit/537 (KHTML, like Gecko) Chrome/49 Safari/537'
           }}, function (err, res) {
    takesTSV(null, res.body)
  })
}

module.exports = extract
