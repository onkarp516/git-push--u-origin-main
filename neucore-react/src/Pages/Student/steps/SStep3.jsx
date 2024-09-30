import React, { Component } from "react";
import { Form, Row, Col, Figure } from "react-bootstrap";
import Select from "react-select";
import { customStyles, MyDatePicker } from "@/helpers";

export default class SStep3 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      values,
      handleChange,
      errors,
      setFieldValue,
      result_options,
      opAcademicYearList,
      opStandardList,
      opDivisionList,
      options,
      typeoptions,
      studentTypeOptions,
      studentGroupOptions,
      getDivisionData,
    } = this.props;
    // TODO:
    // console.log("currentstandardId->", values.currentStandardId);
    return (
      <>
        <Row>
          <Col lg={12} md={6} sm={6} xs={6}>
            <Row className="mt-3">
              <Col lg="2">
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>General Registration No.</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Registration No"
                    name="generalRegisterNo"
                    value={values.generalRegisterNo}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group sm="12" md="2" lg="3">
                  <Form.Label>Name Of Prev. School</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name of prev. school"
                    name="nameOfPrevSchool"
                    value={values.nameOfPrevSchool}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Standard In Prev. School</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Std In Prev. School"
                    name="stdInPrevSchool"
                    value={values.stdInPrevSchool}
                    onChange={handleChange}
                    className="formbg"
                  />
                </Form.Group>
              </Col>

              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Result</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    options={result_options}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("result", "");
                      if (v != null) {
                        setFieldValue("result", v);
                      }
                    }}
                    name="result"
                    value={values.result}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* {JSON.stringify(values)} */}
        {"id" in values ? (
          ""
        ) : (
          <>
            <div>
              <p className="formlabelsize admission-granted">
                STD to which Admission Granted:
              </p>
            </div>
            <hr className="horizontalline stdhorizontalline"></hr>
            <Row className="mb-4 mt-5">
              <Col lg="2">
                <Form.Label className="formlabelsize">
                  Date Of Admission
                </Form.Label>
                <br />

                <MyDatePicker
                  className="datepic form-control"
                  styles={customStyles}
                  value={values.doa}
                  name="doa"
                  placeholderText="dd/MM/yyyy"
                  id="doa"
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => {
                    setFieldValue("doa", date);
                  }}
                  selected={values.doa}
                  // maxDate={new Date()}
                />
              </Col>
              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Academic Year</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("academicYearId", "");
                      if (v != null) {
                        setFieldValue("academicYearId", v);
                      }
                    }}
                    name="academicYearId"
                    options={opAcademicYearList}
                    value={values.academicYearId}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Student Type</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    options={typeoptions}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("studentIsOld", "");
                      if (v != null) {
                        setFieldValue("studentIsOld", v);
                      }
                    }}
                    name="studentIsOld"
                    value={values.studentIsOld}
                  />
                </Form.Group>
              </Col>
              {values.studentIsOld && values.studentIsOld.value == 1 && (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>STD Admitted</Form.Label>
                    <Select
                      // className="selectTo formbg"
                      styles={customStyles}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("admittedStandardId", "");

                        if (v != null) {
                          setFieldValue("admittedStandardId", v);
                        }
                      }}
                      name="admittedStandardId"
                      options={opStandardList}
                      value={values.admittedStandardId}
                    />
                  </Form.Group>
                </Col>
              )}

              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Current STD</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("currentStandardId", "");
                      setFieldValue("studentGroup", "");

                      if (v != null) {
                        setFieldValue("currentStandardId", v);
                        getDivisionData(v.value);
                      } else {
                        this.setState({
                          opDivisionList: [],
                        });
                      }
                    }}
                    name="currentStandardId"
                    options={opStandardList}
                    value={values.currentStandardId}
                    id="options"
                  />
                </Form.Group>
              </Col>

              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Division</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("divisionId", "");
                      if (v != null) {
                        setFieldValue("divisionId", v);
                      }
                    }}
                    name="divisionId"
                    options={opDivisionList}
                    value={values.divisionId}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Student Type</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("studentType", "");
                      if (v != null) {
                        setFieldValue("studentType", v);
                      }
                    }}
                    name="studentType"
                    options={studentTypeOptions}
                    value={values.studentType}
                  />
                </Form.Group>
              </Col>
              {values.currentStandardId &&
              parseInt(values.currentStandardId.label) >= 11 ? (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>Student Group</Form.Label>
                    <Select
                      className="selectTo formbg"
                      styles={customStyles}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("studentGroup", "");
                        if (v != null) {
                          setFieldValue("studentGroup", v);
                        }
                      }}
                      name="studentGroup"
                      options={studentGroupOptions}
                      value={values.studentGroup}
                    />
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}

              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Hostel Applicable</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    options={options}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("isHostel", "");
                      if (v != null) {
                        setFieldValue("isHostel", v);
                      }
                    }}
                    name="isHostel"
                    id="isHostel"
                    value={values.isHostel}
                  />
                </Form.Group>
              </Col>

              <Col lg={2}>
                <Form.Group className="createnew">
                  <Form.Label>Bus Applicable</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    options={options}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("isBusConcession", "");
                      if (v != null) {
                        setFieldValue("isBusConcession", v);
                      }
                    }}
                    name="isBusConcession"
                    value={values.isBusConcession}
                  />
                </Form.Group>
              </Col>
              {(values.currentStandardId.label == "10" ||
                values.currentStandardId.label == "9") && (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>Vacation Applicable</Form.Label>
                    <Select
                      className="selectTo formbg"
                      styles={customStyles}
                      options={options}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("isVacation", "");
                        if (v != null) {
                          setFieldValue("isVacation", v);
                        }
                      }}
                      name="isVacation"
                      value={values.isVacation}
                    />
                  </Form.Group>
                </Col>
              )}
              {(values.currentStandardId.label === "5" ||
                values.currentStandardId.label === "8") && (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>Scholarship</Form.Label>
                    <Select
                      className="selectTo formbg"
                      styles={customStyles}
                      options={options}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("isScholarship", "");
                        if (v != null) {
                          setFieldValue("isScholarship", v);
                        }
                      }}
                      name="isScholarship"
                      value={values.isScholarship}
                    />
                  </Form.Group>
                </Col>
              )}

              {values.currentStandardId.label === "10" && (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>NTS</Form.Label>
                    <Select
                      className="selectTo formbg"
                      styles={customStyles}
                      options={options}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("nts", "");
                        if (v != null) {
                          setFieldValue("nts", v);
                        }
                      }}
                      name="nts"
                      value={values.nts}
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
            <Row>
              {(values.currentStandardId.label === "8" ||
                values.currentStandardId.label === "9") && (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>MTS</Form.Label>
                    <Select
                      className="selectTo formbg"
                      styles={customStyles}
                      options={options}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("mts", "");
                        if (v != null) {
                          setFieldValue("mts", v);
                        }
                      }}
                      name="mts"
                      value={values.mts}
                    />
                  </Form.Group>
                </Col>
              )}

              {(values.currentStandardId.label === "8" ||
                values.currentStandardId.label === "9" ||
                values.currentStandardId.label === "10") && (
                <Col lg={2}>
                  <Form.Group className="createnew">
                    <Form.Label>Foundation</Form.Label>
                    <Select
                      className="selectTo formbg"
                      styles={customStyles}
                      options={options}
                      isClearable={true}
                      onChange={(v) => {
                        setFieldValue("foundation", "");
                        if (v != null) {
                          setFieldValue("foundation", v);
                        }
                      }}
                      name="foundation"
                      value={values.foundation}
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
          </>
        )}
      </>
    );
  }
}
