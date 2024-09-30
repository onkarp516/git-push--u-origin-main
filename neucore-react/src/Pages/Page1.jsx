import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import { customStyles, MyDatePicker } from "../helpers";
export default class Page1 extends Component {
  render() {
    return (
      <div className="from-style">
        <div className="d-bg i-bg">
          <div className="ledger-form ">
            <h4 className="form-header"> Ledger</h4>
            <div className="ledger-header mb-0">
              <Row className="ledgerrow">
                <Col md="5" className="">
                  <Form.Group>
                    <Form.Label>
                      Ledger Name{" "}
                      <span className="pt-1 pl-1 req_validation">*</span>
                    </Form.Label>
                    <Form.Control
                      autoFocus="true"
                      type="text"
                      placeholder="Ledger Name"
                      name="ledger_name"
                      autofocus
                    />
                  </Form.Group>
                </Col>

                <Col md="2" className="">
                  <Form.Group className="createnew">
                    <Form.Label>
                      Under <span className="pt-1 pl-1 req_validation">*</span>
                    </Form.Label>
                    <Select
                      className="selectTo"
                      name="underId"
                      styles={customStyles}
                    />
                  </Form.Group>
                </Col>

                <Col md="2">
                  <div>
                    <Form.Group>
                      <Form.Label>
                        Ledger Type{" "}
                        <span className="pt-1 pl-1 req_validation">*</span>
                      </Form.Label>{" "}
                      <Select
                        as="select"
                        name="is_private"
                        styles={customStyles}
                      >
                        <option value="true"> Yes</option>
                        <option value="false">No</option>
                      </Select>
                    </Form.Group>
                  </div>
                </Col>
                <Col md="3" className="btn_align pt-4 mt-1">
                  <Button
                    variant="secondary"
                    className="cancel-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      window.electron.ipcRenderer.webPageChange({
                        from: "ledgercreate",
                        to: "ledgerlist",
                        isNewTab: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="form-style">
              <Row className="mt-1 row-border">
                <h6
                  className="title-style"
                  style={{
                    marginLeft: "20px",
                  }}
                >
                  SUNDRY DEBTORS
                </h6>
                <Row className="mb-4 row-inside">
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Mailing Name </Form.Label>
                      <Form.Control
                        autoFocus="true"
                        type="text"
                        placeholder="Mailing Name"
                        name="mailing_name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Form.Group className="">
                      <Form.Label>
                        Opening Balance{" "}
                        <span className="pt-1 pl-1 req_validation">*</span>
                      </Form.Label>
                      <InputGroup className="jointdropdown">
                        <FormControl
                          placeholder=""
                          aria-label="Opening Balance"
                          aria-describedby="basic-addon2"
                          name="opening_balance"
                        />
                        <div style={{ width: "25%" }}>
                          <Form.Control
                            as="select"
                            onChange={(e) => {}}
                            name="opening_balance_type"
                          >
                            <option value="dr">Dr</option>
                            <option value="cr">Cr</option>
                          </Form.Control>
                        </div>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Form.Group className="createnew">
                      <Form.Label>
                        Balancing Method{" "}
                        <span className="pt-1 pl-1 req_validation">*</span>
                      </Form.Label>
                      <Select
                        className="selectTo"
                        name="opening_balancing_method"
                        styles={customStyles}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Row>
              <Row className="mt-4 row-border">
                <Col md="12" className="mb-4">
                  {/* <div className="mt-2"> */}
                  <h6 className="title-style">Mailing Details</h6>
                  <Row className="row-inside">
                    <Col md="4">
                      <Form.Group className="createnew">
                        <Form.Label>Address </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Address"
                          name="address"
                        />
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group className="createnew">
                        <Form.Label>
                          State{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>
                        </Form.Label>
                        <Select
                          className="selectTo"
                          onChange={(v) => {}}
                          name="stateId"
                          styles={customStyles}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group className="createnew">
                        <Form.Label>
                          Country{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>
                        </Form.Label>
                        <Select
                          className="selectTo"
                          onChange={(v) => {}}
                          name="countryId"
                          styles={customStyles}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="2">
                      <Form.Group className="createnew">
                        <Form.Label>Pincode </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Pincode"
                          name="pincode"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-4 row-inside">
                    <Col md="2">
                      <Form.Group className="createnew">
                        <Form.Label>Email ID </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Email ID"
                          name="email_id"
                        />
                      </Form.Group>
                    </Col>
                    <Col md="2">
                      <Form.Group className="createnew">
                        <Form.Label>Phone No. </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Phone No."
                          name="phone_no"
                          maxLength={10}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="2">
                      <div>
                        <Form.Group>
                          <Form.Label>
                            TDS Applicable{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>{" "}
                          <Form.Control
                            as="select"
                            onChange={(e) => {}}
                            name="tds"
                          >
                            <option value="false">No</option>
                            <option value="true"> Yes</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="2">
                      <Form.Group>
                        <Form.Label>TDS Applicable Date</Form.Label>

                        <MyDatePicker
                          name="tds_applicable_date"
                          placeholderText="DD/MM/YYYY"
                          id="tds_applicable_date"
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => {}}
                          minDate={new Date()}
                          className="date-style"
                        />
                      </Form.Group>
                    </Col>
                    <Col md="2">
                      <div>
                        <Form.Group>
                          <Form.Label>
                            TCS Applicable{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>{" "}
                          <Form.Control
                            as="select"
                            onChange={(e) => {}}
                            name="tcs"
                          >
                            <option value="false">No</option>
                            <option value="true"> Yes</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </Col>
                    {/* {values.tcs == 'true' && ( */}
                    <Col md="2">
                      <Form.Group>
                        <Form.Label>TCS Applicable Date</Form.Label>

                        <MyDatePicker
                          name="tcs_applicable_date"
                          placeholderText="DD/MM/YYYY"
                          id="tcs_applicable_date"
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => {}}
                          minDate={new Date()}
                          className="date-style"
                        />
                      </Form.Group>
                    </Col>
                    {/* )} */}
                  </Row>

                  <Row className="mt-4 row-inside">
                    <Col md="1">
                      <Form.Group className="createnew">
                        <Form.Label>Credit Days </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Credit Days"
                          name="credit_days"
                        />
                      </Form.Group>
                    </Col>

                    <Col md="2">
                      <div>
                        <Form.Group>
                          <Form.Label>
                            Applicable From
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>{" "}
                          <Form.Control
                            as="select"
                            onChange={(e) => {}}
                            name="applicable_from"
                          >
                            <option value="billDate">Bill Date</option>
                            <option value="deliveryDate">Delivery Date</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="1">
                      <Form.Group className="createnew">
                        <Form.Label>FSSAI No. </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="FSSAI No."
                          name="fssai"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4 row-border">
                <Col md="12" className="mb-4">
                  <h6 className="title-style">Tax Details</h6>
                  <Row className="row-inside">
                    <Col md="1">
                      <div>
                        <Form.Group>
                          <Form.Label>
                            Tax Available{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>{" "}
                          <Form.Control
                            as="select"
                            onChange={(e) => {}}
                            name="isTaxation"
                          >
                            <option value="false">No</option>
                            <option value="true"> Yes</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </Col>

                    <Col md="2">
                      <Form.Group className="createnew">
                        <Form.Label>Registration Type</Form.Label>
                        <Select
                          className="selectTo"
                          onChange={(v) => {}}
                          name="registraion_type"
                          styles={customStyles}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="2">
                      <Form.Group>
                        <Form.Label>Pan Card No.</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Pan Card No."
                          name="pan_no"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <>
                    <Row className="mt-4 row-inside">
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>GSTIN</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="GSTIN"
                            name="gstin"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>Registration Date</Form.Label>

                          <MyDatePicker
                            name="dateofregistartion"
                            placeholderText="DD/MM/YYYY"
                            id="dateofregistartion"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {}}
                            // minDate={new Date()}
                            className="date-style"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>Pan Card No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Pan Card No."
                            name="pan_no"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="5">
                        <ButtonGroup
                          className="pull-right pt-4"
                          aria-label="Basic example"
                        >
                          <Button
                            className="createbtn mr-2"
                            onClick={(e) => {
                              // e.preventDefault();
                              // if (values.gstin != "") {
                              //   let gstObj = {
                              //     gstin: values.gstin,
                              //     dateofregistartion:
                              //       values.dateofregistartion,
                              //     pan_no: values.pan_no,
                              //   };
                              //   this.addGSTRow(gstObj, setFieldValue);
                              // } else {
                              //   ShowNotification(
                              //     "Error",
                              //     "Please submit all data"
                              //   );
                              // }
                            }}
                          >
                            ADD ROW
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                    <Row className="mt-4 row-inside">
                      <Col md="8">
                        <div className="table_wrapper">
                          <Table
                            // bordered
                            hover
                            size="sm"
                            className=""
                            //responsive
                            style={{ fontSize: "13px" }}
                          >
                            <thead>
                              <tr>
                                <th>#.</th>
                                <th>GST No.</th>
                                <th>Registraton Date</th>
                                <th>PAN No.</th>
                                <th className="btn_align right_col">-</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {gstList.map((v, i) => {
                                        return (
                                          <tr>
                                            <td>{i + 1}</td>
                                            <td>{v.gstin}</td>
                                            <td>
                                              {v.dateofregistartion != ""
                                                ? moment(
                                                    v.dateofregistartion
                                                  ).format("DD-MM-YYYY")
                                                : "NA"}
                                            </td>
                                            <td>{v.pan_no}</td>
                                            <td>
                                              <Button
                                                className="mainbtnminus"
                                                variant=""
                                                type="button"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  this.removeGstRow(i);
                                                }}
                                              >
                                                <i class="fa fa-edit"></i>
                                              </Button>
                                            </td>
                                          </tr>
                                        );
                                      })} */}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </>
                </Col>
              </Row>
              <Row className="mt-4 row-border">
                <Col md="12" className="mb-4">
                  <h6 className="title-style">Tax Details</h6>
                  <Row className="row-inside">
                    <Col md="1">
                      <div>
                        <Form.Group>
                          <Form.Label>
                            Tax Available{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>{" "}
                          <Form.Control
                            as="select"
                            onChange={(e) => {}}
                            name="isTaxation"
                          >
                            <option value="false">No</option>
                            <option value="true"> Yes</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </Col>

                    <Col md="2">
                      <Form.Group className="createnew">
                        <Form.Label>Registration Type</Form.Label>
                        <Select
                          className="selectTo"
                          onChange={(v) => {}}
                          name="registraion_type"
                          styles={customStyles}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="2">
                      <Form.Group>
                        <Form.Label>Pan Card No.</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Pan Card No."
                          name="pan_no"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <>
                    <Row className="mt-4 row-inside">
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>GSTIN</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="GSTIN"
                            name="gstin"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>Registration Date</Form.Label>

                          <MyDatePicker
                            name="dateofregistartion"
                            placeholderText="DD/MM/YYYY"
                            id="dateofregistartion"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {}}
                            // minDate={new Date()}
                            className="date-style"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>Pan Card No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Pan Card No."
                            name="pan_no"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="5">
                        <ButtonGroup
                          className="pull-right pt-4"
                          aria-label="Basic example"
                        >
                          <Button
                            className="createbtn mr-2"
                            onClick={(e) => {
                              // e.preventDefault();
                              // if (values.gstin != "") {
                              //   let gstObj = {
                              //     gstin: values.gstin,
                              //     dateofregistartion:
                              //       values.dateofregistartion,
                              //     pan_no: values.pan_no,
                              //   };
                              //   this.addGSTRow(gstObj, setFieldValue);
                              // } else {
                              //   ShowNotification(
                              //     "Error",
                              //     "Please submit all data"
                              //   );
                              // }
                            }}
                          >
                            ADD ROW
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                    <Row className="mt-4 row-inside">
                      <Col md="8">
                        <div className="table_wrapper">
                          <Table
                            // bordered
                            hover
                            size="sm"
                            className=""
                            //responsive
                            style={{ fontSize: "13px" }}
                          >
                            <thead>
                              <tr>
                                <th>#.</th>
                                <th>GST No.</th>
                                <th>Registraton Date</th>
                                <th>PAN No.</th>
                                <th className="btn_align right_col">-</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {gstList.map((v, i) => {
                                        return (
                                          <tr>
                                            <td>{i + 1}</td>
                                            <td>{v.gstin}</td>
                                            <td>
                                              {v.dateofregistartion != ""
                                                ? moment(
                                                    v.dateofregistartion
                                                  ).format("DD-MM-YYYY")
                                                : "NA"}
                                            </td>
                                            <td>{v.pan_no}</td>
                                            <td>
                                              <Button
                                                className="mainbtnminus"
                                                variant=""
                                                type="button"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  this.removeGstRow(i);
                                                }}
                                              >
                                                <i class="fa fa-edit"></i>
                                              </Button>
                                            </td>
                                          </tr>
                                        );
                                      })} */}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
