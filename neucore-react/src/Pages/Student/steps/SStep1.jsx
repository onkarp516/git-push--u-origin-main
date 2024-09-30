import React, { Component } from "react";
import {
  Form,
  Row,
  Col,
  Figure,
  Modal,
  Button,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";
import { createReligion } from "@/services/api_functions";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import cancel_icon from "@/assets/images/3x/cancel_icon.png";

import * as Yup from "yup";
import upload_photo_placeholder_box from "@/assets/images/3x/upload_photo_placeholder_box.png";
import Select from "react-select";
import { customStyles, MyDatePicker, MyNotifications } from "@/helpers";

import MotherTongueSelectList from "@/helpers/MotherTongueSelectList";
import ReligionSelectList from "@/helpers/ReligionSelectList";
import CasteSelectList from "@/helpers/CasteSelectList";
import SubCasteSelectList from "@/helpers/SubCasteSelectList";
import CasteCategorySelectList from "@/helpers/CasteCategorySelectList";

export default class SStep1 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      values,
      handleChange,
      errors,
      touched,
      setFieldValue,
      opBranchList,
      opMotherTongueList,
      opCasteList,
      opSubCasteList,
      opCategoryList,
      nationality_options,
      opReligionList,
      getCasteData,
      findStudentData,
      getAge,
      getSubCasteData,
      getCategoryData,
      getStandardData,
      handleStateData,
      getAcademicYearData,
    } = this.props;
    // TODO:
    return (
      <>
        <Row>
          {/* {JSON.stringify(values)} */}
          <Col lg={6} md={6} sm={6} xs={6}>
            <Row>
              <Col
                sm="12"
                md={{ span: 3 }}
                // lg={{ offset: 9, span: 3 }}
              >
                <Form.Group className="createnew">
                  <Form.Label>Selection</Form.Label>
                  <Select
                    className="selectTo formbg"
                    styles={customStyles}
                    isClearable={true}
                    onChange={(v) => {
                      setFieldValue("branchId", "");
                      setFieldValue("standardId", "");
                      setFieldValue("divisionId", "");
                      setFieldValue("academicYearId", "");
                      if (v != null) {
                        setFieldValue("branchId", v);
                        getStandardData(v.value);
                        getAcademicYearData(v.value);
                      } else {
                        handleStateData({
                          opStandardList: [],
                          opDivisionList: [],
                          opAcademicYearList: [],
                        });
                      }
                    }}
                    name="branchId"
                    options={opBranchList}
                    value={values.branchId}
                  />
                  <span className="text-danger errormsg">
                    {errors.branchId}
                  </span>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg="3">
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    name="firstName"
                    id="firstName"
                    className="formbg"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={(e) => {
                      let input = e.target.value;
                      input = input.trim();
                      console.log("e.target.value =" + input + "-");
                      if (
                        input != null &&
                        input != "" &&
                        values.lastName.trim() != "" &&
                        values.lastName != null
                      ) {
                        findStudentData(
                          values.id != null ? values.id : "",
                          input,
                          values.middleName != null
                            ? values.middleName.trim()
                            : "",
                          values.lastName != null ? values.lastName.trim() : "",
                          setFieldValue
                        );
                      }
                    }}
                    isValid={touched.firstName && !errors.firstName}
                    isInvalid={!!errors.firstName}
                  />
                  <span className="text-danger errormsg">
                    {errors.firstName && errors.firstName}
                  </span>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Middle Name"
                    name="middleName"
                    id="middleName"
                    className="formbg"
                    value={values.middleName}
                    onChange={handleChange}
                    onBlur={(e) => {
                      let input = e.target.value;
                      input = input.trim();
                      console.log("e.target.value =" + input + "-");
                      if (
                        input != null &&
                        input != "" &&
                        values.firstName.trim() != "" &&
                        values.firstName != null &&
                        values.lastName.trim() != "" &&
                        values.lastName != null
                      ) {
                        findStudentData(
                          values.id != null ? values.id : "",
                          values.firstName != null
                            ? values.firstName.trim()
                            : "",
                          input,
                          values.lastName != null ? values.lastName.trim() : "",
                          setFieldValue
                        );
                      }
                    }}
                  />
                  <span className="text-danger errormsg">
                    {errors.middleName && errors.middleName}
                  </span>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group sm="12" md="2" lg="2">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    name="lastName"
                    id="lastName"
                    className="formbg"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={(e) => {
                      let input = e.target.value;
                      input = input.trim();
                      console.log("e.target.value =" + input + "-");
                      if (
                        input != null &&
                        input != "" &&
                        values.firstName.trim() != "" &&
                        values.firstName != null
                      ) {
                        findStudentData(
                          values.id != null ? values.id : "",
                          values.firstName != null
                            ? values.firstName.trim()
                            : "",
                          values.middleName != null
                            ? values.middleName.trim()
                            : "",
                          input,
                          setFieldValue
                        );
                      }
                    }}
                    isValid={touched.lastName && !errors.lastName}
                    isInvalid={!!errors.lastName}
                  />
                  <span className="text-danger errormsg">
                    {errors.lastName}
                  </span>
                </Form.Group>
              </Col>

              <Col lg="3" className="p-0">
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <br />
                  <div className="genderhorizotal">
                    <Form.Check
                      inline
                      label="Male"
                      name="gender"
                      value="male"
                      type="radio"
                      id="genderMale"
                      checked={values.gender === "male" ? true : false}
                      onChange={(v) => {
                        setFieldValue("gender", "male");
                      }}
                    />
                    <Form.Check
                      inline
                      label="Female"
                      name="gender"
                      value="female"
                      type="radio"
                      checked={values.gender === "female" ? true : false}
                      onChange={(v) => {
                        setFieldValue("gender", "female");
                      }}
                    />
                  </div>
                  <span className="text-danger errormsg">{errors.gender}</span>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 mt-4">
              <Col lg={4} md={4} sm={8} className="mb-2">
                <Form.Label className="formlabelsize">DOB</Form.Label>
                <MyDatePicker
                  className="datepic form-control"
                  styles={customStyles}
                  name="dob"
                  placeholderText="dd/MM/yyyy"
                  id="dob"
                  dateFormat="dd/MM/yyyy"
                  value={values.dob}
                  onChange={(date) => {
                    setFieldValue("dob", date);
                    // getAge(date, setFieldValue);
                  }}
                  selected={values.dob}
                  maxDate={new Date()}
                />
                <span className="text-danger errormsg">{errors.dob}</span>
              </Col>
              {/* <Col lg={2} md={2} sm={8} className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="0"
                  name="age"
                  id="age"
                  onChange={handleChange}
                  value={values.age}
                  readOnly
                />
              </Col> */}

              <Col lg={4} md={4} sm={8} className="mb-2">
                <Form.Group>
                  <Form.Label>Birth Place</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Birth Place Name"
                    name="birthPlace"
                    value={values.birthPlace}
                    onChange={handleChange}
                    className="formbg"
                  />
                  <span className="text-danger errormsg">
                    {errors.birthPlace}
                  </span>
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <Form.Label className="formlabelsize">Student Photo</Form.Label>
            <div className="img-style">
              <div className="upload-btn-wrapper text-center p-3">
                <img src={upload_photo_placeholder_box} alt="Logo"></img>
                <input
                  type="file"
                  name="studentImage"
                  onChange={(e) => {
                    setFieldValue("studentImage", e.target.files[0]);
                  }}
                ></input>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={2}>
            <Form.Group className="createnew">
              <Form.Label>Nationality</Form.Label>
              <Select
                className="selectTo formbg"
                styles={customStyles}
                options={nationality_options}
                isClearable={true}
                onChange={(v) => {
                  setFieldValue("nationalityId", "");
                  if (v != null) {
                    setFieldValue("nationalityId", v);
                  }
                }}
                name="nationalityId"
                value={values.nationalityId}
              />
              <span className="text-danger errormsg">
                {errors.nationalityId}
              </span>
            </Form.Group>
          </Col>
          <Col lg={2}>
            {/* <Form.Group className="createnew">
              <Form.Label>Mother Tongue</Form.Label>
              <Select
                className="selectTo formbg"
                styles={customStyles}
                isClearable={true}
                onChange={(v) => {
                  setFieldValue("motherTongueId", "");
                  if (v != null) {
                    setFieldValue("motherTongueId", v);
                  }
                }}
                name="motherTongueId"
                options={opMotherTongueList}
                value={values.motherTongueId}
              />
            </Form.Group> */}

            <Form.Group>
              <MotherTongueSelectList
                {...this.props}
                name="motherTongueId"
                id="motherTongueId"
                options={opMotherTongueList}
                value={values.motherTongueId}
              />

              <span className="text-danger">
                {errors.motherTongueId && errors.motherTongueId}
              </span>
            </Form.Group>
          </Col>

          <Col lg={2}>
            <Form.Group>
              <ReligionSelectList
                {...this.props}
                name="religionId"
                id="religionId"
                options={opReligionList}
                value={values.religionId}
              />

              <span className="text-danger">
                {errors.religionId && errors.religionId}
              </span>
            </Form.Group>
          </Col>

          <Col lg={2}>
            <Form.Group>
              <CasteSelectList
                {...this.props}
                name="casteId"
                id="casteId"
                options={opCasteList}
                value={values.casteId}
                religionId={values.religionId}
              />

              <span className="text-danger">
                {errors.casteId && errors.casteId}
              </span>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group>
              <SubCasteSelectList
                {...this.props}
                name="casteId"
                id="casteId"
                options={opSubCasteList}
                value={values.subCasteId}
                religionId={values.religionId}
                casteId={values.casteId}
              />

              <span className="text-danger">
                {errors.SubCasteId && errors.SubCasteId}
              </span>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group>
              <CasteCategorySelectList
                {...this.props}
                name="categoryId"
                id="categoryId"
                options={opCategoryList}
                value={values.categoryId}
                categoryId={values.categoryId}
              />

              <span className="text-danger">
                {errors.categoryId && errors.categoryId}
              </span>
            </Form.Group>

            {/* <Form.Group className="createnew">
              <Form.Label>Category</Form.Label>
              <Select
                className="selectTo formbg"
                styles={customStyles}
                isClearable={true}
                onChange={(v) => {
                  setFieldValue("categoryId", "");
                  if (v != null) {
                    setFieldValue("categoryId", v);
                  }
                }}
                name="categoryId"
                options={opCategoryList}
                value={values.categoryId}
              />
            </Form.Group> */}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg="2">
            <Form.Group>
              <Form.Label>Home Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="Home Town Name"
                name="hometown"
                value={values.hometown}
                onChange={handleChange}
                className="formbg"
              />
            </Form.Group>
          </Col>
          <Col lg="2">
            <Form.Group>
              <Form.Label>Aadhar Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Aadhar No."
                name="aadharNo"
                value={values.aadharNo}
                onChange={handleChange}
                maxLength="12"
                className="formbg"
              />
            </Form.Group>
          </Col>

          <Col lg="2">
            <Form.Group>
              <Form.Label>Saral ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Saral ID"
                name="saralId"
                value={values.saralId}
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
