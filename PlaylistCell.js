'use strict';

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


var PlaylistCell = React.createClass({
  render: function(){
    var TouchableElement = TouchableHighlight;

    if(Platform.OS == 'android'){
      TouchableElement = TouchableNativeFeedback;
    }
    console.log(this.props.playlist.url);
    var percentToNext = this.props.playlist.percent;
    var percentLabel = percentToNext !== 0 ?  `${percentToNext}% Current`: '';
    var percenToGo = percentToNext !== 0 ? `${100 - percentToNext}% To Next Level`: '';
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <Image
              source={{uri: this.props.playlist.url}}
              style={styles.cellImage}
              />
            <View style={styles.textContainer}>
              <Text style={styles.playlistTitle} numberOfLines={1}>
                {this.props.playlist.title}
              </Text>
              <Text>
                {percentLabel}
              </Text>
              <Text>
                {percenToGo}
              </Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    )
  }
});

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
    width: 80,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

module.exports = PlaylistCell;
