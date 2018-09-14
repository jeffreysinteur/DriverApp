import { connect } from 'react-redux'
import { saveSignUpStepData } from 'store/actions/auth'
import SignUpStepOne from './SignUpStepOne'

const actions = {
  onSaveSignUpStepData: saveSignUpStepData
}

export default connect(
  null,
  actions
)(SignUpStepOne)
