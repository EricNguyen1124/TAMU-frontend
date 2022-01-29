import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import editFill from "@iconify/icons-eva/edit-fill";
import { Link as RouterLink } from "react-router-dom";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import documentSentiment from "@iconify/icons-carbon/document-sentiment";
// import { FormatListBulleted } from "@material-ui/icons";
import { EditMemberModal } from "src/components/_dashboard/members";
import { getUserByEmail } from "src/mysql_db_api/fb_user.js";
import { DeleteConfirmModal } from "src/components/_dashboard/members";
import { useAuth } from "src/authentication/AuthContext";
import {
  getAllMembers,
  deleteOneMember,
  getResumeInfo,
} from "src/mysql_db_api/members";
import { deleteFb_user } from "src/mysql_db_api/fb_user.js";

// ----------------------------------------------------------------------

export default function MemberMoreDetails({
  chosenItem,
  setMembers,
  members,
  update_all_members_func,
  allow_edit,
  allow_delete,
  allow_resume,
}) {
  const ref = useRef(null);
  const { setLoading, displayErrMess, isTechGod } = useAuth();
  const [fb_user, setFbUser] = useState({
    displayName: "",
    email: "",
    disabled: true,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [opentEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
    setIsOpen(false);
  };
  const handleEditClick = () => {
    setIsOpen(false);
    setOpenEditModal(true);
  };
  const openMoreDetails = async () => {
    setIsOpen(true);
    const res = await getUserByEmail(chosenItem.email); // get firebase user information
    if (res.data) {
      setFbUser(res.data);
      // console.log(fb_user);
    } else {
      displayErrMess(res.message.message + " Firebase database!", "warning");
    }
  };

  const deleteChosenMember = async () => {
    setLoading(true);
    const promise1 = deleteOneMember(chosenItem.psid);
    const uid = fb_user && fb_user.uid ? fb_user.uid : "not exists";
    const promise2 = deleteFb_user(uid);
    const [res1, res2] = await Promise.all([promise1, promise2]);
    if (res1.data && res2.data) {
      displayErrMess("Delete successfully!", "success");
      // const members_ = await getAllMembers();
      const members_ = members.filter((member) => {
        return member.psid != chosenItem.psid;
      });
      setMembers(members_);
    } else {
      displayErrMess(
        "Fail to delete! The object may be restricted for the deletion action",
        "error"
      );
    }
    setLoading(false);
    setOpenDeleteModal(false);
  };

  const handleViewResumeClick = async () => {
    if (chosenItem.isResume === 0) {
      return displayErrMess("This user has not upload resume yet!", "error");
    }
    setLoading(true);
    const res = await getResumeInfo(chosenItem.psid);
    if (res.data && res.data.resume_link) {
      setTimeout(() => {
        window.open(`${res.data.resume_link}`, "_blank");
        setLoading(false);
      }, 600);
    } else {
      displayErrMess("Cannot load user resume!", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => openMoreDetails(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {allow_edit && (
          <MenuItem onClick={handleEditClick} sx={{ color: "text.secondary" }}>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="View/Edit"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        )}
        {allow_resume && (
          <MenuItem
            onClick={handleViewResumeClick}
            sx={{ color: "text.secondary" }}
          >
            <ListItemIcon>
              <Icon icon={documentSentiment} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="View Resume"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        )}
        {isTechGod() && allow_delete && (
          <MenuItem
            sx={{ color: "text.secondary" }}
            onClick={handleDeleteClick}
          >
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        )}
      </Menu>
      {opentEditModal && (
        <EditMemberModal
          open={opentEditModal}
          setOpen={setOpenEditModal}
          chosenItem={chosenItem}
          setMembers={setMembers}
          fb_user={fb_user}
          members={members}
          update_all_members_func={update_all_members_func}
        />
      )}

      {openDeleteModal && (
        <DeleteConfirmModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          excuteFunc={deleteChosenMember}
        />
      )}
    </>
  );
}
