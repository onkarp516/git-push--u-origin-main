import { authenticationService } from "@/services/api_functions";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  FormControl,
  Modal,
  Spinner,
} from "react-bootstrap";

export const OTPTimeoutMinutes = 5;
export const OTPTimeoutSeconds = 0;
// Mobile Regex
export const MobileRegx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
//Only character allowed regex
export const alphaRegExp = /^(([a-zA-Z\s]))+$/;
//Only letter accept
export const onlyletterPattern = /^[A-Za-z][A-Za-z\s]*$/;
// Alphanumeric Regex
export const alphaNumericRex = /^[a-zA-Z0-9]*$/;
export const drivingLicenseNewRex = /^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/;

// !Driving Licence
// !example=> MH12 20190034760
export const drivingLicenseReg =
  /^(([A-Z]{2}[0-9]{2})()|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;

export const ReceiptNoRegx =
  /^(([A-Z]){2}[0-9]{5}[-]{1}[0-9]{4}[-]{1}[0-9]{3})$/;

export const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
// !url regular expression
export const urlRegExp =
  /^((https?):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;

// AdharNo Regex
export const numericRegExp =
  /^((\\+[7-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const EMAILREGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;

export const onlydigitsRegExp = /^[0-9]*$/;

export const ADHAAR_REGEX = "^[2-9]{1}[0-9]{11}$";

export const ifsc_code_regex = "^[A-Z]{4}0[A-Z0-9]{6}$";

export const pan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

export const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const SUPPORTED_FORMATS_PDF = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const pincodeReg = /^[1-9][0-9]{5}$/;

export const postalCode = /(^\d{6}$)|(^\d{5}-\d{4}$)/;

export const bankAccountNumber = /^\d{6,18}$/;

export const characterRegEx = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

export const Accepts_numeric_regex = /^(0|[1-9][0-9]*)$/;

export const only_alphabets = /^[a-zA-Z\s]+$/;

export const alphanumericRegEx = /^[\w\s]*$/;

export const alphanumericWithCommaRegEx = /^[\w\s,_@./!@#$%^&*()-_+]*$/;

export const doubleNumRegEx = /^[0-9]+(\.[0-9]+)?$/;

export const autoCapitalize = (input) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const getSelectValue = (opts, val) => {
  return opts.find((o) => o.value === val);
};

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

export const calculatePercentage = (amt, per) => {
  let res = (parseFloat(per) / 100) * parseFloat(amt);
  return res;
};

export const calculatePrValue = (final_amt, discount_amt, total_amt) => {
  let res = parseFloat(
    (parseFloat(discount_amt) * parseFloat(total_amt)) / parseFloat(final_amt)
  );

  return res;
};

export const customStyles = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    ///border: 'none',
    //paddingBottom: "12px",
    // boxShadow: 'none',
    // border: '1px solid #ccc',
    border: "none",
    boxShadow: "0px 2px 0px #cacaca !important",
    borderRadius: "3px",
    // marginTop: "-5px",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
  }),
  // dropdownIndicator: (base) => ({
  //   ...base,
  //   padding: "5px",
  // }),

  // menuPortal: (base) => ({
  //   ...base,
  //   zIndex: '9999'
  // }),
  // menu: (base) => ({
  //   ...base,
  //   zIndex: '9999'
  // })

  // options: {
  //   zIndex: "9999"
  // }
};

export const customStylesForJoin = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    ///border: 'none',
    //paddingBottom: "12px",
    // boxShadow: 'none',
    // border: '1px solid #ccc',
    border: "none",
    boxShadow: "0px 2px 0px #cacaca !important",
    borderRadius: "3px",
    marginTop: "-1px !important",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "5px",
  }),
};

export const customStylesWhite = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    border: "none",
    boxShadow: "0px 2px 0px #cacaca !important",
    borderRadius: "3px",
    marginTop: "-3px",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
    background: "transperent",
    backgroundColor: "transparent",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "5px",
  }),
};

export const OnlyEnterNumbers = (e) => {
  var regex = new RegExp("^[0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
  return false;
};

export const OnlyEnterAlphaNumbers = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
  return false;
};

export const InputMaskNumber = () => {
  // ^([0-9]{0,3}|0)(,[0-9]{3})?(,[0-9]{3})?(\.[0-9]{1,2})?$
};

export const isPermission = (acceeCode = null, actions = null) => {
  const secureData =
    authenticationService.currentUserValue &&
    JSON.parse(authenticationService.currentUserValue.permissionJson);
  console.log({ secureData });

  let accessContolList = secureData && secureData.accessContolList;

  accessContolList.map((v, i) => {
    if (v.accessCode == acceeCode) {
      if (v.permissions.includes(actions)) {
        let perm = v.permissions.find((vi) => vi == actions);
        if (perm && perm == true) {
          return true;
        }
      }
    }
  });
  return false;
};

export const isWriteAuthorized = (slug = null, permission = null) => {
  // const secureData = JSON.parse(localStorage.getItem("loginUser"));
  // if (secureData && secureData.isAdmin == true) {
  //   return true;
  // } else {
  //   let policies =
  //     secureData != null ? JSON.parse(secureData.permission) : undefined;

  //   if (policies && policies[parentpermission][subpermission] == "write") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  return true;
};

export const convertToSlug = (Text) => {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const getValue = (opts, val) => opts.find((o) => o.value === val);

export const ArraySplitChunkElement = (inputArray, perChunk = 10) => {
  var result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return result;
};

export const ordinal_suffix_of = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
};

// export const numberWithCommasIN = (x) => {
//   x = x.toString();
//   let lastThree = x.substring(x.length - 3);
//   let otherNumbers = x.substring(0, x.length - 3);
//   if (otherNumbers != "") lastThree = "," + lastThree;
//   let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//   return res;
// };

export const numberWithCommasIN = (x, isDecimal = false, noz = 2) => {
  x = x.toString();
  // console.log("x", x);
  let y = x.split(".");
  x = y[0];
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  let arrf = new Array(noz).fill("0");
  let resd = y[1] ? y[1] : arrf.join("");

  return isDecimal == true ? res + "." + resd : res;
};

export const LoadingComponent = (showloader = false) => {
  return (
    <Modal
      show={showloader}
      backdrop="static"
      keyboard={false}
      size={"sm"}
      centered
      className="bg-transparent"
      dialogClassName="bg-transparent"
      contentClassName="bg-transparent border-0"
    >
      <div className="bg-transparent text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </Modal>
  );
};
