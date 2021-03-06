import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Platform
} from 'react-native'
import {
  StackActions,
  NavigationActions,
  NavigationEvents
} from 'react-navigation'
import VersionNumber from 'react-native-version-number'
import PropTypes from 'prop-types'
import ImagePicker from 'react-native-image-picker'
import { requestMainPermissions } from 'helpers/permission'
import { icons } from 'images'
import {
  ProfileDetails,
  ChangePassword,
  TermsConditions,
  PrivacyPolicy,
  Home,
  Auth
} from 'navigation/routeNames'
import {
  Section,
  SectionHeader,
  SectionContent,
  NavButton,
  Spinner
} from 'components/ui'
import { colors } from 'theme'
import { isIOS } from 'utils'
import styles from './styles'

let androidOptions = {
  cancelButtonTitle: 'Cancel',
  title: 'License Photo',
  mediaType: 'photo',
  quality: 0.6,
  maxHeight: 800,
  storageOptions: {
    skipBackup: true,
    cameraRoll: true
  },
  noData: true
}
let iosOptions = {
  cancelButtonTitle: 'Cancel',
  title: 'License Photo',
  quality: 0.6,
  maxHeight: 800,
  mediaType: 'photo',
  noData: true
}

const ListItem = ({ text, icon, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image source={icons[icon]} style={styles.listItemIcon} />
    </View>
    <Text style={styles.listItemText}>{text}</Text>
  </TouchableOpacity>
)

ListItem.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func
}

class ProfileMain extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <NavButton
          icon="arrowLeft"
          imageStyle={{ height: 14, width: 16 }}
          onPress={() => navigation.navigate(Home)}
        />
      )
    }
  }

  componentDidUpdate(prevProps) {
    const { error, requestPending } = this.props

    if (prevProps.requestPending && !requestPending) {
      if (error) setTimeout(() => Alert.alert('Error', error), 200)
    }
  }

  handleScreenFocus = () => {
    const { user, onProfileUpdateCheck } = this.props
    const { profile_update_request: profileUpdRequest = {} } = user

    if (profileUpdRequest && profileUpdRequest.status === 'pending') {
      onProfileUpdateCheck()
    }
  }

  onInstaPress = () => {
    Linking.openURL('https://www.instagram.com/carfloinc/').catch(err =>
      console.error('An error occurred', err)
    )
  }

  onFBPress = () => {
    Linking.openURL(
      'https://m.facebook.com/carflow1/?view_public_for=191919698131979'
    ).catch(err => console.error('An error occurred', err))
  }

  resetTo = route => {
    const resetAction = StackActions.reset({
      key: null,
      index: 0,
      actions: [NavigationActions.navigate({ routeName: route })]
    })

    this.props.navigation.dispatch(resetAction)
  }

  onLogOut = () => {
    this.props.onSignOut()
    this.resetTo(Auth)
  }

  onPhotoPress = async () => {
    let granted = await requestMainPermissions(true)

    if (granted) {
      this.showImagePicker()
      // this.props.navigation.navigate(ProfileCamera)
    }
  }

  showImagePicker = () => {
    ImagePicker.showImagePicker(
      Platform.OS === 'android' ? androidOptions : iosOptions,
      response => {
        this.pickerIsOpened = false

        if (response.didCancel || response.error) {
          // this.props.navigation.goBack()
        } else {
          this.props.onUpdateUserImage(response.uri)
          // this.props.navigation.navigate(PicturePreview, {
          //   photoUri: response.uri
          // })
        }
      }
    )
  }

  onNavigateTo = route => {
    this.props.navigation.navigate(route)
  }

  render() {
    const { full_name: fullname, photo } = this.props.user

    return (
      <React.Fragment>
        <NavigationEvents onDidFocus={this.handleScreenFocus} />

        <ScrollView
          contentContainerStyle={styles.container}
          style={{ flex: 1 }}
        >
          <View style={styles.profileInfo}>
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={this.onPhotoPress}
            >
              {photo ? (
                <Image
                  source={{ uri: `${photo}` }}
                  style={styles.profileImage}
                />
              ) : (
                <Image source={icons['camera']} style={styles.iconCamera} />
              )}
            </TouchableOpacity>

            <Text style={styles.userName}>{fullname}</Text>
          </View>

          <Section>
            <SectionHeader title={'PROFILE'} />

            <SectionContent>
              <ListItem
                icon={'user'}
                text={'Personal Details'}
                onPress={() => this.onNavigateTo(ProfileDetails)}
              />
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader title={'SECURITY'} />

            <SectionContent>
              <ListItem
                icon={'lock'}
                text={'Change Password'}
                onPress={() => this.onNavigateTo(ChangePassword)}
              />
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader title={'ABOUT US'} />

            <SectionContent style={styles.socialList}>
              <ListItem
                icon={'star'}
                text={`Rate us on ${isIOS ? 'App Store' : 'Play Store'}`}
              />

              <ListItem
                icon={'instagram'}
                text={'Follow us on Instagram'}
                onPress={this.onInstaPress}
              />

              <ListItem
                icon={'facebook'}
                text={'Like us on Facebook'}
                onPress={this.onFBPress}
              />

              <ListItem icon={'twitter'} text={'Follow us on Twitter'} />

              <ListItem
                icon={'book'}
                text={'Privacy policy'}
                onPress={() => this.onNavigateTo(PrivacyPolicy)}
              />

              <ListItem
                icon={'document'}
                text={`Terms & conditions`}
                onPress={() => this.onNavigateTo(TermsConditions)}
              />
            </SectionContent>
          </Section>

          <View style={styles.footer}>
            <TouchableOpacity onPress={this.onLogOut}>
              <Text style={styles.logOutText}>{'Log Out'}</Text>
            </TouchableOpacity>

            <Text style={styles.appVersionText}>
              {`Version ${VersionNumber.appVersion}`}
            </Text>
          </View>

          <Spinner color={colors.red} visible={this.props.requestPending} />
        </ScrollView>
      </React.Fragment>
    )
  }
}

ProfileMain.propTypes = {
  error: PropTypes.string,
  navigation: PropTypes.object,
  requestPending: PropTypes.bool,
  user: PropTypes.object,
  onProfileUpdateCheck: PropTypes.func,
  onSignOut: PropTypes.func,
  onUpdateUserImage: PropTypes.func
}

export default ProfileMain
