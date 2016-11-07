import _ from 'lodash'
import { createReducer } from 'redux-act'
import { searchActions } from 'redux-meshblu'

import { selectThing, unselectThing } from '../../actions/thing'
import {
  addThingsToGroup,
  removeThingsFromGroup,
  clearSelectedThings,
  deleteSelectedThings,
  deleteSelectedThingsSuccess,
  deleteSelectedThingsFailure,
  dismissDeleteDialog,
  showDeleteDialog,
} from '../../actions/things'


const { searchRequest, searchSuccess, searchFailure } = searchActions
const initialState = {
  deletingThings: false,
  devices: null,
  error: null,
  fetching: false,
  selectedGroups: [],
  selectedThings: [],
  showDeleteDialog: false,
}


const computeSelectedGroups = ({ devices, selectedThings }) => {
  return _(devices)
    .filter({ type: 'octoblu:group' })
    .filter(group => (_.difference(selectedThings, group.devices).length === 0))
    .map('uuid')
    .value()
}

export default createReducer({
  [addThingsToGroup]: (state, groupUuid) => {
    const updatedDevices = _.map(state.devices, (device) => {
      if (device.uuid !== groupUuid) return device
      return {
        ...device,
        devices: _.uniq([...device.devices, ...state.selectedThings]),
      }
    })

    return {
      ...state,
      devices: updatedDevices,
      selectedGroups: computeSelectedGroups({
        devices: updatedDevices,
        selectedThings: state.selectedThings,
      }),
    }
  },
  [removeThingsFromGroup]: (state, groupUuid) => {
    const updatedDevices = _.map(state.devices, (device) => {
      if (device.uuid !== groupUuid) return device
      return {
        ...device,
        devices: _.difference(device.devices, state.selectedThings),
      }
    })

    return {
      ...state,
      devices: updatedDevices,
      selectedGroups: computeSelectedGroups({
        devices: updatedDevices,
        selectedThings: state.selectedThings,
      }),
    }
  },
  [clearSelectedThings]: state => ({ ...state, selectedThings: [] }),
  [deleteSelectedThings]: state => ({ ...state, deletingThings: true }),
  [deleteSelectedThingsSuccess]: (state) => {
    const updatedDevices =  _.filter(state.devices, ({ uuid }) => {
      return (!_.includes(state.selectedThings, uuid))
    })

    return {
      ...state,
      deletingThings: false,
      devices: updatedDevices,
      selectedThings: [],
    }
  },
  [dismissDeleteDialog]: state => ({ ...state, showDeleteDialog: false }),
  [showDeleteDialog]: state => ({ ...state, showDeleteDialog: true }),
  [searchRequest]: () => ({ ...initialState, fetching: true }),
  [searchSuccess]: (state, devices) => {
    return {
      ...initialState,
      devices: _.reject(devices, { type: 'octoblu:group' }),
      fetching: false,
      selectedThings: [],
    }
  },
  [searchFailure]: (state, payload) => ({ ...initialState, error: payload, fetching: false }),
  [selectThing]: (state, payload) => {
    const { selectedThings } = state
    selectedThings.push(payload)
    return { ...state, selectedThings }
  },
  [unselectThing]: (state, payload) => {
    const filteredDevices = _.without(state.selectedThings, payload)
    return { ...state, selectedThings: filteredDevices }
  },
}, initialState)
