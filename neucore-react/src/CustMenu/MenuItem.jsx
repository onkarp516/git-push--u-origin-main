import * as React from "react";
import { Dropdown } from "react-bootstrap";
import { SelectCallback } from "react-bootstrap/helpers";
import { DropdownItemProps } from "react-bootstrap/DropdownItem";

export class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.eventKey = this.props.eventKey;
  }
  render() {
    return (
      <Dropdown.Item
        id={this.props.id}
        href={this.props.href}
        title={this.props.title}
        className={this.props.className}
        onSelect={this.onSelect}
        active={this.props.active}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </Dropdown.Item>
    );
  }

  onSelect = (eventKey, event) => {
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(this.props.eventKey, event);
    }
  };
}
