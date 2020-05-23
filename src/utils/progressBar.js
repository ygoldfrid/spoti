export default function ProgressBar(width) {
  this.canvas = document.createElement("CANVAS");
  this.context = this.canvas.getContext("2d");
  this.canvas.width = width;
  this.canvas.height = 5;

  this.renderBar = function (elementId, initialValue, maxValue) {
    this.progressBar = document.getElementById(elementId);
    this.progressBar.appendChild(this.canvas);
    this.drawProgress(initialValue, maxValue);
  };

  this.drawProgress = function (position, maxValue) {
    const drawPosition = (position * this.canvas.width) / maxValue;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "#535353";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(0, 0, drawPosition, this.canvas.height);
  };

  this.handleClick = async (clientX, apiCall, maxValue) => {
    const progressPosition = this.progressBar.getBoundingClientRect().left;
    const drawPosition = clientX - progressPosition;
    const position = Math.floor((drawPosition * maxValue) / this.canvas.width);
    await apiCall(position);
    this.drawProgress(position, maxValue);
    return position;
  };
}
