import React, { Component } from "react";
import { Modal, CloseButton, Button, Table } from "react-bootstrap";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import { eventBus } from "@/helpers";
import { deleteFeestransaction } from "@/services/api_functions";
class MyNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      icon: "success",
      title: "Success",
      msg: "Successfully",
      is_button_show: false,
      is_timeout: false,
      delay: 100,
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      supplierData: "",
      invoice_no: 0,
      transactionId: 0,
      receiptNo: 0,
      handleFn: "",
      handleFailureFun: "",
    };
    this.handleFire = this.handleFire.bind(this);
  }

  handleHide = () => {
    this.setState({ show: false });
  };
  handleFire = ({
    show,
    icon = "success",
    title = "Success",
    msg = "Successfully",
    is_button_show = false,
    is_timeout = false,
    delay = 0,
    handleFn,
    handleFailureFun,
  }) => {
    this.setState({
      show: show,
      icon: icon,
      title,
      msg,
      is_button_show,

      handleFn,
      handleFailureFun,
    });
    if (is_timeout == true) {
      setTimeout(() => {
        this.handleHide();
      }, delay);
    }
  };

  static fire({
    show,
    icon = "success",
    title = "Success",
    msg = "Successfully",
    is_button_show = false,
    is_timeout = false,
    delay = 0,
    handleFn,
    handleFailureFun,
  }) {
    eventBus.dispatch("mynotification", {
      show,
      icon,
      title,
      msg,
      is_button_show,
      is_timeout,
      delay,

      handleFn,
      handleFailureFun,
    });
  }

  handleImage = () => {
    let { icon } = this.state;
    switch (icon) {
      case "success":
        return <img alt="" src={success_icon} />;
        break;
      case "warning":
        return <img alt="" src={warning_icon} />;
        break;
      case "error":
        return <img alt="" src={error_icon} />;
        break;
      case "confirm":
        return <img alt="" src={confirm_icon} />;
        break;
      default:
        return <img alt="" src={success_icon} />;
        break;
    }
  };

  componentDidMount() {
    eventBus.on("mynotification", this.handleFire);
  }

  componentWillUnmount() {
    eventBus.remove("mynotification");
  }

  // DeleteFeesTransactions = (transactionId, receiptNo) => {
  //   let requestData = new FormData();
  //   requestData.append("transactionId", transactionId);
  //   requestData.append("receiptNo", receiptNo);

  //   deleteFeestransaction(requestData)
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         MyNotifications.fire({
  //           show: true,
  //           icon: "success",
  //           title: "Success",
  //           msg: "Deleted Fees Record Succesfully !",
  //           is_timeout: true,
  //           delay: 1000,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  render() {
    let {
      show,
      icon,
      title,
      msg,
      is_button_show,
      customerData,
      invoiceData,
      invoiceDetails,
      supplierData,
      invoice_no,
      transactionId,
      receiptNo,
    } = this.state;

    return (
      <div>
        {" "}
        <Modal
          show={show}
          size="md"
          className={`${icon}-alert`}
          onHide={() => {
            this.setState({ show: false });
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <CloseButton
              variant="black"
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                this.handleHide();
              }}
            />
          </Modal.Header>
          <Modal.Body className="text-center">
            {this.handleImage()}
            <p className="title">{title}</p>
            <p className="msg">{msg}</p>
            {icon === "confirm" && (
              <>
                <Button
                  className="sub-button"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    // this.DeleteFeesTransactions(transactionId, receiptNo);

                    this.state.handleFn();
                    this.handleHide();
                  }}
                >
                  Yes
                </Button>
                <Button
                  className="sub-button btn-danger"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();

                    this.state.handleFailureFun();
                    this.handleHide();
                  }}
                >
                  No
                </Button>
              </>
            )}
            {isNaN(is_button_show) !== false && is_button_show == true && (
              <Button
                className="sub-button"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleHide();
                }}
              >
                Ok
              </Button>
            )}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export { MyNotifications };
