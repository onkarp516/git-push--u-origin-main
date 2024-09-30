import React, { Component } from 'react';
import { Col, Row, Form, Table } from 'react-bootstrap';
import { getAllUnit } from '@/services/api_functions';
import Select from 'react-select';

import { customStylesWhite } from '@/helpers';
export default class UnitSelect extends Component {
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
              return { value: values.id, label: values.unitCode, ...values };
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
  render() {
    let { unitLst } = this.state;
    let { mstUnits } = this.props;
    return (
      <>
        {mstUnits.length > 0 &&
          mstUnits.map((v, i) => {
            return (
              <Col className="" md="1" xs={1}>
                <Select
                  className="selectTo"
                  isClearable={true}
                  styles={customStylesWhite}
                  placeholder={`Unit ${i + 1}`}
                  options={unitLst}
                  // onChange={(value, action) => {
                  //   hadleUnitMst(value, action, i);
                  // }}
                  // values={getUnitMst(i)}
                />
              </Col>
            );
          })}
      </>
    );
  }
}
