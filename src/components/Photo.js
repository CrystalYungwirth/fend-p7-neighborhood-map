import React, { PureComponent } from 'react'

export default class Photo extends PureComponent {
  render() {

    const activeInfo = this.props.activeInfo;
    return(
      <>
        <img
        alt={activeInfo.name}
        src={activeInfo.images.items[0].prefix + "100x100" + activeInfo.images.items[0].suffix}/>
      </>
    )
  }
}