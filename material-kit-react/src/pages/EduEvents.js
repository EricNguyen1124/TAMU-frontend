import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { EventPostCard } from "src/components/_dashboard/events";
import { getThisWeekEvent_type } from "src/mysql_db_api/events";
import PointSystem from "./PointSystem";

const EduEvents = () => {
  const [thisweekEvents_edu, setThisWeekEvents_edu] = useState([]);
  useEffect(async () => {
    const res = await getThisWeekEvent_type("edu");
    if (res.data) {
      setThisWeekEvents_edu(res.data);
    } else {
      displayErrMess("Fail to load this week events!", "error");
    }
  }, []);

  return (
    <div>
      <PointSystem />
    </div>
  );
};

export default EduEvents;
