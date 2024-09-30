import React from "react";
import { Tabs, Tab } from "./index";
import Page1 from "@/Pages/Page1";
import Login from "@/Pages/Login/Login";
import { v4 as uuidv4 } from "uuid";
export default class MultiTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "untitled",
      icon: "*",
      selectedTab: "multitab0",
      tabs: [],
      currentImageIndex: 0,
    };
  }
  next = () => {
    this.setState((state) => {
      return {
        currentImageIndex: state.currentImageIndex + 1,
      };
    });
  };

  prev = () => {
    this.setState((state) => {
      return {
        currentImageIndex: state.currentImageIndex - 1,
      };
    });
  };
  pageChange = (args) => {
    console.log("arg", args);
    console.log("props", this.props);
    this.props.history.push("/" + args);
  };

  componentDidMount() {
    // console.log('this.props', this.props);
    this.setState({
      tabs: [
        <Tab
          key={"multitab0"}
          unclosable={true}
          title={"Login"}
          disableDrag={true}
        >
          <Login {...this.props} />
        </Tab>,
      ],
    });
    // window.electron.ipcRenderer.on('page-change', (arg) => {
    //   // eslint-disable-next-line no-console
    //   // console.log('page-change==>', arg);
    //   this.pageChange(arg);
    // });
  }

  componentWillReceiveProps(props) {
    let { tabs, selectedTab } = this.state;

    let { images } = this.props;
    let { currentImageIndex } = this.state;

    let findtabs = tabs.find((v) => v.key == selectedTab);
    let finalTabs = tabs;
    if (props.isNewTab != true) {
      finalTabs = tabs.filter((v) => v.key != selectedTab);
    }

    let tabkey = props.isNewTab == true ? uuidv4() : selectedTab;

    let newTab = (
      <Tab key={tabkey} title={props.title}>
        {props.children}
      </Tab>
    );
    let newTabs = finalTabs ? finalTabs.concat([newTab]) : [newTab];
    if (selectedTab === "multitab0") {
      newTabs = [newTab];
    }
    this.setState({
      tabs: newTabs,
      selectedTab: tabkey,
    });
  }

  handleChangeTitle() {
    // console.info(this.state.title);
    this.setState({ title: "something!!!" }, function () {
      console.info(this.state.title);
    });
  }

  handleTabSelect(e, key, currentTabs) {
    // console.log('handleTabSelect key:', key);
    this.setState({ selectedTab: key, tabs: currentTabs });
  }

  handleTabClose(e, key, currentTabs) {
    // console.log('tabClosed key:', key);
    this.setState({ tabs: currentTabs });
  }

  handleTabPositionChange(e, key, currentTabs) {
    // console.log('tabPositionChanged key:', key);
    this.setState({ tabs: currentTabs });
  }
  shouldTabClose(e, key) {
    // console.log('should tab close', e, key);
    // if (this.state.tabs.length > 1) {
    //   return window.confirm('Are your sure to close?');
    // } else {
    //   return;
    // }
    return this.state.tabs.length > 1
      ? window.confirm("Are your sure to close?")
      : null;
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
    let { tabs, selectedTab } = this.state;
    const key = "newTab_" + Date.now();
    let newTab;
    if (selectedTab != undefined) {
      let findtabs = tabs.find((v) => v.key == selectedTab);
      newTab = (
        <Tab key={key} title={findtabs.props.title}>
          {findtabs.props.children}
        </Tab>
      );
    } else {
      newTab = (
        <Tab key={key} title={"Login"}>
          <Login {...this.props} />
        </Tab>
      );
    }

    let newTabs = currentTabs.concat([newTab]);

    this.setState({
      tabs: newTabs,
      selectedTab: key,
    });
  }

  render() {
    return (
      <div>
        {/* <Tabs
          selectedTab={this.state.selectedTab ? this.state.selectedTab : 'tab2'}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          shouldTabClose={this.shouldTabClose.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={{
            close: ['alt+command+w', 'ctrl+q'],
            create: ['alt+command+t', 'ctrl+n'],
            moveRight: ['alt+command+tab', 'ctrl+left'],
            moveLeft: ['shift+alt+command+tab', 'ctrl+right'],
          }}
        /> */}
        <Tabs
          selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab2"}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          shouldTabClose={this.shouldTabClose.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={{
            close: ["alt+command+w", "ctrl+q"],
            create: ["alt+command+t", "ctrl+n"],
            moveRight: ["alt+command+tab", "ctrl+left"],
            moveLeft: ["shift+alt+command+tab", "ctrl+tab"],
          }}
          keepSelectedTab={true}
        />
      </div>
    );
  }
}
