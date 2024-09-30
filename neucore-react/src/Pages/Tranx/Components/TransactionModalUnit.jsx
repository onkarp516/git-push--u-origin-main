import React, { Component } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import { customStylesWhite } from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default class TransactionModalUnit extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      getUnitOpt,
      getUnitElement,
      handleUnitElement,
      unitIndex,
      transaction_detail_index,
      RemoveNewUnit,
    } = this.props;
    return (
      <>
        <Row>
          <Col md="3" sm={3} xs={3}>
            <Form.Group>
              <Form.Label>Select Unit</Form.Label>
              <Select
                className="selectTo"
                isClearable={false}
                styles={customStylesWhite}
                options={getUnitOpt()}
                placeholder="Select"
                onChange={(v, actions) => {
                  if (actions.action == "clear") {
                    handleUnitElement(
                      transaction_detail_index,
                      unitIndex,
                      "unitId",
                      ""
                    );
                  } else {
                    handleUnitElement(
                      transaction_detail_index,
                      unitIndex,
                      "unitId",
                      v
                    );
                  }
                }}
                value={getUnitElement(
                  transaction_detail_index,
                  unitIndex,
                  "unitId"
                )}
              />
            </Form.Group>
          </Col>
          <Col md="3" sm={3} xs={3}>
            <Form.Group>
              <Form.Label>Qty</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  let v = e.target.value;
                  handleUnitElement(
                    transaction_detail_index,
                    unitIndex,
                    "qty",
                    v
                  );
                }}
                value={getUnitElement(
                  transaction_detail_index,
                  unitIndex,
                  "qty"
                )}
              />
            </Form.Group>
          </Col>
          <Col md="3" sm={3} xs={3}>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                onChange={(e) => {
                  let v = e.target.value;
                  handleUnitElement(
                    transaction_detail_index,
                    unitIndex,
                    "rate",
                    v
                  );
                }}
                value={getUnitElement(
                  transaction_detail_index,
                  unitIndex,
                  "rate"
                )}
              />
            </Form.Group>
          </Col>
          <Col md="3" sm={3} xs={3} className="text-center mt-4">
            {unitIndex != 0 && (
              <a
                href="#."
                onClick={(e) => {
                  e.preventDefault();
                  RemoveNewUnit(transaction_detail_index, unitIndex);
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-danger"
                  size={"2x"}
                />
              </a>
            )}
          </Col>
        </Row>
      </>
    );
  }
}
