'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');
var AddOpenMicForm = require('./AddOpenMicForm');
var Banner = require('react-native-admob').AdMobBanner;

var {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component
} = React;

function urlForQueryAndPage(key, value) {
    var data = {
        city: value
    };

    var querystring = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    return 'http://localhost:3000/api/openmic/listForCity?' + querystring;
};

class SearchPage extends Component {
    static BannerAdUnitId = 'ca-app-pub-3940256099942544/2934735716';

    constructor(props) {
        super(props);
        this.state = {
            searchString: 'New York',
            isLoading: false,
            message: ''
        };
    }

    _handleResponse(openmics) {
        this.setState({isLoading: false});
        if (openmics.length) {
            this.props.navigator.push({
                title: this.capitalize(this.state.searchString),
                component: SearchResults,
                passProps: {openmics: openmics}
            });
        } else {
            this.setState({message: 'Location not recognized or does not have any open mics. Please try again.'});
        }
    }

    _executeQuery(query) {
        this.setState({isLoading: true, message: ''});
        fetch(query)
            .then(response => response.json())
            .then(data => this._handleResponse(data))
            .catch(error => {
                this.setState({
                    isLoading: false,
                    message: 'Something bad happened ' + error
                });
            });
    }

    onSearchPressed() {
        if (!this.state.searchString) {
            Alert.alert(
                'OpenMicNight',
                'Please enter a city name.',
                [
                    {text: 'Ok'},
                ]
            )
        }
        else{
            var query = urlForQueryAndPage('place_name', this.state.searchString);
            this._executeQuery(query);
        }
    }

    onAddOpenMicButtonPressed() {
        this.props.navigator.push({
            title: 'Add an Open Mic',
            component: AddOpenMicForm,
            passProps: {}
        });
    }

    onSearchTextChanged(event) {
        this.setState({searchString: event.nativeEvent.text});
    }

    capitalize(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    render() {
        var spinner = this.state.isLoading ?
            ( <ActivityIndicatorIOS
                hidden='true'
                size='large'/> ) :
            ( <View/>);

        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.parentContainer}>
                        <View style={styles.container}>
                            <Text style={styles.description}>
                                Find Open Mics in your area!
                            </Text>

                            <Image source={require('./img/microphone.png')} style={styles.image}/>

                            <Text style={styles.description}>
                                Search by city name.
                            </Text>
                        <View style={styles.flowRight}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder='Search via city name'
                                value={this.state.searchString}
                                onChange={this.onSearchTextChanged.bind(this)}/>
                            <TouchableHighlight style={styles.button}
                                                underlayColor='#99d9f4'
                                                onPress={this.onSearchPressed.bind(this)}>
                                <Text style={styles.buttonText}>Go</Text>
                            </TouchableHighlight>
                        </View>
                            <TouchableHighlight style={styles.button}
                                                onPress={this.onAddOpenMicButtonPressed.bind(this)}
                                                underlayColor='#99d9f4'>
                                <Text style={styles.buttonText}>Add an Open Mic</Text>
                            </TouchableHighlight>
                            {spinner}
                            <Text style={styles.description}>{this.state.message}</Text>
                        </View>
                    </View>
                </ScrollView>

                <Banner
                    style={styles.banner}
                    bannerSize={'smartBannerPortrait'}
                    adUnitID={SearchPage.BannerAdUnitId} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        paddingTop: 80,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 80,
        alignItems: 'center'
    },
    parentContainer: {
        flex: 1,
        //justifyContent: 'flex-end',
        //alignItems: 'flex-end'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
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
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#2196f3',
        borderRadius: 8,
        color: '#2196f3'
    },
    image: {
        width: 100,
        height: 200
    },
    banner: {
        backgroundColor: '#055'
    }
});

module.exports = SearchPage;