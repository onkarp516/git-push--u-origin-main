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
import { getMstPackageList, getAllUnit } from "@/services/api_functions";
import UnitLevel from "./UnitLevel";
import UnitSelect from "./UnitSelect";

export default class Packaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageOpts: [],
      unitLst: [],
    };
  }

  getMstPackageOptions = () => {
    getMstPackageList()
      .then((response) => {
        let data = response.data;
        if (data.responseStatus == 200) {
          let opts = data.list.map((v) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ packageOpts: opts });
        } else {
          this.setState({ packageOpts: [] });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    // let opts = [
    //   {
    //     label: 'ABC',
    //     value: 1,
    //   },
    //   {
    //     label: 'XYZ',
    //     value: 2,
    //   },
    // ];
    // this.setState({ packageOpts: opts });
  };
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
    this.getMstPackageOptions();
    this.lstUnit();
  }

  handlePackageUnit = (unitIndex, mstPackageIndex, element, value) => {
    let { mstPackaging, handleMstPackageState } = this.props;
    mstPackaging[mstPackageIndex]["units"][unitIndex][element] = value;

    handleMstPackageState(mstPackaging);
  };

  getPackageUnit = (unitIndex, mstPackageIndex, element) => {
    let { mstPackaging } = this.props;

    return mstPackaging
      ? mstPackaging[mstPackageIndex]["units"][unitIndex][element]
      : "";
  };

  handleUnitElement = (mstPackageIndex, element, value) => {
    let { mstPackaging, handleMstPackageState } = this.props;
    mstPackaging[mstPackageIndex][element] = value;
    handleMstPackageState(mstPackaging);
  };

  getUnitElement = (mstPackageIndex, element) => {
    let { mstPackaging } = this.props;

    return mstPackaging ? mstPackaging[mstPackageIndex][element] : "";
  };

  // let { mstUnits, mstPackaging } = this.state;

  // this.setState({ mstUnits: fUnits }, () => {
  //   this.setInitPackagingAfterUnitChanges();
  // });
  handleUnitCount = (value, mstPackageIndex) => {
    let { mstPackaging, handleMstPackageState } = this.props;

    mstPackaging = mstPackaging.map((v, i) => {
      if (i == mstPackageIndex) {
        let blankcnt = parseInt(value) - v.units.length;
        let fUnits = [...v.units];
        if (blankcnt > 0) {
          for (let index = 0; index < blankcnt; index++) {
            let single_unit = {
              unit_id: "",
              unit_conv: 0,
              unit_marg: 0,
              min_qty: 0,
              max_qty: 0,
              disc_amt: 0,
              disc_per: 0,
              mrp: 0,
              purchase_rate: 0,
              sales_rate: 0,
              min_sales_rate: 0,
              opening_qty: 0,
              opening_valution: 0,
            };
            fUnits.push(single_unit);
          }
          // let narr = new Array(blankcnt).fill(single_unit).map((v) => v);
          // console.log("narr", narr);
          // fUnits = [...v.units, ...narr];
        } else if (blankcnt < 0) {
          fUnits = fUnits.splice(0, value);
        }
        v.units = fUnits;
      }
      return v;
    });

    handleMstPackageState(mstPackaging);
  };
  render() {
    let {
      mstPackage,
      mstPackageIndex,
      handleRemovePackaging,
      handlePackageChange,
      getPackageSelected,
      mstUnits,
      is_packaging,
    } = this.props;
    let { packageOpts, unitLst } = this.state;

    return (
      <>
        <div className="mt-5 row-border px-3">
          <Row className="mb-4 pkg-row">
            <div className="pkg-div">
              <h6 className="title-style">
                {is_packaging && is_packaging == true ? "Packaging" : "Units"}
              </h6>
            </div>
            {is_packaging && is_packaging == true && (
              <>
                <Col md={1} xs={1}>
                  <Form.Label className="float-end">Package :</Form.Label>
                </Col>
                <Col md={2} xs={3}>
                  <Select
                    className="selectTo"
                    isClearable={true}
                    styles={customStylesWhite}
                    placeholder="Select"
                    onChange={(v, action) => {
                      if (action.action == "clear") {
                        handlePackageChange(mstPackageIndex, "");
                      } else {
                        handlePackageChange(mstPackageIndex, v);
                      }
                    }}
                    options={packageOpts}
                    value={getPackageSelected(mstPackageIndex)}
                  />
                  <span className="text-danger"></span>
                </Col>
              </>
            )}
            <Col md={1} xs={1} className="text-center mt-2">
              <Form.Group>
                <Form.Check
                  inline
                  label="Single Unit"
                  name={`is_multi_unit_${mstPackageIndex}`}
                  type={"radio"}
                  id={`sigle_unit_${mstPackageIndex}`}
                  checked={mstPackage.is_multi_unit == false ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        false
                      );
                      this.handleUnitElement(mstPackageIndex, "unitCount", 1);
                      this.handleUnitCount(1, mstPackageIndex);
                    } else {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        true
                      );
                    }
                  }}
                  value={this.getUnitElement(mstPackageIndex, "is_multi_unit")}
                />
              </Form.Group>
            </Col>

            <Col md={1} xs={1} className="text-center mt-2">
              <Form.Group>
                <Form.Check
                  inline
                  label="Multi Unit"
                  name={`is_multi_unit_${mstPackageIndex}`}
                  id={`multi_unit_${mstPackageIndex}`}
                  type={"radio"}
                  checked={mstPackage.is_multi_unit == false ? false : true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        true
                      );
                      this.handleUnitCount(1, mstPackageIndex);
                    } else {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        false
                      );
                    }
                  }}
                  value={this.getUnitElement(mstPackageIndex, "is_multi_unit")}
                />
              </Form.Group>
            </Col>
            {this.getUnitElement(mstPackageIndex, "is_multi_unit") == true && (
              <Col className="" md="1" xs={1}>
                <Form.Control
                  type="text"
                  placeholder="No of Unit"
                  name="unitCount"
                  onChange={(e) => {
                    let v = e.target.value;
                    this.handleUnitElement(mstPackageIndex, "unitCount", v);
                    this.handleUnitCount(v, mstPackageIndex);
                  }}
                  value={this.getUnitElement(mstPackageIndex, "unitCount")}
                  style={{ background: "transparent" }}
                />
              </Col>
            )}
            {is_packaging && is_packaging == true && mstPackageIndex != 0 && (
              <Col md={7}>
                <div className="text-end ">
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemovePackaging(mstPackageIndex);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      class="bi bi-dash-square-dotted"
                      viewBox="0 0 16 16"
                      style={{ color: "black" }}
                    >
                      <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834 0h.916v-1h-.916v1zm1.833 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                    </svg>
                  </a>
                </div>
              </Col>
            )}
          </Row>

          {mstPackage.units.length > 0 &&
            mstPackage.units.map((vv, ii) => {
              return (
                <UnitLevel
                  UnitData={vv}
                  unitIndex={ii}
                  mstPackageIndex={mstPackageIndex}
                  mstUnits={unitLst}
                  handlePackageUnit={this.handlePackageUnit.bind(this)}
                  getPackageUnit={this.getPackageUnit.bind(this)}
                />
              );
            })}
        </div>
      </>
    );
  }
}
