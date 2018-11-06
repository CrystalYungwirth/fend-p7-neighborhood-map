import React, { Component } from "react";
import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import Photo from "./Photo";

class MapContainer extends Component {
  state = {
    markers: [],
    infoWindowVisible: false
  };

  /**
   * @description load map with markers
   */
  componentDidMount() {
    this.loadMap();
	
  }

  /**
   * @description destroy markers
   */
  componentWillUnmount() {
    this.state.markers.map(marker => marker.setMap(null));
    this.setState({ marker: null });
    this.setState({ activeMarker: null });
  }

  /**
   * @description update markers from user input (query and click)
   */
  componentWillReceiveProps = props => {
    if (this.state.markers.length !== props.stops.length) {
      this.updateMarkers(props.stops);
      return;
    }

    this.handleMarkerClick(
      this.state.markerInfo[props.clickedIndex],
      this.state.markers[props.clickedIndex]
    );
  };

  /**
   * @description load map and markers
   */
  loadMap = (props, map) => {
    this.setState({ map });
    this.updateMarkers(this.props.stops);
  };

  /**
   * @description fetch Foursquare info when marker is clicked and assign to arrays for comparison and info window
   * @todo DRY & DOT
   */
  handleMarkerClick = (props, marker) => {
    //reusable variables
    const clientId = "WQ32QLRKJ3A5DNLFNXW50GFNR0S50YY2XN4EBFDYIJYLGSRO";
    const clientSecret = "1NL3XI1IJVLFAE4MSXBYJ54TPEWDIK0JZ5LNIGMUFSCSORIO";
    const hostName = "https://api.foursquare.com/v2/venues/";
    const version = "20181105";

    //search variables
    const searchPath = "search?";
    const searchUrl = new URL(searchPath, hostName);
    const param = {
      v: "20181104",
      ll: `${props.position.lat},${props.position.lng}`
    };
    let searchParam = new URLSearchParams(param);
    let url = `${searchUrl}client_id=${clientId}&client_secret=${clientSecret}&${searchParam}`;
    let searchRequest = new Request(url, {
      method: "GET"
    });

    let fsInfo;
    fetch(searchRequest)
      .then(response => response.json())
      .then(data => {
        let destination = data.response.venues;
        fsInfo = {
          ...props,
          foursquare: destination[0]
        };

        if (fsInfo.foursquare) {
          let photoUrl = `${hostName}${
            destination[0].id
          }/photos?client_id=${clientId}&client_secret=${clientSecret}&v=${version}`;
          fetch(photoUrl)
            .then(response => response.json())
            .then(data => {
              fsInfo = {
                ...fsInfo,
                photos: data.response.photos
              };

              if (this.state.activeMarker)
                this.state.activeMarker.setAnimation(null);
              this.updateMarkerInfo(marker, fsInfo);
            });
        } else {
          this.updateMarkerInfo(marker, fsInfo);
        }
      })
      .catch(error => alert(error));
  };

  /**
   *@description update marker state
   */
  updateMarkerInfo = (marker, fsInfo) => {
	this.toggleBounce(marker);
    this.setState({
      infoWindowVisible: true,
      activeMarker: marker,
      fsInfo
    });
  };

  /**
   *@description activeMarker toggle bounce
   */
  toggleBounce(marker, props) {
    (marker.getAnimation() !== null) 
      ? marker.setAnimation(null) 
      : marker.setAnimation(this.props.google.maps.Animation.BOUNCE)
  }

  /**
   *@description reset marker & infowindow when not in focus
   */
  disableActive = () => {
    this.state.activeMarker && this.state.activeMarker.setAnimation(null);
    this.setState({
      infoWindowVisible: false,
      activeMarker: null,
      fsInfo: null
    });
  };

  /**
   *@description add and remove markers based on query
   *@tutorial Based on Doug Brown webinar
   */
  updateMarkers = stops => {
    this.state.markers.forEach(marker => marker.setMap(null));

    let markerInfo = [];
    let markers = stops.map((location, index) => {
      let info = {
        key: index,
        index,
        name: location.name,
        position: location.position
      };
      markerInfo.push(info);
      this.setState({ markerInfo });

      let marker = new this.props.google.maps.Marker({
        position: location.position,
        map: this.state.map,
        animation: this.props.google.maps.Animation.DROP
      });
      marker.addListener("click", () => {
        this.handleMarkerClick(info, marker, null);
      });
      return marker;
    });
    this.setState({ markers });
  };

  render() {
    const style = {
      width: "100%",
      height: "60vh"
    };
    const center = {
      lat: 33.60396,
      lng: -111.92579
    };
    let activeInfo = this.state.fsInfo;

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
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.infoWindowVisible}
          onClose={this.disableActive}
        >
          <div>
            <h3>{activeInfo && activeInfo.name}</h3>

            {activeInfo && activeInfo.images ? (
              <React.Fragment>
                <Photo key={activeInfo.id} activeInfo={activeInfo} />
              </React.Fragment>
            ) : (
              <span>Photo not available at this time</span>
            )}
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDdaqZyf_ta1bZMQ4t7ihC09OgrAREotv8"
})(MapContainer);
