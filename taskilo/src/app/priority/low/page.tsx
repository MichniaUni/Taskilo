import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/state/api";

// Low component for displaying tasks with "Low" priority
const Low = () => {
  return <ReusablePriorityPage priority={Priority.Low} />;
};

export default Low;