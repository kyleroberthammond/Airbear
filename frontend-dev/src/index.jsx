import { render } from "preact";

// import "../css/style.css";
import { useState } from "preact/hooks";
import { Button, Col, Container, Modal, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import map from "lodash.map";
import clone from "lodash.clone";

export function App() {
  const [layoutObject, setLayoutObject] = useState({ rows: [] }); // The layout config json, can import a default one.
  const [gaugeModalOpen, setGaugeModalOpen] = useState(false);
  console.log(gaugeModalOpen);

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

  return (
    <Container fluid>
      {map(rows, (row, index) => {
        return (
          <RowOfGauges
            row={row}
            key={index}
            index={index}
            toggleGaugeModal={() => {
              setGaugeModalOpen(!gaugeModalOpen);
            }}
          />
        );
      })}

      <Row className="mt-2">
        <Col>
          <Button onClick={addRow}>Add Row</Button>
        </Col>
      </Row>

      <GaugeModal isOpen={gaugeModalOpen} />
    </Container>
  );
}

const RowOfGauges = (props) => {
  const { row, index, toggleGaugeModal } = props;
  return (
    <Row className="mt-2">
      <Col>
        <Button onClick={toggleGaugeModal}>Add Gauge</Button>
      </Col>
    </Row>
  );
};

const GaugeModal = (props) => {
  const { isOpen } = props;
  return <Modal isOpen={isOpen} trigger="legacy">Add new gauge here</Modal>;
};

render(<App />, document.getElementById("app"));
