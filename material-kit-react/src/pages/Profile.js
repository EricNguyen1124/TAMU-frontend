import React, { useState, useEffect } from "react";
import clsx from "clsx";
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
import { DatePicker, LoadingButton, TimePicker } from "@material-ui/lab";
import { fDateTime } from "src/utils/formatTime";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { updateProfile } from "src/mysql_db_api/members";
import { editFb_user } from "src/mysql_db_api/fb_user";
import { Attended_events, Resume } from "src/components/_dashboard/profile";
import Label from "src/components/Label";

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

export default function InputAdornments() {
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
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setDate("2022-01-31T00:00:00.000Z");
    console.log(time);
  }, []);

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
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h3
            style={{
              textAlign: "left",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            Inspeciton Form
          </h3>
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            Home Owner Information
          </div>
          <Grid cointainer spacing={3}>
            {/* <Grid container item></Grid> */}
            {/* <Grid container item></Grid> */}
            <Grid item>
              <TextField
                label="First Name"
                id="filled-start-adornment d"
                autoFocus
                required
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                {...getFieldProps("first")}
                error={Boolean(touched.first && errors.first)}
              />

              <TextField
                autoFocus
                required
                label="Last Name"
                id="filled-start-adornment f"
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("last")}
                error={Boolean(touched.last && errors.last)}
                variant="outlined"
              />
              <br />
              <TextField
                autoFocus
                label="Phone Number"
                id="filled-start-adornment l"
                className={clsx(classes.margin, classes.textField)}
                // {...getFieldProps("linkedin_link")}
                variant="outlined"
                required
              />
              <TextField
                autoFocus
                label="Email Address"
                id="filled-start-adornment account"
                className={clsx(classes.margin, classes.textField)}
                // {...getFieldProps("groupme_name")}
                variant="outlined"
                required
              />

              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Would You Like to Be Contact Through
                </InputLabel>
                <Select
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select h"
                  {...getFieldProps("classification")}
                  error={Boolean(
                    touched.classification && errors.classification
                  )}
                  input={<Input />}
                  style={{ paddingLeft: 13, marginBottom: "20px" }}
                  required
                >
                  <MenuItem value={"Text"}>Text</MenuItem>
                  <MenuItem value={"Phone"}>Phone</MenuItem>
                  <MenuItem value={"Email"}>Email</MenuItem>
                </Select>
              </FormControl>
              <br />
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <DatePicker
                    label="Schedule Date"
                    mask="____/__/__"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={9}>
                  <TimePicker
                    label="Schedule Time"
                    value={time}
                    onChange={(newTime) => {
                      setTime(newTime);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <div style={{ textAlign: "left", marginTop: "20px" }}>
                  Home Inspection Address
                </div>
              </Grid>

              <Grid item container>
                <TextField
                  autoFocus
                  label="Address"
                  placeholder="Address Line 1"
                  id="filled-start-adornment-updated-time"
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  required
                />

                <TextField
                  autoFocus
                  label=""
                  placeholder="Address Line 2"
                  id="filled-start-adornment-updated-time"
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                />

                <TextField
                  autoFocus
                  label="City"
                  placeholder="City"
                  id="filled-start-adornment-updated-time"
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  required
                />

                <TextField
                  autoFocus
                  label="State"
                  placeholder="State"
                  id="filled-start-adornment-updated-time"
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  required
                />

                <TextField
                  autoFocus
                  label="ZIP Code"
                  placeholder="ZIP   Code"
                  id="filled-start-adornment-updated-time"
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  required
                />
              </Grid>
              <div
                style={{
                  textAlign: "left",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                Upload Files
              </div>
              {/* <CommitteeField selected={selected} setSelected={setSelected} /> */}
              <Resume />
            </Grid>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </Grid>
        </Form>
      </FormikProvider>
      {/* <Attended_events /> */}
    </Container>
  );
}
