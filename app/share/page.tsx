import React from "react";
import ShareRenderer from "./ShareRenderer";

export const metadata = {
  title: "PM Portfolio",
  description: "View this PM portfolio",
};

export default function SharePage(): React.JSX.Element {
  return <ShareRenderer />;
}
