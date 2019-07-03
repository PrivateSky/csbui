function loadHtmlApp(appPath, assetAliasPath, placeholder) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/extract', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "text/html");

    xhr.onload = function () {

        if (xhr.readyState === 4 && xhr.status == "200") {

            placeholder.contentWindow.document.write (xhr.responseText);

        }
    };

    xhr.send(JSON.stringify({appPath: appPath, assetAliasPath:assetAliasPath}));
}