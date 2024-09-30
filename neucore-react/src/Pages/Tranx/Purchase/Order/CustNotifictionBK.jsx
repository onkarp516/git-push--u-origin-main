<Button
className="mr-2 refresh-btn"
type="button"
onClick={(e) => {
  e.preventDefault();
  this.setState({ successAlert: true });
}}
>
Success
</Button>
<Button
className="mr-2 refresh-btn"
type="button"
onClick={(e) => {
  e.preventDefault();
  this.setState({ warningAlert: true });
}}
>
Warning
</Button>
<Button
className="mr-2 refresh-btn"
type="button"
onClick={(e) => {
  e.preventDefault();
  this.setState({ errorAlert: true });
}}
>
Error
</Button>
<Button
className="mr-2 refresh-btn"
type="button"
onClick={(e) => {
  e.preventDefault();
  this.setState({ confirmAlert: true });
}}
>
Confirmation
</Button>




        {/* Sucess Alert */}
        <Modal
          show={successAlert}
          size="md"
          className="success-alert"
          onHide={() => {
            this.setState({ successAlert: false });
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
                this.setState({ successAlert: false });
              }}
            />{" "}
          </Modal.Header>
          <Modal.Body className="text-center">
            <img alt="" src={success_icon} />
            <p className="title">Success</p>
            <p className="msg">Company Created Successfully!</p>
            <Button className="sub-button" type="submit">
              Done
            </Button>
          </Modal.Body>
        </Modal>

        {/* Warning Alert */}
        <Modal
          show={warningAlert}
          size="md"
          className="warning-alert"
          onHide={() => {
            this.setState({ warningAlert: false });
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
                this.setState({ warningAlert: false });
              }}
            />{" "}
          </Modal.Header>
          <Modal.Body className="text-center">
            <img alt="" src={warning_icon} />
            <p className="title">Warning</p>
            <p className="msg">Your password is too weak update now.</p>
            <Button className="sub-button" type="submit">
              Close
            </Button>
          </Modal.Body>
        </Modal>
        {/* error Alert */}
        <Modal
          show={errorAlert}
          size="md"
          className="error-alert"
          onHide={() => {
            this.setState({ errorAlert: false });
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
                this.setState({ errorAlert: false });
              }}
            />{" "}
          </Modal.Header>
          <Modal.Body className="text-center">
            <img alt="" src={error_icon} />
            <p className="title">Error</p>
            <p className="msg">
              The last performed transaction was unseccessfully.
            </p>
            <Button className="sub-button" type="submit">
              Close
            </Button>
          </Modal.Body>
        </Modal>
        {/* confirm Alert */}
        <Modal
          show={confirmAlert}
          size="md"
          className="confirm-alert"
          onHide={() => {
            this.setState({ confirmAlert: false });
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
                this.setState({ confirmAlert: false });
              }}
            />{" "}
          </Modal.Header>
          <Modal.Body className="text-center">
            <img alt="" src={question_icon} />
            <p className="title">Confirmation</p>
            <p className="msg">Are you sure want to delete this transaction.</p>
            <Button
              className="sub-button"
              type="submit"
              style={{ marginRight: "10px" }}
            >
              Yes
            </Button>
            <Button className="sub-button btn btn-secondary" type="submit">
              No
            </Button>
          </Modal.Body>
        </Modal>