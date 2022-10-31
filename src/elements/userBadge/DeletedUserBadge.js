import React from "react"
import deleted_prof_pic from '../../lib/img/deleted_prof_pic.png'
import './user_badge.css'

export const DeletedUserBadge = ({user}) => {
    return (
      <div className='card-round-small container-flex-row full-width user-badge'>
          <img className='avatar-header' src={deleted_prof_pic} alt='username'/>
          <div className='container-flex-column badge-legend-container' style={{justifyContent: "center"}}>
              <p className='ff-body fs-s fw-regular text-primary-100'>
                  {user.login}
              </p>
          </div>
      </div>
    )
  }
  