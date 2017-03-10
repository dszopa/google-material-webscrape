const osmosis = require('osmosis');
const fs = require('fs');

let savedData = [];

osmosis
    .get('https://material.io/guidelines/style/color.html#color-color-palette')
    .find('.color-group ul')
    .set({
        'color_name': 'span.name'
    })
    .select('.color')
    .set({
        'shade': '.shade',
        'hex_color': '.hex'
    })
    .data(function (data) {
        savedData.push(data);
    })
    .done(function () {
        let cssStrings = [];

        savedData.map(item => {
            if (item.color_name) {
                cssStrings.push(createCssString(item));
            }
        });

        cssStrings = trimGoogleColorsArray(cssStrings);

        fs.writeFile('google-material-colors.css', arrayToConcatenatedString(cssStrings), function (err) {
            if (err) console.log(err);
            else console.log('google-material-colors.css successfully created.');
        });
    });

/**
 * This function creates a "color" and "background" css class string
 * from a json object with properties color_name, shade, and hex_color.
 * @param {object} cssItem - a json string
 */
function createCssString(cssItem) {
    return '.g-' + cssItem.color_name.replace(' ', '_').toLowerCase() + '-' + cssItem.shade + '-text {\n' +
        '\t' + 'color: ' + cssItem.hex_color + ';\n' +
        '}\n' +
        '\n' +
        '.g-' + cssItem.color_name.replace(' ', '_').toLowerCase() + "-" + cssItem.shade + "-bg {\n" +
        '\t' + 'background-color: ' + cssItem.hex_color + ';\n' +
        '}\n\n'
}

/**
 * This function is hardcoded to remove the extra 500 level colors from
 * the css array returned from webscraping the page.
 * @param {Array} cssStrings 
 */
function trimGoogleColorsArray(cssStrings) {
    let newArray = [];
    for (let i = 0; i < cssStrings.length; i++) {
        if (i < 240) {
            if ((i % 15) === 0) {
                // don't add to array
            } else {
                newArray.push(cssStrings[i]);
            }
        } else {
            if (((i - 240) % 11) === 0) {
                // don't add to array
            } else {
                newArray.push(cssStrings[i]);
            }
        }
    }

    return newArray;
}

/**
 * This function takes in an Array and concatenate it's elements
 * into a single string.
 * @param {Array} cssArray 
 */
function arrayToConcatenatedString(cssArray) {
    let fileString = '';
    for (let i = 0; i < cssArray.length; i++) {
        fileString += cssArray[i];
    }
    return fileString;
}