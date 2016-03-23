'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');
var AddOpenMicForm = require('./AddOpenMicForm');
var {
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

    constructor(props) {
        super(props);
        this.state = {
            searchString: 'Denver',
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
        var query = urlForQueryAndPage('place_name', this.state.searchString);
        this._executeQuery(query);
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

    render() {
        var spinner = this.state.isLoading ?
            ( <ActivityIndicatorIOS
                hidden='true'
                size='large'/> ) :
            ( <View/>);

        return (
            <ScrollView>
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
            </ScrollView>
        );
    }

    capitalize(string)
    {
        return string[0].toUpperCase() + string.slice(1);
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
        padding: 30,
        alignItems: 'center'
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
    }
});

module.exports = SearchPage;