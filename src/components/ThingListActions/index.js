import _ from 'lodash'
import pluralize from 'pluralize'
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Button from 'zooid-button'
import Input from 'zooid-input'

import styles from './styles.css'

const propTypes = {
  onClearSelection: PropTypes.func,
  onDeleteSelection: PropTypes.func,
  onTagSelection: PropTypes.func,
  selectedThings: PropTypes.array,
}

const defaultProps = {
  selectedThings: [],
}

const ThingListActions = (props) => {
  const {
    onClearSelection,
    onDeleteSelection,
    onTagSelection,
    selectedThings,
  } = props

  if (_.isEmpty(selectedThings)) return null

  return (
    <div className={styles.root}>
      <div>{`${selectedThings.length} ${pluralize('items', selectedThings.length)} selected`}</div>
      <Button kind="no-style" onClick={onTagSelection}>Tag</Button>
      <Button kind="no-style" onClick={onDeleteSelection}>Delete</Button>
      <Button kind="no-style" onClick={onClearSelection}>Clear Selection</Button>
    </div>
  )
}

ThingListActions.propTypes    = propTypes
ThingListActions.defaultProps = defaultProps

export default ThingListActions
