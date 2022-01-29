import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
// import eyeFill from "@iconify/icons-eva/eye-fill";
import bxUser from "@iconify/icons-bx/bx-user";
import outlineGrade from "@iconify/icons-ic/outline-grade";
import { useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
// import shareFill from "@iconify/icons-eva/share-fill";
// import messageCircleFill from "@iconify/icons-eva/message-circle-fill";
// material
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import {
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Button,
  Typography,
  CardContent,
} from "@material-ui/core";
// utils
import { AdditionalModal } from "src/components/_dashboard/events";
import { fDateTime } from "../../../utils/formatTime";
import { fShortenNumber } from "../../../utils/formatNumber";
//
// import SvgIconStyle from "../../SvgIconStyle";

// ----------------------------------------------------------------------

const CardMediaStyle = styled("div")({
  position: "relative",
  paddingTop: "calc(100% * 3 / 4)",
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

const AvatarStyle = styled(Button)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  color: "white",
  height: 32,
  position: "absolute",
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CardBottom = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "",
  justifyContent: "space-between",
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

EventPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};
import { CheckinModal } from "src/components/_dashboard/events";
import { useState } from "react";
export default function EventPostCard({
  post,
  index,
  latestPostLarge,
  latestPost,
}) {
  // const [openCheckin, setOpenCheckin] = useState(false);
  const pathName = useLocation();
  // console.log("path", pathName);
  const [openAdd, setOpenAdd] = useState(false);
  const {
    cover_image,
    title,
    count,
    company,
    location,
    point,
    endtime,
    has_additional_infor,
    additional_information,
    additional_information_link,
    is_more,
    more_content_link,
  } = post;
  const POST_INFO = [
    { number: point, icon: outlineGrade },
    { number: count, icon: bxUser },
  ];
  function gotoMoreContent() {
    if (is_more) {
      window.open(more_content_link, "_blank");
    }
  }
  return (
    <>
      <Grid
        item
        xs={12}
        sm={latestPostLarge ? 12 : 6}
        md={latestPostLarge ? 6 : 3}
      >
        <Card sx={{ position: "relative" }}>
          <CardMediaStyle
            sx={{
              ...((latestPostLarge || latestPost) && {
                pt: "calc(100% * 4 / 3)",
                "&:after": {
                  top: 0,
                  content: "''",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                },
              }),
              ...(latestPostLarge && {
                pt: {
                  xs: "calc(100% * 4 / 3)",
                  sm: "calc(100% * 3 / 4.66)",
                },
              }),
            }}
          >
            {is_more ? (
              <AvatarStyle
                sx={{
                  ...((latestPostLarge || latestPost) && {
                    zIndex: 9,
                    top: 24,
                    left: 24,
                    width: 40,
                    height: 40,
                  }),
                }}
                variant="outlined"
                onClick={gotoMoreContent}
              >
                More...
              </AvatarStyle>
            ) : null}
            <CoverImgStyle alt={title} src={`${cover_image}`} />
          </CardMediaStyle>

          <CardContent
            sx={{
              pt: 4,
              ...((latestPostLarge || latestPost) && {
                bottom: 0,
                width: "100%",
                position: "absolute",
              }),
            }}
          >
            <TitleStyle
              to="#"
              color="inherit"
              variant="subtitle2"
              underline="hover"
              component={RouterLink}
              sx={{
                ...(latestPostLarge && { typography: "h5", height: 60 }),
                ...((latestPostLarge || latestPost) && {
                  color: "common.white",
                }),
              }}
            >
              {company} - {title}
            </TitleStyle>
            <Typography
              gutterBottom
              variant="caption"
              sx={{ color: "text.disabled", display: "block" }}
            >
              Location: {location} <br />
              End time: {fDateTime(endtime)}
            </Typography>
            <CardBottom>
              <InfoStyle>
                {POST_INFO.map((info, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: index === 0 ? 0 : 1.5,
                      ...((latestPostLarge || latestPost) && {
                        color: "grey.500",
                      }),
                    }}
                  >
                    <Box
                      component={Icon}
                      icon={info.icon}
                      sx={{ width: 16, height: 16, mr: 0.5 }}
                    />
                    <Typography variant="caption">
                      {fShortenNumber(info.number)}
                    </Typography>
                  </Box>
                ))}
              </InfoStyle>
              {has_additional_infor == 1 &&
                pathName &&
                !pathName.pathname.includes(
                  "/dashboard/event_checkin_by_link"
                ) && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenAdd(true)}
                    style={{ color: "white" }}
                  >
                    Details
                  </Button>
                )}
            </CardBottom>
          </CardContent>
        </Card>
      </Grid>
      {/* <CheckinModal open={openCheckin} setOpen={setOpenCheckin} event={post} /> */}
      <AdditionalModal
        open={openAdd}
        setOpen={setOpenAdd}
        event_name={title}
        additional_information={additional_information}
        additional_information_link={additional_information_link}
      />
    </>
  );
}

// events:
// title, cover image (default cover image: misso ),
