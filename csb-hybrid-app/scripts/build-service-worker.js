const concat = require("concat");
const files = [
    "public/apps/csb/scripts/webshims.js",
    "public/apps/csb/scripts/pskruntime.js",
    "public/apps/csb/scripts/pskruntime.js",
    "public/apps/csb/scripts/psknode.js",
    "public/apps/csb/scripts/pskclient.js",
    "public/globalServiceWorker.js",
    "public/apps/csb/APIs/csb/create.js",
    "public/apps/csb/APIs/csb/getCSBs.js",
    "public/apps/csb/APIs/csb/saveFile.js",
    "public/apps/csb/APIs/csb/pin.js"
];

concat(files,"public/privateSky-worker.js");
