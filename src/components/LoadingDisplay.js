import React from 'react'
import ReactLoading from 'react-loading';

export default function LoadingDisplay(props) {
  return (
    <div class='loading-div'>
      <p class='body-text loading-text'>loading the Ethureum gas price</p>
    <ReactLoading class='loading-graphic' type={props.type} color={props.color} height={10} width={100} />
    </div>
  )
}
