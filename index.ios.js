/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} from 'react-native';

var GamerTagScreen = require('./GamerTagScreen');
var HaloStats = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Arena Playlists',
          component: GamerTagScreen,
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('HaloStats', () => HaloStats);
