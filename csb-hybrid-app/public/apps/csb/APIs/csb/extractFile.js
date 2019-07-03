_CsbAPI_.extractFile = function(event){

    console.log("Extract", event);
    let  extractFile = function(csbPath, callback){
        console.log(csbPath);
        _$$_.localInteraction.startSwarm('pskwallet.extractFile', 'start', csbPath).on({
            printInfo: function (info) {
                console.log(info)
            },

            __return__: function (fileNames) {
                if (typeof fileNames !== 'string') {
                    fileNames = fileNames[0];
                }
                console.log("File", fileNames);

                callback(null, fileNames);

            },

            handleError: function (err, errInfo) {
                console.log(err);

            },
            onError: function (err) {
                console.log(err);
            },
            readPin: function(noTries){
                this.swarm("validatePin","12345678",noTries)
            },
            reportProgress:function(progress){
                console.log(progress);
            }
        });
    }


   let unzipFile = function(zipFile, csbName, callback){
       const yauzl = require("yauzl");
       const fs = require("fs");
       const path = require("path");
       let outputFolder = path.join("memory",csbName);

       yauzl.open(zipFile, {lazyEntries: true}, function(err, zipfile) {
           if (err) throw err;
           zipfile.readEntry();

           zipfile.once("end", () => {

               fs.readFile(outputFolder+"/index.html", callback);

           });

           zipfile.on("entry", function(entry) {
               if (/\/$/.test(entry.fileName)) {
                   // Directory file names end with '/'.
                   // Note that entires for directories themselves are optional.
                   // An entry's fileName implicitly requires its parent directories to exist.
                   zipfile.readEntry();
               } else {
                   // file entry
                   zipfile.openReadStream(entry, function(err, readStream) {
                       if (err) throw err;
                       readStream.on("end", function() {
                           zipfile.readEntry();
                       });

                       let fileName = path.join(outputFolder, entry.fileName);
                       let folder = path.dirname(fileName);
                       $$.ensureFolderExists(folder, () => {
                           let output = fs.createWriteStream(fileName);
                           readStream.pipe(output);
                       });
                   });
               }
           });
       });
   };


    return new Promise((resolve)=>{
        event.request.json().then(data => {
             console.log("EXTRACTING", data);
            extractFile(data.assetAliasPath, function(err, fileName){
                console.log("Let's unzip", fileName);
                unzipFile(fileName, data.assetAliasPath, (err, data)=>{
                    console.log("Finished", data);


                    if(!err){
                        console.log("Filename", fileName);
                        var init = { "status" : 200 , "statusText" : "File was successfully extracted" };
                        var blob = new Blob([data], {type : 'text/html'});
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
    });
};