import React, { Component } from "react";

import deepai from "deepai";
import tachyons from "tachyons";
import ImageLinkForm from "./components/ImageLink/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
// import axios from "axios";
import "./App.css";

deepai.setApiKey(process.env.REACT_APP_API_KEY);

const particleParameter = {
  particles: {
    number: {
      value: 50,
    },
    size: {
      value: 3,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
    };
  }

  calculateFaceLocation = (data) => {
    console.log(data);
    const face = data.output.faces[0].bounding_box;
    const image = document.getElementById("image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      // bottomRow: width - face[3],
      leftCol: face[0],
      // rightCol: height - face[2],
      topRow: face[1],
      widthX: face[2],
      heightY: face[3],
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box });
  };

  callApi = async (url) => {
    await deepai
      .callStandardApi("facial-recognition", {
        image: url,
      })
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    this.callApi(this.state.input);
  };

  render() {
    const { imageUrl, box } = this.state;
    return (
      <div className="App">
        <h1 className="center" style={{ marginTop: "5em" }}>
          Face Detection
        </h1>
        <Particles className="particles" params={particleParameter} />

        <div className="content">
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      </div>
    );
  }
}

export default App;
