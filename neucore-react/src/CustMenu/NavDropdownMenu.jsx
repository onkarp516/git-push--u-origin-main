import * as React from "react";

import { NavDropdown } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

export class NavDropdownMenu extends React.Component {
  refElement = null;
  render() {
    return (
      <NavDropdown
        className={this.props.className}
        ref={(ref) => (this.refElement = ref)}
        title={this.props.title}
        id={this.props.id}
        onToggle={this.onToggle}
        alignRight={this.props.alignRight}
        bg={this.props.bg}
        disabled={this.props.disabled}
        active={this.props.active}
        menuRole={this.props.menuRole}
        renderMenuOnMount={this.props.renderMenuOnMount}
        rootCloseEvent={this.props.rootCloseEvent}
        bsPrefix={this.props.bsPrefix}
        drop={this.props.drop}
        show={this.props.show}
        flip={this.props.flip}
        focusFirstItemOnShow={this.props.focusFirstItemOnShow}
      >
        {this.props.children}
      </NavDropdown>
    );
  }

  onToggle = (show, event, metadata) => {
    if (this.refElement) {
      if (show === false) {
        const element = this.refElement;
        if (element) {
          const children = element.querySelectorAll(".dropdown-menu.show");
          for (const child of children) {
            child.classList.remove("show");
          }
        }
      }
    }
    if (typeof this.props.onToggle === "function") {
      this.props.onToggle(show, event, metadata);
    }
  };
}
