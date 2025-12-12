import { useState } from "react";
import styles from "./glassSwitch.module.css";

export default function GlassSwitch({value, onChange}) {
  const [isOn, setIsOn] = useState(value);


  return (
    <div className={styles.container}>
      <div
        className={`${styles.switch} ${isOn ? styles.on : styles.off}`}
        onClick={() => setIsOn(!isOn)}
      >
        <div className={styles.knob}></div>
      </div>
    </div>
  );
}
