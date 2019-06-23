_CsbAPI_.saveFile = function(event){


    const fs = require("fs");

     let createFolderStructure = function(path) {
        const folders = path.split('/');

        let newFolder = '/memory';
        folders.forEach(function (folder) {
            newFolder += ('/' + folder);
            fs.mkdir(newFolder, function (err) {
                if(err){
                    console.log(err);
                }
            });
        });
    };


    $$.swarm.describe("storeManifestFile", {

        start: function (csbName, fileContent) {
            if (csbName.indexOf('/') !== -1) {
                createFolderStructure(csbName);
            }

            var path = "/memory/" + csbName + "-manifest.json";

            fs.writeFile(path, JSON.stringify(fileContent), (err) => {
                console.log(err);
                this.swarm("interaction", "onComplete", path);
            });
        }
    });



    let saveFileLocally = function (csbName, manifest, callback) {
        _$$_.localInteraction.startSwarm("storeManifestFile", "start", csbName, manifest).on({
            onComplete: (manifestPath) => {
                if (manifestPath) {
                    console.log(manifestPath);
                    _$$_.localInteraction.startSwarm("pskwallet.attachFile", "start", csbName + "/manifest", manifestPath).on({
                        readPin: function(noTries){
                            this.swarm("validatePin","12345678",noTries)
                        },
                        handleError: function (err) {
                            callback(err);
                            console.log(err);
                        },
                        printInfo: function (info) {
                            console.log(info);
                            callback();
                        }
                    });

                }
            }
        });
    };

    return new Promise((resolve)=>{
        event.request.json().then(data => {

            saveFileLocally(data.csbName, data.manifest, function(err){

                if(!err){
                    var init = { "status" : 200 , "statusText" : "Manifest was successfully created" };
                    var blob = new Blob([JSON.stringify({err:err})], {type : 'application/json'});
                    let response = new  Response(blob, init);
                    resolve(response);
                }
                else{
                    //TODO
                    //handle error
                }
            });

        });
    });
};