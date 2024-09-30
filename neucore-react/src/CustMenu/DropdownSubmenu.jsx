import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";

export class DropdownSubmenu extends Component {
  refSubMenuContent = null;

  render() {
    let className = "dropdown-submenu-container";
    className = this.props.className
      ? className + " " + this.props.className
      : className;
    let show_class = "";
    let show = this.props.show;
    if (show == true) {
      show_class = " show";
    } else {
      show_class = " ";
    }
    return (
      <div className={className} id={this.props.id}>
        <a
          href={this.props.href}
          className="dropdown-item dropdown-submenu dropdown-toggle"
          onClick={this.onClick}
        >
          {this.props.title}
        </a>
        <div
          className={`dropdown-menu ${show_class}`}
          ref={(ref) => (this.refSubMenuContent = ref)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }

  onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.refSubMenuContent) {
      let show = false;
      if (this.refSubMenuContent.classList.contains("show")) {
        DropdownSubmenu.hideChildren(this.refSubMenuContent);
      } else {
        show = true;
        this.hideSibblings();
      }
      this.refSubMenuContent.classList.toggle("show");
      if (typeof this.props.onToggle === "function") {
        this.props.onToggle(show, event, { source: "select" });
      }
    }
  };

  hideSibblings = () => {
    if (this.refSubMenuContent) {
      const parents = DropdownSubmenu.getParents(
        this.refSubMenuContent,
        ".dropdown-menu.show"
      );
      if (parents.length > 1) {
        DropdownSubmenu.hideChildren(parents[1]);
      }
    }
  };

  static hideChildren(parent) {
    const children = parent.querySelectorAll(".dropdown-menu.show");
    for (const child of children) {
      child.classList.remove("show");
    }
  }

  static getParents(elem, selector) {
    const nodes = [];
    let element = elem;
    nodes.push(element);
    while (element.parentNode) {
      if (
        typeof element.parentNode.matches === "function" &&
        element.parentNode.matches(selector)
      ) {
        nodes.push(element.parentNode);
      }
      element = element.parentNode;
    }
    return nodes;
  }
}
