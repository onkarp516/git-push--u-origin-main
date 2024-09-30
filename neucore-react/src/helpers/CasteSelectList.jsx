import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  createCaste,
  getAllCastes,
  getReligion,
  getCastesByReligion,
} from "@/services/api_functions";
import {
  Tooltip,
  Modal,
  CloseButton,
  // FormGroup,
  // Label,
  Input,
  FormFeedback,
  Row,
  Button,
  Col,
  Form,
} from "react-bootstrap";
import { getSelectValue, customStyles } from "@/helpers";
import { Formik } from "formik";
import * as Yup from "yup";

export default function ReligionSelectList(props) {
  const [isLoading, setisLoading] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [options, setoptions] = useState([]);
  const [opReligionList, setopReligionList] = useState([]);
  const [initVal, setinitVal] = useState({
    religionId: "",
    casteName: "",
  });

  const getReligionData = (setVal = null) => {
    getReligion()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          if (d.length > 0) {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.religionName };
            });
            setopReligionList(Opt);
          }
        }
      })
      .catch((error) => {
        setopReligionList([]);
        console.log("error", error);
      });
  };

  const getCasteData = (
    religionId,
    // initObj = null,
    // casteId = null,
    setVal = null
  ) => {
    let reqData = new FormData();
    reqData.append("religionId", religionId);
    getCastesByReligion(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.casteName };
            });
            setoptions(Opt);
            if (setVal != null && Opt.length > 0) {
              let caste = getSelectValue(Opt, setVal);
              props.setFieldValue("casteId", caste);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({ opCasteList: [] });
        console.log("error", error);
      });
  };

  //   const getCasteOption = (setVal = null) => {
  //     getAllCastes()
  //       .then((response) => {
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           let d = res.responseObject;
  //           let Opt = d.map(function (values) {
  //             return { value: values.id, label: values.casteName };
  //           });
  //           setoptions(Opt);
  //           if (setVal != null && Opt.length > 0) {
  //             let caste = getSelectValue(Opt, setVal);
  //             props.setFieldValue("casteId", caste);
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         this.setState({ data: [] });
  //         console.log("error", error);
  //       });
  //   };
  const onAddModalShow = (status) => {
    if (status == true) {
      let initVal = {
        religionId: props.religionId ? props.religionId : "",
        casteName: "",
      };
      setinitVal(initVal);
    }
    setAddModalShow(status);
  };
  const selecthandleChange = (newValue, actionMeta) => {
    props.setFieldValue("casteId", newValue);
  };

  useEffect(() => {
    // getCasteOption();
    getReligionData();
  }, []);
  useEffect(() => {
    // getCasteOption();
    // getReligionData();
    console.log(
      "props.religionId ==================>>>>>>>>",
      props.religionId
    );
    if (
      props.religionId != "" &&
      props.religionId != null &&
      props.religionId != undefined
    ) {
      console.log("props==---->>>>", props.religionId);

      getCasteData(props.religionId.value);
    } else {
      selecthandleChange("");
    }
  }, [props.religionId]);

  // console.log("props==>", props);
  return (
    <div>
      <Form.Label htmlFor="casteId" style={{ marginBottom: "0px" }}>
        Caste <span className="redstar">*</span>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            onAddModalShow(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-plus-square-dotted svg-style"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>{" "}
        </a>
      </Form.Label>
      <Select
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={selecthandleChange}
        options={options}
        value={props.value}
        name={props.name}
        id={props.id}
        styles={customStyles}
      />

      {/* Add Modal */}
      <Modal
        show={addModalShow}
        size="lg"
        className="groupnewmodal mt-5 mainmodal"
        onHide={() => onAddModalShow(false)}
        dialogClassName="modal-400w"
        // aria-labelledby="example-custom-modal-styling-title"
        aria-labelledby="contained-modal-title-vcenter"
        //centered
      >
        <Modal.Header
          //closeButton
          className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup form-header"
          style={{ paddingLeft: "0px" }}
        >
          <Modal.Title
            id="example-custom-modal-styling-title"
            className="form-header"
          >
            Caste
          </Modal.Title>
          <CloseButton
            // variant="white"
            className="pull-right"
            //onClick={this.handleClose}
            onClick={() => onAddModalShow(false)}
          />
        </Modal.Header>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={initVal}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            religionId: Yup.object().required("Select Religion"),
            casteName: Yup.string().trim().required("Caste name is required"),
          })}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            setStatus();
            let requestData = new FormData();
            requestData.append("religionId", values.religionId.value);
            requestData.append("casteName", values.casteName);

            createCaste(requestData)
              .then((response) => {
                if (response.data.responseStatus === 200) {
                  setSubmitting(false);
                  resetForm();
                  onAddModalShow(false);
                  setisLoading(false);
                  //   getCasteOption(response.data.response);
                  // setFieldValue();
                  getCasteData(values.religionId.value, response.data.response);
                } else {
                  setSubmitting(false);
                }
              })
              .catch((error) => {
                setSubmitting(false);
              });
          }}
          render={({
            errors,
            status,
            touched,
            isSubmitting,
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
          }) => (
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <Modal.Body className="p-4 p-invoice-modal common-form-style">
                <Row>
                  <Col md="3">
                    <Form.Group className="createnew">
                      <Form.Label>Religion</Form.Label>
                      <Select
                        className="selectTo"
                        styles={customStyles}
                        isClearable={true}
                        // styles={customStyles}
                        onChange={(v) => {
                          setFieldValue("religionId", v);
                        }}
                        name="religionId"
                        options={opReligionList}
                        value={values.religionId}
                        isDisabled={true}
                      />
                      <span className="text-danger errormsg">
                        {errors.religionId}
                      </span>
                    </Form.Group>
                  </Col>

                  <Col md="3">
                    <Form.Group>
                      <Form.Label>Caste</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Caste Name"
                        name="casteName"
                        id="casteName"
                        onChange={handleChange}
                        value={values.casteName}
                        isValid={touched.casteName && !errors.casteName}
                        isInvalid={!!errors.casteName}
                      />
                      <span className="text-danger errormsg">
                        {errors.casteName}
                      </span>
                      {/* </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer className="p-2">
                <Button
                  type="submit"
                  className="mainbtn1 mainhoverbtn text-white submitbtn formbtn"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Create
                </Button>

                <Button
                  className="mainbtn1 modalcancelbtn submitbtn cancelbtn formbtn"
                  type="button"
                  onClick={() => {
                    onAddModalShow(null);
                  }}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )}
        />
      </Modal>
    </div>
  );
}
