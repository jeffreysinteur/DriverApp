import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  Keyboard,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import SplashScreen from 'react-native-splash-screen'
import {backgrounds} from 'images'
// import { CardSection } from 'components/blocks'
import { Button } from 'components/ui'
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation'
import Swiper from 'react-native-swiper'
import { CONFIG } from './config'
import { connect } from 'react-redux'
import { metrics } from 'theme'
import styles from './styles'

class Intro extends Component {
  _navigateTo = (routeName) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: routeName })]
    })
    this.props.navigation.dispatch(resetAction)
  }

  componentDidMount () {
    SplashScreen.hide()
    Keyboard.dismiss()
  }

  handleStartPress = () => {
    this.props.navigation.navigate('SignUpStepOne') // Register
  }

  handleSignInPress = () => {
    this.props.navigation.navigate('SignIn') // Register
  }

  renderSlides = () => {
    return CONFIG.map((slideData, index) => {
      const {image, title, text} = slideData
      return (
        <View key={index} style={styles.slide}>
          <View style={styles.imageContainer}>
            <Image resizeMode='center' source={backgrounds[image]} style={styles.previewImage} />
          </View>
          <View style={styles.slideTextContainer}>
            <Text style={styles.slideTitle}>{title}</Text>
            <Text style={styles.mainText}>{text}</Text>
          </View>
        </View>
      )
    })
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <Swiper
          activeDot={<View style={{ backgroundColor: 'rgb(222,71,71)', width: height * 0.0156, height: height * 0.0156, borderRadius: 100, marginLeft: 3, marginRight: 3 }} />}
          autoplay
          autoplayTimeout={3.5}
          dot={<View style={{ backgroundColor: 'rgb(248, 226, 226)', width: height * 0.0156, height: height * 0.0156, borderRadius: 100, marginLeft: 3, marginRight: 3 }} />}
          paginationStyle={{ position: 'absolute', top: -metrics.screenHeight * 0.75 }}
          style={{}}
        >
          {this.renderSlides()}
        </Swiper>
        <View style={styles.footer}>
          <Button
            containerStyle={styles.startButton}
            title='START'
            onPress={this.handleStartPress}
          />
          <Text style={styles.mainText}>
            Already have an account?
            <Text
              style={styles.signInButtonText}
              onPress={this.handleSignInPress}
            > Sign in
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    )
  }
}

Intro.propTypes = {
  navigation: PropTypes.object
}

const height = Dimensions.get('window').height // full height

function mapStateToProps (state) {
  return {

  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Intro)
