import { Box, Grid, Container, Typography } from "@material-ui/core";
// components
import Page from "../components/Page";
import PointSystem from "./PointSystem";
// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard | MISSO">
      <Container>
        <PointSystem />
      </Container>
    </Page>
  );
}
