import React, { Component } from "react";

export default class Page2 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { prop_data } = this.props.block;
    return (
      <div>
        {JSON.stringify(prop_data)}
        Page2
      </div>
    );
  }
}
