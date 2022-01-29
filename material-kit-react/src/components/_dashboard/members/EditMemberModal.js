import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  Grid,
  Dialog,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Input,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import { useAuth } from "src/authentication/AuthContext";
import { editOneMember } from "src/mysql_db_api/members.js";

import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@material-ui/lab";
import { editFb_user } from "src/mysql_db_api/fb_user";
import { CommitteeField } from "../profile";

export default function EditMemberModal({
  open,
  setOpen,
  setMembers,
  chosenItem,
  fb_user,
  members,
  update_all_members_func,
}) {
  // console.log("chosenItem", chosenItem);
  const { setLoading, displayErrMess } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };
  const [selected, setSelected] = useState(
    chosenItem.committees ? chosenItem.committees.split("; ") : []
  );
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    cougar_email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    psid: Yup.string().required("PSID is required"),
    memberstatus: Yup.string(),
    graduation_sem: Yup.string(),
    graduation_year: Yup.string(),
    classification: Yup.string(),
    account_expiretime: Yup.string().required(),
    age: Yup.string(),
    ethnicity: Yup.string(),
    // payment_type: Yup.string(),
    displayName: Yup.string().required(),
    linkedin_link: Yup.string(),
    groupme_name: Yup.string(),
    shirt_size: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      id: chosenItem.id,
      first_name: chosenItem.first_name,
      last_name: chosenItem.last_name,
      psid: chosenItem.psid,
      memberstatus: chosenItem.memberstatus,
      email: chosenItem.email,
      cougar_email: chosenItem.cougar_email,
      graduation_sem: chosenItem.graduation_sem,
      graduation_year: chosenItem.graduation_year,
      classification: chosenItem.classification,
      age: chosenItem.age,
      account_expiretime: chosenItem.account_expiretime,
      point: parseInt(chosenItem.point),
      ethnicity: chosenItem.ethnicity,
      payment_type: chosenItem.payment_type,
      displayName: fb_user.displayName,
      disabled: fb_user.disabled,
      linkedin_link: chosenItem.linkedin_link,
      groupme_name: chosenItem.groupme_name,
      shirt_size: chosenItem.shirt_size,
    },
    validationSchema: formSchema,
    onSubmit: async (edit_member) => {
      edit_member.committees = selected.join("; ");
      // console.log("edit member", edit_member);
      setLoading(true);
      const res = await editOneMember(edit_member, chosenItem.psid);
      if (res.data) {
        displayErrMess("Edited new member to the list!", "success");
        const user = {
          email: edit_member.email,
          disabled: edit_member.disabled,
          displayName: edit_member.displayName,
        };
        const res1 = await editFb_user(user, fb_user.uid);

        const res4 = await update_all_members_func();
        setMembers(res4.data);

        setOpen(false);
      } else {
        displayErrMess(res.message.message, "error");
      }
      setLoading(false);
    },
  });

  const { isSuperAdmin } = useAuth();

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Edit Member Information
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid spacing={1} container>
                <Grid item xs={6}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="name"
                    label="First"
                    type="text"
                    fullWidth
                    size="small"
                    {...getFieldProps("first_name")}
                    error={Boolean(touched.first && errors.first)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="last"
                    label="Last"
                    type="text"
                    fullWidth
                    size="small"
                    {...getFieldProps("last_name")}
                    error={Boolean(touched.last && errors.last)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="PSID"
                    label="PSID"
                    type="text"
                    fullWidth
                    size="small"
                    {...getFieldProps("psid")}
                    error={Boolean(touched.psid && errors.psid)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Member status
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select memberstatus"
                      {...getFieldProps("memberstatus")}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"New"}>New</MenuItem>
                      <MenuItem value={"Returning"}>Returning</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="filled-number personal email"
                    label="Email"
                    type="email"
                    fullWidth
                    defaultValue="0"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    {...getFieldProps("email")}
                    error={Boolean(touched.email && errors.email)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="filled-number"
                    label="Cougar Email"
                    type="email"
                    fullWidth
                    defaultValue="0"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    {...getFieldProps("cougar_email")}
                    error={Boolean(touched.cougarEmail && errors.cougarEmail)}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="Account Display Name"
                    label="Account Display Name"
                    type="text"
                    fullWidth
                    size="small"
                    {...getFieldProps("displayName")}
                    error={Boolean(touched.displayName && errors.displayName)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Account Display Name"
                    label="Linkedin"
                    type="text"
                    fullWidth
                    size="small"
                    {...getFieldProps("linkedin_link")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Groupme Name"
                    label="GroupMe Username"
                    type="text"
                    fullWidth
                    size="small"
                    {...getFieldProps("groupme_name")}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Graduation semester
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      // value={gradation_sem}
                      {...getFieldProps("graduation_sem")}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"Spring"}>Spring</MenuItem>
                      <MenuItem value={"Fall"}>Fall</MenuItem>
                      <MenuItem value={"Summer"}>Summer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Graduation year
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
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
                </Grid>

                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Classification
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("classification")}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"Freshman"}>Freshman</MenuItem>
                      <MenuItem value={"Sophomore"}>Sophomore</MenuItem>
                      <MenuItem value={"Junior"}>Junior</MenuItem>
                      <MenuItem value={"Senior"}>Senior</MenuItem>
                      <MenuItem value={"Master"}>Master</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Ethnicity
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("ethnicity")}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"Asian"}>Asian</MenuItem>
                      <MenuItem value={"Black or African- American"}>
                        Black or African- American
                      </MenuItem>
                      <MenuItem value={"White"}>White</MenuItem>
                      <MenuItem value={"Latino"}>Latino</MenuItem>
                      <MenuItem
                        value={"Native Hawaiian or other Pacific islander"}
                      >
                        Native Hawaiian or other Pacific islander
                      </MenuItem>
                      <MenuItem value={"From multiple races"}>
                        From Multiple Races
                      </MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Age
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("age")}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"Under 18"}>Under 18</MenuItem>
                      <MenuItem value={"18-22"}>18-22</MenuItem>
                      <MenuItem value={"23-29"}>23-29</MenuItem>
                      <MenuItem value={"30+"}>30+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="filled-number"
                    label="POINT"
                    type="number"
                    fullWidth
                    defaultValue="0"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    disabled={isSuperAdmin() ? false : true}
                    {...getFieldProps("point")}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Account Expire Time
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("account_expiretime")}
                      error={Boolean(touched.expiretime && errors.expiretime)}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      {/* <MenuItem value={"Fall 2021"}>Fall 2021</MenuItem> */}
                      <MenuItem value={"Spring 2022"}>Spring 2022</MenuItem>
                      {/* <MenuItem value={"Fall 2022"}>Fall 2022</MenuItem>
                      <MenuItem value={"Spring 2023"}>Spring 2023</MenuItem>
                      <MenuItem value={"Fall 2024"}>Fall 2024</MenuItem>
                      <MenuItem value={"Spring 2024"}>Spring 2024</MenuItem>
                      <MenuItem value={"Fall 2025"}>Fall 2025</MenuItem>
                      <MenuItem value={"Spring 2025"}>Spring 2025</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Payment Type
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("payment_type")}
                      error={Boolean(touched.expiretime && errors.expiretime)}
                      input={<Input />}
                      disabled
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"45"}>Membership Only</MenuItem>
                      <MenuItem value={"55"}>Membership + Shirt</MenuItem>
                      <MenuItem value={"0"}>Former Officer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Shirt Size
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("shirt_size")}
                      input={<Input />}
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={"N/A"}>N/A</MenuItem>
                      <MenuItem value={"XS"}>XS</MenuItem>
                      <MenuItem value={"S"}>S</MenuItem>
                      <MenuItem value={"M"}>M</MenuItem>
                      <MenuItem value={"L"}>L</MenuItem>
                      <MenuItem value={"XL"}>XL</MenuItem>
                      <MenuItem value={"2XL"}>2XL</MenuItem>
                      <MenuItem value={"3XL"}>3XL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Active/Disable
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      {...getFieldProps("disabled")}
                      input={<Input />}
                      disabled
                      style={{ paddingLeft: 13 }}
                    >
                      <MenuItem value={false}>Active</MenuItem>
                      <MenuItem value={true}>Disable</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* {console.log("viet", { ...getFieldProps("committees") })} */}
                <Grid item xs={12}>
                  <CommitteeField
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            onClick={handleSubmit}
            color="primary"
          >
            Update
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

// edit, getone, getall, updateprofile
