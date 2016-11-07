import { expect } from 'chai'
import _ from 'lodash'
import { searchActions } from 'redux-meshblu'

import { selectThing, unselectThing } from '../../actions/thing'
import {
  addThingsToGroup,
  removeThingsFromGroup,
  clearSelectedThings,
  deleteSelectedThings,
  deleteSelectedThingsSuccess,
} from '../../actions/things'

import reducer from './'

describe('Things Reducer', () => {
  const initialState = {
    deletingThings: false,
    devices: null,
    error: null,
    fetching: false,
    selectedGroups: [],
    selectedThings: [],
    showDeleteDialog: false,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  describe('fetchThings', () => {
    it('should handle fetching request', () => {
      expect(
        reducer(undefined, { type: searchActions.searchRequest.getType() })
      ).to.deep.equal({ ...initialState, fetching: true })
    })

    it('should handle fetching success', () => {
      const devices = [
        { uuid: 'my-thing-1-uuid' },
        { uuid: 'my-thing-2-uuid' },
        { uuid: 'my-thing-3-uuid' },
        { uuid: 'my-thing-4-uuid' },
        {
          uuid: 'my-app-1-uuid',
          type: 'octoblu:group',
          devices: [],
        },
        {
          uuid: 'my-app-2-uuid',
          type: 'octoblu:group',
          devices: [],
        },
      ]

      expect(reducer(undefined, {
        type: searchActions.searchSuccess.getType(),
        payload: devices,
      })).to.deep.equal({
        ...initialState,
        devices: _.reject(devices, { type: 'octoblu:group' }),
      })
    })

    it('should handle fetching failure', () => {
      expect(reducer(undefined, {
        type: searchActions.searchFailure.getType(),
        payload: new Error('Bang!'),
      })).to.deep.equal({ ...initialState, error: new Error('Bang!') })
    })
  })

  describe('selectThing', () => {
    it('should handle selectThing action', () => {
      expect(
        reducer(undefined, {
          type: selectThing.getType(),
          payload: 'my-selected-thing-uuid',
        })
      ).to.deep.equal({
        ...initialState,
        selectedThings: ['my-selected-thing-uuid'],
      })
    })
  })

  describe('unselectThing', () => {
    it('should handle unselecting a thing', () => {
      const currentState = {
        ...initialState,
        selectedThings: [
          'thing-uuid-1',
          'thing-uuid-2',
          'thing-uuid-3',
        ],
      }

      const expectedState = {
        ...currentState,
        selectedThings: [
          'thing-uuid-1',
          'thing-uuid-3',
        ],
      }

      expect(
        reducer(currentState, {
          type: unselectThing.getType(),
          payload: 'thing-uuid-2',
        })
      ).to.deep.equal(expectedState)
    })
  })

  describe('clearSelectedThings', () => {
    it('should handle clearSelectedThings action', () => {
      const state = {
        ...initialState,
        selectedThings: [
          'thing-uuid-1',
          'thing-uuid-2',
          'thing-uuid-3',
        ],
      }

      expect(
        reducer(state, { type: clearSelectedThings.getType() })
      ).to.deep.equal(initialState)
    })
  })

  describe('deleteThings', () => {
    it('should handle deleteThings action', () => {
      const currentState = {
        ...initialState,
        devices: [
          { uuid: 'thing-1-uuid' },
          { uuid: 'thing-2-uuid' },
          { uuid: 'thing-3-uuid' },
        ],
        selectedThings: [
          'thing-1-uuid',
          'thing-3-uuid',
        ],
        deletingThings: false,
      }

      const expectedState = {
        ...currentState,
        deletingThings: true,
      }

      expect(
        reducer(currentState, {
          type: deleteSelectedThings.getType(),
        })
      ).to.deep.equal(expectedState)
    })

    it('should handle deleteThingsSuccess action', () => {
      const currentState = {
        ...initialState,
        devices: [
          { uuid: 'thing-1-uuid' },
          { uuid: 'thing-2-uuid' },
          { uuid: 'thing-3-uuid' },
        ],
        selectedThings: [
          'thing-1-uuid',
          'thing-3-uuid',
        ],
        deletingThings: true,
      }

      const expectedState = {
        ...currentState,
        devices: [
          { uuid: 'thing-2-uuid' },
        ],
        selectedThings: [],
        deletingThings: false,
      }

      expect(
        reducer(currentState, {
          type: deleteSelectedThingsSuccess.getType(),
        })
      ).to.deep.equal(expectedState)
    })
  })

  describe('addThingsToGroup', () => {
    it('should handle addThingsToGroup action', () => {
      const state = {
        ...initialState,
        devices: [
          { uuid: 'thing-uuid-1' },
          { uuid: 'thing-uuid-2' },
          { uuid: 'thing-uuid-3' },
          {
            uuid: 'app-uuid-1',
            type: 'octoblu:group',
            devices: [
              'thing-uuid-2',
            ],
          },
        ],
        selectedThings: [
          'thing-uuid-1',
          'thing-uuid-3',
        ],
        selectedGroups: [],
      }

      const expectedState = {
        ...state,
        devices: [
          { uuid: 'thing-uuid-1' },
          { uuid: 'thing-uuid-2' },
          { uuid: 'thing-uuid-3' },
          {
            uuid: 'app-uuid-1',
            type: 'octoblu:group',
            devices: [
              'thing-uuid-2',
              'thing-uuid-1',
              'thing-uuid-3',
            ],
          },
        ],
        selectedGroups: ['app-uuid-1'],
      }

      expect(
        reducer(state, {
          type: addThingsToGroup.getType(),
          payload: 'app-uuid-1',
        })
      ).to.deep.equal(expectedState)
    })
  })

  describe('removeThingsFromGroup', () => {
    it('should handle removeThingsFromGroup action', () => {
      const state = {
        ...initialState,
        devices: [
          { uuid: 'thing-uuid-1' },
          { uuid: 'thing-uuid-2' },
          { uuid: 'thing-uuid-3' },
          {
            uuid: 'app-uuid-1',
            type: 'octoblu:group',
            devices: [
              'thing-uuid-2',
              'thing-uuid-1',
              'thing-uuid-3',
            ],
          },
        ],
        selectedThings: [
          'thing-uuid-1',
          'thing-uuid-3',
        ],
      }

      const expectedState = {
        ...state,
        devices: [
          { uuid: 'thing-uuid-1' },
          { uuid: 'thing-uuid-2' },
          { uuid: 'thing-uuid-3' },
          {
            uuid: 'app-uuid-1',
            type: 'octoblu:group',
            devices: [
              'thing-uuid-2',
            ],
          },
        ],
      }

      expect(
        reducer(state, {
          type: removeThingsFromGroup.getType(),
          payload: 'app-uuid-1',
        })
      ).to.deep.equal(expectedState)
    })
  })
})
