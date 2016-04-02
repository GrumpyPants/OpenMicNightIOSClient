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

const DropDown = require('react-native-dropdown');
const {
    Select,
    Option,
    OptionList,
    updatePosition
    } = DropDown;

function urlForQueryAndPage(key, city, state) {
    var data = {
        city: city,
        state: state
    };

    var querystring = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');
    return 'http://salty-oasis-82408.herokuapp.com/api/openmic/listForCity?' + querystring;
};

class SearchPage extends Component {
    static BannerAdUnitId = 'ca-app-pub-3940256099942544/2934735716';

    constructor(props) {
        super(props);
        this.state = {
            //searchString: 'New York',
            isLoading: false,
            message: ''
        };
    }

    componentDidMount() {
        updatePosition(this.refs['SELECT2']);
        updatePosition(this.refs['OPTIONLIST']);
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
        else if (!this.state.usa) {
            Alert.alert(
                'OpenMicNight',
                'Please select a state.',
                [
                    {text: 'Ok'},
                ]
            )
        }
        else{
            var query = urlForQueryAndPage('place_name', this.state.searchString.trim(), this.state.usa);
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

    getOptionList() {
        return this.refs['OPTIONLIST'];
    }

    onStateSelect(state) {
        this.setState({
            ...this.state,
            usa: state
        });
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

                            <View style={styles.flowRight}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder='Search via city name'
                                    value={this.state.searchString}
                                    onChange={this.onSearchTextChanged.bind(this)}/>
                            </View>

                            <View style={styles.flowRight}>

                                <Select
                                    width={250}
                                    height={36}
                                    ref="SELECT2"
                                    optionListRef={this.getOptionList.bind(this)}
                                    defaultValue="Select a State ..."
                                    onSelect={this.onStateSelect.bind(this)}
                                    styleOption={styles.selectedOption}
                                    style={styles.selectDropDown}>
                                    <Option>Alabama</Option>
                                    <Option>Alaska</Option>
                                    <Option>Arizona</Option>
                                    <Option>Arkansas</Option>
                                    <Option>California</Option>
                                    <Option>Colorado</Option>
                                    <Option>Connecticut</Option>
                                    <Option>Delaware</Option>
                                    <Option>District Of Columbia</Option>
                                    <Option>Florida</Option>
                                    <Option>Georgia</Option>
                                    <Option>Hawaii</Option>
                                    <Option>Idaho</Option>
                                    <Option>Illinois</Option>
                                    <Option>Indiana</Option>
                                    <Option>Iowa</Option>
                                    <Option>Kansas</Option>
                                    <Option>Kentucky</Option>
                                    <Option>Louisiana</Option>
                                    <Option>Maine</Option>
                                    <Option>Maryland</Option>
                                    <Option>Massachusetts</Option>
                                    <Option>Michigan</Option>
                                    <Option>Minnesota</Option>
                                    <Option>Mississippi</Option>
                                    <Option>Missouri</Option>
                                    <Option>Montana</Option>
                                    <Option>Nebraska</Option>
                                    <Option>Nevada</Option>
                                    <Option>New Hampshire</Option>
                                    <Option>New Jersey</Option>
                                    <Option>New Mexico</Option>
                                    <Option>New York</Option>
                                    <Option>North Carolina</Option>
                                    <Option>North Dakota</Option>
                                    <Option>Ohio</Option>
                                    <Option>Oklahoma</Option>
                                    <Option>Oregon</Option>
                                    <Option>Pennsylvania</Option>
                                    <Option>Rhode Island</Option>
                                    <Option>South Carolina</Option>
                                    <Option>South Dakota</Option>
                                    <Option>Tennessee</Option>
                                    <Option>Texas</Option>
                                    <Option>Utah</Option>
                                    <Option>Vermont</Option>
                                    <Option>Virginia</Option>
                                    <Option>Washington</Option>
                                    <Option>West Virginia</Option>
                                    <Option>Wisconsin</Option>
                                    <Option>Wyoming</Option>
                                </Select>

                                <OptionList ref="OPTIONLIST"/>

                                <TouchableHighlight style={styles.goButton}
                                                    underlayColor='#99d9f4'
                                                    onPress={this.onSearchPressed.bind(this)}>
                                    <Text style={styles.buttonText}>Go</Text>
                                </TouchableHighlight>
                            </View>
                            {spinner}
                            <Text style={styles.description}>{this.state.message}</Text>
                            <TouchableHighlight style={styles.addMicbutton}
                                                onPress={this.onAddOpenMicButtonPressed.bind(this)}
                                                underlayColor='#99d9f4'>
                                <Text style={styles.buttonText}>Add an Open Mic</Text>
                            </TouchableHighlight>
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
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        paddingTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 80,
        alignItems: 'center'
    },
    parentContainer: {
        flex: 1,
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
    goButton: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
        marginLeft: 5,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    addMicbutton: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 150,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    selectDropDown: {
        marginTop: 5,
        borderColor: '#2196f3',
        padding: 4,
        flex: 4,
        borderWidth: 1,
        borderRadius: 8,
        color: '#2196f3'
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
    },
    image: {
        width: 100,
        height: 200
    },
    banner: {
        backgroundColor: '#055'
    },
    selectedOption: {
        padding: 5
    }
});

module.exports = SearchPage;