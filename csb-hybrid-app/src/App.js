import React from 'react';
import {Text,View} from 'react-native';
import AppContainer from "./container/AppContainer"

class App extends React.Component {

    constructor(props){
        super(props);

        this.state={
            swIsRegistered :false
        };

        if ('serviceWorker' in navigator) {
            var interceptorLoaded = navigator.serviceWorker.controller!=null;
            console.log(navigator.serviceWorker);
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/privateSky-worker.js', {scope:"./"} )
                    .then((registration)=>{
                            console.log(registration);
                            this.setState({swIsRegistered: true});
                            console.log('ServiceWorker registration successful with scope: ', registration.scope);
                            if(!interceptorLoaded){
                                //refresh after interceptor was loaded but only if the interceptor was not already loaded.
                                window.location=window.location.href;
                            }
                        },
                        function(err) { // registration failed :(
                            console.log('ServiceWorker registration failed: ', err);
                        });

            });
        }
        else{
            console.error("No serviceWorker available. Did you used https?");
        }
    }


  render() {
    return (
        this.state.swIsRegistered?
    <AppContainer>

    </AppContainer>:<View><Text>Not registered</Text></View>
    );
  }
}


export default App;
//AppRegistry.registerComponent('App', () => App);
//AppRegistry.runApplication('App', { rootTag: document.getElementById('react-root') });