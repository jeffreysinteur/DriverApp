export const SAVE_RECEIPT_PHOTO = 'SAVE_RECEIPT_PHOTO'
export const saveReceiptPhoto = (photoUri) => {
  return {
    type: SAVE_RECEIPT_PHOTO,
    payload: photoUri
  }
}

export const CLEAR_RECEIPT_PHOTO = 'CLEAR_RECEIPT_PHOTO'
export const clearReceiptPhoto = () => {
  return {
    type: CLEAR_RECEIPT_PHOTO
  }
}

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
