(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
	'use strict';

	var table = [],
		poly = 0xEDB88320; // reverse polynomial

	// build the table
	function makeTable() {
		var c, n, k;

		for (n = 0; n < 256; n += 1) {
			c = n;
			for (k = 0; k < 8; k += 1) {
				if (c & 1) {
					c = poly ^ (c >>> 1);
				} else {
					c = c >>> 1;
				}
			}
			table[n] = c >>> 0;
		}
	}

	function strToArr(str) {
		// sweet hack to turn string into a 'byte' array
		return Array.prototype.map.call(str, function (c) {
			return c.charCodeAt(0);
		});
	}

	/*
	 * Compute CRC of array directly.
	 *
	 * This is slower for repeated calls, so append mode is not supported.
	 */
	function crcDirect(arr) {
		var crc = -1, // initial contents of LFBSR
			i, j, l, temp;

		for (i = 0, l = arr.length; i < l; i += 1) {
			temp = (crc ^ arr[i]) & 0xff;

			// read 8 bits one at a time
			for (j = 0; j < 8; j += 1) {
				if ((temp & 1) === 1) {
					temp = (temp >>> 1) ^ poly;
				} else {
					temp = (temp >>> 1);
				}
			}
			crc = (crc >>> 8) ^ temp;
		}

		// flip bits
		return crc ^ -1;
	}

	/*
	 * Compute CRC with the help of a pre-calculated table.
	 *
	 * This supports append mode, if the second parameter is set.
	 */
	function crcTable(arr, append) {
		var crc, i, l;

		// if we're in append mode, don't reset crc
		// if arr is null or undefined, reset table and return
		if (typeof crcTable.crc === 'undefined' || !append || !arr) {
			crcTable.crc = 0 ^ -1;

			if (!arr) {
				return;
			}
		}

		// store in temp variable for minor speed gain
		crc = crcTable.crc;

		for (i = 0, l = arr.length; i < l; i += 1) {
			crc = (crc >>> 8) ^ table[(crc ^ arr[i]) & 0xff];
		}

		crcTable.crc = crc;

		return crc ^ -1;
	}

	// build the table
	// this isn't that costly, and most uses will be for table assisted mode
	makeTable();

	module.exports = function (val, direct) {
		var val = (typeof val === 'string') ? strToArr(val) : val,
			ret = direct ? crcDirect(val) : crcTable(val);

		// convert to 2's complement hex
		return (ret >>> 0).toString(16);
	};
	module.exports.direct = crcDirect;
	module.exports.table = crcTable;
}());

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
module.exports = require('./lib/speakingurl');

},{"./lib/speakingurl":4}],4:[function(require,module,exports){
(function (root) {
    'use strict';

    /**
     * charMap
     * @type {Object}
     */
    var charMap = {

        // latin
        '??': 'A',
        '??': 'A',
        '??': 'A',
        '??': 'A',
        '??': 'Ae',
        '??': 'A',
        '??': 'AE',
        '??': 'C',
        '??': 'E',
        '??': 'E',
        '??': 'E',
        '??': 'E',
        '??': 'I',
        '??': 'I',
        '??': 'I',
        '??': 'I',
        '??': 'D',
        '??': 'N',
        '??': 'O',
        '??': 'O',
        '??': 'O',
        '??': 'O',
        '??': 'Oe',
        '??': 'O',
        '??': 'O',
        '??': 'U',
        '??': 'U',
        '??': 'U',
        '??': 'Ue',
        '??': 'U',
        '??': 'Y',
        '??': 'TH',
        '??': 'ss',
        '??': 'a',
        '??': 'a',
        '??': 'a',
        '??': 'a',
        '??': 'ae',
        '??': 'a',
        '??': 'ae',
        '??': 'c',
        '??': 'e',
        '??': 'e',
        '??': 'e',
        '??': 'e',
        '??': 'i',
        '??': 'i',
        '??': 'i',
        '??': 'i',
        '??': 'd',
        '??': 'n',
        '??': 'o',
        '??': 'o',
        '??': 'o',
        '??': 'o',
        '??': 'oe',
        '??': 'o',
        '??': 'o',
        '??': 'u',
        '??': 'u',
        '??': 'u',
        '??': 'ue',
        '??': 'u',
        '??': 'y',
        '??': 'th',
        '??': 'y',
        '???': 'SS',

        // language specific

        // Arabic
        '??': 'a',
        '??': 'a',
        '??': 'i',
        '??': 'aa',
        '??': 'u',
        '??': 'e',
        '??': 'a',
        '??': 'b',
        '??': 't',
        '??': 'th',
        '??': 'j',
        '??': 'h',
        '??': 'kh',
        '??': 'd',
        '??': 'th',
        '??': 'r',
        '??': 'z',
        '??': 's',
        '??': 'sh',
        '??': 's',
        '??': 'dh',
        '??': 't',
        '??': 'z',
        '??': 'a',
        '??': 'gh',
        '??': 'f',
        '??': 'q',
        '??': 'k',
        '??': 'l',
        '??': 'm',
        '??': 'n',
        '??': 'h',
        '??': 'w',
        '??': 'y',
        '??': 'a',
        '??': 'h',
        '???': 'la',
        '???': 'laa',
        '???': 'lai',
        '???': 'laa',

        // Persian additional characters than Arabic
        '??': 'g',
        '??': 'ch',
        '??': 'p',
        '??': 'zh',
        '??': 'k',
        '??': 'y',

        // Arabic diactrics
        '??': 'a',
        '??': 'an',
        '??': 'e',
        '??': 'en',
        '??': 'u',
        '??': 'on',
        '??': '',

        // Arabic numbers
        '??': '0',
        '??': '1',
        '??': '2',
        '??': '3',
        '??': '4',
        '??': '5',
        '??': '6',
        '??': '7',
        '??': '8',
        '??': '9',

        // Persian numbers
        '??': '0',
        '??': '1',
        '??': '2',
        '??': '3',
        '??': '4',
        '??': '5',
        '??': '6',
        '??': '7',
        '??': '8',
        '??': '9',

        // Burmese consonants
        '???': 'k',
        '???': 'kh',
        '???': 'g',
        '???': 'ga',
        '???': 'ng',
        '???': 's',
        '???': 'sa',
        '???': 'z',
        '??????': 'za',
        '???': 'ny',
        '???': 't',
        '???': 'ta',
        '???': 'd',
        '???': 'da',
        '???': 'na',
        '???': 't',
        '???': 'ta',
        '???': 'd',
        '???': 'da',
        '???': 'n',
        '???': 'p',
        '???': 'pa',
        '???': 'b',
        '???': 'ba',
        '???': 'm',
        '???': 'y',
        '???': 'ya',
        '???': 'l',
        '???': 'w',
        '???': 'th',
        '???': 'h',
        '???': 'la',
        '???': 'a',
        // consonant character combos
        '???': 'y',
        '???': 'ya',
        '???': 'w',
        '??????': 'yw',
        '??????': 'ywa',
        '???': 'h',
        // independent vowels
        '???': 'e',
        '???': '-e',
        '???': 'i',
        '???': '-i',
        '???': 'u',
        '???': '-u',
        '???': 'aw',
        '????????????': 'aw',
        '???': 'aw',
        // numbers
        '???': '0',
        '???': '1',
        '???': '2',
        '???': '3',
        '???': '4',
        '???': '5',
        '???': '6',
        '???': '7',
        '???': '8',
        '???': '9',
        // virama and tone marks which are silent in transliteration
        '???': '',
        '???': '',
        '???': '',

        // Czech
        '??': 'c',
        '??': 'd',
        '??': 'e',
        '??': 'n',
        '??': 'r',
        '??': 's',
        '??': 't',
        '??': 'u',
        '??': 'z',
        '??': 'C',
        '??': 'D',
        '??': 'E',
        '??': 'N',
        '??': 'R',
        '??': 'S',
        '??': 'T',
        '??': 'U',
        '??': 'Z',

        // Dhivehi
        '??': 'h',
        '??': 'sh',
        '??': 'n',
        '??': 'r',
        '??': 'b',
        '??': 'lh',
        '??': 'k',
        '??': 'a',
        '??': 'v',
        '??': 'm',
        '??': 'f',
        '??': 'dh',
        '??': 'th',
        '??': 'l',
        '??': 'g',
        '??': 'gn',
        '??': 's',
        '??': 'd',
        '??': 'z',
        '??': 't',
        '??': 'y',
        '??': 'p',
        '??': 'j',
        '??': 'ch',
        '??': 'tt',
        '??': 'hh',
        '??': 'kh',
        '??': 'th',
        '??': 'z',
        '??': 'sh',
        '??': 's',
        '??': 'd',
        '??': 't',
        '??': 'z',
        '??': 'a',
        '??': 'gh',
        '??': 'q',
        '??': 'w',
        '??': 'a',
        '??': 'aa',
        '??': 'i',
        '??': 'ee',
        '??': 'u',
        '??': 'oo',
        '??': 'e',
        '??': 'ey',
        '??': 'o',
        '??': 'oa',
        '??': '',

        // Georgian https://en.wikipedia.org/wiki/Romanization_of_Georgian
        // National system (2002)
        '???': 'a',
        '???': 'b',
        '???': 'g',
        '???': 'd',
        '???': 'e',
        '???': 'v',
        '???': 'z',
        '???': 't',
        '???': 'i',
        '???': 'k',
        '???': 'l',
        '???': 'm',
        '???': 'n',
        '???': 'o',
        '???': 'p',
        '???': 'zh',
        '???': 'r',
        '???': 's',
        '???': 't',
        '???': 'u',
        '???': 'p',
        '???': 'k',
        '???': 'gh',
        '???': 'q',
        '???': 'sh',
        '???': 'ch',
        '???': 'ts',
        '???': 'dz',
        '???': 'ts',
        '???': 'ch',
        '???': 'kh',
        '???': 'j',
        '???': 'h',

        // Greek
        '??': 'a',
        '??': 'v',
        '??': 'g',
        '??': 'd',
        '??': 'e',
        '??': 'z',
        '??': 'i',
        '??': 'th',
        '??': 'i',
        '??': 'k',
        '??': 'l',
        '??': 'm',
        '??': 'n',
        '??': 'ks',
        '??': 'o',
        '??': 'p',
        '??': 'r',
        '??': 's',
        '??': 't',
        '??': 'y',
        '??': 'f',
        '??': 'x',
        '??': 'ps',
        '??': 'o',
        '??': 'a',
        '??': 'e',
        '??': 'i',
        '??': 'o',
        '??': 'y',
        '??': 'i',
        '??': 'o',
        '??': 's',
        '??': 'i',
        '??': 'y',
        '??': 'y',
        '??': 'i',
        '??': 'A',
        '??': 'B',
        '??': 'G',
        '??': 'D',
        '??': 'E',
        '??': 'Z',
        '??': 'I',
        '??': 'TH',
        '??': 'I',
        '??': 'K',
        '??': 'L',
        '??': 'M',
        '??': 'N',
        '??': 'KS',
        '??': 'O',
        '??': 'P',
        '??': 'R',
        '??': 'S',
        '??': 'T',
        '??': 'Y',
        '??': 'F',
        '??': 'X',
        '??': 'PS',
        '??': 'O',
        '??': 'A',
        '??': 'E',
        '??': 'I',
        '??': 'O',
        '??': 'Y',
        '??': 'I',
        '??': 'O',
        '??': 'I',
        '??': 'Y',

        // Latvian
        '??': 'a',
        // '??': 'c', // duplicate
        '??': 'e',
        '??': 'g',
        '??': 'i',
        '??': 'k',
        '??': 'l',
        '??': 'n',
        // '??': 's', // duplicate
        '??': 'u',
        // '??': 'z', // duplicate
        '??': 'A',
        // '??': 'C', // duplicate
        '??': 'E',
        '??': 'G',
        '??': 'I',
        '??': 'k',
        '??': 'L',
        '??': 'N',
        // '??': 'S', // duplicate
        '??': 'U',
        // '??': 'Z', // duplicate

        // Macedonian
        '??': 'Kj',
        '??': 'kj',
        '??': 'Lj',
        '??': 'lj',
        '??': 'Nj',
        '??': 'nj',
        '????': 'Ts',
        '????': 'ts',

        // Polish
        '??': 'a',
        '??': 'c',
        '??': 'e',
        '??': 'l',
        '??': 'n',
        // '??': 'o', // duplicate
        '??': 's',
        '??': 'z',
        '??': 'z',
        '??': 'A',
        '??': 'C',
        '??': 'E',
        '??': 'L',
        '??': 'N',
        '??': 'S',
        '??': 'Z',
        '??': 'Z',

        // Ukranian
        '??': 'Ye',
        '??': 'I',
        '??': 'Yi',
        '??': 'G',
        '??': 'ye',
        '??': 'i',
        '??': 'yi',
        '??': 'g',

        // Romanian
        '??': 'a',
        '??': 'A',
        '??': 's',
        '??': 'S',
        // '??': 's', // duplicate
        // '??': 'S', // duplicate
        '??': 't',
        '??': 'T',
        '??': 't',
        '??': 'T',

        // Russian https://en.wikipedia.org/wiki/Romanization_of_Russian
        // ICAO

        '??': 'a',
        '??': 'b',
        '??': 'v',
        '??': 'g',
        '??': 'd',
        '??': 'e',
        '??': 'yo',
        '??': 'zh',
        '??': 'z',
        '??': 'i',
        '??': 'i',
        '??': 'k',
        '??': 'l',
        '??': 'm',
        '??': 'n',
        '??': 'o',
        '??': 'p',
        '??': 'r',
        '??': 's',
        '??': 't',
        '??': 'u',
        '??': 'f',
        '??': 'kh',
        '??': 'c',
        '??': 'ch',
        '??': 'sh',
        '??': 'sh',
        '??': '',
        '??': 'y',
        '??': '',
        '??': 'e',
        '??': 'yu',
        '??': 'ya',
        '??': 'A',
        '??': 'B',
        '??': 'V',
        '??': 'G',
        '??': 'D',
        '??': 'E',
        '??': 'Yo',
        '??': 'Zh',
        '??': 'Z',
        '??': 'I',
        '??': 'I',
        '??': 'K',
        '??': 'L',
        '??': 'M',
        '??': 'N',
        '??': 'O',
        '??': 'P',
        '??': 'R',
        '??': 'S',
        '??': 'T',
        '??': 'U',
        '??': 'F',
        '??': 'Kh',
        '??': 'C',
        '??': 'Ch',
        '??': 'Sh',
        '??': 'Sh',
        '??': '',
        '??': 'Y',
        '??': '',
        '??': 'E',
        '??': 'Yu',
        '??': 'Ya',

        // Serbian
        '??': 'dj',
        '??': 'j',
        // '??': 'lj',  // duplicate
        // '??': 'nj', // duplicate
        '??': 'c',
        '??': 'dz',
        '??': 'Dj',
        '??': 'j',
        // '??': 'Lj', // duplicate
        // '??': 'Nj', // duplicate
        '??': 'C',
        '??': 'Dz',

        // Slovak
        '??': 'l',
        '??': 'l',
        '??': 'r',
        '??': 'L',
        '??': 'L',
        '??': 'R',

        // Turkish
        '??': 's',
        '??': 'S',
        '??': 'i',
        '??': 'I',
        // '??': 'c', // duplicate
        // '??': 'C', // duplicate
        // '??': 'u', // duplicate, see langCharMap
        // '??': 'U', // duplicate, see langCharMap
        // '??': 'o', // duplicate, see langCharMap
        // '??': 'O', // duplicate, see langCharMap
        '??': 'g',
        '??': 'G',

        // Vietnamese
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '??': 'd',
        '??': 'D',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'e',
        '???': 'E',
        '???': 'o',
        '???': 'o',
        '???': 'o',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '??': 'o',
        '??': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'O',
        '???': 'o',
        '???': 'o',
        '???': 'i',
        '???': 'I',
        '??': 'i',
        '??': 'I',
        '???': 'i',
        '???': 'i',
        '???': 'u',
        '???': 'U',
        '???': 'u',
        '???': 'U',
        '??': 'u',
        '??': 'U',
        '??': 'u',
        '??': 'U',
        '???': 'u',
        '???': 'U',
        '???': 'u',
        '???': 'U',
        '???': 'u',
        '???': 'U',
        '???': 'u',
        '???': 'U',
        '???': 'u',
        '???': '??',
        '???': 'y',
        '???': 'y',
        '???': 'y',
        '???': 'Y',
        '???': 'y',
        '???': 'Y',
        '???': 'y',
        '???': 'Y',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        // '??': 'a', // duplicate
        // '??': 'A', // duplicate
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',
        '???': 'a',
        '???': 'A',

        // symbols
        '???': '"',
        '???': '"',
        '???': "'",
        '???': "'",
        '???': 'd',
        '??': 'f',
        '???': '(TM)',
        '??': '(C)',
        '??': 'oe',
        '??': 'OE',
        '??': '(R)',
        '???': '+',
        '???': '(SM)',
        '???': '...',
        '??': 'o',
        '??': 'o',
        '??': 'a',
        '???': '*',
        '???': ',',
        '???': '.',

        // currency
        '$': 'USD',
        '???': 'EUR',
        '???': 'BRN',
        '???': 'FRF',
        '??': 'GBP',
        '???': 'ITL',
        '???': 'NGN',
        '???': 'ESP',
        '???': 'KRW',
        '???': 'ILS',
        '???': 'VND',
        '???': 'LAK',
        '???': 'MNT',
        '???': 'GRD',
        '???': 'ARS',
        '???': 'PYG',
        '???': 'ARA',
        '???': 'UAH',
        '???': 'GHS',
        '??': 'cent',
        '??': 'CNY',
        '???': 'CNY',
        '???': 'YEN',
        '???': 'IRR',
        '???': 'EWE',
        '???': 'THB',
        '???': 'INR',
        '???': 'INR',
        '???': 'PF',
        '???': 'TRY',
        '??': 'AFN',
        '???': 'AZN',
        '????': 'BGN',
        '???': 'KHR',
        '???': 'CRC',
        '???': 'KZT',
        '??????': 'MKD',
        'z??': 'PLN',
        '???': 'RUB',
        '???': 'GEL'

    };

    /**
     * special look ahead character array
     * These characters form with consonants to become 'single'/consonant combo
     * @type [Array]
     */
    var lookAheadCharArray = [
        // burmese
        '???',

        // Dhivehi
        '??'
    ];

    /**
     * diatricMap for languages where transliteration changes entirely as more diatrics are added
     * @type {Object}
     */
    var diatricMap = {
        // Burmese
        // dependent vowels
        '???': 'a',
        '???': 'a',
        '???': 'e',
        '???': 'e',
        '???': 'i',
        '???': 'i',
        '??????': 'o',
        '???': 'u',
        '???': 'u',
        '????????????': 'aung',
        '??????': 'aw',
        '?????????': 'aw',
        '??????': 'aw',
        '?????????': 'aw',
        '???': '???', // this is special case but the character will be converted to latin in the code
        '??????': 'et',
        '????????????': 'aik',
        '????????????': 'auk',
        '??????': 'in',
        '????????????': 'aing',
        '????????????': 'aung',
        '??????': 'it',
        '??????': 'i',
        '??????': 'at',
        '?????????': 'eik',
        '?????????': 'ok',
        '?????????': 'ut',
        '?????????': 'it',
        '??????': 'd',
        '????????????': 'ok',
        '?????????': 'ait',
        '??????': 'an',
        '?????????': 'an',
        '?????????': 'ein',
        '?????????': 'on',
        '?????????': 'un',
        '??????': 'at',
        '?????????': 'eik',
        '?????????': 'ok',
        '?????????': 'ut',
        '???????????????': 'nub',
        '??????': 'an',
        '?????????': 'ein',
        '?????????': 'on',
        '?????????': 'un',
        '??????': 'e',
        '????????????': 'ol',
        '??????': 'in',
        '???': 'an',
        '??????': 'ein',
        '??????': 'on',

        // Dhivehi
        '??????': 'ah',
        '??????': 'ah'
    };

    /**
     * langCharMap language specific characters translations
     * @type   {Object}
     */
    var langCharMap = {
        'en': {}, // default language

        'az': { // Azerbaijani
            '??': 'c',
            '??': 'e',
            '??': 'g',
            '??': 'i',
            '??': 'o',
            '??': 's',
            '??': 'u',
            '??': 'C',
            '??': 'E',
            '??': 'G',
            '??': 'I',
            '??': 'O',
            '??': 'S',
            '??': 'U'
        },

        'cs': { // Czech
            '??': 'c',
            '??': 'd',
            '??': 'e',
            '??': 'n',
            '??': 'r',
            '??': 's',
            '??': 't',
            '??': 'u',
            '??': 'z',
            '??': 'C',
            '??': 'D',
            '??': 'E',
            '??': 'N',
            '??': 'R',
            '??': 'S',
            '??': 'T',
            '??': 'U',
            '??': 'Z'
        },

        'fi': { // Finnish
            // '??': 'a', duplicate see charMap/latin
            // '??': 'A', duplicate see charMap/latin
            '??': 'a', // ok
            '??': 'A', // ok
            '??': 'o', // ok
            '??': 'O' // ok
        },

        'hu': { // Hungarian
            '??': 'a', // ok
            '??': 'A', // ok
            // '??': 'a', duplicate see charMap/latin
            // '??': 'A', duplicate see charMap/latin
            '??': 'o', // ok
            '??': 'O', // ok
            // '??': 'o', duplicate see charMap/latin
            // '??': 'O', duplicate see charMap/latin
            '??': 'u',
            '??': 'U',
            '??': 'u',
            '??': 'U'
        },

        'lt': { // Lithuanian
            '??': 'a',
            '??': 'c',
            '??': 'e',
            '??': 'e',
            '??': 'i',
            '??': 's',
            '??': 'u',
            '??': 'u',
            '??': 'z',
            '??': 'A',
            '??': 'C',
            '??': 'E',
            '??': 'E',
            '??': 'I',
            '??': 'S',
            '??': 'U',
            '??': 'U'
        },

        'lv': { // Latvian
            '??': 'a',
            '??': 'c',
            '??': 'e',
            '??': 'g',
            '??': 'i',
            '??': 'k',
            '??': 'l',
            '??': 'n',
            '??': 's',
            '??': 'u',
            '??': 'z',
            '??': 'A',
            '??': 'C',
            '??': 'E',
            '??': 'G',
            '??': 'i',
            '??': 'k',
            '??': 'L',
            '??': 'N',
            '??': 'S',
            '??': 'u',
            '??': 'Z'
        },

        'pl': { // Polish
            '??': 'a',
            '??': 'c',
            '??': 'e',
            '??': 'l',
            '??': 'n',
            '??': 'o',
            '??': 's',
            '??': 'z',
            '??': 'z',
            '??': 'A',
            '??': 'C',
            '??': 'e',
            '??': 'L',
            '??': 'N',
            '??': 'O',
            '??': 'S',
            '??': 'Z',
            '??': 'Z'
        },

        'sk': { // Slovak
            '??': 'a',
            '??': 'A'
        },

        'sr': { // Serbian
            '??': 'lj',
            '??': 'nj',
            '??': 'Lj',
            '??': 'Nj',
            '??': 'dj',
            '??': 'Dj'
        },

        'tr': { // Turkish
            '??': 'U',
            '??': 'O',
            '??': 'u',
            '??': 'o'
        }
    };

    /**
     * symbolMap language specific symbol translations
     * translations must be transliterated already
     * @type   {Object}
     */
    var symbolMap = {
        'ar': {
            '???': 'delta',
            '???': 'la-nihaya',
            '???': 'hob',
            '&': 'wa',
            '|': 'aw',
            '<': 'aqal-men',
            '>': 'akbar-men',
            '???': 'majmou',
            '??': 'omla'
        },

        'az': {},

        'ca': {
            '???': 'delta',
            '???': 'infinit',
            '???': 'amor',
            '&': 'i',
            '|': 'o',
            '<': 'menys que',
            '>': 'mes que',
            '???': 'suma dels',
            '??': 'moneda'
        },

        'cs': {
            '???': 'delta',
            '???': 'nekonecno',
            '???': 'laska',
            '&': 'a',
            '|': 'nebo',
            '<': 'mensi nez',
            '>': 'vetsi nez',
            '???': 'soucet',
            '??': 'mena'
        },

        'de': {
            '???': 'delta',
            '???': 'unendlich',
            '???': 'Liebe',
            '&': 'und',
            '|': 'oder',
            '<': 'kleiner als',
            '>': 'groesser als',
            '???': 'Summe von',
            '??': 'Waehrung'
        },

        'dv': {
            '???': 'delta',
            '???': 'kolunulaa',
            '???': 'loabi',
            '&': 'aai',
            '|': 'noonee',
            '<': 'ah vure kuda',
            '>': 'ah vure bodu',
            '???': 'jumula',
            '??': 'faisaa'
        },

        'en': {
            '???': 'delta',
            '???': 'infinity',
            '???': 'love',
            '&': 'and',
            '|': 'or',
            '<': 'less than',
            '>': 'greater than',
            '???': 'sum',
            '??': 'currency'
        },

        'es': {
            '???': 'delta',
            '???': 'infinito',
            '???': 'amor',
            '&': 'y',
            '|': 'u',
            '<': 'menos que',
            '>': 'mas que',
            '???': 'suma de los',
            '??': 'moneda'
        },

        'fa': {
            '???': 'delta',
            '???': 'bi-nahayat',
            '???': 'eshgh',
            '&': 'va',
            '|': 'ya',
            '<': 'kamtar-az',
            '>': 'bishtar-az',
            '???': 'majmooe',
            '??': 'vahed'
        },

        'fi': {
            '???': 'delta',
            '???': 'aarettomyys',
            '???': 'rakkaus',
            '&': 'ja',
            '|': 'tai',
            '<': 'pienempi kuin',
            '>': 'suurempi kuin',
            '???': 'summa',
            '??': 'valuutta'
        },

        'fr': {
            '???': 'delta',
            '???': 'infiniment',
            '???': 'Amour',
            '&': 'et',
            '|': 'ou',
            '<': 'moins que',
            '>': 'superieure a',
            '???': 'somme des',
            '??': 'monnaie'
        },

        'ge': {
            '???': 'delta',
            '???': 'usasruloba',
            '???': 'siqvaruli',
            '&': 'da',
            '|': 'an',
            '<': 'naklebi',
            '>': 'meti',
            '???': 'jami',
            '??': 'valuta'
        },

        'gr': {},

        'hu': {
            '???': 'delta',
            '???': 'vegtelen',
            '???': 'szerelem',
            '&': 'es',
            '|': 'vagy',
            '<': 'kisebb mint',
            '>': 'nagyobb mint',
            '???': 'szumma',
            '??': 'penznem'
        },

        'it': {
            '???': 'delta',
            '???': 'infinito',
            '???': 'amore',
            '&': 'e',
            '|': 'o',
            '<': 'minore di',
            '>': 'maggiore di',
            '???': 'somma',
            '??': 'moneta'
        },

        'lt': {
            '???': 'delta',
            '???': 'begalybe',
            '???': 'meile',
            '&': 'ir',
            '|': 'ar',
            '<': 'maziau nei',
            '>': 'daugiau nei',
            '???': 'suma',
            '??': 'valiuta'
        },

        'lv': {
            '???': 'delta',
            '???': 'bezgaliba',
            '???': 'milestiba',
            '&': 'un',
            '|': 'vai',
            '<': 'mazak neka',
            '>': 'lielaks neka',
            '???': 'summa',
            '??': 'valuta'
        },

        'my': {
            '???': 'kwahkhyaet',
            '???': 'asaonasme',
            '???': 'akhyait',
            '&': 'nhin',
            '|': 'tho',
            '<': 'ngethaw',
            '>': 'kyithaw',
            '???': 'paungld',
            '??': 'ngwekye'
        },

        'mk': {},

        'nl': {
            '???': 'delta',
            '???': 'oneindig',
            '???': 'liefde',
            '&': 'en',
            '|': 'of',
            '<': 'kleiner dan',
            '>': 'groter dan',
            '???': 'som',
            '??': 'valuta'
        },

        'pl': {
            '???': 'delta',
            '???': 'nieskonczonosc',
            '???': 'milosc',
            '&': 'i',
            '|': 'lub',
            '<': 'mniejsze niz',
            '>': 'wieksze niz',
            '???': 'suma',
            '??': 'waluta'
        },

        'pt': {
            '???': 'delta',
            '???': 'infinito',
            '???': 'amor',
            '&': 'e',
            '|': 'ou',
            '<': 'menor que',
            '>': 'maior que',
            '???': 'soma',
            '??': 'moeda'
        },

        'ro': {
            '???': 'delta',
            '???': 'infinit',
            '???': 'dragoste',
            '&': 'si',
            '|': 'sau',
            '<': 'mai mic ca',
            '>': 'mai mare ca',
            '???': 'suma',
            '??': 'valuta'
        },

        'ru': {
            '???': 'delta',
            '???': 'beskonechno',
            '???': 'lubov',
            '&': 'i',
            '|': 'ili',
            '<': 'menshe',
            '>': 'bolshe',
            '???': 'summa',
            '??': 'valjuta'
        },

        'sk': {
            '???': 'delta',
            '???': 'nekonecno',
            '???': 'laska',
            '&': 'a',
            '|': 'alebo',
            '<': 'menej ako',
            '>': 'viac ako',
            '???': 'sucet',
            '??': 'mena'
        },

        'sr': {},

        'tr': {
            '???': 'delta',
            '???': 'sonsuzluk',
            '???': 'ask',
            '&': 've',
            '|': 'veya',
            '<': 'kucuktur',
            '>': 'buyuktur',
            '???': 'toplam',
            '??': 'para birimi'
        },

        'uk': {
            '???': 'delta',
            '???': 'bezkinechnist',
            '???': 'lubov',
            '&': 'i',
            '|': 'abo',
            '<': 'menshe',
            '>': 'bilshe',
            '???': 'suma',
            '??': 'valjuta'
        },

        'vn': {
            '???': 'delta',
            '???': 'vo cuc',
            '???': 'yeu',
            '&': 'va',
            '|': 'hoac',
            '<': 'nho hon',
            '>': 'lon hon',
            '???': 'tong',
            '??': 'tien te'
        }
    };

    var uricChars = [';', '?', ':', '@', '&', '=', '+', '$', ',', '/'].join('');

    var uricNoSlashChars = [';', '?', ':', '@', '&', '=', '+', '$', ','].join('');

    var markChars = ['.', '!', '~', '*', "'", '(', ')'].join('');

    /**
     * getSlug
     * @param  {string} input input string
     * @param  {object|string} opts config object or separator string/char
     * @api    public
     * @return {string}  sluggified string
     */
    var getSlug = function getSlug(input, opts) {
        var separator = '-';
        var result = '';
        var diatricString = '';
        var convertSymbols = true;
        var customReplacements = {};
        var maintainCase;
        var titleCase;
        var truncate;
        var uricFlag;
        var uricNoSlashFlag;
        var markFlag;
        var symbol;
        var langChar;
        var lucky;
        var i;
        var ch;
        var l;
        var lastCharWasSymbol;
        var lastCharWasDiatric;
        var allowedChars = '';

        if (typeof input !== 'string') {
            return '';
        }

        if (typeof opts === 'string') {
            separator = opts;
        }

        symbol = symbolMap.en;
        langChar = langCharMap.en;

        if (typeof opts === 'object') {
            maintainCase = opts.maintainCase || false;
            customReplacements = (opts.custom && typeof opts.custom === 'object') ? opts.custom : customReplacements;
            truncate = (+opts.truncate > 1 && opts.truncate) || false;
            uricFlag = opts.uric || false;
            uricNoSlashFlag = opts.uricNoSlash || false;
            markFlag = opts.mark || false;
            convertSymbols = (opts.symbols === false || opts.lang === false) ? false : true;
            separator = opts.separator || separator;

            if (uricFlag) {
                allowedChars += uricChars;
            }

            if (uricNoSlashFlag) {
                allowedChars += uricNoSlashChars;
            }

            if (markFlag) {
                allowedChars += markChars;
            }

            symbol = (opts.lang && symbolMap[opts.lang] && convertSymbols) ?
                symbolMap[opts.lang] : (convertSymbols ? symbolMap.en : {});

            langChar = (opts.lang && langCharMap[opts.lang]) ?
                langCharMap[opts.lang] :
                opts.lang === false || opts.lang === true ? {} : langCharMap.en;

            // if titleCase config is an Array, rewrite to object format
            if (opts.titleCase && typeof opts.titleCase.length === 'number' && Array.prototype.toString.call(opts.titleCase)) {
                opts.titleCase.forEach(function (v) {
                    customReplacements[v + ''] = v + '';
                });

                titleCase = true;
            } else {
                titleCase = !!opts.titleCase;
            }

            // if custom config is an Array, rewrite to object format
            if (opts.custom && typeof opts.custom.length === 'number' && Array.prototype.toString.call(opts.custom)) {
                opts.custom.forEach(function (v) {
                    customReplacements[v + ''] = v + '';
                });
            }

            // custom replacements
            Object.keys(customReplacements).forEach(function (v) {
                var r;

                if (v.length > 1) {
                    r = new RegExp('\\b' + escapeChars(v) + '\\b', 'gi');
                } else {
                    r = new RegExp(escapeChars(v), 'gi');
                }

                input = input.replace(r, customReplacements[v]);
            });

            // add all custom replacement to allowed charlist
            for (ch in customReplacements) {
                allowedChars += ch;
            }
        }

        allowedChars += separator;

        // escape all necessary chars
        allowedChars = escapeChars(allowedChars);

        // trim whitespaces
        input = input.replace(/(^\s+|\s+$)/g, '');

        lastCharWasSymbol = false;
        lastCharWasDiatric = false;

        for (i = 0, l = input.length; i < l; i++) {
            ch = input[i];

            if (isReplacedCustomChar(ch, customReplacements)) {
                // don't convert a already converted char
                lastCharWasSymbol = false;
            } else if (langChar[ch]) {
                // process language specific diactrics chars conversion
                ch = lastCharWasSymbol && langChar[ch].match(/[A-Za-z0-9]/) ? ' ' + langChar[ch] : langChar[ch];

                lastCharWasSymbol = false;
            } else if (ch in charMap) {
                // the transliteration changes entirely when some special characters are added
                if (i + 1 < l && lookAheadCharArray.indexOf(input[i + 1]) >= 0) {
                    diatricString += ch;
                    ch = '';
                } else if (lastCharWasDiatric === true) {
                    ch = diatricMap[diatricString] + charMap[ch];
                    diatricString = '';
                } else {
                    // process diactrics chars
                    ch = lastCharWasSymbol && charMap[ch].match(/[A-Za-z0-9]/) ? ' ' + charMap[ch] : charMap[ch];
                }

                lastCharWasSymbol = false;
                lastCharWasDiatric = false;
            } else if (ch in diatricMap) {
                diatricString += ch;
                ch = '';
                // end of string, put the whole meaningful word
                if (i === l - 1) {
                    ch = diatricMap[diatricString];
                }
                lastCharWasDiatric = true;
            } else if (
                // process symbol chars
                symbol[ch] && !(uricFlag && uricChars
                    .indexOf(ch) !== -1) && !(uricNoSlashFlag && uricNoSlashChars
                    // .indexOf(ch) !== -1) && !(markFlag && markChars
                    .indexOf(ch) !== -1)) {
                ch = lastCharWasSymbol || result.substr(-1).match(/[A-Za-z0-9]/) ? separator + symbol[ch] : symbol[ch];
                ch += input[i + 1] !== void 0 && input[i + 1].match(/[A-Za-z0-9]/) ? separator : '';

                lastCharWasSymbol = true;
            } else {
                if (lastCharWasDiatric === true) {
                    ch = diatricMap[diatricString] + ch;
                    diatricString = '';
                    lastCharWasDiatric = false;
                } else if (lastCharWasSymbol && (/[A-Za-z0-9]/.test(ch) || result.substr(-1).match(/A-Za-z0-9]/))) {
                    // process latin chars
                    ch = ' ' + ch;
                }
                lastCharWasSymbol = false;
            }

            // add allowed chars
            result += ch.replace(new RegExp('[^\\w\\s' + allowedChars + '_-]', 'g'), separator);
        }

        if (titleCase) {
            result = result.replace(/(\w)(\S*)/g, function (_, i, r) {
                var j = i.toUpperCase() + (r !== null ? r : '');
                return (Object.keys(customReplacements).indexOf(j.toLowerCase()) < 0) ? j : j.toLowerCase();
            });
        }

        // eliminate duplicate separators
        // add separator
        // trim separators from start and end
        result = result.replace(/\s+/g, separator)
            .replace(new RegExp('\\' + separator + '+', 'g'), separator)
            .replace(new RegExp('(^\\' + separator + '+|\\' + separator + '+$)', 'g'), '');

        if (truncate && result.length > truncate) {
            lucky = result.charAt(truncate) === separator;
            result = result.slice(0, truncate);

            if (!lucky) {
                result = result.slice(0, result.lastIndexOf(separator));
            }
        }

        if (!maintainCase && !titleCase) {
            result = result.toLowerCase();
        }

        return result;
    };

    /**
     * createSlug curried(opts)(input)
     * @param   {object|string} opts config object or input string
     * @return  {Function} function getSlugWithConfig()
     **/
    var createSlug = function createSlug(opts) {

        /**
         * getSlugWithConfig
         * @param   {string} input string
         * @return  {string} slug string
         */
        return function getSlugWithConfig(input) {
            return getSlug(input, opts);
        };
    };

    /**
     * escape Chars
     * @param   {string} input string
     */
    var escapeChars = function escapeChars(input) {
        return input.replace(/[-\\^$*+?.()|[\]{}\/]/g, '\\$&');
    };

    /**
     * check if the char is an already converted char from custom list
     * @param   {char} ch character to check
     * @param   {object} customReplacements custom translation map
     */
    var isReplacedCustomChar = function (ch, customReplacements) {
        for (var c in customReplacements) {
            if (customReplacements[c] === ch) {
                return true;
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {

        // export functions for use in Node
        module.exports = getSlug;
        module.exports.createSlug = createSlug;
    } else if (typeof define !== 'undefined' && define.amd) {

        // export function for use in AMD
        define([], function () {
            return getSlug;
        });
    } else {

        // don't overwrite global if exists
        try {
            if (root.getSlug || root.createSlug) {
                throw 'speakingurl: globals exists /(getSlug|createSlug)/';
            } else {
                root.getSlug = getSlug;
                root.createSlug = createSlug;
            }
        } catch (e) {}
    }
})(this);
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _pluralize = require('./pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _i18nliner = require('./i18nliner');

var _i18nliner2 = _interopRequireDefault(_i18nliner);

var _speakingurl = require('speakingurl');

var _speakingurl2 = _interopRequireDefault(_speakingurl);

var _crc = require('crc32');

var _crc2 = _interopRequireDefault(_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CallHelpers = {
  ALLOWED_PLURALIZATION_KEYS: ["zero", "one", "few", "many", "other"],
  REQUIRED_PLURALIZATION_KEYS: ["one", "other"],
  UNSUPPORTED_EXPRESSION: [],

  normalizeKey: function normalizeKey(key) {
    return key;
  },

  normalizeDefault: function normalizeDefault(defaultValue, translateOptions) {
    defaultValue = CallHelpers.inferPluralizationHash(defaultValue, translateOptions);
    return defaultValue;
  },

  inferPluralizationHash: function inferPluralizationHash(defaultValue, translateOptions) {
    if (typeof defaultValue === 'string' && defaultValue.match(/^[\w-]+$/) && translateOptions && "count" in translateOptions) {
      return { one: "1 " + defaultValue, other: "%{count} " + (0, _pluralize2.default)(defaultValue) };
    } else {
      return defaultValue;
    }
  },

  isObject: function isObject(object) {
    return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== this.UNSUPPORTED_EXPRESSION;
  },

  validDefault: function validDefault(allowBlank) {
    var defaultValue = this.defaultValue;
    return allowBlank && (typeof defaultValue === 'undefined' || defaultValue === null) || typeof defaultValue === 'string' || this.isObject(defaultValue);
  },

  inferKey: function inferKey(defaultValue, translateOptions) {
    if (this.validDefault(defaultValue)) {
      defaultValue = this.normalizeDefault(defaultValue, translateOptions);
      if ((typeof defaultValue === 'undefined' ? 'undefined' : _typeof(defaultValue)) === 'object') defaultValue = "" + defaultValue.other;
      return this.keyify(defaultValue);
    }
  },

  keyifyUnderscored: function keyifyUnderscored(string) {
    var key = (0, _speakingurl2.default)(string, { separator: '_', lang: false }).replace(/[-_]+/g, '_');
    return key.substring(0, _i18nliner2.default.config.underscoredKeyLength);
  },

  keyifyUnderscoredCrc32: function keyifyUnderscoredCrc32(string) {
    var checksum = (0, _crc2.default)(string.length + ":" + string).toString(16);
    return this.keyifyUnderscored(string) + "_" + checksum;
  },

  keyify: function keyify(string) {
    switch (_i18nliner2.default.config.inferredKeyFormat) {
      case 'underscored':
        return this.keyifyUnderscored(string);
      case 'underscored_crc32':
        return this.keyifyUnderscoredCrc32(string);
      default:
        return string;
    }
  },

  keyPattern: /^(\w+\.)+\w+$/,

  /**
   * Possible translate signatures:
   *
   * key [, options]
   * key, default_string [, options]
   * key, default_object, options
   * default_string [, options]
   * default_object, options
   **/
  isKeyProvided: function isKeyProvided(keyOrDefault, defaultOrOptions, maybeOptions) {
    if ((typeof keyOrDefault === 'undefined' ? 'undefined' : _typeof(keyOrDefault)) === 'object') return false;
    if (typeof defaultOrOptions === 'string') return true;
    if (maybeOptions) return true;
    if (typeof keyOrDefault === 'string' && keyOrDefault.match(CallHelpers.keyPattern)) return true;
    return false;
  },

  isPluralizationHash: function isPluralizationHash(object) {
    var pKeys;
    return this.isObject(object) && (pKeys = _utils2.default.keys(object)) && pKeys.length > 0 && _utils2.default.difference(pKeys, this.ALLOWED_PLURALIZATION_KEYS).length === 0;
  },

  inferArguments: function inferArguments(args, meta) {
    if (args.length === 2 && _typeof(args[1]) === 'object' && args[1].defaultValue) return args;

    var hasKey = this.isKeyProvided.apply(this, args);
    if (meta) meta.inferredKey = !hasKey;
    if (!hasKey) args.unshift(null);

    var defaultValue = null;
    var defaultOrOptions = args[1];
    if (args[2] || typeof defaultOrOptions === 'string' || this.isPluralizationHash(defaultOrOptions)) defaultValue = args.splice(1, 1)[0];
    if (args.length === 1) args.push({});
    var options = args[1];
    if (defaultValue) options.defaultValue = defaultValue;
    if (!hasKey) args[0] = this.inferKey(defaultValue, options);
    return args;
  },

  applyWrappers: function applyWrappers(string, wrappers) {
    var i;
    var len;
    var keys;
    if (typeof wrappers === 'string') wrappers = [wrappers];
    if (wrappers instanceof Array) {
      for (i = wrappers.length; i; i--) {
        string = this.applyWrapper(string, new Array(i + 1).join("*"), wrappers[i - 1]);
      }
    } else {
      keys = _utils2.default.keys(wrappers);
      keys.sort(function (a, b) {
        return b.length - a.length;
      }); // longest first
      for (i = 0, len = keys.length; i < len; i++) {
        string = this.applyWrapper(string, keys[i], wrappers[keys[i]]);
      }
    }
    return string;
  },

  applyWrapper: function applyWrapper(string, delimiter, wrapper) {
    var escapedDelimiter = _utils2.default.regexpEscape(delimiter);
    var pattern = new RegExp(escapedDelimiter + "(.*?)" + escapedDelimiter, "g");
    return string.replace(pattern, wrapper);
  }
};

exports.default = CallHelpers;

},{"./i18nliner":8,"./pluralize":9,"./utils":10,"crc32":1,"speakingurl":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _call_helpers = require('../call_helpers');

var _call_helpers2 = _interopRequireDefault(_call_helpers);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extend = function extend(I18n) {
  var htmlEscape = _utils2.default.htmlEscape;

  I18n.interpolateWithoutHtmlSafety = I18n.interpolate;
  I18n.interpolate = function (message, options) {
    var needsEscaping = false;
    var matches = message.match(this.PLACEHOLDER) || [];
    var len = matches.length;
    var match;
    var keys = [];
    var key;
    var i;
    var wrappers = options.wrappers || options.wrapper;

    if (wrappers) {
      needsEscaping = true;
      message = htmlEscape(message);
      message = _call_helpers2.default.applyWrappers(message, wrappers);
    }

    for (i = 0; i < len; i++) {
      match = matches[i];
      key = match.replace(this.PLACEHOLDER, "$1");
      keys.push(key);
      if (!(key in options)) continue;
      if (match[1] === 'h') options[key] = new _utils2.default.HtmlSafeString(options[key]);
      if (options[key] instanceof _utils2.default.HtmlSafeString) needsEscaping = true;
    }

    if (needsEscaping) {
      if (!wrappers) message = htmlEscape(message);
      for (i = 0; i < len; i++) {
        key = keys[i];
        if (!(key in options)) continue;
        options[key] = htmlEscape(options[key]);
      }
    }
    message = this.interpolateWithoutHtmlSafety(message, options);
    return needsEscaping ? new _utils2.default.HtmlSafeString(message) : message;
  };

  // add html-safety hint, i.e. "%h{...}"
  I18n.PLACEHOLDER = /(?:\{\{|%h?\{)(.*?)(?:\}\}?)/gm;

  I18n.CallHelpers = _call_helpers2.default;
  I18n.Utils = _utils2.default;

  I18n.translateWithoutI18nliner = I18n.translate;
  I18n.translate = function () {
    var args = _call_helpers2.default.inferArguments([].slice.call(arguments));
    var key = args[0];
    var options = args[1];
    key = _call_helpers2.default.normalizeKey(key, options);
    var defaultValue = options.defaultValue;
    if (defaultValue) options.defaultValue = _call_helpers2.default.normalizeDefault(defaultValue, options);

    return this.translateWithoutI18nliner(key, options);
  };
  I18n.t = I18n.translate;
};

exports.default = extend;

},{"../call_helpers":5,"../utils":10}],7:[function(require,module,exports){
'use strict';

var _i18n_js = require('./i18n_js');

var _i18n_js2 = _interopRequireDefault(_i18n_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _i18n_js2.default)(I18n); /* global I18n */

},{"./i18n_js":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs;

var maybeLoadJSON = function maybeLoadJSON(path) {
  fs = fs || require("fs");
  var data = {};
  if (fs.existsSync(path)) {
    try {
      data = JSON.parse(fs.readFileSync(path).toString());
    } catch (e) {
      console.log(e);
    }
  }
  return data;
};

var I18nliner = {
  ignore: function ignore() {
    fs = fs || require("fs");
    var ignores = [];
    if (fs.existsSync(".i18nignore")) {
      ignores = fs.readFileSync(".i18nignore").toString().trim().split(/\r?\n|\r/);
    }
    return ignores;
  },
  set: function set(key, value, fn) {
    var prevValue = this.config[key];
    this.config[key] = value;
    if (fn) {
      try {
        fn();
      } finally {
        this.config[key] = prevValue;
      }
    }
  },
  loadConfig: function loadConfig() {
    var config = maybeLoadJSON(".i18nrc");

    for (var key in config) {
      if (key !== "plugins") {
        this.set(key, config[key]);
      }
    }

  },

  config: {
    inferredKeyFormat: 'underscored_crc32',
    /*
      literal:
        Just use the literal string as its translation key
      underscored:
        Underscored ascii representation of the string, truncated to
        <underscoredKeyLength> bytes
      underscored_crc32:
        Underscored, with a checksum at the end to avoid collisions
    */

    underscoredKeyLength: 50,

    basePath: ".",
    /*
      Where to look for files. Additionally, the output json file
      will be relative to this.
     */

    directories: []
    /*
      Further limit extraction to these directories. If empty,
      I18nliner will look everywhere under <basePath>
     */
  }
};

exports.default = I18nliner;

},{"fs":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// ported pluralizations from active_support/inflections.rb
// (except for cow -> kine, because nobody does that)
var skip = ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans'];
var patterns = [[/person$/i, 'people'], [/man$/i, 'men'], [/child$/i, 'children'], [/sex$/i, 'sexes'], [/move$/i, 'moves'], [/(quiz)$/i, '$1zes'], [/^(ox)$/i, '$1en'], [/([m|l])ouse$/i, '$1ice'], [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'], [/(x|ch|ss|sh)$/i, '$1es'], [/([^aeiouy]|qu)y$/i, '$1ies'], [/(hive)$/i, '$1s'], [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'], [/sis$/i, 'ses'], [/([ti])um$/i, '$1a'], [/(buffal|tomat)o$/i, '$1oes'], [/(bu)s$/i, '$1ses'], [/(alias|status)$/i, '$1es'], [/(octop|vir)us$/i, '$1i'], [/(ax|test)is$/i, '$1es'], [/s$/i, 's']];

var pluralize = function pluralize(string) {
  string = string || '';
  if (skip.indexOf(string) >= 0) {
    return string;
  }
  for (var i = 0, len = patterns.length; i < len; i++) {
    var pair = patterns[i];
    if (string.match(pair[0])) {
      return string.replace(pair[0], pair[1]);
    }
  }
  return string + "s";
};

pluralize.withCount = function (count, string) {
  return "" + count + " " + (count === 1 ? string : pluralize(string));
};

exports.default = pluralize;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var htmlEntities = {
  "'": "&#39;",
  "&": "&amp;",
  '"': "&quot;",
  ">": "&gt;",
  "<": "&lt;"
};

function HtmlSafeString(string) {
  this.string = typeof string === 'string' ? string : "" + string;
}
HtmlSafeString.prototype.toString = function () {
  return this.string;
};

var Utils = {
  HtmlSafeString: HtmlSafeString,

  difference: function difference(a1, a2) {
    var result = [];
    for (var i = 0, len = a1.length; i < len; i++) {
      if (a2.indexOf(a1[i]) === -1) result.push(a1[i]);
    }
    return result;
  },

  keys: function keys(object) {
    var keys = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) keys.push(key);
    }
    return keys;
  },

  htmlEscape: function htmlEscape(string) {
    if (typeof string === 'undefined' || string === null) return '';
    if (string instanceof Utils.HtmlSafeString) return string.toString();
    return String(string).replace(/[&<>"']/g, function (m) {
      return htmlEntities[m];
    });
  },

  regexpEscape: function regexpEscape(string) {
    if (typeof string === 'undefined' || string === null) return '';
    return String(string).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  },

  extend: function extend() {
    var args = [].slice.call(arguments);
    var target = args.shift();
    for (var i = 0, len = args.length; i < len; i++) {
      var source = args[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) target[key] = source[key];
      }
    }
  }
};

exports.default = Utils;

},{}]},{},[7]);
