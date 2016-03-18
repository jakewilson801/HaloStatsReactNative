var React = require('react-native');
var {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
  } = React;
var _ = require('lodash-node');
var Playlists = require('./playlists.json');

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  playlistTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 93,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

var LeaderBoardCell = React.createClass({
  render: function(){
    var TouchableElement = TouchableHighlight;
    if(Platform.OS == 'android'){
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.playlistTitle} numberOfLines={1}>
                {this.props.player.gamertag}
              </Text>
              <Text>
                {this.props.player.name}
              </Text>
              <Text>
                {this.props.player.count}
              </Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    )
  }
});
module.exports = LeaderBoardCell;
