import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'
const Tab = ({tab, isFilterTab, isActiveTab, handleClick}) => {

  const snap = useSnapshot(state);

  const activeStyles = isFilterTab && isActiveTab ? {backgroundColor: snap.color, opacity: 0.5} : {backgroundColor: "glassmorphism", opacity: 1};


  return (
    <div
      key={tab.name}
      className={`tab-btn ${isFilterTab ? 'rounded-full glassmorphism' : 'rounded-4'} `}
      onClick={handleClick}
      style={activeStyles}
    >
    <img src={tab.icon} alt={tab.name} className={`${isFilterTab ? 'w-5/6 h-5/6' : 'w-11/12 h-11/12'}`}/>  
    </div>
  )
}

export default Tab