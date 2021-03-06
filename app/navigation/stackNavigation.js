import { createStackNavigator, createAppContainer } from 'react-navigation'

import React from 'react'
import CardStackStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator'
import { fromTop } from 'react-navigation-transitions'

import Intro from 'components/screens/Intro'
import Account from 'components/screens/SignUp/Account'
import PersonalInfo from 'components/screens/SignUp/PersonalInfo'
import Documentation from 'components/screens/SignUp/Documentation'
import DocumentsCamera from 'components/screens/SignUp//DocumentsCamera'
import RegisterReview from 'components/screens/SignUp/RegisterReview'
import PicturePreview from 'components/screens/SignUp/PicturePreview'
import PictureGallery from 'components/screens/SignUp/PictureGallery'
import TermsConditions from 'components/screens/TermsConditions'
import DriverTerms from 'components/screens/SignUp/DriverTerms'
import SignIn from 'components/screens/SignIn'
import ResetPassword from 'components/screens/ResetPassword'

import { NavBackImage } from 'components/ui'
// New Bookings
import BookingConfirmed from 'components/screens/NewBooking/BookingConfirmed'
import NewBooking from 'components/screens/NewBooking/Filters'
import PickupLocation from 'components/screens/NewBooking/PickupLocation'
import NewBookingDetails from 'components/screens/NewBooking/NewBookingDetails'
import AvailableBookings from 'components/screens/NewBooking/AvailableBookings'
import BookingCalendar from 'components/screens/NewBooking/BookingCalendar'
import VehicleOptions from 'components/screens/NewBooking/VehicleOptions'

import ChangePassword from 'components/screens/Profile/ChangePassword'
import ChangesReview from 'components/screens/Profile/ChangesReview'
import ProfileDetails from 'components/screens/Profile/ProfileDetails'
import ProfileMain from 'components/screens/Profile/ProfileMain'
import PrivacyPolicy from 'components/screens/Profile/PrivacyPolicy'
import ProfileCamera from 'components/screens/Profile/ProfileCamera'
import PhotoPreview from 'components/screens/Profile/PicturePreview'

import HelpCenter from 'components/screens/RideHelp/HelpCenter'
import RideMalfunction from 'components/screens/RideHelp/RideMalfunction'
import RideDamaged from 'components/screens/RideHelp/RideDamaged'
import RideAccident from 'components/screens/RideHelp/RideAccident'
import RideCancel from 'components/screens/RideHelp/RideCancel'
import RideLateDescription from 'components/screens/RideHelp/RideLateDescription'
import HelpPhotoPreview from 'components/screens/RideHelp/Camera/HelpPhotoPreview'
import HelpPhotoGallery from 'components/screens/RideHelp/Camera/HelpPhotoGallery'
import HelpCamera from 'components/screens/RideHelp/Camera/HelpCamera'

let navigationOptions = {
  headerStyle: {
    elevation: 0,
    borderBottomWidth: 0
  },
  headerBackImage: <NavBackImage />,
  headerTitleStyle: {
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
    fontWeight: 'normal',
    color: '#343A40'
  },
  headerLeftContainerStyle: {},
  headerRightContainerStyle: {
    paddingRight: 16
  }
}

const RegisterReviewStack = createStackNavigator({
  Review: {
    screen: RegisterReview,
    navigationOptions: {
      title: null,
      headerTitle: null,
      headerBackTitle: null,
      ...navigationOptions
    }
  }
})

export const AuthStack = createStackNavigator(
  {
    Intro: {
      screen: Intro,
      navigationOptions: {
        title: null,
        header: null
      }
    },
    Account: {
      screen: Account,
      navigationOptions: {
        title: 'Account',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions,
        headerLeftContainerStyle: {
          paddingLeft: 22
        }
      }
    },
    PersonalInfo: {
      screen: PersonalInfo,
      navigationOptions: {
        title: 'Personal Information',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    Documentation: {
      screen: Documentation,
      navigationOptions: {
        title: 'Documentation',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    DocumentsCamera: {
      screen: DocumentsCamera,
      navigationOptions: {
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    PicturePreview: {
      screen: PicturePreview,
      navigationOptions: {
        header: null
      }
    },
    PictureGallery: {
      screen: PictureGallery,
      navigationOptions: {
        header: null,
        title: 'Select photo',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    SignIn: {
      screen: SignIn,
      navigationOptions: {
        title: 'Sign In',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        title: 'Reset your password',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    TermsConditions: {
      screen: TermsConditions,
      navigationOptions: {
        title: 'Terms & conditions',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    DriverTerms: {
      screen: DriverTerms,
      navigationOptions: {
        title: 'Drivers Contract',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    RegisterReview: {
      screen: RegisterReviewStack,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'Intro',
    headerLayoutPreset: 'center',
    transitionConfig: (toTransitionProps, fromTransitionProps) => {
      return { screenInterpolator: CardStackStyleInterpolator.forHorizontal }
    }
  }
)

export const NewBookingStack = createStackNavigator(
  {
    BookingConfirmed: {
      screen: BookingConfirmed,
      navigationOptions: {
        title: null,
        header: null,
        headerTitle: null,
        headerBackTitle: null
      }
    },
    NewBookingDetails: {
      screen: NewBookingDetails,
      navigationOptions: {
        headerTitle: null,
        headerBackTitle: null,
        headerBackImage: <NavBackImage />,
        headerLeftContainerStyle: {
          paddingLeft: 0
        }
      }
    },
    NewBooking: {
      screen: NewBooking,
      navigationOptions: {
        title: 'New Booking',
        headerTitle: null,
        headerBackTitle: null,
        headerLeftContainerStyle: {
          paddingLeft: 10
        }
      }
    },
    PickupLocation: {
      screen: PickupLocation,
      navigationOptions: {
        title: 'Pickup Location',
        headerTitle: null,
        headerBackTitle: null,
        headerBackImage: null,
        headerLeft: null,
        headerRightContainerStyle: {
          paddingRight: 10
        }
      }
    },
    VehicleOptions: {
      screen: VehicleOptions,
      navigationOptions: {
        headerTitle: null,
        headerBackTitle: null,
        headerBackImage: <NavBackImage short />,
        headerLeftContainerStyle: {}
      }
    },
    AvailableBookings: {
      screen: AvailableBookings,
      navigationOptions: {
        title: 'Available cars',
        headerTitle: null,
        headerBackTitle: null,
        headerLeftContainerStyle: {
          paddingLeft: 0
        }
      }
    },
    BookingCalendar: {
      screen: BookingCalendar,
      navigationOptions: {
        title: null,
        headerTitle: null,
        headerBackTitle: null
      }
    }
  },
  {
    initialRouteName: 'NewBooking',
    headerLayoutPreset: 'center',
    navigationOptions: {
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0
      },
      headerTitleStyle: {
        fontSize: 16,
        fontFamily: 'SFProText-Regular',
        fontWeight: 'normal',
        color: '#343A40'
      },
      headerLeftContainerStyle: {
        paddingLeft: 16
      },
      headerRightContainerStyle: {
        paddingRight: 16
      }
    },
    transitionConfig: (toTransitionProps, fromTransitionProps) => {
      return { screenInterpolator: CardStackStyleInterpolator.forHorizontal }
    }
  }
)

export const ProfileStack = createStackNavigator(
  {
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        title: 'Change password',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    ChangesReview: {
      screen: ChangesReview,
      navigationOptions: {
        title: 'Approve changes',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    ProfileCamera: {
      screen: ProfileCamera,
      navigationOptions: {
        title: 'Profile photo',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    PicturePreview: {
      screen: PhotoPreview,
      navigationOptions: {
        header: null
      }
    },
    PictureGallery: {
      screen: PictureGallery,
      navigationOptions: {
        title: 'Select photo',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    ProfileDetails: {
      screen: ProfileDetails,
      navigationOptions: {
        title: 'Personal details',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    ProfileMain: {
      screen: ProfileMain,
      navigationOptions: {
        title: null,
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions,
        headerLeftContainerStyle: {
          paddingLeft: 22
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 0
        }
      }
    },
    TermsConditions: {
      screen: TermsConditions,
      navigationOptions: {
        title: 'Terms & conditions',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    PrivacyPolicy: {
      screen: PrivacyPolicy,
      navigationOptions: {
        title: 'Privacy policy',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    }
  },
  {
    initialRouteName: 'ProfileMain',
    headerLayoutPreset: 'center',
    transitionConfig: prop => {
      return { screenInterpolator: CardStackStyleInterpolator.forHorizontal }
    }
  }
)

export const HelpCenterStack = createStackNavigator(
  {
    HelpCenter: {
      screen: HelpCenter,
      navigationOptions: {
        title: 'Help Center',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions,
        headerLeftContainerStyle: {
          paddingLeft: 22
        }
      }
    },
    RideMalfunction: {
      screen: RideMalfunction,
      navigationOptions: {
        title: 'Car malfunctioned',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    RideDamaged: {
      screen: RideDamaged,
      navigationOptions: {
        title: 'Car damaged',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    RideAccident: {
      screen: RideAccident,
      navigationOptions: {
        title: 'I had an accident',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    RideCancel: {
      screen: RideCancel,
      navigationOptions: {
        title: 'Cancel booking',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions,
        headerLeftContainerStyle: {
          paddingLeft: 16
        }
      }
    },
    RideLateDescription: {
      screen: RideLateDescription,
      navigationOptions: {
        title: "I'm late",
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    HelpCamera: {
      screen: HelpCamera,
      navigationOptions: {
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    },
    HelpPhotoPreview: {
      screen: HelpPhotoPreview,
      navigationOptions: {
        header: null
      }
    },
    HelpPhotoGallery: {
      screen: HelpPhotoGallery,
      navigationOptions: {
        header: null,
        title: 'Select photo',
        headerTitle: null,
        headerBackTitle: null,
        ...navigationOptions
      }
    }
  },
  {
    initialRouteName: 'HelpCenter',
    headerLayoutPreset: 'center',
    transitionConfig: (toTransitionProps, fromTransitionProps) => {
      return { screenInterpolator: CardStackStyleInterpolator.forHorizontal }
    }
  }
)
