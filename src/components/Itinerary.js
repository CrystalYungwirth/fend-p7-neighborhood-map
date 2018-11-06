import React, { Component } from "react";
import PropTypes from "prop-types";
import ComponentSlider from "@kapost/react-component-slider";
//// TODO: lookup fallback from myreads for when there's no results

class Itinerary extends Component {
  state = {
    query: ""
  };

    /**
     * @description run updateQuery if update
     */
    componentDidUpdate = prevProps => {
      if (this.props.value !== prevProps.value) {
        this.updateQuery();
      }
    };
    /**
     * @description run updateQuery if update
     */
    componentDidUpdate = prevProps => {
      if (this.props.value !== prevProps.value) {
        this.updateQuery();
      }
    };

    /**
     * @description bind user input to handleChange
     * @param {string} query
     */
     updateQuery = (newQuery) => {
         this.setState({ query: newQuery });
         this.props.handleChange(newQuery);
     }

    /**
     * @description update query value state
     * @param {string} query
     */
    handleChange = (event, query) => {
      this.setState({ query });
      this.updateQuery(event.target.value);
    };

  render() {
    return (
      <>
        <input
          className="search"
          placeholder="Filter stops"
          name="filter"
          onChange={this.handleChange}
          value={this.state.query}
        />
      <ComponentSlider>
        <ul className="stops">
          {this.props.stops &&
            this.props.stops.map((stop, index) => {
              return (
                <li key={stop.name}>
                  <button
                    className="info-card slider-content"
                    key={stop.id}
                    onClick={event => this.props.handleClick(index)}
                  >
                    {stop.name}
                  </button>
                </li>
              );
            })}
        </ul>
      </ComponentSlider>
      </>
    );
  }
}

Itinerary.propTypes = {
  query: PropTypes.string,
  stops: PropTypes.array
};
export default Itinerary;
