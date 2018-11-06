/**
 * @file 2018 Udacity Frontend Nanodegree Project 7 - Neighborhood Map
 * @author Crystal Yungwirth
 */
import React, { Component } from "react";
import { debounce } from "throttle-debounce";
import "./App.css";
import stops from "./data/locations.json";
import MapContainer from "./components/MapContainer";
import Itinerary from "./components/Itinerary";
import Attribution from "./components/Attribution";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stops
    };
    this.updateQuery = debounce(100, this.updateQuery);
  }

  /**
  * @description load map with markers
  */
  componentDidMount() {
    this.loadMap();
  };

  /**
   * @description destroy markers
   */
  componentWillUnmount() {
    this.state.markers.map(marker => marker.setMap(null));
    this.setState({marker: null});
  }
  /**
   * @description Display all stops when page is loaded
   * @param {string} query
   * @param {array} stops
   */
  loadMap() {
    this.setState({
      ...this.state,
      filteredStops: this.handleChange(this.state.stops, "")
    });
  }

  /**
   *@description set state for stops and clear query
   *@param {string} query
   */
  updateQuery = query => {
    this.setState({
      ...this.state,
      filteredStops: this.handleChange(this.state.stops, query)
    });
  };

  /**
   * @description Filter for search input & map markers
   * @param {string} query
   * @param {array} stops
   */
  handleChange = (stops, queried) => {
    return stops.filter(stop =>
      stop.name.toLowerCase().includes(queried.toLowerCase())
    );
  };

  /**
   * @description Handle state for clicking list item and assign index to use for comparing in Map.js
   * @param {number} index
   */
  handleClick = index => {
    this.setState({ clickedIndex: index });
  };

  render() {
    return (
      <>
        <h1 className="page-header">Grand Canyon Fun Day</h1>
        <Itinerary
          stops={this.state.filteredStops}
          handleChange={this.updateQuery}
          handleClick={this.handleClick}
        />
        <MapContainer
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          stops={this.state.filteredStops}
          clickedIndex={this.state.clickedIndex}
          handleClick={this.handleClick}
        />
        <Attribution />
      </>
    );
  };
}
