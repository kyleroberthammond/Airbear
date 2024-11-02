// This is just to implement the Radial Gauge from vanilla js to react

import { RadialGauge } from "canvas-gauges";
import { useEffect, useRef, useState } from "preact/hooks";

const ReactRadialGauge = (props) => {
  const [gauge, setGauge] = useState(null);
  const gaugeEl = useRef(null);

  useEffect(() => {
    const options = { ...props, renderTo: gaugeEl.current };
    const newGauge = new RadialGauge(options).draw();
    setGauge(newGauge);
  }, []);

  useEffect(() => {
    if (gauge) {
      gauge.value = props.value;
      gauge.update(props);
    }
  }, [props]);

  return <canvas ref={gaugeEl} {...props} />;
};

// class ReactRadialGauge extends React.Component {
//   componentDidMount() {
//     const options = Object.assign({}, this.props, {
//       renderTo: this.el,
//     });
//     this.gauge = new RadialGauge(options).draw();
//   }

//   componentWillReceiveProps(nextProps) {
//     this.gauge.value = nextProps.value;
//     this.gauge.update(nextProps);
//   }

//   render() {
//     return (
//       <canvas
//         ref={(canvas) => {
//           this.el = canvas;
//         }}
//         {...this.props}
//       />
//     );
//   }
// }

export default ReactRadialGauge;
