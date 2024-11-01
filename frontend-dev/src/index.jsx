import { Fragment, render } from "preact";

import { useState } from "preact/hooks";
import { Button, Col, Container, Row } from "reactstrap";
import map from "lodash.map";
import clone from "lodash.clone";
import sumBy from "lodash.sumby";
import ReactRadialGauge from "./CanvasGauges/ReactRadialGuage";
import GaugeModalForm from "./GaugeModalForm";
import RightSidebar from "./RightSidebar";

import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

export function App() {
  const [layoutObject, setLayoutObject] = useState({ rows: [] }); // The layout config json, can import a default one.
  const [gaugeModalOpen, setGaugeModalOpen] = useState(false);

  const toggleGaugeModal = () => {
    setGaugeModalOpen(!gaugeModalOpen);
  };

  // Rows > Guages
  // Example object
  // {rows:[
  //   {guages:[]},
  //   {guages:[]},
  // ]}

  // const [data, setData] = useState({});
  // useEffect(() => {
  //   // This is the onload. You would setup the serial events incoming here.
  //   // As one hits you would update the data by calling setData which is just an object.
  //   // This automatically will rerender the components effected.
  //   // Basically your sse.js.
  //   // Waiting on my esp32 to arrive to test all this.
  // }, [])

  const { rows } = layoutObject;

  const addRow = () => {
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.rows.push({
      gauges: [],
    }); // Setup the new row object

    // Update the layout object with the new rows.
    setLayoutObject(newLayoutObject);
  };

  const addGaugeToLayout = (gaugeValues) => {
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.rows[0].gauges.push(gaugeValues); // Add the gauge to the first row

    // // Update the layout object with the new rows.
    setLayoutObject(newLayoutObject);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={11}>
          {map(rows, (row, index) => {
            return (
              <RowOfGauges
                row={row}
                key={index}
                index={index}
                toggleGaugeModal={toggleGaugeModal}
              />
            );
          })}
          <Row className="mt-2">
            <Col>
              <Button onClick={addRow}>Add Row</Button>
            </Col>
          </Row>
        </Col>
        <Col md={1} className="text-end mt-2">
          <RightSidebar />
        </Col>
      </Row>

      <GaugeModalForm
        isOpen={gaugeModalOpen}
        toggleGaugeModal={toggleGaugeModal}
        addGaugeToLayout={addGaugeToLayout}
      />
    </Container>
  );
}

const RowOfGauges = (props) => {
  const { row, index, toggleGaugeModal } = props;
  const { gauges } = row;

  const totalUsedWidth = sumBy(gauges, (g) => parseInt(g.containerWidth));

  console.log(totalUsedWidth);
  return (
    <Row className="mt-2">
      {map(gauges, (gauge, index) => {
        return (
          <Col key={index} md={gauge?.containerWidth}>
            <RenderGauge gaugeValues={gauge} />
          </Col>
        );
      })}
      {totalUsedWidth < 12 && (
        <Col>
          <Button onClick={toggleGaugeModal}>Add Gauge</Button>
        </Col>
      )}
    </Row>
  );
};

export const RenderGauge = (props) => {
  const { gaugeValues } = props;

  if (gaugeValues?.type == "radial") {
    return <ReactRadialGauge {...gaugeValues} />;
  }
};

render(<App />, document.getElementById("app"));
