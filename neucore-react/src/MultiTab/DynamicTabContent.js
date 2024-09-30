'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';

class DynamicTabContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textvalue: '',
    };
  }

  _handleTextChange(e) {
    this.setState({ textValue: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>TAB3!!! This tab dynamically change</h1>
        <h3>Welcome</h3>
        <textarea
          value={this.state ? this.state.textValue : ''}
          onChange={this._handleTextChange.bind(this)}
        ></textarea>
        <Button> New </Button>
      </div>
    );
  }
}

export default DynamicTabContent;
