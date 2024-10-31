import { render } from "preact";

import "../css/style.css";
import { useState } from "preact/hooks";
import ReactRadialGauge from "./CanvasGauges/ReactRadialGuage";
import { gaugeConfig_rpm, gaugeConfig_rpm2 } from "./gauges";

export function App() {
  const [layoutObject, setLayoutObject] = useState({}); // The layout config json, can import a default one.
  const [data, setData] = useState({});
  const [number, setNumber] = useState(0); // Initial number

  // useEffect(() => {
  //   // This is the onload. You would setup the serial events incoming here.
  //   // As one hits you would update the data by calling setData which is just an object.
  //   // This automatically will rerender the components effected.
  //   // Basically your sse.js.
  //   // Waiting on my esp32 to arrive to test all this.
  // }, [])

  return (
    <div>

    </div>
  );
}

render(<App />, document.getElementById("app"));
