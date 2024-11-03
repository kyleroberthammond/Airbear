import { useState } from "preact/hooks";
import { HexColorPicker } from "react-colorful";
import { Popover, UncontrolledPopover } from "reactstrap";

export const PopoverPicker = ({ color, onChange }) => {
  const [elementId] = useState(
    `element-${Math.random().toString(36).substr(2, 9)}`
  );
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div className="picker">
      <div
        className="swatch"
        style={{ backgroundColor: color }}
        onClick={toggle}
        id={elementId}
      />

      <UncontrolledPopover
        trigger="legacy"
        placement="auto"
        isOpen={open}
        toggle={toggle}
        target={elementId}
      >
        <HexColorPicker color={color} onChange={onChange} />
      </UncontrolledPopover>
    </div>
  );
};
export default PopoverPicker;
