import React, { Component } from "react";
import Select from "react-select";
import { customStylesWhite } from "@/helpers";
import { Modal, Row, Col, Form, CloseButton, Button } from "react-bootstrap";
import TransactionModalUnit from "./TransactionModalUnit";
export default class TransactionModal extends Component {
  constructor(props) {
    super(props);
  }

  getUnitOpt = () => {
    let { lstPackages, transaction_detail_index, rows } = this.props;
    let lst = [];
    // if (lstPackages && lstPackages.length > 0 && lstPackages[0]["value"] != 0) {
    //   lst = lstPackages[0].unitOpt;
    // } else if (
    //   lstPackages &&
    //   lstPackages.length > 0 &&
    //   lstPackages[0]["value"] == 0
    // ) {
    //   lst = lstPackages[0].unitOpt;
    // }
    lst = rows[transaction_detail_index]["packageId"]
      ? rows[transaction_detail_index]["packageId"]["unitOpt"]
      : lstPackages[0].unitOpt;
    return lst;
  };

  handleUnitElement = (transaction_detail_index, unitIndex, element, value) => {
    let { rows, handleRowChange } = this.props;
    // console.log('handleRowChange', handleRowChange);
    rows[transaction_detail_index]["units"][unitIndex][element] = value;
    handleRowChange(rows);
  };

  getUnitElement = (transaction_detail_index, unitIndex, element) => {
    let { rows } = this.props;
    return rows
      ? rows[transaction_detail_index]["units"][unitIndex][element]
      : "";
  };

  AddNewUnit = (transaction_detail_index) => {
    let { rows, handleRowChange } = this.props;
    let single_unit = {
      unitId: "",
      qty: "",
      rate: "",
      base_amt: "",
      unit_conv: "",
    };
    let Frows = rows;
    Frows[transaction_detail_index]["units"] = [
      ...Frows[transaction_detail_index]["units"],
      single_unit,
    ];
    handleRowChange(Frows);
    // rows
    //   ? rows[transaction_detail_index]['units']
  };

  RemoveNewUnit = (transaction_detail_index, unitIndex) => {
    let { rows, handleRowChange } = this.props;
    let Frows = rows;
    let InnerUnits = Frows[transaction_detail_index]["units"].filter(
      (v, i) => i != unitIndex
    );
    Frows[transaction_detail_index]["units"] = InnerUnits;
    handleRowChange(Frows);
  };

  handlePackageChange = (transaction_detail_index, element, value) => {
    let { rows, handleRowChange } = this.props;
    // console.log('handleRowChange', handleRowChange);
    rows[transaction_detail_index][element] = value;
    handleRowChange(rows);
  };

  getPackageValue = (transaction_detail_index, element) => {
    let { rows } = this.props;
    return rows ? rows[transaction_detail_index][element] : "";
  };

  render() {
    let {
      transaction_mdl_show,
      handleTranxModal,
      transaction_detail_index,
      lstPackages,
      rows,
      handleRowChange,
    } = this.props;
    return (
      <div>
        {/* transaction modal */}
        <Modal
          show={transaction_mdl_show}
          size="lg"
          className="mt-5 transaction_mdl"
          onHide={() => handleTranxModal(false)}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
          // closeButton
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              {lstPackages &&
              lstPackages.length > 0 &&
              lstPackages[0]["value"] != 0
                ? "Packaging"
                : "Units"}{" "}
              Parameters
            </Modal.Title>
            <CloseButton
              variant="white"
              className="close-btn-style pull-right"
              onClick={() => handleTranxModal(false)}
            />
          </Modal.Header>
          <Modal.Body className="">
            <div className="company-from mb-2">
              {lstPackages &&
                lstPackages.length > 0 &&
                lstPackages[0]["value"] != 0 && (
                  <Row>
                    <Col md="3" xs={3} sm={3}>
                      <Form.Group>
                        <Form.Label>Select Packaging</Form.Label>
                        <Select
                          className="selectTo"
                          isClearable={false}
                          styles={customStylesWhite}
                          placeholder="Select"
                          options={lstPackages}
                          onChange={(v, actions) => {
                            if (actions.action == "clear") {
                              this.handlePackageChange(
                                transaction_detail_index,
                                "packageId",
                                ""
                              );
                            } else {
                              this.handlePackageChange(
                                transaction_detail_index,
                                "packageId",
                                v
                              );
                            }
                          }}
                          value={this.getPackageValue(
                            transaction_detail_index,
                            "packageId"
                          )}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

              <hr />
              {rows &&
                rows[transaction_detail_index] &&
                rows[transaction_detail_index]["units"] &&
                rows[transaction_detail_index]["units"].length > 0 &&
                rows[transaction_detail_index]["units"].map((v, i) => {
                  return (
                    <TransactionModalUnit
                      transaction_detail_index={transaction_detail_index}
                      unitIndex={i}
                      unitData={v}
                      getUnitOpt={this.getUnitOpt.bind(this)}
                      handleUnitElement={this.handleUnitElement.bind(this)}
                      getUnitElement={this.getUnitElement.bind(this)}
                      RemoveNewUnit={this.RemoveNewUnit.bind(this)}
                    />
                  );
                })}

              <div className="mt-4 pkg-style">
                <Row>
                  <Col md={12} xs={12} className="text-center">
                    <Button
                      type="button"
                      className="btn-add-pckg"
                      style={{ width: "25%" }}
                      onClick={(e) => {
                        e.preventDefault();
                        this.AddNewUnit(transaction_detail_index);
                      }}
                    >
                      Add New Unit
                    </Button>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col md="12" className="mt-4 btn_align">
                  <Button
                    className="submit-btn"
                    type="submit"
                    style={{ borderRadius: "20px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTranxModal(false);
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    className="cancel-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTranxModal(false);
                    }}
                    style={{ borderRadius: "20px" }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
        {/* transaction modal end */}
      </div>
    );
  }
}
