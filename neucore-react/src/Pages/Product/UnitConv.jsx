import React, { Component } from 'react';
import { Col, Row, Form, Table } from 'react-bootstrap';
import { getAllUnit } from '@/services/api_functions';
import Select from 'react-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { customStyles } from '@/helpers';
export default class UnitConv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unitLst: [],
    };
  }

  lstUnit = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.unitName };
            });
            this.setState({ unitLst: Opt });
          }
        }
      })
      .catch((error) => {});
  };
  componentDidMount() {
    this.lstUnit();
  }
  setElementValue = (element, unittype) => {
    let elementCheck = this.props.unitarray.find((v, i) => {
      return v.unitType == unittype;
    });

    return elementCheck ? elementCheck[element] : '';
  };
  render() {
    const { unitLst } = this.state;
    // const customStyles = {
    //   control: (base) => ({
    //     ...base,
    //     height: 28,
    //     minHeight: 28,
    //     border: 'none',
    //     borderBottom: '1px solid #ccc',
    //     fontSize: '13px',
    //     boxShadow: 'none',
    //   }),
    // };

    return (
      <Col md="4">
        <Row>
          <Col className="" md="6">
            <Form.Group className="createnew">
              <Form.Label>
                <span>{this.props.v} Unit</span>
              </Form.Label>
              <Select
                className="selectTo"
                isClearable
                options={unitLst}
                borderRadius="0px"
                colors="#729"
                styles={customStyles}
                onChange={(e) => {
                  this.props.handleChangeUnitArrayElement(
                    'unitId',
                    e,
                    this.props.v
                  );
                }}
                value={this.setElementValue('unitId', this.props.v)}
              />
            </Form.Group>
          </Col>
          <Col className="" md="3">
            <Form.Group>
              <Form.Label>Unit Conv</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unit Conv"
                onChange={(e) => {
                  this.props.handleChangeUnitArrayElement(
                    'unitConv',
                    e.target.value,
                    this.props.v
                  );
                }}
                value={this.setElementValue('unitConv', this.props.v)}
              />
            </Form.Group>
          </Col>
          <Col className="" md="3">
            <Form.Group>
              <Form.Label>Mar %</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mar %"
                onChange={(e) => {
                  this.props.handleChangeUnitArrayElement(
                    'unitConvMargn',
                    e.target.value,
                    this.props.v
                  );
                }}
                value={this.setElementValue('unitConvMargn', this.props.v)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table className="prdcttbl mt-2" border="1" striped>
              <thead>
                <tr>
                  <td className="tabletd">
                    <span>{this.props.v}</span>
                  </td>
                  <td className="tabletd" style={{ textAlign: 'center' }}>
                    Min
                  </td>
                  <td style={{ textAlign: 'center' }} className="tabletd">
                    Max
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tabletd">Qnty</td>
                  <td>
                    <Form.Group className="unitlabel">
                      <Form.Control
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          this.props.handleChangeUnitArrayElement(
                            'minQty',
                            e.target.value,
                            this.props.v
                          );
                        }}
                        value={this.setElementValue('minQty', this.props.v)}
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group className="unitlabel">
                      <Form.Control
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          this.props.handleChangeUnitArrayElement(
                            'maxQty',
                            e.target.value,
                            this.props.v
                          );
                        }}
                        value={this.setElementValue('maxQty', this.props.v)}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td className="tabletd">Disc %</td>
                  <td>
                    <Form.Group className="unitlabel">
                      <Form.Control
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          this.props.handleChangeUnitArrayElement(
                            'minDisPer',
                            e.target.value,
                            this.props.v
                          );
                        }}
                        value={this.setElementValue('minDisPer', this.props.v)}
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group className="unitlabel">
                      <Form.Control
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          this.props.handleChangeUnitArrayElement(
                            'maxDisPer',
                            e.target.value,
                            this.props.v
                          );
                        }}
                        value={this.setElementValue('maxDisPer', this.props.v)}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td className="tabletd" style={{ width: '23%' }}>
                    Disc Amt
                  </td>
                  <td>
                    <Form.Group className="unitlabel">
                      <Form.Control
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          this.props.handleChangeUnitArrayElement(
                            'minDisAmt',
                            e.target.value,
                            this.props.v
                          );
                        }}
                        value={this.setElementValue('minDisAmt', this.props.v)}
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group className="unitlabel">
                      <Form.Control
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          this.props.handleChangeUnitArrayElement(
                            'maxDisAmt',
                            e.target.value,
                            this.props.v
                          );
                        }}
                        value={this.setElementValue('maxDisAmt', this.props.v)}
                      />
                    </Form.Group>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <div className="highunittbl">
          <Row>
            <Col className="" md="6">
              <Form.Group>
                <Form.Label>MRP</Form.Label>

                <Form.Control
                  type="text"
                  className="btn_align"
                  placeholder=""
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      'mrp',
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue('mrp', this.props.v)}
                />
              </Form.Group>
            </Col>
            <Col className="" md="6">
              <Form.Group>
                <Form.Label>Pur. Rate</Form.Label>

                <Form.Control
                  type="text"
                  className="btn_align"
                  placeholder=""
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      'purchaseRate',
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue('purchaseRate', this.props.v)}
                />
              </Form.Group>
            </Col>

            <Col className="" md="6">
              <Form.Group>
                <Form.Label>Sale Rate</Form.Label>

                <Form.Control
                  type="text"
                  className="btn_align"
                  placeholder=""
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      'saleRate',
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue('saleRate', this.props.v)}
                />
              </Form.Group>
            </Col>
            <Col className="" md="6">
              <Form.Group>
                <Form.Label>Min Sales Rate</Form.Label>

                <Form.Control
                  type="text"
                  className="btn_align"
                  placeholder=""
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      'minSaleRate',
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue('minSaleRate', this.props.v)}
                />
              </Form.Group>
            </Col>

            {/* <Col className="" md="6">
              <Form.Group>
                <Form.Label>Opening Qty</Form.Label>

                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      "openingQty",
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue("openingQty", this.props.v)}
                />
              </Form.Group>
            </Col> */}
            {/* <Col className="" md="6">
              <Form.Group>
                <Form.Label>Opening Rate</Form.Label>

                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      "openingRate",
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue("openingRate", this.props.v)}
                />
              </Form.Group>
            </Col> */}

            {/* <Col className="" md="12">
              <Form.Group>
                <Form.Control
                  style={{
                    background: "#eee",
                    textAlign: "center",
                  }}
                  type="text"
                  placeholder="000.00"
                  onChange={(e) => {
                    this.props.handleChangeUnitArrayElement(
                      "openingeValuation",
                      e.target.value,
                      this.props.v
                    );
                  }}
                  value={this.setElementValue(
                    "openingeValuation",
                    this.props.v
                  )}
                />
              </Form.Group>
            </Col> */}
          </Row>
        </div>
      </Col>
    );
  }
}
