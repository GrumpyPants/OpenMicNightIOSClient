var React = require('react-native');
var OpenMicView = require('./OpenMicView');
var t = require('tcomb-form-native');
var moment = require('moment');
var {
  Alert,
  AppRegistry,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Component,
  PickerIOS,
  DatePickerIOS
} = React;

var Form = t.form.Form;

var WeekDay = t.enums({
  'sunday': 'Sunday',
  'monday': 'Monday',
  'tuesday': 'Tuesday',
  'wednesday': 'Wednesday',
  'thursday': 'Thursday',
  'friday': 'Friday',
  'saturday': 'Saturday'
});

var Regularity = t.enums({
  'weekly': 'Weekly',
  'biweekly': 'Bi-weekly',
  'monthly': 'Monthly'
});

var State = t.enums({
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
});

var OpenMic = t.struct({
  openMicName: t.Str,
  comedians: t.Bool,
  musicians: t.Bool,
  poets: t.Bool,
  venueName: t.Str,
  venueAddress: t.Str,
  city: t.Str,
  state: State,
  contactEmailAddress: t.maybe(t.Str),
  contactPhoneNumber: t.maybe(t.Str),
  signUpTime: t.Date,
  startTime: t.Date,
  openMicRegularity: Regularity,
  openMicWeekDay: WeekDay,
  nextOpenMicDate: t.Date,
  isOpenMicFree:t.Bool,
  otherNotes: t.maybe(t.Str)
});

var OpenMicWeekly = t.struct({
  openMicName: t.Str,
  comedians: t.Bool,
  musicians: t.Bool,
  poets: t.Bool,
  venueName: t.Str,
  venueAddress: t.Str,
  city: t.Str,
  state: State,
  contactEmailAddress: t.maybe(t.Str),
  contactPhoneNumber: t.maybe(t.Str),
  signUpTime: t.Date,
  startTime: t.Date,
  openMicRegularity: Regularity,
  sunday: t.Bool,
  monday: t.Bool,
  tuesday: t.Bool,
  wednesday: t.Bool,
  thursday: t.Bool,
  friday: t.Bool,
  saturday: t.Bool,
  nextOpenMicDate: t.Date,
  isOpenMicFree:t.Bool,
  otherNotes: t.maybe(t.Str)
});

var options = {
  fields: {
    isOpenMicFree: {
        label: 'Is this Open Mic Free?'
    },
    signUpTime: {
        mode: 'time',
    },
    startTime: {
        mode: 'time'
    },
    nextOpenMicDate: {
        mode: 'date',
        //minimumDate: moment().toDate()
    },
    otherNotes: {
        //placeholder: 'Opmerking',
        //multiline: true
    }
  }
};

class AddOpenMicForm extends Component {

    constructor(props) {
        super(props);

        var openMic = this.props.openmic ? this.getOpenMicStateFromProp() : null;

        var openMicType = null;

        if (openMic && openMic.openMicRegularity === 'weekly') {
            openMicType = OpenMicWeekly;
        }
        else{
            openMicType = OpenMic;
        }

        this.state = {
            type: openMicType,
            value: openMic,
        };
    }

  getOpenMicStateFromProp(){
      var openMic = this.props.openmic;
      var signUpTime = moment(this.extractTimeFromDate(openMic.sign_up_time), 'hh:mma').toDate();
      var startTime = moment(this.extractTimeFromDate(openMic.start_time), 'hh:mma').toDate();
      var localDateTime = moment(openMic.next_openmic_date).toDate();
      var nextOpenMicDate = new Date(localDateTime.getTime() + localDateTime.getTimezoneOffset() * 60000);

      var openmicWeekDay = this.getSelectedOpenMicWeekday(openMic);
      return {
          openMicName: openMic.name,
          comedians: openMic.comedian,
          musicians: openMic.musician,
          poets: openMic.poet,
          venueName: openMic.venue_name,
          venueAddress: openMic.venue_address,
          city: openMic.city,
          state: openMic.state,
          contactEmailAddress: openMic.contact_email_address,
          contactPhoneNumber: openMic.contact_phone_number,
          signUpTime: signUpTime,
          startTime: startTime,
          openMicRegularity: openMic.regularity,
          openMicWeekDay: openmicWeekDay,
          nextOpenMicDate: nextOpenMicDate,
          isOpenMicFree: openMic.is_free,
          otherNotes: openMic.notes,
          monday: openMic.monday,
          tuesday: openMic.tuesday,
          wednesday: openMic.wednesday,
          thursday: openMic.thursday,
          friday: openMic.friday,
          saturday: openMic.saturday,
          sunday: openMic.sunday,
          id: openMic.id
      };
  };

    extractTimeFromDate(dateString){
        if (dateString.split(':').length === 2) {
            return dateString;
        }
        else {
            let timeArray = new Date(dateString).toLocaleTimeString().split(':');
            timeArray[2] = timeArray[2].slice(3);
            return timeArray.join(':');
        }
    }

    getSelectedOpenMicWeekday(openMic){
    var {monday, wednesday, tuesday, thursday, friday, saturday, sunday} = openMic;
    for (var key in openMic) {
        if (openMic.hasOwnProperty(key) && (key === 'monday' || key === 'tuesday' || key === 'wednesday' ||
            key === 'thursday' || key === 'friday' || key === 'saturday' || key === 'sunday')) {

            if (openMic[key]) {
                return key;
            }
        }
    }
  };

  saveNewOpenMic(openmic) {
      fetch('http://salty-oasis-82408.herokuapp.com/api/openmic/save', {
          method: 'post',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(openmic)
      }).then((response) => {
              Alert.alert(
                  'OpenMic Saved',
                  openmic.openMicName + ' was saved successfully.',
                  [
                      {text: 'OK', onPress: () => this.props.navigator.popToTop()},
                  ]
              );
          })
          .catch((error) => {
              console.warn(error);
          });
  }

    updateOpenMic(id, openmic) {
        fetch('http://salty-oasis-82408.herokuapp.com/api/openmic/update', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, openmic})
        }).then((response) => {
            Alert.alert(
                'OpenMic Updated',
                openmic.openMicName + ' was updated successfully.',
                [
                    {text: 'OK', onPress: () => this.props.navigator.popToTop()},
                ]
            );
        })
        .catch((error) => {
            console.warn(error);
        });
    }

  onPress() {
    var openmic = this.refs.form.getValue();

    if (openmic && !this.isWeekdayAndNextOpenMicDateValid(openmic)) {
        openmic = null;
        Alert.alert(
            'OpenMic Weekday is invalid',
            'The Next OpenMic Date you have provided does not land on the Weekday you have provided. Please select a Weekday that aligns with the Next OpenMic Date',
            [
                {text: 'OK'},
            ]
        );
    }

    if (openmic) { // if validation fails, value will be null
        if (this.props.openmic) {
            this.updateOpenMic(this.props.openmic.id, openmic);
        }
        else {
            this.saveNewOpenMic(openmic)
        }
    }
  }

  isWeekdayAndNextOpenMicDateValid(openmic){
    var isValid = false;
    var weekday = moment(openmic.nextOpenMicDate).format('dddd').toLowerCase();
    if (openmic.openMicWeekDay && weekday === openmic.openMicWeekDay) {
        // validate against weekday
        isValid = true;
    }
    else {
        //validate against list of weekdays
        if (openmic[weekday]) {
            isValid = true;
        }
    }

    return isValid;
  }

  onChange(value) {
    if (value.openMicRegularity === 'weekly') {
        this.setState({type: OpenMicWeekly, value: value});
    }
    else{
        this.setState({type: OpenMic, value: value});
    }
  }


  render() {
    return (
      <ScrollView
        scrollEventThrottle={200}
        style={styles.scrollView}>

        <View style={styles.container}>
          <Form
            ref="form"
            type={this.state.type}
            options={options}
            onChange={this.onChange.bind(this)}
            value={this.state.value}
            />
          <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingRight: 8,
        paddingLeft: 8,
    },
    scrollView: {
        height: 300,
    }
});

module.exports = AddOpenMicForm;