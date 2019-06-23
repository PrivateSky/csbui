_CsbAPI_.changePin = function(event){


   let changePinFn = function (pin, callback) {
        _$$_.localInteraction.startSwarm("pskwallet.setPin", "start").on({
            readPin: function(noTries){
                this.swarm("validatePin","12345678",noTries)
            },
            enterNewPin: function () {
                this.swarm("actualizePin", pin);
            },
            handleError: (err) => {
                console.log(err);
            },
            printInfo: function (info) {
                callback(null, info);
            }
        })
    };

    return new Promise((resolve)=>{
        event.request.json().then(data => {

            changePinFn(data.pin, function(err){

                if(!err){
                    var init = { "status" : 200 , "statusText" : "PIN was successfully changed" };
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


_CsbAPI_.resetPin = function(event){
    let  resetPinFn = function(seed, newPin, callback) {
        this.interact.startSwarm("pskwallet.resetPin", "start").on({
            readSeed: function (noTries) {
                this.swarm("validateSeed", seed, noTries);
            },

            insertPin: function (noTries) {
                this.swarm("actualizePin", newPin);
            },
            handleError: (err) => {
                callback(err);
            },
            printInfo: function (info) {
                callback();
                console.log(info);
            }
        })
    };

    return new Promise((resolve)=>{
        event.request.json().then(data => {

            resetPinFn(data.seed, data.newPin, function(err){

                if(!err){
                    var init = { "status" : 200 , "statusText" : "PIN was successfully changed" };
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
}