import { render } from "preact";

import { useEffect, useState } from "preact/hooks";
import { Button, Col, Row } from "reactstrap";
import map from "lodash/map";
import clone from "lodash/clone";
import sumBy from "lodash/sumby";
import GaugeModalForm from "./AddGaugeModal";
import RightSidebar from "./RightSidebar";

import isEmpty from "lodash/isempty";
import GaugeTypes from "./GaugeTypes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DndContainer from "./index/DndContainer";

import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import LogViewerModal from "./LogViewerModal";

export function App() {
  const initialDashboardObject = { gauges: [] };

  const toggleEditing = () => setEditing(!editing);
  const [layoutObject, setLayoutObject] = useState({
    dashboards: [initialDashboardObject],
  }); // The layout config json, can import a default one.
  const [gaugeModalOpen, setGaugeModalOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const toggleLogModal = () => setLogOpen(!logOpen);

  const [editing, setEditing] = useState(true);
  const [gaugeEditing, setGaugeEditing] = useState(null);
  const toggleGaugeModal = (event) => {
    // Check if the clicked element is the container itself
    // Ignore if the gauge modal is open
    if (!event) {
      setGaugeModalOpen(!gaugeModalOpen);
    } else if (event?.target === event?.currentTarget && editing) {
      setGaugeModalOpen(!gaugeModalOpen);
    }
  };
  useEffect(() => {
    if (!isEmpty(gaugeEditing)) {
      toggleGaugeModal();
    }
  }, [gaugeEditing]);

  // const [data, setData] = useState({});
  // useEffect(() => {
  //   // This is the onload. You would setup the serial events incoming here.
  //   // As one hits you would update the data by calling setData which is just an object.
  //   // This automatically will rerender the components effected.
  //   // Basically your sse.js.
  //   // Waiting on my esp32 to arrive to test all this.
  // }, [])

  const addGauge = (gaugeValues) => {
    let newLayoutObject = clone(layoutObject);

    let left = event.clientX;
    let top = event.clientY;

    newLayoutObject.dashboards[0].gauges.push({
      left: left,
      top: top,
      saved: true,
      ...gaugeValues,
    });
    setLayoutObject(newLayoutObject);
  };

  const moveGauge = (dashboardIndex, gaugeIndex, left, top) => {
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.dashboards[dashboardIndex].gauges[gaugeIndex].left = left;
    newLayoutObject.dashboards[dashboardIndex].gauges[gaugeIndex].top = top;
    setLayoutObject(newLayoutObject);
  };

  // console.log(layoutObject);

  // const updateGaugeInLayout = (gaugeValues) => {
  //   let newLayoutObject = clone(layoutObject);
  //   newLayoutObject.rows[gaugeValues.rowIndex].gauges[gaugeValues.gaugeIndex] =
  //     gaugeValues; // Add the gauge to the first row

  //   // // Update the layout object with the new rows.
  //   setLayoutObject(newLayoutObject);
  // };

  // const removeGaugeFromLayout = (gaugeValues) => {
  //   let newLayoutObject = clone(layoutObject);
  //   newLayoutObject.rows[gaugeValues.rowIndex].gauges.splice(
  //     gaugeValues.gaugeIndex,
  //     1
  //   ); // Add the gauge to the first row

  //   // // Update the layout object with the new rows.
  //   setLayoutObject(newLayoutObject);
  // };

  return (
    <DndProvider backend={HTML5Backend}>
      {map(layoutObject.dashboards, (dashboard, dashboardIndex) => {
        return (
          <DndContainer
            toggleGaugeModal={toggleGaugeModal}
            editing={editing}
            moveGauge={moveGauge}
            gauges={dashboard?.gauges}
          >
            <RightSidebar
              toggleEditing={toggleEditing}
              toggleLogModal={toggleLogModal}
              dashboardIndex={dashboardIndex}
            />
          </DndContainer>
        );
      })}
      {gaugeModalOpen && (
        <GaugeModalForm
          isOpen={gaugeModalOpen}
          toggleGaugeModal={toggleGaugeModal}
          addGauge={addGauge}
          // updateGaugeInLayout={updateGaugeInLayout}
          // removeGaugeFromLayout={removeGaugeFromLayout}
          gaugeEditing={gaugeEditing}
        />
      )}
      {/* {logOpen && (
  <LogViewerModal isOpen={logOpen} toggleGaugeModal={toggleLogModal} />
)} */}
    </DndProvider>
  );
}

const RowOfGauges = (props) => {
  const {
    row,
    rowIndex,
    toggleGaugeModal,
    editing,
    setGaugeEditing,
    setRowIndexAddingOn,
  } = props;
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
          <Button
            onClick={() => {
              setGaugeEditing(null);
              toggleGaugeModal();
              setRowIndexAddingOn(rowIndex);
            }}
          >
            Add Gauge
          </Button>
        </Col>
      )}
    </Row>
  );
};

render(<App />, document.getElementById("app"));
