import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";

// ----------------------------------------------------------------------
import { useAuth } from "src/authentication/AuthContext";
export default function ForgotpassForm() {
  const { resetPass, setLoading, displayErrMess } = useAuth();
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async ({ email }) => {
      // setLoading(true);
      try {
        await resetPass(email);
        displayErrMess(
          "Sending you an email! Check it out in couple seconds",
          "info"
        );
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } catch (err) {
        console.log("err", err);
        displayErrMess("Invalid email or username", "error");
      }
      // setLoading(false);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit}
          style={{ marginTop: 20 }}
        >
          Reset Password
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
