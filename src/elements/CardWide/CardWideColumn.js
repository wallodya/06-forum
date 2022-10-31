import React from 'react'

export const CardWideColumn = props => {
  return (
    <div className='container-flex-column card-round margin-top-m full-width'>
        <h2 className='ff-heading fs-l fw-bold text-gradient full-width'>{props.header}</h2>
        {props.children}
    </div>
  )
}
