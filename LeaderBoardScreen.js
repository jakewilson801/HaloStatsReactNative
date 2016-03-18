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
var API_URL = 'https://halo5.herokuapp.com/leaderboard/medals';
var LeaderBoardCell = require('./LeaderBoardCell');
var SearchBar = require('./SearchBar');
var LeaderBoardScreen = React.createClass({
  mixins: [TimerMixin],
  timeoutID: (null: any),
  renderSeparator: function(sectionID: number | string, rowID: number | string, adjacentRowHighlighted: boolean) {
  var style = styles.rowSeparator;
  if (adjacentRowHighlighted) {
    style = [style, styles.rowSeparatorHide];
  }
  return (
    <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
  );
  },
onSearchChange: function(event: Object) {
  var filter = event.nativeEvent.text;
  this.clearTimeout(this.timeoutID);
  this.timeoutID = this.setTimeout(() => this.getLeaderBoard(filter), 400);
},
  render: function(){
    var content = <ListView
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
    var search =    <SearchBar
  />

    return (
      <View style={styles.container}>
  <SearchBar
    onSearchChange={this.onSearchChange}
    isLoading={this.state.isLoading}
    searchText={'type in a medal'}
    onFocus={() =>
    this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0, 0)}
  />
  <View style={styles.separator}/>
        {content}
      </View>
    );
  },
  _query: function(medal : string): string {
    if(!medal){
      return API_URL
    }
    else{
      return API_URL + "?medal=" + medal
    }
  },
  getInitialState: function(){
    return {
      query : 'JakeWilson801',
      isRefreshing: false,
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  },
  componentDidMount: function() {
    this.getLeaderBoard('Headshot');
  },
  getLeaderBoard: function(medal: string) {
    this.timeoutID = null;
    this.setState({query: medal, isLoading: true, isRefreshing: true,dataSource: this.getDataSource([])});
    fetch(this._query(medal))
      .then((response) => response.json())
      .catch((error) => {
        this.setState({isLoading: false, dataSource: this.getDataSource([])});
      })
      .then((responseData) => {
          if(responseData){
            console.log(responseData);
            //var MyPlaylists = responseData.Results[0].Result.ArenaStats.ArenaPlaylistStats;
            var data =  _.map(responseData, (list) => {
              return {gamertag: list.player_gamertag, count: list.medal_count, rank: list.rank, name: list.name};
            });
            this.setState({isLoading: false, isRefreshing: false ,dataSource: this.getDataSource(data)});
          } else{
            this.setState({isLoading: false, isRefreshing: false, dataSource: this.getDataSource([])});
          }
        }
      );
  },
  getDataSource: function(playlists: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(playlists);
  },
  renderRow: function(player: Object){
  return (
    <LeaderBoardCell
      key={player}
      player={player}
    />
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

module.exports = LeaderBoardScreen;