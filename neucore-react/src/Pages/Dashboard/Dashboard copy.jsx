import React, { Component } from "react";
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Table,
  Card,
} from "react-bootstrap";
import { authenticationService } from "@/services/api_functions";
import { isParentExist } from "@/helpers";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import std_registered_icon from "@/assets/images/dashboard/registered_students.png";
import our_branches_icon from "@/assets/images/dashboard/our_branches.png";
import average_passing_rate_icon from "@/assets/images/dashboard/average_passing_rate.png";
import total_divisions_icon from "@/assets/images/dashboard/total_divisions.png";
import notification_icon_icon from "@/assets/images/dashboard/notification_icon.png";
export default class Dashboard extends Component {
  render() {
    // console.log(JSON.parse(authenticationService.currentUserValue.permission));
    return (
      <div>
        <div className="row-style ">
          <Container>
            <Row>
              <Col lg={3} md="6" sm={6} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#ffefe3" }}
                  >
                    <Card.Title className="titlehead cardfont">
                      Registered Students
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="card1-bg-img">
                    <img src={std_registered_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      12,658
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md="6" sm={6} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#eefcf4" }}
                  >
                    <Card.Title className="titlehead cardfont">
                      Our Branches
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="card2-bg-img">
                    <img src={our_branches_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      5
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md="6" sm={6} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#e4f2f9" }}
                  >
                    <Card.Title className="titlehead cardfont">
                      Average Passign Rate
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="card3-bg-img">
                    <img src={average_passing_rate_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      98%
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md="6" sm={6} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#fffbed" }}
                  >
                    <Card.Title className="titlehead cardfont">
                      Total Divisions
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="card4-bg-img">
                    <img src={total_divisions_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      50+
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* <Col md="3" sm={3} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#ffefe3" }}
                  >
                    <Card.Title className="titlehead">
                      Registered Students
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <img src={std_registered_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      12,658
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3" sm={3} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#eefcf4" }}
                  >
                    <Card.Title className="titlehead">Our Branches</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <img src={our_branches_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      5
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3" sm={3} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#e4f2f9" }}
                  >
                    <Card.Title className="titlehead">
                      Average Passign Rate
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <img src={average_passing_rate_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      98%
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3" sm={3} xs={12} className="form-style">
                <Card className="text-center">
                  <Card.Header
                    className="card-hade"
                    style={{ background: "#fffbed" }}
                  >
                    <Card.Title className="titlehead">
                      Total Divisions
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <img src={total_divisions_icon} alt=""></img>
                    <Card.Text className="card-text-style text-center">
                      50+
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col> */}
            </Row>
            <Row className="">
              <Col md="12" sm={12} xs={12} className="form-style">
                <Table responsive="sm" bordered className="table-height">
                  <thead>
                    <tr>
                      <th colSpan={2}>
                        <p className="m-0">Recent Updates</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "transparent" }}>
                    <tr>
                      <td>
                        <p className="m-0">
                          <img
                            src={notification_icon_icon}
                            alt=""
                            className="tableimg"
                          ></img>
                          Student - <b>Ravindra Meghnath Surve</b>, Standard -
                          5, Div - A, Fees paid <i className="fa fa-inr"></i>
                          22,000 for year 2021-22 <br />
                          <p className="m-0" style={{ marginLeft: "10px" }}>
                            {/* {moment(date).format("DD-MM-YYYY")} */}
                            13-04-2022
                          </p>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="m-0">
                          <img
                            src={notification_icon_icon}
                            alt=""
                            className="tableimg"
                          ></img>
                          Student - <b>Ravindra Meghnath Surve</b>, Standard -
                          5, Div - A, Fees paid <i className="fa fa-inr"></i>
                          22,000 for year 2021-22 <br />
                          <p className="m-0" style={{ marginLeft: "10px" }}>
                            {/* {moment(date).format("DD-MM-YYYY")}*/}
                            13-04-2022
                          </p>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="m-0">
                          <img
                            src={notification_icon_icon}
                            alt=""
                            className="tableimg"
                          ></img>
                          Student - <b>Ravindra Meghnath Surve</b>, Standard -
                          5, Div - A, Fees paid <i className="fa fa-inr"></i>
                          22,000 for year 2021-22 <br />
                          <p className="m-0" style={{ marginLeft: "10px" }}>
                            {/* {moment(date).format("DD-MM-YYYY")} */}
                            13-04-2022
                          </p>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="m-0">
                          <img
                            src={notification_icon_icon}
                            alt=""
                            className="tableimg"
                          ></img>
                          Student - <b>Ravindra Meghnath Surve</b>, Standard -
                          5, Div - A, Fees paid <i className="fa fa-inr"></i>
                          22,000 for year 2021-22 <br />
                          <p className="m-0" style={{ marginLeft: "10px" }}>
                            {/* {moment(date).format("DD-MM-YYYY")} */}
                            13-04-2022
                          </p>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="m-0">
                          <img
                            src={notification_icon_icon}
                            alt=""
                            className="tableimg"
                          ></img>
                          Student - <b>Ravindra Meghnath Surve</b>, Standard -
                          5, Div - A, Fees paid <i className="fa fa-inr"></i>
                          22,000 for year 2021-22 <br />
                          <p className="m-0" style={{ marginLeft: "10px" }}>
                            {/* {moment(date).format("DD-MM-YYYY")} */}
                            13-04-2022
                          </p>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <Button
                          variant="primary"
                          className="submitbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push({
                              pathname: "/dashboard",
                            });
                          }}
                        >
                          Show More
                          <img src={arrowicon} alt="" className="icons"></img>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                  {/* <thead>
                    <tr className="btm-thead ">
                      <Button
                        variant="primary"
                        className="submitbtn1"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.history.push({
                            pathname: "/dashboard",
                          });
                        }}
                      >
                        Show More
                        <img src={arrowicon} alt="" className="btsubmit"></img>
                      </Button>
                    </tr>
                  </thead> */}
                </Table>
              </Col>
              {/* <Col md={3} sm={3} xs={6} className="btm-button">
                <Button
                  variant="primary"
                  className="submitbtn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push({
                      pathname: "/dashboard",
                    });
                  }}
                >
                  Show More
                  <img src={arrowicon} alt="" className="btsubmit"></img>
                </Button>
              </Col> */}
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}
