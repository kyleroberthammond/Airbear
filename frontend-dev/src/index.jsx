import { Fragment, render } from "preact";

import { useEffect, useState } from "preact/hooks";
import { Button, Col, Container, Row } from "reactstrap";
import map from "lodash.map";
import clone from "lodash.clone";
import sumBy from "lodash.sumby";
import ReactRadialGauge from "./helpers/ReactRadialGuage";
import GaugeModalForm from "./index/AddGaugeModal";
import RightSidebar from "./RightSidebar";

import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import isEmpty from "lodash.isempty";

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
          gaugeEditing={gaugeEditing}
        />
      )}
    </Container>
  );
}

const RowOfGauges = (props) => {
  const { row, rowIndex, toggleGaugeModal, editing, setGaugeEditing } = props;
  const { gauges } = row;

  const totalUsedWidth = sumBy(gauges, (g) => parseInt(g.containerWidth));
  return (
    <Row className="mt-2">
      {map(gauges, (gauge, gaugeIndex) => {
        console.log(gauge);
        return (
          <Col key={gaugeIndex} md={gauge?.containerWidth}>
            {/* <RenderGauge
              editing={editing}
              gaugeValues={gauge}
              onGaugeClick={() => {
                setGaugeEditing({ ...gauge, rowIndex, gaugeIndex });
              }}
            /> */}
            Find and render here
          </Col>
        );
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
