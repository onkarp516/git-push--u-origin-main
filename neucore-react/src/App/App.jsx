import React, { Component } from "react";
import "@/assets/scss/App.scss";
import DynamicComponents from "@/App/DynamicComponents/DynamicComponents";

export default class App extends Component {
  render() {
    return (
      <div>
        <DynamicComponents />
      </div>
    );
  }
}
