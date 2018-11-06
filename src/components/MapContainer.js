import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

class MapContainer extends Component {
  render() {
    const style = {
      width: "100%",
      height: "60vh"
    };
    const center = {
      lat: 33.60396,
      lng: -111.92579
    };

    return (
      <Map
        role="application"
        aria-label="map"
        onReady={this.loadMap}
        google={this.props.google}
        zoom={9}
        style={style}
        initialCenter={center}
      >

      </Map>
    );
  };
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBSf2q0a4Umr65w17nKsfLOl6L99Vj2DsQ"
})(MapContainer);
