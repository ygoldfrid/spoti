import React, { Component } from "react";

class ProgressBar extends Component {
  state = {
    progressValue: 0,
    progressPosition: 0,
    context: undefined,
    canvas: undefined,
  };

  componentDidMount = () => {
    this.setBar();
  };

  setBar = () => {
    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");
    const progressBar = document.getElementById("progress-bar");
    const progressPosition = progressBar.getBoundingClientRect().left;
    canvas.width = 100;
    canvas.height = 5;
    progressBar.appendChild(canvas);
    this.setProgress(context, canvas);
    this.setState({ context, canvas, progressPosition });
  };

  setProgress = (context, canvas, progress = 50) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#5a5a5a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, progress, canvas.height);
  };

  handleClick = async ({ clientX }) => {
    const { context, canvas, progressPosition } = this.state;
    const progressValue = Math.floor(100 - progressPosition + clientX);
    console.log(progressValue);
    this.setState({ progressValue });
    this.setProgress(context, canvas, progressValue);
  };

  render() {
    return <div id="progress-bar" onClick={this.handleClick}></div>;
  }
}

export default ProgressBar;
