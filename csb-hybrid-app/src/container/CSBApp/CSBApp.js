import React from 'react';
import {View, Text} from 'react-native';
import WebView from "WebView";


export default class CSBApp extends React.Component{

    render(){
        return(
            <View style={{height: 700, width:700}}>
                <WebView ref={(webView) => {
                    this.webView = webView;
                }} source={{uri: require('../../../public/apps/csb/appProxy.html')}}/>
            </View>
        );
    }
}
