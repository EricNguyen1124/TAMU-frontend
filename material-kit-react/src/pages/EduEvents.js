import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { EventPostCard } from "src/components/_dashboard/events";
import { getThisWeekEvent_type } from "src/mysql_db_api/events";

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
      <h3
        style={{
          padding: "12px",
          backgroundColor: "#EBF0F5",
          marginBottom: "12px",
          borderRadius: "12px",
          textAlign: "center",
          fontSize: "25px"
        }}
      >
        WEEKLY CODING TIMES
      </h3>
      {thisweekEvents_edu.length === 0 ? (
        <p style={{ padding: "12px", textAlign: "center", fontSize: "20px"}}>No Coding Time to Show</p>
      ) : (
        <Grid
          container
          spacing={5}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {thisweekEvents_edu.map((event, index) => (
            <EventPostCard
              key={event.id}
              post={event}
              index={index}
              latestPost={true}
              latestPostLarge={false}
            />
          ))}
        </Grid>
      )}
    </div>
  );
};

export default EduEvents;
