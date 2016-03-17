var React = require('react-native');

var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  TextInput,
  RefreshControl,
  ScrollView
  } = React;
var TimerMixin = require('react-timer-mixin');
var invariant = require('invariant');
var dismissKeyboard = require('dismissKeyboard');
var Playlists = require('./playlists.json');
var csrs = require('./csrs.json')
var _ = require('lodash-node');
var PlaylistCell = require('./PlaylistCell')
var API_URL = 'https://www.haloapi.com/stats/h5/servicerecords/arena';
var API_ARGS = { method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '73aa374e744a4831983df95bebb7b8ba',
  }
};
var SearchBar = require('./SearchBar');
var LOADING = {};

var GamerTagScreen = React.createClass({
  mixins: [TimerMixin],
  timeoutID: (null: any),
getInitialState: function(){
  return {
    query : 'JakeWilson801',
    isRefreshing: false,
    isLoading: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
  };
},
componentDidMount: function() {
  this.searchGamerTag('JakeWilson801');
},
_urlForQuery: function(gamertag: string): string {
  if(gamertag){
    return API_URL + '?players=' + gamertag;
  }
},
searchGamerTag: function(gamertag: string) {
  this.timeoutID = null;
  this.setState({query: gamertag, isLoading: true, isRefreshing: true,dataSource: this.getDataSource([])});
  fetch(this._urlForQuery(gamertag), API_ARGS)
    .then((response) => response.json())
    .catch((error) => {
      this.setState({isLoading: false, dataSource: this.getDataSource([])});
    })
    .then((responseData) => {
        if(responseData){
          var MyPlaylists = responseData.Results[0].Result.ArenaStats.ArenaPlaylistStats;
          var data =  _.map(MyPlaylists, (list) => {
            var {name} = _.filter(Playlists, {id: list.PlaylistId})[0];
            var IsNotRanked = list.TotalGamesCompleted < 10;
            var listOfImages = _.filter(csrs, {id: IsNotRanked ? '0' : `${list.Csr.DesignationId}` });
            var imageIndex = (IsNotRanked ? parseInt(list.TotalGamesCompleted) : parseInt(list.Csr.Tier - 1));
            var url = listOfImages[0].tiers[imageIndex];
            var percentToNext = list.Csr ? list.Csr.PercentToNextTier : 0;
            return {title: name, url: url.iconImageUrl, id: list.PlaylistId, percent: percentToNext};
          });
          this.setState({isLoading: false, isRefreshing: false ,dataSource: this.getDataSource(data)});
        } else{
          this.setState({isLoading: false, isRefreshing: false, dataSource: this.getDataSource([])});
        }
      }
    );
},
onSearchChange: function(event: Object) {
  var filter = event.nativeEvent.text;
  this.clearTimeout(this.timeoutID);
  this.timeoutID = this.setTimeout(() => this.searchGamerTag(filter), 400);
},
getDataSource: function(playlists: Array<any>): ListView.DataSource {
  return this.state.dataSource.cloneWithRows(playlists);
},
renderSeparator: function(
  sectionID: number | string,
  rowID: number | string,
  adjacentRowHighlighted: boolean
) {
  var style = styles.rowSeparator;
  if (adjacentRowHighlighted) {
    style = [style, styles.rowSeparatorHide];
  }
  return (
    <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
  );
},
renderRow: function(
  playlist: Object,
  sectionID: number | string,
  rowID: number | string,
  highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
) {
  return (
    <PlaylistCell
      key={playlist.id}
      onSelect={() => console.log(playlist)}
      onHighlight={() => highlightRowFunc(sectionID, rowID)}
      onUnhighlight={() => highlightRowFunc(null, null)}
      playlist={playlist}x
    />
  );
},
refreshList: function(){
  this.setState({isRefreshing: true});
  this.searchGamerTag(this.state.query);
},
render: function(){
  var content = this.state.dataSource.getRowCount() === 0 ?
    <NoPlaylist
      query={this.state.query}
      isLoading={this.state.isLoadng}
    /> :
    <ListView
      ref="listview"
      renderSeparator={this.renderSeparator}
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
      automaticallyAdjustContentInsets={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps={true}
      showsVerticalScrollIndicator={false}
      refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refreshList}
                            tintColor="#ff0000"
                            title="Loading..."
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                          />
                        }
    />;

  return (
    <View style={styles.container}>
      <SearchBar
        onSearchChange={this.onSearchChange}
        isLoading={this.state.isLoading}
        searchText={'search for a gamertag'}
        onFocus={() =>
              this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0, 0)}
      />
      <View style={styles.separator}/>
      {content}
    </View>
  );
},
});


var NoPlaylist = React.createClass({
  render: function() {
    var text = '';
    if (this.props.query) {
      text = `No results for "${this.props.query}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No playlists found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noPlaylistText}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noPlaylistText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = GamerTagScreen;
