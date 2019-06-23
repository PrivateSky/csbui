_CsbAPI_.create = function(event){

    let createCSB = function(name, backupUrl, callback){

        let createCSBFn = function(){
            _$$_.localInteraction.startSwarm("pskwallet.createCsb", "start", name).on({
                onComplete: function (completedInfo) {
                    if (completedInfo) {
                        console.log(completedInfo);
                    }
                },
                handleError: function (error) {
                    console.log(error);
                    callback(error);
                },
                onError: function (error) {
                    console.log(error)
                },
                readPin: function(noTries){
                    this.swarm("validatePin","12345678",noTries)
                },

                createPin: function (defaultPin) {
                    this.swarm("loadBackups", defaultPin);
                },

                printSensitiveInfo: function (seedBuffer, defaultPin) {
                    let seed = String.fromCharCode.apply(null, new Uint16Array(seedBuffer));
                    console.log("Seed: ", seed);
                    console.log("Pin: ", defaultPin);
                    callback(null, true, seed);
                },
                printInfo: function (info) {
                    console.log(info);
                    callback(null, info);
                }
            });
        };



        if (backupUrl) {
            _$$_.localInteraction.startSwarm("pskwallet.addBackup", "start", backupUrl).on({
                readPin: function(noTries){
                    this.swarm("validatePin","12345678",noTries)
                },
                createPin: function (defaultPin) {
                    this.swarm('addBackup', defaultPin);
                },
                handleError: function (err) {
                    console.log(err);
                },
                printInfo: function (info) {
                    console.log(info);
                    createCSBFn();
                }
            });
        }
        else {
            createCSBFn()
        }
    };


    return new Promise((resolve)=>{

        event.request.json().then(data => {
            createCSB(data.csbName,data.backupUrl, function(err, isMaster, seed){
                console.log(err,isMaster, seed);

                if(!err){
                    var init = { "status" : 201 , "statusText" : "CSB created!" };
                    var blob = new Blob([JSON.stringify({err:err, isMaster:isMaster, seed:seed})], {type : 'application/json'});
                    let response = new  Response(blob, init);
                    resolve(response);
                }

            });

        });
    });
};