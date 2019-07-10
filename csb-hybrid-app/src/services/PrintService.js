export function seedToPrint(seed) {
    var html: doc = '<!DOCTYPE html>';

    html += '<html lang="en">';

    html += '<head>';
    html += '<meta charset="utf-8">';
    html += '<title>Your SEED</title>';
    html += '</head>';

    html += '<body style="background-color: white;">';
    html += '<div>';
    html += '<h1>';
    html += '<p>This is your SEED: </p></br>';
    html += '</h1>';
    html += '</div>';
    html += seed;
    html += '</div>';
    html += '</body>';
    html += '</html>';

    var newWin = window.open();
    newWin.document.write(html);
    newWin.window.print();
    newWin.document.close();
}
