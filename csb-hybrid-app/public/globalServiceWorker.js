    _$$_ = {};
    _CsbAPI_ = {};




    self.addEventListener('activate', function(event) {
        console.log("Activate event",event);

        $$.requireBundle("psknode");
        $$.requireBundle("virtualMQ");
        $$.requireBundle("pskclient");
        require("callflow");
        require("pskwallet").init();

        var interactionProvider = require("interact");
        interactionProvider.enableLocalInteractions();
        _$$_.localInteraction = interactionProvider.createInteractionSpace();
        console.log(_$$_.localInteraction);

            /*let fs = require("fs");
           fs.readdir("/",function(err, files){
           console.log(files);
       });*/
    });



self.addEventListener('fetch', function(event) {

    console.log("REQUEST:", event.request.url);
    var url = event.request.url;
    if (url.endsWith("/csb") && event.request.method === "POST") {

        event.respondWith(_CsbAPI_.create(event));
    }

    if(url.indexOf("/list/csb")>1 && event.request.method ==="GET"){
            event.respondWith(_CsbAPI_.getCSBs(event));
    }

    if(url.indexOf("/manifest")>1 && event.request.method ==="POST"){
        event.respondWith(_CsbAPI_.saveFile(event));
    }

    if(url.indexOf("/changePin")>1 && event.request.method ==="POST"){
        console.log("ChangingPin");
        event.respondWith(_CsbAPI_.changePin(event));
    }

    if(url.indexOf("/resetPin")>1 && event.request.method ==="POST"){
        event.respondWith(_CsbAPI_.resetPin(event));
    }

});

