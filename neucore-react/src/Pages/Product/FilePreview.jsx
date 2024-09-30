import React from "react";
import { Col } from "react-bootstrap";
export default function FilePreview(props) {
  let { close_img, bg_img } = props;
  return (
    <>
      <Col md={3} xs={3}>
        <img class="imgA1 prd-img-style" src={close_img} alt="Logo" />
        <img class="imgB1 prd-img-style" src={bg_img} />
      </Col>
    </>
  );
}
