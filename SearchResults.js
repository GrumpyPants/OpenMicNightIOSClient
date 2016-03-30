'use strict';

var React = require('react-native');
var OpenMicView = require('./OpenMicView');
var AddOpenMicForm = require('./AddOpenMicForm');
var Banner = require('react-native-admob').AdMobBanner;

var {
    StyleSheet,
    ScrollView,
    Text,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicatorIOS,
    Component,
    TouchableHighlight
} = React;

var API_URL = 'http://demo9383702.mockable.io/users';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialDataSourceState();
    this.bindMethods();
  }

  bindMethods() {
    if (! this.bindableMethods) {
      return;
    }

    for (var methodName in this.bindableMethods) {
      this[methodName] = this.bindableMethods[methodName].bind(this);
    }
  }

  getInitialDataSourceState() {
    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    }

    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID + ':' + rowID];
    }

    return {
      loaded : false,
      dataBlob: {},
      dataSource : new ListView.DataSource({
        getSectionData          : getSectionData,
        getRowData              : getRowData,
        rowHasChanged           : (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged : (s1, s2) => s1 !== s2
      })
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData () {
      var dates = this.props.openmics,
          length = dates.length,
          dataBlob = {},
          sectionIDs = [],
          rowIDs = [],
          date,
          openmics,
          openmicsLength,
          openmic,
          i,
          j;

      for (i = 0; i < length; i++) {
        date = dates[i];

        sectionIDs.push(date.id);
        dataBlob[date.id] = date.date;//date

        openmics = date.openmics;
        openmicsLength = openmics.length;

        rowIDs[i] = [];

        for(j = 0; j < openmicsLength; j++) {
          openmic = openmics[j];
          rowIDs[i].push(openmic.id);

          dataBlob[date.id + ':' + openmic.id] = openmic;
        }
      }

      this.setState({
        dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        loaded     : true
      });
  }

  render() {
    if (!this.state.loaded) {
        return this.renderLoadingView();
    }

    if (this.state.dataSource.getRowCount() > 0) {

        return (
            <View style={{flex: 1}}>
                {this.renderListView()}
                <Banner
                    style={styles.banner}
                    bannerSize={'smartBannerPortrait'}
                    adUnitID={'ca-app-pub-3940256099942544/2934735716'} />
            </View>
        );
    }
    else{
        return this.renderNoOpenMicsFoundView();
    }
  }

  renderLoadingView() {
    return (
          <View style={styles.container}>
            <ActivityIndicatorIOS
                animating={!this.state.loaded}
                style={[styles.activityIndicator, {height: 80}]}
                size="large"
            />
          </View>
    );
  }

  renderListView() {
    return (
          <ListView
              dataSource = {this.state.dataSource}
              style      = {styles.listview}
              renderRow  = {this.renderRow}
              renderSectionHeader = {this.renderSectionHeader}
          />
    );
  }

  onAddOpenMicButtonPressed() {
    this.props.navigator.push({
        title: 'Add an Open Mic',
        component: AddOpenMicForm,
        passProps: {}
    });
  }

  renderNoOpenMicsFoundView() {
        return (
            <View style={styles.noOpenMicsFoundContainer}>
                <Text>No Open Mics found for this city. Be the first to add one!</Text>
                <TouchableHighlight style={styles.button}
                                    onPress={this.onAddOpenMicButtonPressed.bind(this)}
                                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Add an Open Mic</Text>
                </TouchableHighlight>
            </View>
        );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
        <View style={styles.section}>
          <Text style={styles.text}>{sectionData}</Text>
        </View>
    );
  }
};

Object.assign(SearchResults.prototype, {
  bindableMethods : {
    renderRow : function (rowData, sectionID, rowID) {
      return (
          <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
            <View style={styles.rowStyle}>
              <Text style={styles.rowText}>{rowData.openmic_name ? rowData.openmic_name : 'Open Mic at ' + rowData.venue_name}</Text>
            </View>
          </TouchableOpacity>
      );
    },
    onPressRow : function (rowData, sectionID) {
    rowData.date = this.state.dataSource._getSectionHeaderData(this.state.dataSource._dataBlob, sectionID);
      this.props.navigator.push({
        title: rowData.openmic_name ? rowData.openmic_name : 'Open Mic at ' + rowData.venue_name,
        component: OpenMicView,
        passProps: {openmic: rowData}
      });
    }

  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noOpenMicsFoundContainer: {
      padding: 30,
      marginTop: 65,
      alignItems: 'center'
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    flexDirection: 'column',
    paddingTop: 25
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  text: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 16
  },
  rowStyle: {
    paddingVertical: 20,
    paddingLeft: 16,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1
  },
  rowText: {
    color: '#212121',
    fontSize: 16
  },
  subText: {
    fontSize: 14,
    color: '#757575'
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#2196F3'
  },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

module.exports = SearchResults;