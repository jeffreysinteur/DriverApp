import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectPhoto, resetPhotos, savePhoto } from 'store/actions/helpCenter'
import { lateForRide } from 'store/actions/bookings'
import {
  getRideLatePhotos,
  getSelectedRide,
  getRideHelpRequestStatus,
  getRideHelpRequestError,
  getLateNotificationData
} from 'store/selectors'
import RideLateDescription from './RideLateDescription'

const selector = createStructuredSelector({
  photos: getRideLatePhotos,
  ride: getSelectedRide,
  error: getRideHelpRequestError,
  requestPending: getRideHelpRequestStatus,
  notification: getLateNotificationData
})

const actions = {
  onSubmitReport: lateForRide,
  onSelectPhoto: selectPhoto,
  onResetPhotos: resetPhotos,
  onSavePhoto: savePhoto
}

export default connect(
  selector,
  actions
)(RideLateDescription)
