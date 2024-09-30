import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";

import Select from "react-select";
import {
  customStyles,
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
} from "@/helpers";
import {
  createAssociateGroup,
  updateAssociateGroup,
  getUnderList,
  getAssociateGroups,
} from "@/services/api_functions";

export default class LedgerBillbyBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      },
      undervalue: [],
      associategroupslst: [],
    };
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  setTheme(color) {
    if (color === "default") color = "#1e3989";

    document.documentElement.style.setProperty("--main-color", color);
  }
  render() {
    const { show, initValue, undervalue, associategroupslst } = this.state;
    // const customStyles = {
    //   control: (base) => ({
    //     ...base,
    //     height: 31,
    //     minHeight: 31,
    //     border: 'none',
    //     borderBottom: '1px solid #ccc',
    //     fontSize: '13px',
    //     //paddingBottom: "12px",
    //     boxShadow: 'none',
    //     //lineHeight: "20px",
    //   }),
    // };
    return (
      <div className="">
        <div className="dashboardpg institutepg">
          <Row>
            <Col md="4"></Col>
            <Col md="5">
              <div className="gstwindow">
                <Row>
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Bill No.</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Bill No."
                        name="Billno"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Bill Dt.</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Date"
                        name="date"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Bill Amt</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="000.00"
                        name="billamt"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md="3"></Col>
            {/* <hr style={{ margin: "0px", paddingBottom: "7px" }} /> */}
          </Row>
        </div>
      </div>
    );
  }
}
