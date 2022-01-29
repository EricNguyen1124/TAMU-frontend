import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
// material
import { Grid, Button, Container, Stack, Typography } from "@material-ui/core";
// components
import Page from "../components/Page";

//
import { useAuth } from "src/authentication/AuthContext";
import {
  getTodayEvent,
  getThisWeekEvent,
  getNextWeekEvent,
  getThisWeekEvent_type,
} from "src/mysql_db_api/events.js";
import { EventPostCard } from "src/components/_dashboard/events";
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];
import { useState, useEffect } from "react";
// ----------------------------------------------------------------------

export default function Events() {
  const { setLoading, displayErrMess } = useAuth();
  const [todayEvents, setTodayEvents] = useState([]);
  const [nextWeekEvents, setNextWeekEvents] = useState([]);
  const [thisweekEvents_edu, setThisWeekEvents_edu] = useState([]);
  const [thisweekEvents_PM, setThisWeekEvents_PM] = useState([]);
  const [thisweekEvents_spe, setThisWeekEvents_spe] = useState([]);
  const [thisweekEvents_standard, setThisWeekEvents_standard] = useState([]);
  useEffect(async () => {
    setLoading(true);
    const promise1 = getTodayEvent();
    // const promise2 = getThisWeekEvent_type("edu");
    const promise2 = getThisWeekEvent_type("standard");
    const promise3 = getThisWeekEvent_type("PM");
    const promise4 = getThisWeekEvent_type("spe");
    const promise5 = getNextWeekEvent();

    const [res1, res2, res3, res4, res5] = await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
      promise5,
    ]);
    if (res1.data && res2.data && res3.data && res4.data && res5.data) {
      setTodayEvents(res1.data);
      // setThisWeekEvents_edu(res2.data);
      setThisWeekEvents_standard(res2.data);
      setThisWeekEvents_PM(res3.data);
      setThisWeekEvents_spe(res4.data);
      setNextWeekEvents(res5.data);
    } else {
      displayErrMess("Fail to load this week events!", "error");
    }
    setLoading(false);
  }, []);
  return (
    <Page title="Dashboard | Events">
      <Container>
        <div style={{ paddingBottom: "75px" }}>
          <h3
            style={{
              padding: "12px",
              backgroundColor: "#EBF0F5",
              marginBottom: "12px",
              borderRadius: "12px",
            }}
          >
            TODAY'S EVENTS: {todayEvents.length}
          </h3>
          {todayEvents.length === 0 && (
            <p style={{ padding: "12px", fontSize: "20px" }}>It's quiet today...</p>
          )}
          {todayEvents && todayEvents.length > 0 && (
            <Grid container spacing={3}>
              {todayEvents.map((event, index) => (
                <EventPostCard
                  key={event.id}
                  post={event}
                  index={index}
                  latestPost={false}
                  latestPostLarge={true}
                />
              ))}
            </Grid>
          )}
        </div>
        <div style={{ paddingBottom: "75px" }}>
          <h3
            style={{
              padding: "12px",
              backgroundColor: "#EBF0F5",
              marginBottom: "12px",
              borderRadius: "12px",
            }}
          >
            SPECIAL EVENTS THIS WEEK: {thisweekEvents_spe.length}
          </h3>
          {thisweekEvents_spe.length === 0 && (
            <p style={{ padding: "12px", fontSize: "20px" }}>No Special Event this week</p>
          )}
          {thisweekEvents_spe && thisweekEvents_spe.length > 0 && (
            <Grid container spacing={3}>
              {thisweekEvents_spe.map((event, index) => (
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
        <div style={{ paddingBottom: "75px" }}>
          <h3
            style={{
              padding: "12px",
              backgroundColor: "#EBF0F5",
              marginBottom: "12px",
              borderRadius: "12px",
            }}
          >
            PROFESSIONAL EVENTS THIS WEEK : {thisweekEvents_PM.length}
          </h3>
          {thisweekEvents_PM.length === 0 && (
            <p style={{ padding: "12px", fontSize: "20px" }}>No Professional Meeting this week</p>
          )}
          {thisweekEvents_PM && thisweekEvents_PM.length > 0 && (
            <Grid container spacing={3}>
              {thisweekEvents_PM.map((event, index) => (
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

        <div style={{ paddingBottom: "75px" }}>
          <h3
            style={{
              padding: "12px",
              backgroundColor: "#EBF0F5",
              marginBottom: "12px",
              borderRadius: "12px",
            }}
          >
            ACTIVITIES & INVOLVEMENT: {thisweekEvents_standard.length}
          </h3>
          {thisweekEvents_standard.length === 0 && (
            <p style={{ padding: "12px", fontSize: "20px" }}>
              If you're seeing this then you've made it through this semester!
            </p>
          )}
          {thisweekEvents_standard.length > 0 && (
            <Grid container spacing={3}>
              {thisweekEvents_standard.map((event, index) => (
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

        {/* Moved to EduEvents */}
        {/* <div style={{ paddingBottom: "75px" }}>
          <h3 style={{ padding: "12px", backgroundColor: "#EBF0F5", marginBottom: "12px", borderRadius: "12px"}}>
            Weekly Coding Times : {thisweekEvents_edu.length}
          </h3>
          {thisweekEvents_edu.length === 0 && <p style={{ padding: "12px"}}>If you're seeing this then you've made it through this semester!</p>}
          {thisweekEvents_edu && thisweekEvents_edu.length > 0 && (
            <Grid container spacing={3}>
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
        </div> */}

        <div style={{ paddingBottom: "25px" }}>
          <h3
            style={{
              padding: "12px",
              backgroundColor: "#EBF0F5",
              marginBottom: "12px",
              borderRadius: "12px",
            }}
          >
            Upcomming Events Next Week : {nextWeekEvents.length}
          </h3>
          {nextWeekEvents.length === 0 && (
            <p style={{ padding: "12px", fontSize: "20px" }}>No event next week</p>
          )}
          {nextWeekEvents.length > 0 && (
            <Grid container spacing={3}>
              {nextWeekEvents.map((event, index) => (
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
      </Container>
    </Page>
  );
}
