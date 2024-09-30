import React, { Component } from "react";
import Chart from "react-apexcharts";
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
import teacher_icon from "@/assets/images/dashboard/teacher.png";
import all_add_icon from "@/assets/images/dashboard/all_add_icon.png";
import today_add_icon from "@/assets/images/dashboard/today_add_icon.png";
import total_fees_icon from "@/assets/images/dashboard/total_fees_icon.png";
import today_fees from "@/assets/images/dashboard/today_fees_icon.jpg";
import arrow from "@/assets/images/dashboard/ra_icon.png";
import our_branches_icon from "@/assets/images/dashboard/our_branches.png";
import average_passing_rate_icon from "@/assets/images/dashboard/average_passing_rate.png";
import total_divisions_icon from "@/assets/images/dashboard/total_divisions.png";
import notification_icon_icon from "@/assets/images/dashboard/notification_icon.png";
import {
  customStyles,
  isActionExist,
  getSelectValue,
  eventBus,
  MyNotifications,
  getHeader,
  numberWithCommasIN,
} from "@/helpers";
import { getDataForDashboard } from "@/services/api_functions";
import { number } from "yup";
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.transFormRef = React.createRef();
    this.state = {
      totalC: "",
      income: [],
      WeekCollection: [],
    };
  }
  getCollection = () => {
    getDataForDashboard()
      .then((response) => {
        if (response.data.responseStatus == 200) {
          let res = response.data;
          console.log("res", res);
          let d = res.responseObject;
          this.setState({
            totalC: res.responseObject,
            WeekCollection: res.WeekCollection,
            income: res.incomeexp,
          });
        }
      })
      .catch((error) => {
        console.log("errors", error);
      });
  };

  componentDidMount() {
    this.getCollection();
  }
  render() {
    const { totalC, WeekCollection, income } = this.state;
    // console.log(JSON.parse(authenticationService.currentUserValue.permission));
    return (
      <div className="mx-0">
        <div className="dashboard-style">
          <div className="Container-fluid">
            <Row className="mb-2 mx-0">
              <Col md={4}>
                <Card className="top_cards">
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Header style={{ background: "#e1fc88" }}>
                    TOTAL STUDENTS
                  </Card.Header>
                  <Card.Body style={{ marginTop: "10px" }}>
                    {/* <Card.Title></Card.Title> */}
                    <img
                      src={std_registered_icon}
                      alt="student"
                      className="stdRegisIconStyle"
                    />
                    <Card.Text>
                      <h1>
                        {totalC.registeredStudent != null
                          ? numberWithCommasIN(totalC.registeredStudent, false)
                          : 0}
                      </h1>
                    </Card.Text>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="top_cards">
                  {/* <Card.Img variant="to  p" src="holder.js/100px180" /> */}
                  <Card.Header style={{ background: "#88fcfb" }}>
                    TOTAL TEACHERS
                  </Card.Header>

                  <Card.Body style={{ marginTop: "10px" }}>
                    <img
                      src={teacher_icon}
                      alt="teacher"
                      className="TeacherIcon"
                    />
                    {/* <Card.Title>TOTAL TEACHERS</Card.Title> */}
                    <Card.Text>
                      <h1>1245</h1>
                    </Card.Text>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card style={{ height: "300px" }} className="top_cards">
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Header style={{ background: "#ebc867" }}>
                    ADMISSIONS
                  </Card.Header>
                  <Card.Body style={{ marginTop: "2px" }}>
                    {/* <Card.Title>TOTAL TEACHERS</Card.Title> */}
                    {/* <Card.Text>
                      1245
                    </Card.Text> */}
                    <div>
                      <Row>
                        <Col md={4}>
                          <Row>
                            <Col>
                              <h3>Total</h3>
                              <img
                                src={all_add_icon}
                                alt=""
                                className="addAll"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <h4>
                                {totalC.totalAdmission != null
                                  ? numberWithCommasIN(
                                    totalC.totalAdmission,
                                    false,
                                    2
                                  )
                                  : 0}{" "}
                              </h4>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col>
                              <h3>Today</h3>
                              <img
                                src={today_add_icon}
                                alt=""
                                className="addAll"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <h4>
                                {totalC.totalDayAdmission != null
                                  ? numberWithCommasIN(
                                    totalC.totalDayAdmission,
                                    false,
                                    2
                                  )
                                  : 0}{" "}
                              </h4>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col>
                              <Button
                                variant="primary"
                                className="mt-5"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "studentadmission"
                                  );
                                }}
                              >
                                NEW ENROLL
                                <img
                                  src={arrow}
                                  alt=""
                                  className="ms-2 ArrowIcon"
                                />
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>

                    {/* <Button variant="primary">Go somewhere</Button> */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <hr />
            <Row className="my-2 mx-0">
              <Col md={4}>
                <Card className="Bottom_card">
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Header style={{ background: "#b0ffd2" }}>
                    FEES COLLECTION
                  </Card.Header>
                  <Card.Body style={{ marginTop: "30px" }}>
                    {/* <Card.Title>TOTAL TEACHERS</Card.Title> */}
                    {/* <Card.Text>
                      1245
                    </Card.Text> */}
                    <div>
                      <Row>
                        <Col md={6}>
                          <Row>
                            <Col>
                              <h3>Total</h3>
                              <img
                                src={total_fees_icon}
                                alt=""
                                className="mb-2 addAll"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              {/* <h4>₹250950.00</h4> */}
                              <h4>
                                ₹
                                {totalC.totalCollection != null
                                  ? numberWithCommasIN(
                                    totalC.totalCollection,
                                    true,
                                    2
                                  )
                                  : 0.0}
                              </h4>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <Col>
                              <h3 className="mb-2">Today</h3>
                              <img
                                src={today_fees}
                                alt=""
                                className="mb-2 addAll"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              {/* <h4>₹50000.00</h4> */}
                              <h4>
                                ₹{" "}
                                {totalC.totalDayCollection != null
                                  ? numberWithCommasIN(
                                    totalC.totalDayCollection,
                                    true,
                                    2
                                  )
                                  : 0.0}
                              </h4>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="Bottom_card">
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Header style={{ background: "#ff8c90" }}>
                    INCOME / EXPENSES
                  </Card.Header>

                  <Card.Body>
                    {/* <Card.Title>NEW ADMISSION</Card.Title> */}
                    <Card.Text>
                      <Chart
                        type="pie"
                        // width={400}
                        height={220}
                        series={income}
                        options={{
                          labels: ["income", "expenses"],
                        }}
                      ></Chart>
                    </Card.Text>
                    {/* <Button variant="primary">ENROLL</Button> */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="Bottom_card">
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Header style={{ background: "#a2b8a3" }}>
                    Fees Collection
                  </Card.Header>

                  <Card.Body>
                    {/* {JSON.stringify(WeekCollection)} */}

                    {/* {WeekCollection.length > 0 ? (WeekCollection.map((v,i)=>
                          {

                            return(
                              <> */}

                    {WeekCollection && WeekCollection.length > 0 && (
                      <Card.Text>

                        <Chart
                          type="bar"
                          // width={ }
                          height={220}

                          series={[
                            {
                              name: "Fees",

                              data: WeekCollection,
                            },
                          ]}

                          options={{
                            title: { text: "This Week" },
                            labels: ["S", "M", "T", "W", "T", "F", "S"],
                          }}
                        ></Chart>

                      </Card.Text>
                    )}


                    {/* </>
                  );
                })
                )
                :
                ("")
                })} */}
                  </Card.Body>

                </Card>
              </Col>
            </Row>
            <hr />
            <Row className="mx-0">
              <Col>
                <Row>
                  <Col>
                    <h3 style={{ color: "orange" }}>Student Details : </h3>
                  </Col>
                </Row>
                <Table>
                  <thead style={{ background: "#c5f7ba" }}>
                    <tr>
                      <th>Name</th>
                      <th>Std</th>
                      <th>Div</th>
                      <th>Total</th>
                      <th>Outstanding</th>
                      <th>DueDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Name 1</td>
                      <td>5</td>
                      <td>A</td>
                      <td>₹25000</td>
                      <td>₹15000</td>
                      <td>25/10/22</td>
                    </tr>
                    <tr>
                      <td>Name 2</td>
                      <td>6</td>
                      <td>B</td>
                      <td>₹26000</td>
                      <td>₹12000</td>
                      <td>29/10/22</td>
                    </tr>
                    <tr>
                      <td>Name 3</td>
                      <td>7</td>
                      <td>C</td>
                      <td>₹22000</td>
                      <td>₹11000</td>
                      <td>22/10/22</td>
                    </tr>
                    <tr>
                      <td>Name 4</td>
                      <td>8</td>
                      <td>D</td>
                      <td>₹22000</td>
                      <td>₹11000</td>
                      <td>22/10/22</td>
                    </tr>
                    <tr>
                      <td>Name 5</td>
                      <td>9</td>
                      <td>E</td>
                      <td>₹22000</td>
                      <td>₹11000</td>
                      <td>22/10/22</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <hr />
          </div>
        </div>
      </div >
    );
  }
}
