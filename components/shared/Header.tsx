import React from 'react'

export const Header = ({title,subTitle}:{
    title:string,subTitle?:string
}) => {
  return (
    <>
    <h2 className="h2-bold text-black">{title}</h2>
    {subTitle && <p className=''>{subTitle}</p>}
   
    </>
  )
}
