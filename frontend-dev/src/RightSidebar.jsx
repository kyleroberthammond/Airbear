import { Button } from "reactstrap";
import PencilIcon from "./Icons/PencilIcon";
import SettingsIcon from "./Icons/SettingsIcon";
import { useEffect, useState } from "preact/hooks";
import MinimizeButton from "./Icons/MinimizeButton";
import MaximizeButton from "./Icons/MaximizeButton";

export const RightSidebar = (props) => {
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div>
      <Button onClick={toggleFullscreen}>
        {fullscreen ? <MinimizeButton /> : <MaximizeButton />}
      </Button>
      <Button
        className="mt-2"
        onClick={() => {
          alert("hi");
        }}
      >
        <PencilIcon />
      </Button>
      <Button
        className="mt-2"
        onClick={() => {
          window.location.href("/config");
        }}
      >
        <SettingsIcon />
      </Button>
    </div>
  );
};

export default RightSidebar;
