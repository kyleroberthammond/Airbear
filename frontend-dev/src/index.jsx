import { Fragment, render } from "preact";

// import "../css/style.css";
import { useState } from "preact/hooks";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import map from "lodash.map";
import clone from "lodash.clone";
import ReactRadialGauge from "./CanvasGauges/ReactRadialGuage";
import GaugeModalForm from "./GaugeModalForm";

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
          <Button onClick={addRow}>Add Row of gauges</Button>
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

  return (
    <Fragment>
      <Row>
        {map(gauges, (gauge, index) => {
          return (
            <Col key={index} md={gauge?.containerWidth}>
              <RenderGauge gaugeValues={gauge} />
            </Col>
          );
        })}
        <Col>
          <Button onClick={toggleGaugeModal}>Add Gauge</Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export const RenderGauge = (props) => {
  const { gaugeValues } = props;

  if (gaugeValues?.type == "radial") {
    return <ReactRadialGauge {...gaugeValues} />;
  }
};

render(<App />, document.getElementById("app"));
