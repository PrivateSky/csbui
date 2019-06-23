var isRegistered = false;

if ('serviceWorker' in navigator) {
    var interceptorLoaded = navigator.serviceWorker.controller!=null;
    console.log(navigator.serviceWorker);
    window.addEventListener('load', function() {
        if(!isRegistered){
            navigator.serviceWorker.register('./mergedWorker.js', {scope:"./"} )
                .then(function(registration){
                        console.log(registration);
                        isRegistered = true;
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                        if(!interceptorLoaded){
                            //refresh after interceptor was loaded but only if the interceptor was not already loaded.
                            window.location=window.location.href;
                        }
                    },
                    function(err) { // registration failed :(
                        console.log('ServiceWorker registration failed: ', err);
                    });
        }

    });
}
