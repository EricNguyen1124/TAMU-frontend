// material
import { Grid, Container } from "@material-ui/core";

import { useAuth } from "src/authentication/AuthContext";
import { getEventsForMember } from "src/mysql_db_api/events.js";
import {
  getResumeSignUp,
  getLinkedinSignup,
  getInterviewSignup,
} from "src/mysql_db_api/members";
import { MemberEventTab } from ".";
// ----------------------------------------------------------------------

// const SORT_OPTIONS = [
//   { value: "latest", label: "Latest" },
//   { value: "popular", label: "Popular" },
//   { value: "oldest", label: "Oldest" },
// ];
import { useState, useEffect } from "react";
import { fDateTime } from "src/utils/formatTime";
// ----------------------------------------------------------------------
const redirect_link = process.env.REACT_APP_PD_SHEDULE_LINK;
export default function Blog() {
  const { displayErrMess, setLoading, userProfile } = useAuth();
  const [memberEvents, setMemberEvents] = useState([]);
  useEffect(async () => {
    setLoading(true);
    const promise = getEventsForMember(userProfile.psid);
    const promise1 = getResumeSignUp(userProfile.psid);
    const promise2 = getLinkedinSignup(userProfile.psid);
    const promise3 = getInterviewSignup(userProfile.psid);
    const [res, res1, res2, res3] = await Promise.all([
      promise,
      promise1,
      promise2,
      promise3,
    ]);

    if (res1.data && res.data && res2.data && res3.data) {
      const resume_events = res1.data.map((item) => {
        return {
          cover_image: process.env.REACT_APP_DEFAULT_COVER_IMAGE_LINK,
          title: "Resume Review",
          count: "*",
          company: "MISSO",
          location: "MISSO",
          endtime: item.created_time,
          has_additional_infor: true,
          additional_information: `Your request for Resume Review has been recevied. Our PD officer and committees will review and get back to you with feedback on your resume.`,
        };
      });
      const linkedin_events = res2.data.map((item) => {
        return {
          cover_image: process.env.REACT_APP_DEFAULT_COVER_IMAGE_LINK,
          title: "Linkedin Review",
          count: "*",
          company: "MISSO",
          location: "MISSO",
          endtime: item.created_time,
          has_additional_infor: true,
          additional_information: `Please schedule an appointment with our officer at ${redirect_link}`,
        };
      });
      const interview_events = res3.data.map((item) => {
        return {
          cover_image: process.env.REACT_APP_DEFAULT_COVER_IMAGE_LINK,
          title: "Mock Interview",
          count: "*",
          company: "MISSO",
          location: "MISSO",
          endtime: item.created_time,
          has_additional_infor: true,
          additional_information: `Please schedule an appointment with our officer at ${redirect_link}`,
        };
      });
      // const standard_event = res.data.map((item) => {
      //   // const endtime = new Date(item.datetime);
      //   console.log("item", item);
      //   return {
      //     cover_image: item.cover_image,
      //     title: item.title,
      //     count: item.count,
      //     company: item.company,
      //     location: item.location,
      //     endtime: item.endtime,
      //     has_additional_infor: item.has_additional_infor,
      //     additional_information: item.additional_information,
      //     additional_information_link: item.additional_information_link,
      //   };
      // });
      const all_events = [
        ...res.data,
        ...interview_events,
        ...linkedin_events,
        ...resume_events,
      ];
      // console.log(all_events);
      setMemberEvents(all_events);
    } else {
      displayErrMess("Fail to load Events Data!", "error");
    }
    setLoading(false);
  }, []);
  return (
    <Container>
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ paddingBottom: "17px" }}>
          My Attended Events: {memberEvents.length}
        </h3>
        {memberEvents && memberEvents.length > 0 && (
          <Grid container spacing={3}>
            {memberEvents.map((event, index) => (
              <MemberEventTab
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
  );
}
