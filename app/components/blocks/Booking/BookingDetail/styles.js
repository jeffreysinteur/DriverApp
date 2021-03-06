import { StyleSheet } from 'react-native'
import { colors, metrics } from 'theme'

export default StyleSheet.create({
  // Car Image
  carPhoto: {
    backgroundColor: colors.gray100,
    alignSelf: 'stretch',
    height: 200,
    borderRadius: 5
  },
  // Booking Detail
  bookingDetail: {
    // marginBottom: 16
  },
  detailLabel: {
    fontSize: metrics.fontSize,
    fontFamily: 'SFProText-Regular',
    color: colors.gray100,
    marginBottom: 6
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'SFProText-Regular',
    color: colors.black
  },

  // Section Title
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'SFProText-Regular',
    color: colors.gray200
  }
})
