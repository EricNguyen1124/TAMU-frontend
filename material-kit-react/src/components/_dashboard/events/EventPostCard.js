import { Icon } from "@iconify/react";

import bookmarkCheck from "@iconify/icons-bi/bookmark-check";
// material
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, Grid } from "@material-ui/core";
import "./EventCard.css";
// ----------------------------------------------------------------------

const CardMediaStyle = styled("div")({
  position: "relative",
  paddingTop: "calc(100% * 3 / 4)",
});

const CoverImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
export default function EventPostCard({ id, title, points, image }) {
  const [doneStatus, setDoneStatus] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(prev => !prev)
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ position: "relative" }}>
          <CardMediaStyle>
            <CoverImgStyle alt={title} src={`${image}`} sx={doneStatus ? { opacity : 0.5 } : { opacity : 1 }} />
          </CardMediaStyle>
          <div className="task-info">
            <p className="title">{title}</p>
            <p className="subtitle">
            {"Points: "}
            {points}
            </p>
            <button onClick={handleOpenConfirmModal} className="button" disabled={doneStatus ? true : false}>
              {!doneStatus ? "Resolve" : "Pending"}
            </button>
          </div>

          {doneStatus && (
            <div
              style={{
                width: 50,
                position: "absolute",
                top: 0,
                right: 20,
                color: "green",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "0px 0px 10px 10px",
              }}
            >
              <Icon icon={bookmarkCheck} fontSize={50} />
            </div>
          )}
        </Card>
        <ConfirmModal
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        title={title}
        setDoneStatus={setDoneStatus}
      />

      </Grid>
    </>
  );
}
