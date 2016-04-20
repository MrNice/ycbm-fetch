# YCBM Fetch
Extract tab separated values from your You Can Book Me (YCBM) calendar data.
## Install ycbm-ez-pull instead!
If your goal is to extract data quickly from You Can Book Me, consider npm installing `ycbm-ez-pull` instead of writing your own solution with this low-level module. Ez-pull does a good job of getting all of your data into one TSV file, for a single calendar, though it does allow duplicates.
## What it is
This is a `node` module you can include in your node.js project with the following `npm` command:

```bash
$ npm install --save ycbm-fetch
$ echo "Or"
$ npm i --save ycbm-fetch
```
## How to use it
### Lightning Fast Tutorial
#### Create a new folder and npm init
```bash
$ mkdir tmp
$ cd tmp
$ npm init
```
#### Mash the enter / return key
You'll watch configuration options scroll by, pay them no mind
#### Install this common.js style node module
```bash
$ npm install ycbm-fetch
```
#### Create a script file and open it in your editor
```bash
$ touch index.js
$ atom index.js
```

Atom is just what I personally use. If you know about emacs or vim or textedit or notepad, those work too.

Enter the following into the script file:
```js
// Grab node core library dependencies
let fs = require('fs')
// Grab dependencies located in the nearby node_modules
let extract = require('ycbm-fetch')

// You will have to replace these in the next few steps
var testCalendar = ''
var testCookie = ''

extract(testCookie, testCalendar, new Date('2016-4-1'), new Date('2016-4-20'), function(err, tsv) {
  // If the preceding information is correct, you should have some number of booking values
  // Stored as Tab Separated Values (TSV), which means:
  // Mac OSX & Linux: '\t' regex tab character separates columns
  //                  '\n' regex newline character separates rows

  // Dump this data as a file in the current directory, synchronously
  fs.writeFileSync('my-calendar-from-2016-4-1-to-2016-4-20.tsv', tsv)
})
```

<b>Warning: this will make a file on your computer. Be suspicious!</b>
##### Here's the sha1 hash for the above copied into a file
SHA1(index.js)= 19bcfdd07c8e942ef11674ba79350ed84beb5a42
##### If you added an extra semicolon, you might have this hash:
SHA1(test.js)= fe107e645f3afebffef97ffa2d7f81568a8a5602
#### Collect your authentication data with Chrome
Here's the fun part.
We need two string values in order to proceed: the authentication cookie and the calendar string.
You can get both with Google Chrome.
You will need to log into your YCBM account normally, as this is not a cracking tool.

// TODO: Fill out the rest of this readme from the following thought-notions
- Open Chrome Dev tools
- Move to the network tab
- Navigate to the table view with the export button
- click the export button
- wait for the export to complete and the file to start downloading
- look at the cookies which were set in the request
- also look at the request's "query string", which contains the calendar identifiers

##### Optionally Update the Date Ranges
If you have a newer calendar, you might also have to change the start and end dates of extraction.
The strings I pass into date are of the format 'YYYY-MM-DD', where everything is one-indexed except the month, which is zero-indexed like C / Algol / JavaScript arrays.
YCBM's months are one-indexed, which this module accounts for :3

### API
Here's extract's function signature:
```js
function extract(cookie, calendar, start, end, takesTSV) => takesTSV(err, tsv_string)
```
#### Caveats
We don't have control over YCBM's response, so this may stop working at any time, especially since it's currently under the 'classic' subdomain.

Also, it relies on them being on AWS and using their current Java servlets.
If they switch away, this tool will break.
#### Inputs
- cookie: string based key-value structure
  - AWSELB: 170 character string, collected with chrome in tutorial
  - JSESSIONID: 32 character string, collected with chrome in tutorial
- calendar: 20 character string, collected with chrome in tutorial
- start: JS date object with the month zero indexed
- end: similar to start
- takesTSV: callback function, described in the outputs

#### Outputs
executes a callback function passed in as input, with an error if anything went wrong, and a string of tsv otherwise
- err: Probably a network error if my code works right
- tsv_string: Tab Separated Value string, like CSV but with tabs. '\t' and '\n' act as column and row separators, respectively.

## Why this exists
Statistical analysis is a wonderful tool that can analyze data stored within a service like You Can Book Me and deliver insights into the functioning of a company's processes.
In order to analyze the data stored within You Can Book Me, you must first extract it.
It is possible to use their web interface to manually extract this data, but that's a pain and has inherent limitations.

Instead, use EZ-PULL, which was mentioned in the first bit of this readme.
That's the fastest way to claim all of your company's YCBM data that I know of.
Otherwise, you can implement your own algorithms to selectively pull and name tsv strings.
Ez pull is a leaky abstraction over downloading all of your YCBM data.
<b>Note: the final file may have duplicated rows because of how the date ranges are selected.</b>

The author used python and pandas to clean his with `Pandas.DataFrame.drop_duplicates()`.
The following script can do the same.

```py
import pandas as pd
from pandas import Series, DataFrame

dirty = pd.read_csv('my-calendar-from-2016-4-1-to-2016-4-20.tsv', sep='\t')
clean = dirty.drop_duplicates()
clean.to_csv(path_or_buf='clean-calendar.csv')
```
