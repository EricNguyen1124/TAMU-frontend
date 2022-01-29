import React, { useEffect, useState } from "react";
import { useAuth } from "src/authentication/AuthContext";
import {
  addOneInterviewSignUp,
  addOneLinkedinSignUp,
  addOneResumeSignUp,
  getMembersForInterviewSignup,
  getMembersForLinkedinSignup,
  getMembersForResumeSignUp,
} from "src/mysql_db_api/members";
import {
  ProfessionalsTab,
  AdminProfessionalTable,
  AdminProfessionalTab,
} from "src/components/_dashboard/professionals";
import { Container, Grid } from "@material-ui/core";
import handshakeIcon from "@iconify/icons-fa-regular/handshake";
import documentSentiment from "@iconify/icons-carbon/document-sentiment";
import linkedinOutlined from "@iconify/icons-ant-design/linkedin-outlined";
const professionals_tab_info = [
  {
    name: "Mock Interview",
    tbl_name: "mock_interview",
    icon: handshakeIcon,
    color: 0, // color code
  },
  {
    name: "Resume Review",
    tbl_name: "resume_review",

    icon: documentSentiment,
    color: 2, // color code
  },
  {
    name: "Linkedin Review",
    tbl_name: "linkedin_review",
    icon: linkedinOutlined,
    color: 1, // color code
  },
];
export default function AdminProfessionals() {
  const [adminTableName, setAdminTableName] = useState("mock_interview");
  const [memberList, setMemberList] = useState([]);
  const [update_all_members_func, setUpdate_all_members_func] = useState(
    getMembersForInterviewSignup
  );
  const { setLoading, displayErrMess } = useAuth();
  useEffect(async () => {
    // console.log(admin)
    setLoading(true);
    let func;
    if (adminTableName === "mock_interview")
      func = getMembersForInterviewSignup;
    else if (adminTableName === "resume_review")
      func = getMembersForResumeSignUp;
    else if (adminTableName === "linkedin_review")
      func = getMembersForLinkedinSignup;
    else {
      displayErrMess("There was error when switching table", "error");
      func = getMembersForInterviewSignup;
    }
    const res = await func();
    setUpdate_all_members_func(func);
    setMemberList(res.data);
    setLoading(false);
  }, [adminTableName]);
  return (
    <Container>
      <Grid container spacing={3}>
        {professionals_tab_info.map((item, index) => {
          return (
            <Grid key={item.name} item xs={12} sm={6} md={4}>
              <AdminProfessionalTab
                name={item.name}
                color={item.color}
                admin_tbl={item.tbl_name}
                icon={item.icon}
                func={setAdminTableName}
                chosen={item.tbl_name === adminTableName}
              />
            </Grid>
          );
        })}
      </Grid>
      {/* table  */}
      <br />
      <AdminProfessionalTable
        members={memberList}
        setMembers={setMemberList}
        tbl_name={adminTableName}
        update_all_members_func={update_all_members_func}
      />
    </Container>
  );
}
