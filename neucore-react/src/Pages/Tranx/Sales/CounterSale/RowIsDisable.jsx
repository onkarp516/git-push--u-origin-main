import React from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { customStyles } from "@render/helpers";

export default function RowIsDisable(props) {
  const { i, productLst, setFieldValue, isDisabled } = props;
  return (
    <tr className="entryrow">
      <td style={{ width: "2%" }}>{i + 1}</td>
      <td style={{ width: "30%", background: "#f5f5f5" }}>
        <Select
          className="selectTo"
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          placeholder=""
          styles={customStyles}
          isClearable={!isDisabled}
          options={productLst}
          borderRadius="0px"
          colors="#729"
          onChange={(value, triggeredAction) => {
            if (triggeredAction.action === "clear") {
              // Clear happened
              // console.log("clear index=>", i);
              props.handleClearProduct(i);
            } else {
              props.handleChangeArrayElement(
                "productId",
                value,
                i,
                setFieldValue
              );
            }
          }}
          value={props.setElementValue("productId", i)}
          isDisabled={isDisabled}
        />
      </td>
      <td>
        <tr>
          <td>
            {" "}
            <Form.Control
              type="text"
              placeholder={props.handlePlaceHolder(
                props.setElementValue("productId", i),
                "qtyH"
              )}
              className="unitreadonly"
              onChange={(value) => {
                props.handleChangeArrayElement(
                  "qtyH",
                  value.target.value,
                  i,
                  setFieldValue
                );
              }}
              value={props.setElementValue("qtyH", i)}
              readOnly={
                isDisabled == true
                  ? true
                  : props.handleUnitLstOptLength(
                      props.setElementValue("productId", i)
                    ) > 0
                  ? false
                  : true
              }
              maxLength={4}
            />
          </td>
          <td>
            {" "}
            <Form.Control
              type="text"
              placeholder={props.handlePlaceHolder(
                props.setElementValue("productId", i),
                "qtyM"
              )}
              className="unitreadonly"
              onChange={(value) => {
                props.handleChangeArrayElement(
                  "qtyM",
                  value.target.value,
                  i,
                  setFieldValue
                );
              }}
              value={props.setElementValue("qtyM", i)}
              readOnly={
                isDisabled == true
                  ? true
                  : props.handleUnitLstOptLength(
                      props.setElementValue("productId", i)
                    ) > 1
                  ? false
                  : true
              }
              maxLength={4}
            />
          </td>
          <td>
            {" "}
            <Form.Control
              type="text"
              placeholder={props.handlePlaceHolder(
                props.setElementValue("productId", i),
                "qtyL"
              )}
              className="unitreadonly"
              onChange={(value) => {
                props.handleChangeArrayElement(
                  "qtyL",
                  value.target.value,
                  i,
                  setFieldValue
                );
              }}
              value={props.setElementValue("qtyL", i)}
              readOnly={
                isDisabled == true
                  ? true
                  : props.handleUnitLstOptLength(
                      props.setElementValue("productId", i)
                    ) > 2
                  ? false
                  : true
              }
              maxLength={4}
            />
          </td>
        </tr>
      </td>
      <td>
        <tr>
          <td>
            <Form.Control
              type="text"
              placeholder={props.handlePlaceHolder(
                props.setElementValue("productId", i),
                "rateH"
              )}
              className="unitreadonly"
              onChange={(value) => {
                props.handleChangeArrayElement(
                  "rateH",
                  value.target.value,
                  i,
                  setFieldValue
                );
              }}
              value={props.setElementValue("rateH", i)}
              readOnly={
                isDisabled == true
                  ? true
                  : props.handleUnitLstOptLength(
                      props.setElementValue("productId", i)
                    ) > 0
                  ? false
                  : true
              }
              maxLength={6}
            />
          </td>
          <td>
            {" "}
            <Form.Control
              type="text"
              placeholder={props.handlePlaceHolder(
                props.setElementValue("productId", i),
                "rateM"
              )}
              className="unitreadonly"
              onChange={(value) => {
                props.handleChangeArrayElement(
                  "rateM",
                  value.target.value,
                  i,
                  setFieldValue
                );
              }}
              value={props.setElementValue("rateM", i)}
              readOnly={
                isDisabled == true
                  ? true
                  : props.handleUnitLstOptLength(
                      props.setElementValue("productId", i)
                    ) > 1
                  ? false
                  : true
              }
              maxLength={6}
            />
          </td>
          <td>
            {" "}
            <Form.Control
              type="text"
              placeholder={props.handlePlaceHolder(
                props.setElementValue("productId", i),
                "rateL"
              )}
              className="unitreadonly"
              onChange={(value) => {
                props.handleChangeArrayElement(
                  "rateL",
                  value.target.value,
                  i,
                  setFieldValue
                );
              }}
              value={props.setElementValue("rateL", i)}
              readOnly={
                isDisabled == true
                  ? true
                  : props.handleUnitLstOptLength(
                      props.setElementValue("productId", i)
                    ) > 2
                  ? false
                  : true
              }
              maxLength={6}
            />
          </td>
        </tr>
      </td>

      <td>
        <Form.Control
          type="text"
          placeholder=""
          onChange={(value) => {
            props.handleChangeArrayElement(
              "dis_amt",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("dis_amt", i)}
          readOnly={isDisabled == true ? true : false}
        />
      </td>
      <td style={{ width: "4%" }}>
        <Form.Control
          type="text"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "dis_per",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("dis_per", i)}
          readOnly={isDisabled == true ? true : false}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "total_amt",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          style={{
            textAlign: "right",
            paddingRight: "23px",
          }}
          value={props.setElementValue("total_amt", i)}
          readOnly
        />
      </td>
      <td style={{ width: "4%" }}>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "gst",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("gst", i)}
          readOnly
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "total_igst",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("total_igst", i)}
          readOnly
          style={{
            textAlign: "right",
            paddingRight: "23px",
          }}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          style={{
            textAlign: "right",
            //paddingRight: "23px",
          }}
          className="gstreadonly"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "final_amt",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("final_amt", i)}
          readOnly={isDisabled == true ? true : false}
        />
      </td>
    </tr>
  );
}
