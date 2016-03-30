'use strict';

var React = require('react-native');
var AddOpenMicForm = require('./AddOpenMicForm');
var Banner = require('react-native-admob').AdMobBanner;

var {
    Alert,
    StyleSheet,
    Image,
    View,
    ScrollView,
    Text,
    Component,
    LinkingIOS,
    TouchableHighlight,
} = React;

class OpenMicView extends Component {

    constructor(props) {
        super(props);
    }

    _onOpenNavigation(){
        var openmic = this.props.openmic;
        var addressFields = [];
        this._addAddressToFieldsArray(openmic.venue_address, addressFields);
        //var url = 'http://maps.apple.com/?daddr=14601,Valentin+Dr.,El+Paso,TX';
        addressFields.push(this._replaceWhiteSpaceWithPlus(openmic.city));
        addressFields.push(openmic.state.trim());
        var url = 'http://maps.apple.com/?daddr=' + addressFields.join(',');
        this._submitOpenUrlRequest(url)
    }

    _addAddressToFieldsArray(venueAddress, addressFields) {
        var venueAddress = venueAddress.trim();
        addressFields.push(venueAddress.split(' ')[0]);
        var street = venueAddress.slice(venueAddress.indexOf(' '));
        addressFields.push(this._replaceWhiteSpaceWithPlus(street));
    }

    _replaceWhiteSpaceWithPlus(string){
        return string.trim().split(' ').join('+');
    }

    _submitOpenUrlRequest(url){
        LinkingIOS.canOpenURL(url, (supported) => {
            if (!supported) {
                Alert.alert('Can\'t handle url: ' + url);
            } else {
                LinkingIOS.openURL(url);
            }
        });
    }

    _getPerformerImages(){
        var openmic = this.props.openmic;
        var images =[];

        if (openmic.comedian) {
            images.push(
             <View style={styles.imageContainer}>
                <Image style={styles.performerIcon} source={require('./img/comedy.png')}/>
                <Text style={styles.valueText}>Comedians</Text>
             </View>
             );
        }

        if (openmic.poet) {
            images.push(
                <View style={styles.imageContainer}>
                    <Image style={styles.performerIcon} source={require('./img/poetry.png')}/>
                    <Text style={styles.valueText}>Poets</Text>
                </View>
            );
        }

        if (openmic.musician) {
            images.push(
                <View style={styles.imageContainer}>
                    <Image style={styles.performerIcon} source={require('./img/music.png')}/>
                    <Text style={styles.valueText}>Musicians</Text>
                </View>
            );
        }

        if (!openmic.is_free) {
            images.push(
                <View style={styles.imageContainer}>
                    <Image style={styles.performerIcon} source={require('./img/money.png')}/>
                    <Text style={styles.valueText}>Pay to Perform</Text>
                </View>
            );
        }

        return images;
    }

    _getContactSection(){
        var openmic = this.props.openmic;
        var rows = [];

        if (openmic.contact_email_address) {
            rows.push(
                <View>
                    <Text style={styles.sectionHeaderText}>CONTACT EMAIL ADDRESS</Text>
                    <Text style={styles.hyperlink} onPress={this._submitOpenUrlRequest.bind(this, "mailto:" + openmic.contact_email_address)}>{openmic.contact_email_address}</Text>
                    <View style={styles.separator}/>
                </View>
            );
        }

        if (openmic.contact_phone_number) {
            rows.push(
                <View>
                    <Text style={styles.sectionHeaderText}>CONTACT PHONE NUMBER</Text>
                    <Text style={styles.hyperlink} onPress={this._submitOpenUrlRequest.bind(this, "tel:" + openmic.contact_phone_number)}>{openmic.contact_phone_number}</Text>
                    <View style={styles.separator}/>
                </View>
            );
        }

        if (openmic.website) {
            rows.push(
                <View>
                    <Text style={styles.sectionHeaderText}>WEBSITE</Text>
                    <Text style={styles.hyperlink} onPress={this._submitOpenUrlRequest.bind(this, openmic.website)}>{openmic.website}</Text>
                    <View style={styles.separator}/>
                </View>
            );
        }

        return (
            <View>
                {rows}
            </View>
        );
    }

    _onEditOpenMicButtonPressed() {
        this.props.navigator.push({
            title: 'Edit an Open Mic',
            component: AddOpenMicForm,
            passProps: {openmic: this.props.openmic}
        });
    }

    _onFlagForDeletionButtonPressed() {
        Alert.alert(
            'OpenMicNight',
            'Are you sure you want to flag this Open Mic for deletion?',
            [
                {text: 'Yes', onPress: () => this._submitDeleteOpenMicRequest()},
                {text: 'Cancel', onPress: () => console.log('Cancel'), style: 'cancel'}
            ]
        )
    }

    _submitDeleteOpenMicRequest(){
        let id = this.props.openmic.id;
        fetch('http://localhost:3000/api/openmic/flagForDeletion', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }).then((response) => {
            this.props.navigator.popToTop();
        }).catch((error) => {
            console.warn(error);
        });
    }

    _extractTimeFromDate(dateString){
        if (dateString.split(':').length === 2) {
            return dateString;
        }
        else {
            let timeArray = new Date(dateString).toLocaleTimeString().split(':');
            timeArray[2] = timeArray[2].slice(3);
            return timeArray.join(':');
        }
    }

    render() {
        var openmic = this.props.openmic;
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    <View style={styles.sectionContainerOuter}>
                        <View style={styles.locationInner}>
                            <Text style={styles.sectionHeaderText}>LOCATION</Text>
                            <Text style={styles.valueText}>{openmic.venue_name}</Text>
                        </View>
                        <TouchableHighlight onPress={this._onOpenNavigation.bind(this)}>
                            <Image
                                style={styles.navigationIcon}
                                source={require('./img/navigation.png')}
                            />
                        </TouchableHighlight>
                    </View>
                    <View style={styles.separator}/>

                        <View>
                            <Text style={styles.sectionHeaderText}>DATE</Text>
                            <Text style={styles.valueText}>{openmic.date}</Text>
                        </View>
                    <View style={styles.separator}/>

                    <View style={styles.sectionContainerOuter}>
                        <View style={styles.signUpTimeContainer}>
                            <Text style={styles.sectionHeaderText}>SIGN UP TIME</Text>
                            <Text style={styles.valueText}>{this._extractTimeFromDate(openmic.sign_up_time)}</Text>
                        </View>

                        <View style={styles.startTimeContainer}>
                            <Text style={styles.sectionHeaderText}>START TIME</Text>
                            <Text style={styles.valueText}>{this._extractTimeFromDate(openmic.start_time)}</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>

                    <View style={styles.performerSectionContainerOuter}>
                        {this._getPerformerImages()}
                    </View>
                    <View style={styles.separator}/>


                    {this._getContactSection()}

                    <View style={styles.startTimeContainer}>
                        <Text style={styles.sectionHeaderText}>NOTES</Text>
                        <Text style={styles.description}>{openmic.notes}</Text>
                    </View>

                    <View style={styles.editOpenMicButtonContainer}>
                        <TouchableHighlight style={styles.button}
                                            onPress={this._onEditOpenMicButtonPressed.bind(this)}
                                            underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={styles.deleteButton}
                                            onPress={this._onFlagForDeletionButtonPressed.bind(this, true)}
                                            underlayColor='#ac2925'>
                            <Text style={styles.buttonText}>Flag</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>

                <Banner
                    style={styles.banner}
                    bannerSize={'smartBannerPortrait'}
                    adUnitID={'ca-app-pub-3940256099942544/2934735716'} />
            </View>
        );
    }
};

var styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom:20
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD'
    },
    description: {
    },
    signUpTimeContainer: {
        flex: 1,
    },
    startTimeContainer: {
        justifyContent: 'flex-start'
    },
    navigationIconView: {
        justifyContent: 'flex-end'
    },
    navigationIcon: {
        width: 30,
        height: 30,
    },
    sectionContainerOuter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
    },
    performerSectionContainerOuter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex:1
    },
    locationInner: {
        flex: 1,
    },
    sectionHeaderText: {
        color: '#ceced0',
        paddingTop: 10,
        paddingBottom: 10,
    },
    valueText: {
        paddingBottom: 10,
    },
    hyperlink: {
        paddingBottom: 10,
        color: 'blue'
    },
    performerIcon: {
        width: 45,
        height: 45,
    },
    imageContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    deleteButton: {
        height: 36,
        backgroundColor: '#d9534f',
        borderColor: '#d43f3a',
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    editOpenMicButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    banner: {
        backgroundColor: '#055'
    }
});

module.exports = OpenMicView;