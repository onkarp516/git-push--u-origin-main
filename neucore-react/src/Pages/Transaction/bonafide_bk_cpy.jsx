{
  /* <> */
}
<Formik
  innerRef={this.transFormRef}
  initialValues={initVal}
  enableReinitialize={true}
  validationSchema={Yup.object().shape({})}
  onSubmit={(values, { resetForm, setSubmitting }) => {
    // this.setState({ isLoading: true });
    setSubmitting(false);
    this.setState({ initVal: values }, () => {
      this.getInstallmentStructure();
    });
    // console.log({ values });
  }}
  render={({
    errors,
    status,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
    values,
  }) => (
    <Form>
      <Row>
        <Col lg="2">
          <div
            style={{
              border: "1px solid black",
              width: "198px",
              height: "198px",
              marginTop: "20px",
            }}
          >
            <p style={{ marginTop: "80px" }}> Photo</p>
          </div>
        </Col>
        <Col lg="10">
          <div>
            <h1
              className="mb-0"
              style={{ fontWeight: "600", fontSize: "67px" }}
            >
              SUYASH GURUKUL /JR COLLEGE
            </h1>
            <p style={{ fontWeight: "600", fontSize: "30px" }}>
              Opp. SRP Camp,Vijapur Road,Solapur,Ph-0217/2744921{" "}
            </p>
            <div
              style={{
                border: "3px solid black",
                borderRadius: "15px",
                width: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              className="mt-3"
            >
              <h3
                className="mb-0"
                style={{ fontWeight: "900", fontSize: "30px" }}
              >
                BONAFIDE & CHARACTER CERTIFICATE
              </h3>
            </div>
            <Row className="mt-3 mx-4">
              <Col lg="5">
                {/* <Form.Group
                    //   as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    > */}
                {/* <Form.Label> */}
                <h5 style={{ fontSize: "30px", fontWeight: "500" }}>
                  G.R.No.:______________________
                </h5>
                {/* </Form.Label> */}
                {/* </Form.Group> */}
              </Col>
              <Col lg="5" className="ms-5">
                {/* <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label> */}
                <h5 style={{ fontSize: "30px", fontWeight: "500" }}>
                  {" "}
                  Date:______________________
                </h5>
                {/* </Form.Label>
                    </Form.Group> */}
              </Col>
            </Row>
          </div>
        </Col>
        {/* <Col lg="1"></Col> */}
      </Row>
    </Form>
  )}
/>;
