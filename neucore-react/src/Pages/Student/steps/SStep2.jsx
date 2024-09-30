import React, { Component } from "react";
import { Form, Row, Col, Figure } from "react-bootstrap";
import upload_photo_placeholder_box from "@/assets/images/3x/upload_photo_placeholder_box.png";

import { customStyles } from "@/helpers";
export default class SStep2 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { values, handleChange, errors, setFieldValue } = this.props;
    // TODO:
    return (
      <>
        <Row>
          <Col lg={8} md={6} sm={6} xs={6}>
            <Row className="mt-3">
              <Col lg="3">
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Father Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Father Name"
                    name="fatherName"
                    value={values.fatherName}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Father Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Father Occupation"
                    name="fatherOccupation"
                    value={values.fatherOccupation}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Mother Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Mother Name"
                    name="motherName"
                    value={values.motherName}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>

              <Col lg={3}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Mother Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Mother Occupation"
                    name="motherOccupation"
                    value={values.motherOccupation}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2 mt-4">
              <Col lg={4}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Office Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Office Address"
                    name="officeAddress"
                    value={values.officeAddress}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Current Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Current Address"
                    name="currentAddress"
                    value={values.currentAddress}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3 checkboxfont"
                  controlId="formBasicCheckbox"
                >
                  <Form.Check
                    type="checkbox"
                    id="sameAsCurrentAddress"
                    name="sameAsCurrentAddress"
                    label="Same for Permanent Address"
                    // defaultChecked={false}
                    checked={values.sameAsCurrentAddress == true ? true : false}
                    onChange={() => {
                      console.log(
                        "values.sameAsCurrentAddress ",
                        values.sameAsCurrentAddress
                      );
                      setFieldValue(
                        "sameAsCurrentAddress",
                        !values.sameAsCurrentAddress
                      );
                      setFieldValue(
                        "permanentAddress",
                        !values.sameAsCurrentAddress == true
                          ? values.currentAddress
                          : ""
                      );
                    }}
                    value={values.sameAsCurrentAddress}
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Permanent Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Permanent Address"
                    name="permanentAddress"
                    value={values.permanentAddress}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col lg={2} md={3} sm={3} xs={3}>
            <Form.Label className="formlabelsize">Father Photo</Form.Label>
            <div className="img-style">
              <div className="upload-btn-wrapper text-center p-3">
                <img src={upload_photo_placeholder_box} alt="Logo"></img>
                <input type="file" name="myfile"></input>
              </div>
            </div>
          </Col>
          <Col lg={2} md={3} sm={3} xs={3}>
            <Form.Label className="formlabelsize">Mother Photo</Form.Label>
            <div className="img-style">
              <div className="upload-btn-wrapper text-center p-3">
                <img src={upload_photo_placeholder_box} alt="Logo"></img>
                <input type="file" name="myfile"></input>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg="2">
            <Form.Group>
              <Form.Label>Phone Home</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Phone Home"
                name="phoneNoHome"
                value={values.phoneNoHome}
                onChange={handleChange}
                className="formbg"
              />
            </Form.Group>
          </Col>
          <Col lg="2">
            <Form.Group>
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Mobile No."
                name="mobileNo"
                value={values.mobileNo}
                onChange={handleChange}
                className="formbg"
              />
            </Form.Group>
          </Col>
          <Col lg="2">
            <Form.Group>
              <Form.Label>Alt Mobile No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Alt Mob No."
                name="alternativeMobileNo"
                value={values.alternativeMobileNo}
                onChange={handleChange}
                className="formbg"
              />
            </Form.Group>
          </Col>

          <Col lg="2">
            <Form.Group>
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email id"
                name="emailId"
                value={values.emailId}
                onChange={handleChange}
                className="formbg"
              />
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  }
}
