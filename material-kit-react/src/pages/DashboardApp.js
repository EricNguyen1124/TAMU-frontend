import { Box, Grid, Container, Typography } from "@material-ui/core";
// components
import Page from "../components/Page";
import {
  AppTasks,
  Java,
  AppBugReports,
  TransactionProcessing,
  AppNewsUpdate,
  Database,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
} from "../components/_dashboard/app";
import VideosPlaylist from "src/components/_dashboard/educations/VideosPlaylist";
import { EventPostCard } from "src/components/_dashboard/events";
import EduEvents from "./EduEvents";
// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard | MISSO">
      <Container maxWidth="xl">
        {/* <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box> */}
        <Grid container spacing={3} marginBottom={"12px"}>
          <Grid item xs={12} sm={6} md={4}>
            <Database />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Java />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TransactionProcessing />
          </Grid>
        </Grid>
        <EduEvents />
        <VideosPlaylist />
      </Container>
    </Page>
  );
}
