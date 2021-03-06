import React, { PureComponent } from 'react'
import { Switch } from 'react-native-switch'
import PropTypes from 'prop-types'
import { NavButton, Button } from 'components/ui'
import {
  Home,
  PickupLocation,
  AvailableBookings,
  VehicleOptions
} from 'navigation/routeNames'
import { Slider } from 'react-native-elements'
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity
} from 'react-native'
import { colors } from 'theme'

import _ from 'lodash'
import moment from 'moment'

import { icons } from 'images'
import DatePicker from '../../../blocks/DatePicker'
import { styles } from './styles'

const RANGES = {
  0: {
    value: 0.5,
    title: '1/2 mile'
  },
  1: {
    value: 1,
    title: '1 mile'
  },
  2: {
    value: 2,
    title: '2 miles'
  },
  3: {
    value: 5,
    title: '5 miles'
  },
  4: {
    value: 10,
    title: '10 miles'
  },
  5: {
    value: 100,
    title: '10+ miles'
  }
}

class Filters extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <NavButton
          icon={'arrowLeft'}
          imageStyle={{
            width: 16,
            height: 14
          }}
          onPress={() => navigation.navigate(Home)}
        />
      )
    }
  }

  state = {
    address: '',
    addressSelected: false,
    showAddressResults: false,
    isNext7Days: false,
    isDatePickerShow: false
  }

  componentDidMount() {
    const { onCarCategoriesLoad } = this.props

    onCarCategoriesLoad()

    this.setDefaultLocation()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !nextProps.isFetchingCarCategories &&
      this.props.isFetchingCarCategories
    ) {
      setTimeout(() => {
        this.setState({
          isDatePickerShow: true
        })
      }, 150)
    }
  }

  setDefaultLocation = () => {
    const { onFilterUpdate } = this.props

    navigator.geolocation.getCurrentPosition(
      location => {
        const choosenLocation = {
          address: 'My location',
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }

        onFilterUpdate('location', choosenLocation)
      },
      err => {
        console.log('location error', err)

        setTimeout(
          () => Alert.alert('Geolocation Error', "Can't get your location"),
          200
        )
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  onConfirmPress = () => {
    const {
      filters: { startDate, endDate, isRecurring, location, range, categories },
      onFetchAvailableCars,
      navigation
    } = this.props

    const errors = []
    const selectedCategories = []

    categories.forEach(item => {
      if (item.selected) selectedCategories.push(item.id)
    })

    if (selectedCategories.length === 0) {
      errors.push('Choose at least one vehicle option.')
    }

    if (
      moment()
        .tz('America/New_York')
        .isAfter(moment(startDate).tz('America/New_York'))
    ) {
      errors.push('Start date must be after now.')
    }

    if (
      moment()
        .tz('America/New_York')
        .isAfter(moment(endDate).tz('America/New_York'))
    ) {
      errors.push('End date must be after now.')
    }

    if (
      moment(startDate)
        .tz('America/New_York')
        .isAfter(moment(endDate).tz('America/New_York'))
    ) {
      errors.push('End date must be after start date.')
    }

    if (errors.length > 0) {
      setTimeout(() => Alert.alert('Errors', _.join(errors, '\n')), 200)

      return
    }

    const req = {
      available_to: moment(endDate)
        // .unix(endDate)
        .tz('America/New_York')
        .subtract(1, 'hours')
        .minutes(59)
        .format('YYYY-MM-DD HH:mm'),
      available_from: moment(startDate)
        // .unix(startDate)
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm'),
      categories: selectedCategories
    }

    if (location.lat && location.lng) {
      req.pickup_location_lat = location.lat
      req.pickup_location_lon = location.lng
      req.allowed_range_miles = RANGES[range].value
    }

    if (isRecurring) {
      req.allowed_recurring = isRecurring
    }

    onFetchAvailableCars(req)

    navigation.navigate(AvailableBookings)
  }

  handleClearLocation = () => {
    const { onFilterUpdate } = this.props

    const nextLocation = {
      address: '',
      lat: null,
      lon: null
    }

    onFilterUpdate('location', nextLocation)
  }

  handleNext7DaysBtnPress = () => {
    const { onFilterUpdate } = this.props

    const now = moment().tz('America/New_York')

    const nextStartDate =
      now.minute() || now.second() || now.millisecond()
        ? now.add(1, 'hour').startOf('hour')
        : now.startOf('hour')

    onFilterUpdate('startDate', nextStartDate.format())

    const nextEndDate = nextStartDate.add({ days: 7 })

    onFilterUpdate('endDate', nextEndDate.format())

    this.setState({
      isNext7Days: true
    })
  }

  handleDateChange = (nextDate, type) => {
    const {
      onFilterUpdate,
      filters: { startDate }
    } = this.props
    const nextState = {
      isNext7Days: false
    }

    if (
      moment()
        .tz('America/New_York')
        .isAfter(moment(nextDate).tz('America/New_York'))
    ) {
      setTimeout(
        () => Alert.alert('Invalid date', 'The date must be after now.'),
        200
      )
    }

    if (type === 'Start') {
      onFilterUpdate('startDate', nextDate)
      onFilterUpdate(
        'endDate',
        moment(nextDate)
          .tz('America/New_York')
          .add({ hours: 12 })
          .format()
      )
    } else {
      if (
        moment(startDate)
          .tz('America/New_York')
          .isAfter(moment(nextDate).tz('America/New_York'))
      ) {
        setTimeout(
          () =>
            Alert.alert('Invalid date', 'End date must be after start date.'),
          200
        )

        return
      }

      onFilterUpdate('endDate', nextDate)
    }

    this.setState(nextState)
  }

  handleToogleRecurringSwitch = () => {
    const { filters, onFilterUpdate } = this.props

    onFilterUpdate('isRecurring', !filters.isRecurring)
  }

  getVehicleOptionsString = () => {
    const {
      filters: { categories }
    } = this.props

    if (_.some(categories, item => !item.selected)) {
      const names = []

      categories.forEach(item => {
        if (item.selected) names.push(item.name)
      })

      return _.truncate(_.join(names, ', '), {
        length: 20
      })
    }

    return 'All'
  }

  render() {
    const {
      filters: { startDate, endDate, isRecurring, location, range },
      onFilterUpdate,
      isFetchingCarCategories,
      navigation
    } = this.props

    const { isNext7Days, isDatePickerShow } = this.state

    if (isFetchingCarCategories || !isDatePickerShow) {
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={colors.red} size={'large'} />
        </View>
      )
    }

    const now = moment().tz('America/New_York')
    const minDate =
      now.minute() || now.second() || now.millisecond()
        ? now.add(1, 'hour').startOf('hour')
        : now.startOf('hour')

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        style={{
          flex: 1
        }}
      >
        <View>
          <DatePicker
            ExpandedHeader={() => (
              <View
                style={[
                  styles.filterRow,
                  {
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    justifyContent: 'flex-end'
                  }
                ]}
              >
                <TouchableOpacity onPress={this.handleNext7DaysBtnPress}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'Helvetica',
                      color: '#F03E3E'
                    }}
                  >
                    {'Next 7 days'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            formatter={'dddd, DD MMM hh:mmA'}
            headerValue={isNext7Days ? 'Next 7 days' : null}
            isDatePickerShow={isDatePickerShow}
            startDate={minDate.format()}
            style={{ marginTop: 20 }}
            type={'Start'}
            value={startDate}
            onChange={this.handleDateChange}
          />

          <DatePicker
            disabled={isNext7Days}
            formatter={'dddd, DD MMM hh:mmA'}
            headerValue={isNext7Days ? 'Next 7 days' : null}
            isDatePickerShow={isDatePickerShow}
            startDate={moment(startDate)
              .add({ hours: 1 })
              .format()}
            type={'End'}
            value={endDate}
            onChange={this.handleDateChange}
          />

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate(VehicleOptions)}
          >
            <View
              style={[styles.filterRow, { borderBottomWidth: 0, padding: 0 }]}
            >
              <Text style={[styles.fieldName]}>{'Vehicle options'}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Helvetica',
                    color: '#F03E3E'
                  }}
                >
                  {this.getVehicleOptionsString()}
                </Text>

                <Image
                  source={icons.arowRightGray}
                  style={{ width: 8, height: 13, marginLeft: 10 }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.filterRow}>
            <TextInput
              placeholder={'Pickup location'}
              style={{ flex: 1, fontSize: 18, fontFamily: 'Helvetica' }}
              value={location.address || ''}
              onFocus={() => {
                Keyboard.dismiss()

                this.props.navigation.navigate(PickupLocation)
              }}
            />

            <TouchableWithoutFeedback onPress={this.handleClearLocation}>
              <Image
                source={icons.cancelGray}
                style={{ width: 12, height: 12, marginLeft: 10 }}
              />
            </TouchableWithoutFeedback>
          </View>

          <View style={[styles.filterRow, { flexDirection: 'column' }]}>
            <View
              style={[styles.filterRow, { borderBottomWidth: 0, padding: 0 }]}
            >
              <Text style={[styles.fieldName]}>{'Range from location'}</Text>

              <Text style={styles.fieldValue}>{RANGES[range].title}</Text>
            </View>

            <Slider
              maximumTrackTintColor={'#A4AAB3'}
              maximumValue={5}
              minimumTrackTintColor={'#F03E3E'}
              minimumValue={0}
              step={1}
              style={{ width: '100%' }}
              thumbStyle={{
                backgroundColor: '#fff',
                height: 28,
                width: 28,
                borderRadius: 100,
                shadowOffset: { width: 3, height: 3 },
                shadowColor: 'black',
                shadowOpacity: 0.5,
                borderColor: '#F1F3F5',
                borderWidth: 1
              }}
              thumbTintColor={'#000'}
              trackStyle={{
                height: 2
              }}
              value={range}
              onValueChange={value => onFilterUpdate('range', value)}
            />
          </View>

          <View style={styles.filterRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={icons.recurring}
                style={styles.recurringImageContainer}
              />

              <Text
                numberOfLines={2}
                style={[styles.fieldName, { width: '70%', marginLeft: 10 }]}
              >
                {'Show only cars avaliable for recurring bookin'}
              </Text>
            </View>

            <View>
              <Switch
                backgroundActive={'#F03E3E'}
                backgroundInactive={'#DEE2E6'}
                barHeight={30}
                circleBorderWidth={2}
                circleSize={27}
                innerCircleStyle={{
                  borderColor: isRecurring ? '#F03E3E' : '#DEE2E6'
                }}
                switchWidthMultiplier={2}
                value={isRecurring}
                onValueChange={this.handleToogleRecurringSwitch}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Button
            containerStyle={styles.button}
            title={'SHOW AVAILABLE CARS'}
            onPress={this.onConfirmPress}
          />
        </View>
      </ScrollView>
    )
  }
}

Filters.propTypes = {
  filters: PropTypes.object,
  isFetchingCarCategories: PropTypes.bool,
  navigation: PropTypes.object,
  onCarCategoriesLoad: PropTypes.func,
  onFetchAvailableCars: PropTypes.func,
  onFilterUpdate: PropTypes.func
}

export default Filters
