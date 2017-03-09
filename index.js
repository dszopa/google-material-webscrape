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
        let fileString = '';

        savedData.map(item => {
            if (item.color_name && !fileString.includes('.g-' + item.color_name.replace(' ', '_').toLowerCase() + '-' + item.shade + '-text {\n')) {
                let cssString = '.g-' + item.color_name.replace(' ', '_').toLowerCase() + '-' + item.shade + '-text {\n' +
                                '\t' + 'color: ' + item.hex_color + ';\n' +
                                '}\n' +
                                '\n' +
                                '.g-' + item.color_name.replace(' ', '_').toLowerCase() + "-" + item.shade + "-bg {\n" +
                                '\t' + 'background-color: ' + item.hex_color + ';\n' +
                                '}\n\n';

                fileString += cssString;
            }
        })

        fs.writeFile('google-material-colors.css', fileString, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('google-material-colors.css successfully created.');
            }
        });
    });