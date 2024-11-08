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

import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardPage from "./index/DashboardPage";
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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    const left = event?.clientX;
    const top = event?.clientY;
    setMousePosition({ left: left, top: top });
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

    newLayoutObject.dashboards[0].gauges.push({
      left: mousePosition.left,
      top: mousePosition.top,
      saved: true,
      dashboardIndex: 0,
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

  const updateGauge = (gaugeValues) => {
    const { dashboardIndex, gaugeIndex } = gaugeEditing;
    let newLayoutObject = clone(layoutObject);
    newLayoutObject.dashboards[dashboardIndex].gauges[gaugeIndex] = gaugeValues;
    setLayoutObject(newLayoutObject);
  };

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
          <DashboardPage
            toggleGaugeModal={toggleGaugeModal}
            editing={editing}
            moveGauge={moveGauge}
            gauges={dashboard?.gauges}
            dashboardIndex={dashboardIndex}
            setGaugeEditing={setGaugeEditing}
            gaugeEditing={gaugeEditing}
          >
            <RightSidebar
              toggleEditing={toggleEditing}
              toggleLogModal={toggleLogModal}
              dashboardIndex={dashboardIndex}
            />
          </DashboardPage>
        );
      })}
      {gaugeModalOpen && (
        <GaugeModalForm
          isOpen={gaugeModalOpen}
          toggleGaugeModal={toggleGaugeModal}
          addGauge={addGauge}
          updateGauge={updateGauge}
          // removeGauge={removeGauge}
          gaugeEditing={gaugeEditing}
        />
      )}
      {/* {logOpen && (
        <LogViewerModal isOpen={logOpen} toggleGaugeModal={toggleLogModal} />
      )} */}
    </DndProvider>
  );
}

render(<App />, document.getElementById("app"));
