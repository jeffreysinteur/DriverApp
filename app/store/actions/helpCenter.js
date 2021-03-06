export const SELECT_PHOTO = 'helpCenter/SELECT_PHOTO'
export const selectPhoto = (payload) => {
  return {
    type: SELECT_PHOTO,
    payload
  }
}

export const UNSELECT_PHOTO = 'helpCenter/UNSELECT_PHOTO'
export const unselectPhoto = () => {
  return {
    type: UNSELECT_PHOTO
  }
}

export const SAVE_PHOTO = 'helpCenter/SAVE_PHOTO'
export const savePhoto = (payload) => {
  return {
    type: SAVE_PHOTO,
    payload
  }
}

export const RESET_PHOTOS = 'helpCenter/RESET_PHOTOS'
export const resetPhotos = (type) => {
  return {
    type: RESET_PHOTOS,
    payload: {
      type
    }
  }
}

export const RESET_RIDE_CANCEL_ERROR = 'bookings/RESET_RIDE_CANCEL_ERROR'
export const resetRideCancelError = () => {
  return {
    type: RESET_RIDE_CANCEL_ERROR
  }
}
