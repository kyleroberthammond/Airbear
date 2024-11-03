import { render } from "preact";

import { useEffect, useState } from "preact/hooks";
import { Button, Col, Container, Row } from "reactstrap";
import map from "lodash.map";
import clone from "lodash.clone";
import sumBy from "lodash.sumby";
import GaugeModalForm from "./AddGaugeModal";
import RightSidebar from "./RightSidebar";

import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import isEmpty from "lodash.isempty";
import GaugeTypes from "./GaugeTypes";

export function App() {
  const toggleEditing = () => setEditing(!editing);
  const [layoutObject, setLayoutObject] = useState({ rows: [] }); // The layout config json, can import a default one.
  const [gaugeModalOpen, setGaugeModalOpen] = useState(false);

  const [editing, setEditing] = useState(true);
  const [gaugeEditing, setGaugeEditing] = useState(null);
  const toggleGaugeModal = () => {
    setGaugeModalOpen(!gaugeModalOpen);
  };
  useEffect(() => {
    if (!isEmpty(gaugeEditing)) {
      toggleGaugeModal();
    }
  }, [gaugeEditing]);

  // Rows > Gauges
  // Example object
  // {rows:[
  //   {Gauges:[]},
  //   {Gauges:[]},
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
    console.log(gaugeValues);
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.rows[0].gauges.push({ saved: true, ...gaugeValues }); // Add the gauge to the first row for now

    // // Update the layout object with the new rows.
    setLayoutObject(newLayoutObject);
  };

  const updateGaugeInLayout = (gaugeValues) => {
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.rows[gaugeValues.rowIndex].gauges[gaugeValues.gaugeIndex] =
      gaugeValues; // Add the gauge to the first row

    // // Update the layout object with the new rows.
    setLayoutObject(newLayoutObject);
  };

  const removeGaugeFromLayout = (gaugeValues) => {
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.rows[gaugeValues.rowIndex].gauges.splice(
      gaugeValues.gaugeIndex,
      1
    ); // Add the gauge to the first row

    // // Update the layout object with the new rows.
    setLayoutObject(newLayoutObject);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={11}>
          {map(rows, (row, rowIndex) => {
            return (
              <RowOfGauges
                row={row}
                key={rowIndex}
                rowIndex={rowIndex}
                toggleGaugeModal={toggleGaugeModal}
                setGaugeEditing={setGaugeEditing}
                editing={editing}
              />
            );
          })}
          {editing && (
            <Row className="mt-2">
              <Col>
                <Button onClick={addRow}>Add Row</Button>
              </Col>
            </Row>
          )}
        </Col>
        <Col md={1} className="text-end mt-2">
          <RightSidebar toggleEditing={toggleEditing} />
        </Col>
      </Row>

      {gaugeModalOpen && (
        <GaugeModalForm
          isOpen={gaugeModalOpen}
          toggleGaugeModal={toggleGaugeModal}
          addGaugeToLayout={addGaugeToLayout}
          updateGaugeInLayout={updateGaugeInLayout}
          removeGaugeFromLayout={removeGaugeFromLayout}
          gaugeEditing={gaugeEditing}
        />
      )}
    </Container>
  );
}

const RowOfGauges = (props) => {
  const { row, rowIndex, toggleGaugeModal, editing, setGaugeEditing } = props;
  const { gauges } = row;

  const totalUsedWidth = sumBy(
    gauges,
    (g) => parseInt(g.containerWidth) + parseInt(g.offsetWidth)
  );

  return (
    <Row className="mt-2">
      {map(gauges, (gauge, gaugeIndex) => {
        const findGaugeType = GaugeTypes.find((gt) => gt.value === gauge?.type);
        if (findGaugeType) {
          return (
            <Col
              key={gaugeIndex}
              md={{ size: gauge?.containerWidth, offset: gauge?.offsetWidth }}
            >
              <findGaugeType.renderGauge
                editing={editing}
                gaugeValues={gauge}
                onGaugeClick={() => {
                  setGaugeEditing({ ...gauge, rowIndex, gaugeIndex });
                }}
              />
            </Col>
          );
        }
      })}
      {totalUsedWidth < 12 && editing && (
        <Col>
          <Button onClick={toggleGaugeModal}>Add Gauge</Button>
        </Col>
      )}
    </Row>
  );
};

render(<App />, document.getElementById("app"));
