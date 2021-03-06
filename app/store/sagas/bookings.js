import { take, put, call, select, all, fork } from 'redux-saga/effects'
import { takeLatest } from 'helpers/saga'
import * as Api from 'helpers/api'
import { toImageFile } from 'helpers/image'
import { checkUserStatusWrapper } from './auth'
import {
    FETCH_USER_BOOKINGS,
    FETCH_AVAILABLE_CARS,
    FETCH_SELECTED_CAR,
    BOOK_CAR,
    CHECK_LICENSE,
    CANCEL_RIDE,
    END_RIDE,
    SEND_LATE_FOR_RIDE_DETAILS,
    SEND_LATE_FOR_RIDE_NOTIFICATION,
    SUBMIT_RECEIPT,
    HELP_RIDE_DAMAGED,
    HELP_RIDE_MALFUNCTIONED,
    START_RIDE
} from 'store/actions/bookings'
import { LOAD_CAR_CATEGORIES } from 'store/actions/newBooking'

function* fetchUserBookings(action) {
    let state = yield select()

    let { token } = state.auth

    try {
        const bookingsType = action.payload

        let payload = {}

        if (bookingsType === 'upcoming') {
            const [allUpcoming, oneTime, recurring] = yield all([
                Api.fetchUpcomingBookings(token, 'all'),
                Api.fetchUpcomingBookings(token, 'one-time'),
                Api.fetchUpcomingBookings(token, 'recurring')
            ])

            payload = {
                upcoming: {
                    all: allUpcoming.bookings,
                    oneTime: oneTime.bookings,
                    recurring: recurring.bookings
                }
            }
        } else {
            const history = yield Api.fetchBookingsHistory(token)

            payload = {
                history: history.bookings
            }
        }

        yield put({
            type: FETCH_USER_BOOKINGS.SUCCESS,
            payload
        })
    } catch (error) {
        console.log('fetchUserBookings error', error)

        yield put({
            type: FETCH_USER_BOOKINGS.FAILURE,
            payload: error.response.data.message
        })
    }
}

function* fetchUserBookingsFlow() {
    yield takeLatest(
        FETCH_USER_BOOKINGS.REQUEST,
        checkUserStatusWrapper,
        fetchUserBookings
    )
}

function* fetchAvailableCars(action) {
    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.fetchAvailableCars, action.payload, token)

        yield put({ type: FETCH_AVAILABLE_CARS.SUCCESS, payload: response })
    } catch (error) {
        console.log('fetchAvailableCars error', error)

        yield put({
            type: FETCH_AVAILABLE_CARS.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* fetchAvailableCarsFlow() {
    yield takeLatest(
        FETCH_AVAILABLE_CARS.REQUEST,
        checkUserStatusWrapper,
        fetchAvailableCars
    )
}

function* fetchCarDetails({ payload: { id, body } }) {
    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.fetchCarDetails, { token, id, body })

        yield put({ type: FETCH_SELECTED_CAR.SUCCESS, payload: response })
    } catch (error) {
        console.log('fetchCarDetails error', error)

        yield put({
            type: FETCH_SELECTED_CAR.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* fetchCarDetailsFlow() {
    yield takeLatest(
        FETCH_SELECTED_CAR.REQUEST,
        checkUserStatusWrapper,
        fetchCarDetails
    )
}

function* bookCar({ payload }) {
    let { id, timeStamps } = payload

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.bookCar, { token, id, timeStamps })

        yield put({
            type: BOOK_CAR.SUCCESS,
            payload: { booking: response.booking }
        })
    } catch (error) {
        console.log('bookCar error', error)

        yield fork(fetchCarDetails, { payload: { id } })

        yield put({
            type: BOOK_CAR.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* bookCarFlow() {
    while (true) {
        let action = yield take(BOOK_CAR.REQUEST)

        yield fork(checkUserStatusWrapper, () => bookCar(action))
    }
}

function* checkRideLicense({ payload }) {
    const {
        carId: id,
        data: { carPhotos, gasTankPhotos, mileagePhotos, notes }
    } = payload // photoUri

    let rideEndPhotos = yield transformLicenses({
        carPhotos,
        gasTankPhotos,
        mileagePhotos
    })

    const query = {
        ...rideEndPhotos
    }

    if (notes) {
        query.notes = notes
    }

    const data = query // Api.toFormData(query)

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.checkRideLicense, { id, data, token })

        yield put({ type: CHECK_LICENSE.SUCCESS, payload: response })
    } catch (error) {
        console.log('checkRideLicense error', error)

        yield put({
            type: CHECK_LICENSE.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* checkRideLicenseFlow() {
    yield takeLatest(
        CHECK_LICENSE.REQUEST,
        checkUserStatusWrapper,
        checkRideLicense
    )
}

function* rideCancel({ payload }) {
    const { carId: id } = payload

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.cancelRide, { id, token })

        yield put({ type: CANCEL_RIDE.SUCCESS, payload: response })
    } catch (error) {
        console.log('rideCancel error', error)

        yield put({
            type: CANCEL_RIDE.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

async function transformLicenses({ carPhotos, gasTankPhotos, mileagePhotos }) {
    let compressed = {}
    compressed['car_front_photo'] = await toImageFile(carPhotos[0])
    compressed['car_back_photo'] = await toImageFile(carPhotos[1])
    compressed['car_right_photo'] = await toImageFile(carPhotos[2])
    compressed['car_left_photo'] = await toImageFile(carPhotos[3])
    compressed['gas_tank_photo'] = await toImageFile(gasTankPhotos[0])
    compressed['mileage_photo'] = await toImageFile(mileagePhotos[0])

    return compressed
}

function* rideStartFlow() {
    yield takeLatest(START_RIDE.REQUEST, checkUserStatusWrapper, rideStart)
}

function* rideStart() {
    const {
        carId: id,
        data: { carPhotos, gasTankPhotos, mileagePhotos, notes }
    } = payload

    let state = yield select()

    let { token } = state.auth

    try {
        let rideEndPhotos = yield transformLicenses({
            carPhotos,
            gasTankPhotos,
            mileagePhotos
        })

        let query = {
            ...rideEndPhotos
        }

        if (notes) {
            query.notes = notes
        }

        let data = Api.toFormData(query)

        let response = yield call(Api.endRide, { id, data, token })

        yield put({ type: START_RIDE.SUCCESS, payload: {} })
    } catch (error) {
        console.log('rideStart error', error)

        yield put({
            type: END_RIDE.FAILURE,
            payload: error.response.data.error.message
        })
    }
}

function* rideCancelFlow() {
    yield takeLatest(CANCEL_RIDE.REQUEST, checkUserStatusWrapper, rideCancel)
}

function* rideEnd({ payload }) {
    const {
        carId: id,
        data: { carPhotos, gasTankPhotos, mileagePhotos, notes }
    } = payload

    let state = yield select()

    let { token } = state.auth

    try {
        let rideEndPhotos = yield transformLicenses({
            carPhotos,
            gasTankPhotos,
            mileagePhotos
        })

        let query = {
            ...rideEndPhotos
        }

        if (notes) {
            query.notes = notes
        }

        let data = Api.toFormData(query)

        let response = yield call(Api.endRide, { id, data, token })

        yield put({ type: END_RIDE.SUCCESS, payload: response })
    } catch (error) {
        console.log('rideEnd error', error)

        yield put({
            type: END_RIDE.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* rideEndFlow() {
    yield takeLatest(END_RIDE.REQUEST, checkUserStatusWrapper, rideEnd)
}

function* rideDamaged({ payload }) {
    const {
        carId: id,
        data: { photos, description }
    } = payload

    let data = new FormData()
    data.append('description', description)

    if ( photos?.length > 0) {
        let transformedPhotos = yield transformPhotoArray(photos)
        transformedPhotos.forEach( photo=>data.append('car_photos[]', photo ) )
    }

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.rideDamaged, { id, token, data })

        yield put({ type: HELP_RIDE_DAMAGED.SUCCESS, payload: response })
    } catch (error) {
        // console.log('rideDamaged error', error)

        yield put({
            type: HELP_RIDE_DAMAGED.FAILURE,
            payload:
            (error.response && error.response
                ? error.response.data.error.message
                : error.message) || ''
        })
    }
}

function* rideDamagedFlow() {
    yield takeLatest(
        HELP_RIDE_DAMAGED.REQUEST,
        checkUserStatusWrapper,
        rideDamaged
    )
}

function* rideMalfunction({ payload }) {
    const {
        carId: id,
        data: { photos, description, plate }
    } = payload

    let data = new FormData()
    data.append('description', description)
    data.append('license_plate', plate)
    if (photos?.length > 0) {
        let transformedPhotos = yield transformPhotoArray(photos)
        transformedPhotos.forEach( photo=>data.append('car_photos[]', photo ) )
    }

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.rideMalfunction, { id, token, data })

        yield put({ type: HELP_RIDE_MALFUNCTIONED.SUCCESS, payload: response })
    } catch (error) {
        console.log('rideMalfunction error', error)

        yield put({
            type: HELP_RIDE_MALFUNCTIONED.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* rideMalfunctionFlow() {
    yield takeLatest(
        HELP_RIDE_MALFUNCTIONED.REQUEST,
        checkUserStatusWrapper,
        rideMalfunction
    )
}

function* sendRideLateNotification({ payload }) {
    const { carId: id } = payload

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.rideLateNotification, { id, token })

        yield put({
            type: SEND_LATE_FOR_RIDE_NOTIFICATION.SUCCESS,
            payload: response
        })
    } catch (error) {
        console.log('sendRideLateNotification error', error)

        yield put({
            type: SEND_LATE_FOR_RIDE_NOTIFICATION.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* sendRideLateNotificationFlow() {
    yield takeLatest(
        SEND_LATE_FOR_RIDE_NOTIFICATION.REQUEST,
        checkUserStatusWrapper,
        sendRideLateNotification
    )
}

function* rideLate({ payload }) {
    const {
        carId: id,
        data: { photos, reason, delay },
        notificationId
    } = payload

    let query = { reason, delay_minutes: delay }

    if (photos.length > 0) {
        let transformedPhotos = yield transformPhotoArray(photos)

        query['photo'] = transformedPhotos[0]
    }

    let data = Api.toFormData(query)

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.rideLate, { id, token, data, notificationId })

        yield put({ type: SEND_LATE_FOR_RIDE_DETAILS.SUCCESS, payload: response })
    } catch (error) {
        console.log('rideLate error', error)

        yield put({
            type: SEND_LATE_FOR_RIDE_DETAILS.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* rideLateFlow() {
    yield takeLatest(
        SEND_LATE_FOR_RIDE_DETAILS.REQUEST,
        checkUserStatusWrapper,
        rideLate
    )
}

function* submitRideReceipt({ payload }) {
    const {
        carId: id,
        data: { location, title, price, date, time, photo }
    } = payload

    let imageFile = yield toImageFile(photo)

    let query = {
        location,
        title,
        price: +price,
        receipt_date: date,
        receipt_time: time,
        photo: imageFile
    }

    let data = Api.toFormData(query)

    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.sendRideReceipt, { id, token, data })

        yield put({ type: SUBMIT_RECEIPT.SUCCESS, payload: response })
    } catch (error) {
        console.log('submitRideReceipt error', error)

        yield put({
            type: SUBMIT_RECEIPT.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* submitRideReceiptFlow() {
    yield takeLatest(
        SUBMIT_RECEIPT.REQUEST,
        checkUserStatusWrapper,
        submitRideReceipt
    )
}

async function transformPhotoArray(photos) {
    let transformedPhotos = await Promise.all(
        photos.map(async photoUri => {
            let imageFile = await toImageFile(photoUri)

            return imageFile
        })
    )

    return transformedPhotos
}

function* fetchCarCategories() {
    let state = yield select()

    let { token } = state.auth

    try {
        let response = yield call(Api.fetchCarCategories, token)

        yield put({ type: LOAD_CAR_CATEGORIES.SUCCESS, payload: response })
    } catch (error) {
        console.log('fetchCarCategories error', error)

        yield put({
            type: LOAD_CAR_CATEGORIES.FAILURE,
            payload: error.response
                ? error.response.data.error.message
                : error.message
        })
    }
}

function* fetchNewBookingDataFlow() {
    yield takeLatest(LOAD_CAR_CATEGORIES.REQUEST, fetchCarCategories)
}

export default [
    fetchUserBookingsFlow,
    fetchAvailableCarsFlow,
    bookCarFlow,
    fetchCarDetailsFlow,
    checkRideLicenseFlow,
    rideCancelFlow,
    rideDamagedFlow,
    rideMalfunctionFlow,
    rideLateFlow,
    submitRideReceiptFlow,
    rideEndFlow,
    sendRideLateNotificationFlow,
    rideStartFlow,
    fetchNewBookingDataFlow
]