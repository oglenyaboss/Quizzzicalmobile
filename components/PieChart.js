import React from "react";
import { VictoryPie } from "victory-native";

export default function PieChart(props) {
  return (
    <VictoryPie
      data={[
        { x: "Cats", y: 35 },
        { x: "Dogs", y: 40 },
        { x: "Birds", y: 55 },
      ]}
    />
  );
}
