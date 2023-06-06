import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import * as tf from "@tensorflow/tfjs";
import { PERMANENT_REDIRECT_STATUS } from "next/dist/shared/lib/constants";
import DrawableCanvas from "../component/draw";
export default function Home() {
  const canvasRef = useRef(null);
  const [clear, setClear] = useState(false);
  const [image, setImage] = useState(null);
  const [models, setModel] = useState(null);
  const [score, SetScore] = useState(null);
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    const model = await tf.loadLayersModel("model.json");
    setModel(model);
    model.summary();
  };

  const view = async (imageData) => {
    setClear(false);
    SetScore(null);

    await tf.tidy(() => {
      let img = tf.browser.fromPixels(imageData, 1);
      img = img.reshape([1, 28, 28, 1]);
      img = tf.cast(img, "float32");

      const outputs = models.predict(img);
      const pros = tf.softmax(Array.from(outputs.dataSync()));
      const arr = Array.from(outputs.dataSync());

      const max = Math.max(...arr);

      const index = arr.indexOf(max);
      SetScore(index);
      pros.print();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      {score ? <h1 className=" text-5xl font-mono">{score}</h1> : ""}

      <h4 className="py-3  text-lg">
      CNN for MNIST Handwritten Digit Classification using keras and  tensorflow.js .Python code available{" "}
        <a
          className="text-cyan-800"
          href="https://colab.research.google.com/drive/15XcZ5igPtPom_YGg3PIl29UfBFREDPBE#scrollTo=xUErtkwn0jVr"
        >
          link
        </a>
      </h4>
      <p className="py-3 text-red-500 text-sm">
        Draw a single digit on the canvas below
      </p>
      <DrawableCanvas onGetImage={view} clear={clear} brushColor={"white"} />

      <button
        className="bg-cyan-800 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 "
        onClick={() => {
          setClear(true);
        }}
      >
        clear
      </button>
    </div>
  );
}
