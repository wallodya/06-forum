import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './elements/header/Header'
import './style/layout.css'

export const Layout = () => {
  return (
    <div className='__page-wrap'>
        <div className='__page-header-wrap'>
            <Header id={1}/>
        </div>
        <div className='__page-content-wrap'>
            <div className='__page-content-center'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}
