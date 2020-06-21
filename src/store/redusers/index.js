import { combineReducers } from 'redux'
import * as actionTypes from '../types'

const initialUserState = {
  currentUser: null,
  isLoading: true
}

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

const initialChannelState = {
  currentChannel: null
}

const channelReducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      }
    default:
      return state
  }
}

export default combineReducers({
  user: userReducer,
  channel: channelReducer
})
