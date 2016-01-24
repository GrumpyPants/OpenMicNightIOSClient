'use strict';

var React = require('react-native');
var SearchPage = require('./SearchPage');

class OpenMicNightApp extends React.Component {
  render() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          //title: 'Home',
          component: SearchPage
        }}/>
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    flex: 1
  }
});

React.AppRegistry.registerComponent('OpenMicNightIOSClient', function() { return OpenMicNightApp });
