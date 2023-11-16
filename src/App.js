import { useState, useRef, useEffect } from "react";
import "./styles.css";
import "./loader.css";
import domtoimage from "dom-to-image";
import { professions as emojis } from "./emojis";

const colours1 = ["#227c9d", "#17c3b2", "#ffcb77", "#fef9ef", "#fe6d73"];
const colours2 = ["#38a3a5", "#57cc99", "#80ed99", "#c7f9cc", "#0fa3b1"];
const colours3 = ["#48cae4", "#8d99ae", "#edf2f4", "#fb6f92", "#ef233c"];
const numbers = new Array(10).fill(1).map((_, index) => index);
const colours = [colours1, colours2, colours3];

export function fetchAPI(callback) {
  // param is a highlighted word from the user before it clicked the button
  return fetch("https://api.quotable.io/quotes/random?maxLength=100").then(
    callback
  );
}

export default function App() {
  const [colourPalette, setColourPalette] = useState(
    colours[Math.floor(Math.random() * colours.length)]
  );
  const [rowStarts, setRowStarts] = useState([0, 0]);
  const [rowEnds, setRowEnds] = useState([0, 0]);
  const [columnStarts, setColumnStarts] = useState([0, 0]);
  const [columnEnds, setColumnEnds] = useState([0, 0]);
  const [emoji, setEmoji] = useState(emojis[0]);
  const [loading, setLoading] = useState();
  const [quote, setQuote] = useState({
    content: "Nobody said NOTHING!",
    author: "Nobody",
    tags:new Array(5).fill('My new tag')
  });
  const downloadRef = useRef();

  const generate = () => {
    if (loading) return;
    setColourPalette(colours[Math.floor(Math.random() * 3)]);
    setRowStarts(numbers.map(() => Math.floor(Math.random() * 10)));
    setRowEnds(numbers.map(() => Math.floor(Math.random() * 20)));
    setColumnStarts(numbers.map(() => Math.floor(Math.random() * 10)));
    setColumnEnds(numbers.map(() => Math.floor(Math.random() * 20)));
    setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    setLoading(true);
    fetch("https://api.quotable.io/quotes/random?maxLength=200")
      .then((result) => result.json())
      .then((x) => {
        setQuote(x[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const download = () => {
    const targetEl = downloadRef.current;
    domtoimage.toJpeg(targetEl, { quality: 0.95 }).then((dataUrl) => {
      let link = document.createElement("a");
      link.download = "profile banner.jpeg";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <span className="logo" aria-label="Ract Art logo">
          <span>💬</span>
          <span>uotter</span>
        </span>
        <div className="btn-wrapper">
          <button className="btn generate" onClick={generate}>
            Randomize
          </button>
          <button className="btn download" onClick={download}>
            Sceenshot
          </button>
        </div>
      </header>
      <div className="box-wrapper" ref={downloadRef}>
        <div className="box">
          {numbers.map((number) => {
            return (
              <div
                id={number}
                key={`${colourPalette[number % 5]}-${number}`}
                className="gridItem"
                style={{
                  backgroundColor: colourPalette[number % 5],
                  gridRowStart: rowStarts[number],
                  gridRowEnd: rowEnds[number],
                  gridColumnStart: columnStarts[number],
                  gridColumnEnd: columnEnds[number]
                }}
              />
            );
          })}
          <div key="profile" className="gridItem profile">
            {/* ♥<span>ﻌ</span>♥ */}
            {emoji}
          </div>
        </div>
        <div className="box content">
          {loading && (<span class="loader"></span>)}
          {!loading && quote && (<figure>
            <blockquote>
              {quote.content}
            </blockquote>
            <figcaption>- {quote.author}</figcaption>
            {/* <div className="tags">{quote.tags?.length && quote.tags?.map(x => <small>{x}</small>)}</div> */}
          </figure>)}
        </div>

      </div>
    </div>
  );
}
