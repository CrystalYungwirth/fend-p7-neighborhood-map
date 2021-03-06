import React, { Component } from "react";
import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";

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
  componentWillUnmount(props) {
    this.state.markers.map(marker => marker.setMap(null));
  }

  /**
   * @description update markers from user input (query and click)
   */
  //TODO: Transition to static getDerivedStateFromProps. I was getting a weird error that static couldn't be used.
  componentWillReceiveProps(props) {
    if (this.state.markers.length !== props.stops.length) {
      this.updateMarkers(props.stops);
      this.setState({ activeMarker: null, infoWindowVisible: false });

      return;
    }

    //TODO: Figure out a better lifecycle for this. I don't think it needs to be in static getDerivedStateFromProps, but it didn't fit in with
    //componentDidUpdate like I thought it should.
    if (
      props.clickedIndex === null ||
      typeof props.clickedIndex === "undefined"
    ) {
      return;
    }

    this.handleMarkerClick(
      this.state.markerInfo[props.clickedIndex],
      this.state.markers[props.clickedIndex]
    );
  }

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
    const clientId = process.env.FS_CLIENT_ID;
    const clientSecret = process.env.FS_CLIENT_SECRET;
    const hostName = "https://api.foursquare.com/v2/venues/";
    const version = "20181105";
    //search variables
    const searchPath = "search?";
    const searchUrl = new URL(searchPath, hostName);
    // const param = {
    //   v: "20181104",
    //   ll: `${props.position.lat},${props.position.lng}`
    // };
    // let searchParam = new URLSearchParams(param);
    let url = `${searchUrl}client_id=${clientId}&client_secret=${clientSecret}&v=${version}&radius=100&ll=${
      props.position.lat
    },${props.position.lng}&llAcc=100`;
    let headers = new Headers();
    let request = new Request(url, {
      method: "GET",
      headers
    });

    let fsInfo;
    fetch(request)
      .then(response => response.json())
      .then(data => {
        let venues = data.response.venues.filter(
          item =>
            item.name.includes(props.name) || props.name.includes(item.name)
        );
        fsInfo = {
          ...props,
          foursquare: venues[0]
        };

        if (fsInfo.foursquare) {
          let url = `${hostName}/${
            venues[0].id
          }/photos?client_id=${clientId}&client_secret=${clientSecret}&v=${version}`;
          fetch(url)
            .then(response => response.json())
            .then(data => {
              fsInfo = {
                ...fsInfo,
                images: data.response.photos
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
    marker.getAnimation() !== null
      ? marker.setAnimation(null)
      : marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
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
    console.log(activeInfo);
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
          <>
            <h3>{activeInfo && activeInfo.name}</h3>
            <address>
              {activeInfo && activeInfo.foursquare.location.address}
              <br />
              {activeInfo && activeInfo.foursquare.location.city},{" "}
              {activeInfo && activeInfo.foursquare.location.postalCode}
            </address>
            <br />
            {activeInfo && activeInfo.images ? (
              <React.Fragment>
                <img
                  className="foursquare-location-image"
                  alt={activeInfo && activeInfo.name}
                  src={
                    activeInfo &&
                    activeInfo.images.items[0].prefix +
                      "100x100" +
                      activeInfo.images.items[0].suffix
                  }
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span>Photo not available at this time</span>
              </React.Fragment>
            )}
          </>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY
})(MapContainer);
