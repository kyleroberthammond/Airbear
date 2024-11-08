import { useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import GaugeTypes from "../GaugeTypes/index.jsx";
import { find, map } from "lodash";

const DashboardPage = (props) => {
  const {
    children,
    toggleGaugeModal,
    editing,
    dashboardIndex,
    moveGauge,
    gauges,
    setGaugeEditing,
    gaugeEditing
  } = props;

  const styles = useMemo(() => {
    if (editing) {
      return {
        width: "100%",
        height: "100vh",
        position: "absolute",
        cursor: "crosshair",
        border: "1px dashed gray",
      };
    } else {
      return {
        width: "100%",
        height: "100vh",
        position: "absolute",
        border: "1px dashed gray",
      };
    }
  }, [editing]);

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.GAUGE,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const gaugeIndex = item.gaugeIndex;
        const newLeft = Math.round(item.left + delta.x);
        const newTop = Math.round(item.top + delta.y);
        moveGauge(dashboardIndex, gaugeIndex, newLeft, newTop);
        return undefined;
      },
    }),
    [moveGauge]
  );
  return (
    <div ref={drop} style={styles} onClick={toggleGaugeModal}>
      <div style={{ width: "95%", float: "left" }}>
        {map(gauges, (gaugeValues, gaugeIndex) => {
          const findGaugeType = find(
            GaugeTypes,
            (gt) => gt.value == gaugeValues.type
          );

          if (findGaugeType) {
            return (
              <DraggableItem
                hideSourceOnDrag
                gaugeValues={gaugeValues}
                gaugeIndex={gaugeIndex}
              >
                <findGaugeType.renderGauge
                  key={gaugeIndex}
                  editing={editing}
                  gaugeValues={gaugeValues}
                  onGaugeClick={() => {
                    console.log("click");
                    setGaugeEditing({
                      gaugeValues,
                      gaugeIndex,
                      dashboardIndex,
                    });
                    console.log(gaugeEditing)
                    toggleGaugeModal(gaugeIndex);
                  }}
                />
              </DraggableItem>
            );
          }
        })}
      </div>
      <div
        style={{ width: "5%", left: "95%", top: "10px", position: "relative" }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardPage;

const style = {
  position: "absolute",
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
};

const DraggableItem = (props) => {
  const { hideSourceOnDrag, children, gaugeValues, gaugeIndex } = props;
  const { left, top } = gaugeValues;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.GAUGE,
      item: { left, top, gaugeIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [left, top]
  );

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div ref={drag} style={{ ...style, left, top }}>
      {children}
    </div>
  );
};
