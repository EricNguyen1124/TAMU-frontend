import React, { useState } from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { makeStyles } from "@material-ui/styles";
// import IconButton from "@material-ui/core/IconButton";
import {
  Input,
  // Typography,
  Grid,
  Select,
  MenuItem,
  Container,
  FilledInput,
  // Divider,
  // Button,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { useAuth } from "src/authentication/AuthContext";
import { DatePicker, LoadingButton } from "@material-ui/lab";
import { fDateTime } from "src/utils/formatTime";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { updateProfile } from "src/mysql_db_api/members";
import { editFb_user } from "src/mysql_db_api/fb_user";
import { Attended_events, Resume } from "src/components/_dashboard/profile";
import Label from "src/components/Label";
import bxScan from "@iconify/icons-bx/bx-scan";

const useStyles = makeStyles(() => ({
  root: {
    flexWrap: "wrap",
    padding: 0,
    marginLeft: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  margin: {
    margin: "10px 0px",
    marginRight: "10px !important",
  },
  withoutLabel: {
    marginTop: "10px",
  },
  textField: {
    width: "40ch",
  },
  personal_textfield: {
    width: "20ch",
  },
  dropdown: {
    width: "18ch",
  },
}));
// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function PointSystem() {
  const classes = useStyles();
  const {
    setLoading,
    displayErrMess,
    userProfile,
    currentUser,
    updateUserProfileInFrontend,
  } = useAuth();
  const [selected, setSelected] = useState(
    userProfile.committees ? userProfile.committees.split(", ") : []
  );
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    cougarEmail: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    displayName: Yup.string().required("First Name is required"),
    first: Yup.string().required("First Name is required"),
    last: Yup.string().required("Last Name is required"),
    psid: Yup.string().required("PSID is required"),
    graduation_sem: Yup.string(),
    graduation_year: Yup.string(),
    classification: Yup.string(),
    point: Yup.string(),
    account_expiretime: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      first: userProfile.first_name,
      last: userProfile.last_name,
      psid: userProfile.psid,
      email: userProfile.email,
      cougarEmail: userProfile.cougar_email,
      graduation_sem: userProfile.graduation_sem,
      graduation_year: userProfile.graduation_year,
      classification: userProfile.classification,
      age: parseInt(userProfile.age),
      point: parseInt(userProfile.point),
      displayName: userProfile.displayName,
      expiretime: userProfile.account_expiretime,
      linkedin_link: userProfile.linkedin_link,
      groupme_name: userProfile.groupme_name,
      updated_time: fDateTime(userProfile.updated_time),
    },
    validationSchema: formSchema,
    onSubmit: async (member) => {
      console.log("member", member);
      setLoading(true);
      const user = {
        uid: currentUser.uid,
        displayName: member.displayName,
        email: member.email,
        disabled: false,
      };
      const promise1 = updateProfile(member, userProfile.psid); // for mysql
      const promise2 = editFb_user(user, userProfile.uid); // firebase
      const [res1, res2] = await Promise.all([promise1, promise2]);
      const promise3 = await updateUserProfileInFrontend(user);
      if (res1.data && res2.data) {
        displayErrMess("Update successfully", "success");
      } else {
        displayErrMess("Fail to save the data", "error");
      }
      setLoading(false);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;
  return (
    <Container>
      <h1
        style={{
          textAlign: "left",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Home Insurance Savings
      </h1>
      <div
        style={{
          textAlign: "left",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ fontSize: "25px", color: "red" }}>
          Save more with our home insurance discounts
        </h2>
        <p style={{ fontSize: "15px", width: "100%" }}>
          As a Discount Farmer customer, you may be eligible for the home
          insurance discount we offer. You could save money for submit an annual
          home inspection and security system invoice, or invite friend and
          family to enjoy the same great insurance services you have.
        </p>
        <p style={{ fontSize: "15px", color: "red" }}>
          Note: discounts vary by state.
        </p>
        <p
          style={{
            fontSize: "20px",
            marginTop: "10px",
            color: "red",
            width: "50%",
          }}
        >
          Get a free home insurance quote TODAY!
        </p>
      </div>

      <Grid item xs={0} gap={2}>
        <item>
          <TextField
            autoFocus
            label="ZIP Code"
            id="filled-basic"
            className={clsx(classes.margin, classes.textField)}
            // {...getFieldProps("linkedin_link")}
            variant="filled"
          />
        </item>
      </Grid>
      <item>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Start A Quote
        </LoadingButton>
      </item>

      <h2 style={{ fontSize: "25px", marginTop: "20px" }}>
        Home Owner Savings
      </h2>
      <p
        style={{
          fontSize: "15px",
          marginTop: "10px",
          marginBottom: "40px",
          width: "50%",
        }}
      >
        If you submit a home inspection report along with a inspection invoice
        annually, or when your friend and family enrolled with your refer code,
        Discount Farmer may reward you!
      </p>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Icon icon={bxScan} width="60" height="60" color="red" />
          <h3
            style={{
              fontSize: "18px",
              marginTop: "0px",
              marginBottom: "5px",
              width: "15%",
            }}
          >
            Scan/ Upload Annual Home Inspection Report
          </h3>
          <p
            style={{
              fontSize: "15px",
              marginTop: "10px",
              marginBottom: "40px",
              width: "45%",
            }}
          >
            Join us for scan and upload your annual home inspection report and
            invoice today, and you will get reward points once we received the
            information you uploaded to the web. Safe home save more with Scan
            and Upload!
          </p>
        </Grid>
        <Grid item xs={6}>
          <Icon icon={bxScan} width="60" height="60" color="red" />
          <h3
            style={{
              fontSize: "18px",
              marginTop: "0px",
              marginBottom: "5px",
              width: "15%",
            }}
          >
            Scan/ Upload Annual Home Inspection Report
          </h3>
          <p
            style={{
              fontSize: "15px",
              marginTop: "10px",
              marginBottom: "40px",
              width: "45%",
            }}
          >
            Join us for scan and upload your annual home inspection report and
            invoice today, and you will get reward points once we received the
            information you uploaded to the web. Safe home save more with Scan
            and Upload!
          </p>
        </Grid>
      </Grid>
    </Container>
  );
}
