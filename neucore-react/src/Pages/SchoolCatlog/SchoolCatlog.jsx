import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import AcademicYear from "./AcademicYear/AcademicYear.jsx";
import Standard from "./Standard/Standard.jsx";
import Division from "./Division/Division.jsx";
// import Subcategory from "./Subcategory.jsx";
export default class Catlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
    };
  }

  handleRefresh = (status) => {
    this.setState({ isRefresh: status });
  };
  render() {
    const { isRefresh } = this.state;
    return (
      <div>
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="sub-tab-style "
          // style={{ background: "#fff" }}
        >
          <Tab eventKey="home" title="AcademicYear">
            <AcademicYear
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab eventKey="profile" title="Standard">
            <Standard
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab eventKey="Division" title="Division">
            <Division
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
