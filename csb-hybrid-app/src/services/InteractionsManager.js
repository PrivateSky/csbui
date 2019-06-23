import PinManager from './PinManager';
const axios = require("axios");

let interactions = {};
let readPin = function (noTries) {
    //this.swarm("validatePin", "123456", noTries); return;
    if (noTries === 3) {
        PinManager.showModalPin(null, (pin) => {
            this.swarm("validatePin", pin, noTries);
        })
    }
    else {
        PinManager.invalidatePin();
        if (noTries !== 0) {
            PinManager.showModalPin("Invalid PIN. Please try again", (pin) => {
                this.swarm("validatePin", pin, noTries);
            })
        } else {
            PinManager.blockAccess("You entered a wrong pin for 3 times. Please try again in 1 minute.")
        }
    }
};

class InteractionService {

    constructor(webView, name) {
        this.interact = null;
        this.callbacks = {};
        this.newInstance(webView, name);
    }

    newInstance(webView, name) {
        let self = this;

        function receiveMessage(message) {

            if (message.data && message.data.webViewIsReady === true) {
                var interactProvider = window.reactClientRequire('interact');

                //WebView from web
                if (webView && typeof document !== "undefined") {
                    interactProvider.enableReactInteractions();
                    self.interact = interactProvider.createWindowInteractionSpace("iframe", webView.frameRef.contentWindow);
                    window.removeEventListener("message", receiveMessage, false);
                }
                else
                //WebView from mobile
                if (webView) {
                    interactProvider.enableWebViewInteractions();
                    self.interact = interactProvider.createWindowInteractionSpace("iframe", webView, webView);
                }
                else if (typeof document !== "undefined") {
                    interactProvider.enableReactInteractions();
                    let iframe = document.getElementsByTagName("iframe")[0].contentWindow;
                    self.interact = interactProvider.createWindowInteractionSpace("iframe", iframe);
                }
                self.dispatchCallbacks();
            }
        }


        if (typeof window.addEventListener !== "undefined") {
            window.addEventListener("message", receiveMessage, false);
        }
        else {
            if (webView) {
                receiveMessage({
                    data: {
                        webViewIsReady: true
                    }
                })
            }
        }

        interactions[name ? name : "global"] = self;
    }

    createCSB(csbName, backupUrl, callback) {

        if (typeof backupUrl === "function") {
            callback = backupUrl;
            backupUrl = null;
        }

        axios.post('/csb', {
            csbName: csbName,
            backupUrl: backupUrl
        })
            .then(function (response) {
                console.log(response);
                    callback(response.data.err, response.data.isMaster, response.data.seed);
            })
            .catch(function (error) {
                console.log(error);
                callback(error);

            });
    }

    changeDefaultPin(pin, callback) {

            axios.post('/changePin', {
                pin: pin,
            })
            .then(function (response) {
                console.log(response);
                callback(response.data.err);
            })
            .catch(function (error) {
                console.log(error);
                callback(error);
            });

    }

    resetPin(seed, newPin, callback) {

        axios.post('/resetPin', {
            seed: seed,
            newPin:newPin
        })
            .then(function (response) {
                console.log(response);
                callback(response.data.err);
            })
            .catch(function (error) {
                console.log(error);
                callback(error);
            });
    }

    doBackup(callback) {

        this.interact.startSwarm("pskwallet.saveBackup", "start", "/").on({
            readPin: readPin,
            handleError: function (err) {
                console.log(err);
            },
            csbBackupReport: function ({errors, successes}) {
                if (errors.length === 0 && successes.length === 0) {
                    console.log('All CSBs are already backed up');
                }

                errors.forEach(({alias, backupURL}) => {
                    console.log(`Error while saving file ${alias} on ${backupURL}`);
                });

                successes.forEach(({alias, backupURL}) => {
                    console.log(`Successfully backed up file ${alias} on ${backupURL}`);
                });

                callback();
            }
        });
    }


    getCsbNames(csbPath, callback) {

        axios.get('/list/csb', {
            params:{
                csbPath: csbPath?csbPath:""
            }
        })
            .then(function (response) {
                console.log(response);
                callback(null, response.data.csbList);
            })
            .catch(function (error) {
                console.log(error);
                callback(error);
            });
    }

    restoreCSB(path, seed, callback) {
        this.interact.startSwarm("pskwallet.restore", "start", path).on({
            readSeed: function () {
                this.swarm("restoreCSB", seed)
            },
            printInfo: function (info) {
                console.log(info);
                callback();
            },
            handleError: function (err) {
                if (err) {
                    callback(err);
                }
                console.log(err);
            },
            readPin: readPin
        });
    }


    saveCsbManifest(csbName, manifest, callback) {

        axios.post('/manifest', {
            csbName: csbName,
            manifest: manifest
        })
            .then(function (response) {
                console.log(response);
                callback(null, response.data);
            })
            .catch(function (error) {
                console.log(error);
                callback(error);
            });

    }

    addFilesToCSB(csbPath, csbAlias, progressCallback, callback) {
        this.interact.startSwarm('addFilesToCsb', "start", csbPath + "/" + csbAlias).on({
            onComplete: function (info) {
                callback(info);
            },
            readPin: readPin,
            onProgress: function (progress) {
                progressCallback(progress);
            }
        })
    }

    notifyWhenFilesWereSelected(callback) {
        if (this.interact) {
            this.interact.startSwarm("notifyWhenFilesWereLocallyPersisted", "start").on({
                onComplete: function (files) {
                    callback(files);
                }
            })
        }
        else {
            this.registerCallback('notifyWhenFilesWereSelected', arguments);
        }
    }

    extractAssetFromCSB(assetPath, progressCallback, callback) {
        if (this.interact) {
            this.interact.startSwarm('extractAssetFromCSB', "start", assetPath).on({
                onExtractionComplete: function (assetName) {
                    callback('Your asset [ ' + assetName + ' ] has been decrypted', assetName);
                },
                onError: function (errInfo) {
                    callback(errInfo);
                },
                onProgress: function (progress) {
                    progressCallback(progress);
                },
                readPin: readPin,
            });
        } else {
            this.registerCallback('extractAssetFromCSB', arguments);
        }
    }

    displayExtractedAssetFromCSB(assetPath, type, progressCallback, callback) {
        if (this.interact) {
            this.interact.startSwarm('extractAssetFromCSB', "getAsset", assetPath, type).on({
                onComplete: function (info) {
                    callback(true, info);
                },
                onError: function (err, errInfo) {
                    callback(false, errInfo);
                },
                onCloseIframe: function () {
                    callback(null);
                },
                onProgress: function (progress) {
                    progressCallback(progress);
                }
            });
        } else {
            this.registerCallback('displayExtractedAssetFromCSB', arguments);
        }
    }

    registerCallback(fnName, callback) {

        if (!this.callbacks[fnName]) {
            this.callbacks[fnName] = [];
        }
        this.callbacks[fnName].push(callback);
    }

    dispatchCallbacks() {
        for (let fnName in this.callbacks) {
            let fnCallbacks = this.callbacks[fnName];
            fnCallbacks.forEach((args) => {
                this[fnName].apply(this, args);
            })
        }

        this.callbacks = [];
    }

}


class InteractionsManager {

    static getInstance(interactView, name) {
        if (interactView) {
            if (interactions[name]) {
                return interactions[name];
            }
            else {
                interactView.frameRef.contentWindow.addEventListener("unload", function () {
                    if (interactions[name]) {
                        delete interactions[name];
                    }
                });
                return new InteractionService(interactView, name);
            }

        }
        else {
            if (interactions['global']) {
                return interactions['global'];
            }
            else {

                return new InteractionService();
            }
        }
    }

}

export default InteractionsManager;

