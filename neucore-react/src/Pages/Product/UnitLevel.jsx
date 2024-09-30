import React, { Component } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import {
  ShowNotification,
  calculatePercentage,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  customStylesWhite,
} from "@/helpers";

export default class UnitLevel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      mstUnits,
      mstPackageIndex,
      handlePackageUnit,
      getPackageUnit,
      unitIndex,
      UnitData,
    } = this.props;
    return (
      <div className="unit-style">
        <Row>
          <Col md={12} sm={12}>
            <h6 className="px-4 m-0">Unit {unitIndex + 1}</h6>
            <hr className="m-0" />
          </Col>
        </Row>
        <Row className="mb-4 mt-2 m-0">
          <Col md={2} sm={2} xs={2}>
            <Form.Group>
              <Form.Label>Unit </Form.Label>
              <Select
                className="selectTo"
                isClearable={true}
                styles={customStyles}
                name="unit_id"
                options={mstUnits}
                onChange={(v, actions) => {
                  if (actions.action == "clear") {
                    handlePackageUnit(
                      unitIndex,
                      mstPackageIndex,
                      "unit_id",
                      ""
                    );
                  } else {
                    handlePackageUnit(unitIndex, mstPackageIndex, "unit_id", v);
                  }
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "unit_id")}
              />
              <span className="text-danger"></span>
            </Form.Group>
          </Col>
          <Col md={1} sm={1} xs={1}>
            <Form.Group>
              <Form.Label>Unit Conv</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unit Conv"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "unit_conv",
                    e.target.value
                  );
                }}
                style={{ background: "transparent" }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "unit_conv")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Mar %</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mar %"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "unit_marg",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "unit_marg")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Min Qty</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "min_qty",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "min_qty")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Max Qty</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "max_qty",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "max_qty")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Discount Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "disc_amt",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "disc_amt")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Discount %</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "disc_per",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "disc_per")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>MRP </Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "mrp",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "mrp")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Purchase Rate </Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "purchase_rate",
                    e.target.value
                  );
                }}
                value={getPackageUnit(
                  unitIndex,
                  mstPackageIndex,
                  "purchase_rate"
                )}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Sales Rate </Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "sales_rate",
                    e.target.value
                  );
                }}
                value={getPackageUnit(unitIndex, mstPackageIndex, "sales_rate")}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Min Sales Rate </Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "min_sales_rate",
                    e.target.value
                  );
                }}
                value={getPackageUnit(
                  unitIndex,
                  mstPackageIndex,
                  "min_sales_rate"
                )}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4 row-inside">
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Opening Qty </Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "opening_qty",
                    e.target.value
                  );
                }}
                value={getPackageUnit(
                  unitIndex,
                  mstPackageIndex,
                  "opening_qty"
                )}
              />
            </Form.Group>
          </Col>
          <Col className="" md="1" xs={1}>
            <Form.Group>
              <Form.Label>Opening Valuation </Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  handlePackageUnit(
                    unitIndex,
                    mstPackageIndex,
                    "opening_valution",
                    e.target.value
                  );
                }}
                value={getPackageUnit(
                  unitIndex,
                  mstPackageIndex,
                  "opening_valution"
                )}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
  }
}
