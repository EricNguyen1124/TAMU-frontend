import { getUserByEmail } from "src/mysql_db_api/fb_user.js";
import { getOneMember } from "src/mysql_db_api/members.js";
import { DeleteConfirmModal } from "src/components/_dashboard/members";
import { useAuth } from "src/authentication/AuthContext";
import {
  deleteOneMember,
} from "src/mysql_db_api/members";
import { deleteFb_user } from "src/mysql_db_api/fb_user.js";

// ----------------------------------------------------------------------

export default function DeleteSelectedMembersModal({
  selected,
  setMembers,
  members,
  openDeleteSelected,
  setOpenDeleteSelected,
  setSelected,
}) {
  const { setLoading, displayErrMess } = useAuth();

  const deleteSelectedMembers = async () => {
    setLoading(true);

    let selectedPSID = selected;
    let uid;
    for (const psid of selectedPSID) {
      //   console.log(psid);
      // Use PSID to look for email in the database
      const res = await getOneMember(psid);
      if (res.data) {
        // console.log(res.data);
      } else {
        displayErrMess(
          "Cannot find this member's email in the database",
          "warning"
        );
      }
      // Use Email to look for firebase account
      const res_fb = await getUserByEmail(res.data.email);
      if (res_fb.data) {
        uid = res_fb.data.uid;
        // console.log(uid);
      }

      // Check if can delete from firebase. If can't, won't delete from database
      // Will cause error if successfully delete from database but not firebase
      const promise1 = await deleteFb_user(uid);
      if (!promise1.data) {
        displayErrMess(
          `Failed to delete from Firebase user ${uid} , database won't be affected`,
          "error"
        );
        return;
      }
      // Delete from database and re-render new member table
      const promise2 = await deleteOneMember(psid);
      if (promise2.data) {
        console.log(`User removed from FB and DB`);
        displayErrMess("Delete successfully!", "success");
        // const members_ = await getAllMembers();
        const members_ = members.filter((member) => {
          return member.psid != psid;
        });
        setMembers(members_);
        setSelected([]);
      } else {
        displayErrMess(
          "Fail to delete! The object may be restricted for the deletion action",
          "error"
        );
      }
      setOpenDeleteSelected(false);
      setLoading(false);
    }

    //   const uid = fb_user && fb_user.uid ? fb_user.uid : "not exists";
    //   const promise1 = deleteOneMember(psid);

    //   const promise1 = deleteSelectedMembers(psid);
    //   const uid = fb_user && fb_user.uid ? fb_user.uid : "not exists";
    //   const [res1, res2] = await Promise.all([promise1, promise2]);

    //
    // const uid = fb_user && fb_user.uid ? fb_user.uid : "not exists";
    // const promise2 = deleteFb_user(uid);
    // const [res1, res2] = await Promise.all([promise1, promise2]);
    // if (res1.data && res2.data) {
    //   displayErrMess("Delete successfully!", "success");
    //   // const members_ = await getAllMembers();
    //   const members_ = members.filter((member) => {
    //     return member.psid != chosenItem.psid;
    //   });
    //   setMembers(members_);
    // } else {
    //   displayErrMess(
    //     "Fail to delete! The object may be restricted for the deletion action",
    //     "error"
    //   );
    // }
    setLoading(false);
    setOpenDeleteSelected(false);
  };

  return (
    <>
      {openDeleteSelected && (
        <DeleteConfirmModal
          open={openDeleteSelected}
          setOpen={setOpenDeleteSelected}
          excuteFunc={deleteSelectedMembers}
        />
      )}
    </>
  );
}
