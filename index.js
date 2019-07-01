/*
* This is a polyfill needed for Android, as it's JS runtime does not include Symbol.iterator,
* which brokes using the ES6 for..of syntax.
* Please check
* https://github.com/facebook/react-native/issues/15902
* https://github.com/facebook/immutable-js/issues/1305
*/
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';

import React from "react";
import {AppRegistry} from "react-native";
import {Provider} from "react-redux";
import {Client, Configuration} from 'bugsnag-react-native';
import {Navigator} from "./src/navigator";
import {store} from "./src/store";

const bugsnagConfig = new Configuration("679da4947e65c72a8ce121acc5b5a832");
bugsnagConfig.appVersion = require('./package.json').version;
new Client(bugsnagConfig);

export const Moravec = () => (
    <Provider store={store}>
        <Navigator/>
    </Provider>
);

AppRegistry.registerComponent('Moravec', () => Moravec);
