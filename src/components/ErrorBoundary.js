/** 
*@tutorial https://reactjs.org/docs/error-boundaries.html
*/
import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
 constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }


      render() {
        if (this.state.errorInfo) {
          return (
            <div>
              <h1>Uh-oh there's an error</h1>
      			<main>
            		{this.state.hasError && this.state.hasError.toString()}
      			</main>
            </div>
          );
        }

        return this.props.children;
      }
    }