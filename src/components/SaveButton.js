import React from 'react'
import { Icon } from 'semantic-ui-react';

const SaveButton = ({ onSubmit, name, onChangeStatus }) => {
  return (
    <div className={name}>
      <Icon name="save outline" size="big"  onClick={onSubmit} />
      <Icon name="undo" size="large" onClick={onChangeStatus} />
    </div>

  )
}

export default SaveButton
