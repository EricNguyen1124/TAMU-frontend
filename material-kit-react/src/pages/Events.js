import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
// material
import { Grid, Button, Container, Stack, Typography } from "@material-ui/core";
// components
import Page from "../components/Page";

//

import { EventPostCard } from "src/components/_dashboard/events";
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];
import { useState, useEffect } from "react";
// ----------------------------------------------------------------------

// const taskList = [{
//   id: 1,
//   title: "Install Security Systems",
//   points: 100,
//   image: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
// },
// {
//   id: 2,
//   title: "Schedule Anual Inspection",
//   points: 50,
//   image: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
// },
// {
//   id: 3,
//   title: "Refer A Friend or Family",
//   points: 20,
//   image: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
// },]

export default function Events() {
  const [taskList, setTaskList] = useState([]);
  const [doneStatus, setDoneStatus] = useState(false);

  const getTaskList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTaskList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTaskList();
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
            Available Tasks: {taskList.length}
          </h3>
          <Grid container spacing={3}>
            {taskList.map((task) => (
              <EventPostCard
                taskID={task.taskID}
                title={task.title}
                points={task.points}
                image={task.image}
                isConfirm={task.isConfirm}
                doneStatus={task.done}
                setDoneStatus={setDoneStatus}
              />
            ))}
          </Grid>
        </div>
      </Container>
    </Page>
  );
}
