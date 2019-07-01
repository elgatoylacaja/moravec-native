/*
* This is a polyfill needed for Android, as it's JS runtime does not include Symbol.iterator,
* which brokes using the ES6 for..of syntax.
* Please check
* https://github.com/facebook/react-native/issues/15902
* https://github.com/facebook/immutable-js/issues/1305
*/
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';

import React from 'react';
import {AppRegistry} from 'react-native';
import {Tester, TestHookStore} from 'cavy';
import {Provider} from "react-redux";
import {gameSpec} from "./specs/game/game_spec";
import {practiceSpec} from "./specs/practice_spec";
import {operationHintsSpec} from "./specs/game/hints_spec";
import {Navigator} from "./src/navigator";
import {store} from "./src/store";

const cavyTestHooksStore = new TestHookStore();

const CavyMoravecWrapper = () => (
  <Provider store={store}>
    <Tester specs={[gameSpec, practiceSpec, operationHintsSpec]}
            store={cavyTestHooksStore} clearAsyncStorage={true}>
      <Navigator/>
    </Tester>
  </Provider>
);

AppRegistry.registerComponent('Moravec', () => CavyMoravecWrapper);
