import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import clock_icon from "@/assets/images/1x/clock_icon.png";
export default class Datetime extends Component {
  constructor(props) {
    super(props);
    this.countDownId = null;
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: false,
      counter: 1,
    };
  }

  // componentDidMount() {
  //   this.countDownId = setInterval(this.timerInit, 1000);
  // }

  componentDidMount() {
    var timer = setInterval(this.timerInit, 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }

  componentWillUnmount() {
    if (this.countDownId) {
      clearInterval(this.countDownId);
    }
  }

  timerInit = () => {
    // const { startDate } = this.props;
    // const ntime = getTimesFromInput(currentTime * 1000);
    // const now = new Date().getTime();

    let startDate = new Date();

    if (!startDate) {
      this.setState({ expired: true });
      return;
    }
    const now = new Date().getTime();

    const distance = now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // For countdown is finished
    if (distance < 0) {
      clearInterval(this.countDownId);
      this.setState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true,
        counter: 1,
      });
      return;
    }
    this.setState({
      days,
      hours,
      minutes,
      seconds,
      expired: false,
      counter: this.state.counter + 1,
    });
  };

  render() {
    var date = new Date();
    return (
      <>
        <Nav>
          <Nav.Link href="#deets" className="bgtime">
            <p>
              {" "}
              {date.toLocaleDateString()},{date.toLocaleTimeString()}
              <img alt="Date Time" src={clock_icon} />
            </p>
          </Nav.Link>
        </Nav>
      </>
    );
  }
}
