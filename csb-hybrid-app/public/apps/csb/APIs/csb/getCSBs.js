_CsbAPI_.getCSBs = function(event){
    let getCSBList = function (csbPath, callback) {
        _$$_.localInteraction.startSwarm("pskwallet.listCSBs", "start", csbPath).on({
            __return__: function (csbs) {
                console.log(csbs);
                callback(null, csbs);
            },
            onError: function (error) {
                console.log(error)
            },
            readPin: function(noTries){
                this.swarm("validatePin","12345678",noTries)
            },
            handleError: function (err, message) {
                console.error(err, message);
            },
            noMasterCSBExists: function () {
                callback(null, []);
            }
        });
    };

    return new Promise((resolve)=>{
        event.request.text().then(data => {

            let url = new URL(event.request.url);
            let csbPath = url.searchParams.get("csbPath");

            getCSBList(csbPath, function(err, csbList){

                console.log(csbList);

                if(!err){
                    var init = { "status" : 200 , "statusText" : "CSB list created" };
                    var blob = new Blob([JSON.stringify({err:err, csbList:csbList})], {type : 'application/json'});
                    let response = new  Response(blob, init);
                    resolve(response);
                }

            });

        });
    });
}