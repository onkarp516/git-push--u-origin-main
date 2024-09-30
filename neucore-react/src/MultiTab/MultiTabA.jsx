import React, { Component } from 'react';
import Tabs from 'react-draggable-tabs';
import HomePage from '@/pages/Home/HomePage';

export default class MultiTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: [
        {
          id: 1,
          content: 'Cute Cat',
          active: true,
          display: (
            <div>
              Cute Cat
              <HomePage />
            </div>
          ),
        },
        {
          id: 2,
          content: (
            <span>
              <i className="fa fa-paw" aria-hidden="true" /> Cute Dog
            </span>
          ),
          display: (
            <img
              src="http://slappedham.com/wp-content/uploads/2014/06/Cute-White-Dog.jpg"
              alt="cute dog"
              width="500px"
            />
          ),
        },
        {
          id: 3,
          content: 'Cute Duck',
          display: (
            <iframe
              title="DuckDuckGo"
              src="https://duckduckgo.com/"
              style={{
                border: '0',
                margin: '50px',
                width: '500px',
                height: '800px',
              }}
            />
          ),
        },
      ],
    };
  }

  moveTab(dragIndex, hoverIndex) {
    console.log('dragIndex', dragIndex);
    console.log('hoverIndex', hoverIndex);
    // this.setState((state, props) => {
    //   let newTabs = [...state.tabs];
    //   newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);
    //
    //   return { tabs: newTabs };
    // });
  }

  selectTab(selectedIndex, selectedID) {
    this.setState((state, props) => {
      const newTabs = state.tabs.map((tab) => ({
        ...tab,
        active: tab.id === selectedID,
      }));
      return { tabs: newTabs };
    });
  }

  closedTab(removedIndex, removedID) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(removedIndex, 1);

      if (state.tabs[removedIndex].active && newTabs.length !== 0) {
        // automatically select another tab if needed
        const newActive = removedIndex === 0 ? 0 : removedIndex - 1;
        newTabs[newActive].active = true;
      }

      return { tabs: newTabs };
    });
  }

  addTab() {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.push({
        id: newTabs.length + 1,
        content: 'Cute *',
        display: <div key={newTabs.length + 1}>Cute *</div>,
      });

      return { tabs: newTabs };
    });
  }

  render() {
    const activeTab = this.state.tabs.filter((tab) => tab.active === true);
    return (
      <div>
        <Tabs
          moveTab={this.moveTab.bind(this)}
          selectTab={this.selectTab.bind(this)}
          closeTab={this.closedTab.bind(this)}
          tabs={this.state.tabs}
        >
          <button onClick={this.addTab.bind(this)}>+</button>
        </Tabs>
        {activeTab.length !== 0 ? activeTab[0].display : ''}
      </div>
    );
  }
}
