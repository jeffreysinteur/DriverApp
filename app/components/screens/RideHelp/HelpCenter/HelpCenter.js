import React, { PureComponent } from 'react'
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { RideLateDescription, BookingDetail } from 'navigation/routeNames'
import { HelpCenterSection, NavButton, Spinner } from 'components/ui'

import PropTypes from 'prop-types'
import CONFIG, { CancelRide } from './config'
import { colors } from 'theme'
import styles from './styles'

class HelpCenter extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <NavButton
          icon={'arrowLeft'}
          imageStyle={{ height: 14, width: 16 }}
          onPress={() => navigation.navigate(BookingDetail)}
        />
      )
    }
  }

  state = {
    isLateAlertShow: false
  }

  isLateReq = false

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { error, requestPending } = this.props
    const { isLateAlertShow } = this.state

    if (requestPending && !nextProps.requestPending) {
      if (error) {
        setTimeout(() => Alert.alert('Error', error), 200)
      } else {
        if (!isLateAlertShow && this.isLateReq) {
          this.setState({
            isLateAlertShow: true
          })

          setTimeout(
            () =>
              Alert.alert(
                'Thank you for notifying us',
                'Our administrator has been notified. You can add more details about why you are being late (optional).',
                [
                  { text: 'OK', onPress: () => this.onOkPress() },
                  { text: 'More', onPress: () => this.onMorePress() }
                ],
                { cancelable: false }
              ),
            200
          )

          this.isLateReq = false
        }
      }
    }
  }

  onOkPress = () => {
    this.props.navigation.navigate(BookingDetail)
  }

  onMorePress = () => {
    this.props.navigation.navigate(RideLateDescription)
  }

  onLatePress = () => {
    this.setState({ isLateReq: true })
    this.isLateReq = true

    const { onSendLateNotification, ride } = this.props

    onSendLateNotification({ carId: ride.id })
  }

  keyExtractor = (item, index) => item.id

  renderSeparator = () => <View style={styles.listSeparator} />

  renderListItem = ({ item }) => {
    let { text, routeName, id } = item

    let onPress = () => this.props.navigation.navigate(routeName)
    if (id === 'late') {
      onPress = this.onLatePress
    }

    return (
      <TouchableOpacity style={styles.listItem} onPress={onPress}>
        <Text style={styles.listItemText}>{text}</Text>

        <Icon color={colors.gray25} name={'ios-arrow-forward'} size={22} />
      </TouchableOpacity>
    )
  }

  render() {
    const { requestPending, ride } = this.props

    const data = [...CONFIG]
    data.push(CancelRide)

    return (
      <HelpCenterSection>
        <FlatList
          ItemSeparatorComponent={this.renderSeparator}
          data={data}
          extraData={data.length}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderListItem}
        />

        <Spinner color={colors.red} visible={requestPending} />
      </HelpCenterSection>
    )
  }
}
HelpCenter.propTypes = {
  error: PropTypes.string,
  navigation: PropTypes.object,
  requestPending: PropTypes.bool,
  ride: PropTypes.object,
  onSendLateNotification: PropTypes.func
}

export default HelpCenter
