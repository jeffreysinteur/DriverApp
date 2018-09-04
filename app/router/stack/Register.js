import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity, Platform,
  Dimensions
} from 'react-native';

import styles from '../../files/styles';

import { CardSection, Button, TextInputView } from '../../files/components';

import { StackActions, NavigationActions } from 'react-navigation';
import { TextField } from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';


class Register extends Component {

	constructor(props) {
		super(props);

		this.state = {
      email: '',
      password: '',
      confirmPassword: '',
		};
	}

	_navigateTo = (routeName) => {
		const resetAction = StackActions.reset({
		  index: 0,
		  actions: [NavigationActions.navigate({ routeName: routeName })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	componentDidMount() {

	}

	render() {
    let { email, password, confirmPassword } = this.state;
		return (
			<CardSection style={styles.register}>
        <CardSection style={styles.topNav}>
          <View style={[styles.dash, styles.dash__active]}></View>
          <View style={styles.dash}></View>
          <View style={styles.dash}></View>
        </CardSection>

        <CardSection style={styles.register__main}>
          <TextInputView
              ref='email'
              text="EMAIL"
              placeholder=''
          />
          <TextInputView
              ref='password'
              text="PASSWORD"
              placeholder=''
              secureTextEntry={true}
          />
          <TextInputView
              ref='email'
              text="CONFIRM PASSWORD"
              placeholder=''
              secureTextEntry={true}
          />
          <View style={{ flex: 1 }}/>
          <View style={ styles.register__BlockButton}>
            <CardSection style={ styles.preloaderBlock__Button} >
              <TouchableOpacity onPress={() => this._navigateTo('PersonalInfo')}>
                <Button>NEXT</Button>
              </TouchableOpacity>
            </CardSection>
          </View>
          <CardSection style={styles.register__account}>
            <Text style={styles.preloaderBlock__alreadyAcc}>Already have an account?</Text>
            <Text style={styles.preloaderBlock__signIn}>Sign in</Text>
          </CardSection>
        </CardSection>

      </CardSection>
		);
	}
}

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

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
  mapDispatchToProps,
)(Register);
