import React, { useState } from "react";
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
  // Divider,
  // Button,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { useAuth } from "src/authentication/AuthContext";
import { LoadingButton } from "@material-ui/lab";
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
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            My profile
          </h3>
          <div>
            Committees:
            {userProfile.committees
              ? userProfile.committees.split("; ").map((item) => (
                  <Label variant="ghost" color="info" style={{ margin: 6 }}>
                    {item}
                  </Label>
                ))
              : " No committee"}
          </div>
          <Grid cointainer spacing={3}>
            <Grid container item>
              <TextField
                required
                label="Account Display Name"
                autoFocus
                id="filled-start-adornment a"
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("displayName")}
                error={Boolean(touched.displayName && errors.displayName)}
                variant="outlined"
              />

              <TextField
                label="Point"
                autoFocus
                id="filled-start-adornment v"
                type="number"
                disabled={true}
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("point")}
                variant="outlined"
              />
            </Grid>
            <Grid container item>
              <TextField
                required
                autoFocus
                margin="dense"
                id="filled-number cougar_email"
                label="Account Login Email"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
                {...getFieldProps("email")}
                className={clsx(classes.margin, classes.textField)}
                error={Boolean(touched.email && errors.email)}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="filled-number c"
                label="Cougar Email"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
                {...getFieldProps("cougarEmail")}
                className={clsx(classes.margin, classes.textField)}
                error={Boolean(touched.cougarEmail && errors.cougarEmail)}
              />
            </Grid>
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

              {/* <TextField
                required
                label="Student ID"
                id="filled-start-adornment g"
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("psid")}
                error={Boolean(touched.psid && errors.psid)}
                variant="outlined"
              /> */}<br/>
              <TextField
                autoFocus
                label="Linkedin"
                id="filled-start-adornment l"
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("linkedin_link")}
                variant="outlined"
              />
              <TextField
                autoFocus
                label="GroupMe Username"
                id="filled-start-adornment acount"
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("groupme_name")}
                variant="outlined"
              />
<br/>
              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Classification
                </InputLabel>
                <Select
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select h"
                  {...getFieldProps("classification")}
                  error={Boolean(
                    touched.classification && errors.classification
                  )}
                  input={<Input />}
                  style={{ paddingLeft: 13 }}
                >
                  <MenuItem value={"Freshman"}>Freshman</MenuItem>
                  <MenuItem value={"Sophomore"}>Sophomore</MenuItem>
                  <MenuItem value={"Junior"}>Junior</MenuItem>
                  <MenuItem value={"Senior"}>Senior</MenuItem>
                  <MenuItem value={"Masters"}>Master</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item container>
              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Graduation semester
                </InputLabel>
                <Select
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select k"
                  // value={gradation_sem}
                  {...getFieldProps("graduation_sem")}
                  error={Boolean(
                    touched.graduation_sem && errors.graduation_sem
                  )}
                  input={<Input />}
                  style={{ paddingLeft: 13 }}
                >
                  <MenuItem value={"Spring"}>Spring</MenuItem>
                  <MenuItem value={"Fall"}>Fall</MenuItem>
                  <MenuItem value={"Summer"}>Summer</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Graduation year
                </InputLabel>
                <Select
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select m"
                  {...getFieldProps("graduation_year")}
                  input={<Input />}
                  style={{ paddingLeft: 13 }}
                >
                  <MenuItem value={"2021"}>2021</MenuItem>
                  <MenuItem value={"2022"}>2022</MenuItem>
                  <MenuItem value={"2023"}>2023</MenuItem>
                  <MenuItem value={"2024"}>2024</MenuItem>
                  <MenuItem value={"2025"}>2025</MenuItem>
                  <MenuItem value={"2026"}>2026</MenuItem>
                  <MenuItem value={"2027"}>2027</MenuItem>
                  <MenuItem value={"2028"}>2028</MenuItem>
                  <MenuItem value={"2029"}>2029</MenuItem>
                  <MenuItem value={"2030"}>2030</MenuItem>
                </Select>
              </FormControl>

              {/* <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Account Will Expire After*
                </InputLabel>
                <Select
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select n"
                  {...getFieldProps("expiretime")}
                  disabled
                  input={<Input />}
                  style={{ paddingLeft: 13 }}
                >
                  <MenuItem value={"Fall 2021"}>Fall 2021</MenuItem>
                  <MenuItem value={"Spring 2022"}>Spring 2022</MenuItem>
                  <MenuItem value={"Fall 2022"}>Fall 2022</MenuItem>
                  <MenuItem value={"Spring 2023"}>Spring 2023</MenuItem>
                  <MenuItem value={"Fall 2024"}>Fall 2024</MenuItem>
                  <MenuItem value={"Spring 2024"}>Spring 2024</MenuItem>
                  <MenuItem value={"Fall 2025"}>Fall 2025</MenuItem>
                  <MenuItem value={"Spring 2025"}>Spring 2025</MenuItem>
                </Select>
              </FormControl> */}
              <TextField
                autoFocus
                label="Profile Updated time"
                id="filled-start-adornment-updated-time"
                className={clsx(classes.margin, classes.textField)}
                {...getFieldProps("updated_time")}
                variant="outlined"
                disabled
              />
            </Grid>

            {/* <CommitteeField selected={selected} setSelected={setSelected} /> */}
            <Resume />
          </Grid>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update Profile
          </LoadingButton>
        </Form>
      </FormikProvider>
      {/* <Attended_events /> */}
    </Container>
  );
}
