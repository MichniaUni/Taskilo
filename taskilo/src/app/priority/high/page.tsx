import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/state/api";

// High component for displaying tasks with "High" priority
const High = () => {
  return <ReusablePriorityPage priority={Priority.High} />;
};

export default High;