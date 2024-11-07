import { useCallback, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import GaugeTypes from "../GaugeTypes/index.jsx";
import each from "lodash/each.js";
import { find, map } from "lodash";

const DndContainer = (props) => {
  const {
    children,
    toggleGaugeModal,
    editing,
    dashboardIndex,
    moveGauge,
    gauges,
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
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        // moveGauge(dashboardIndex, left, top);
        console.log(item);
        return undefined;
      },
    }),
    [moveGauge]
  );
  return (
    <div ref={drop} style={styles} onClick={toggleGaugeModal}>
      <div style={{ width: "95%", float: "left" }}>
        {map(gauges, (gauge, gaugeIndex) => {
          const findGaugeType = find(
            GaugeTypes,
            (gt) => gt.value == gauge.type
          );

          console.log(gauge);

          if (findGaugeType) {
            return (
              <DraggableItem>
                <findGaugeType.renderGauge
                  key={gaugeIndex}
                  editing={editing}
                  gaugeValues={gauge}
                  left={gauge.left}
                  top={gauge.top}
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

export default DndContainer;

const style = {
  position: "absolute",
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
};
export const DraggableItem = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.GAUGE,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div className="box" ref={drag} style={{ ...style, left, top }}>
      {children}
    </div>
  );
};
