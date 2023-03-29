import { Button } from "@mui/material";
import {
  FormContainer,
  FormErrorProvider,
  TextFieldElement,
} from "react-hook-form-mui";
import { login, LoginRequest } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

import "./login.css";
import { useSnackbar } from "notistack";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../App";
import { AppPaths } from "../../utils/appPaths";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { authToken, setAuthContext } = useContext(AuthContext);

  useEffect(() => {
    if (authToken) {
      navigate(AppPaths.ADD_PARTICIPANT);
    }
  }, [authToken]);

  const handleSubmit = (formData: LoginRequest) => {
    login(formData)
      .then((result) => {
        setAuthContext(result);
        enqueueSnackbar("Logged in!", { variant: "success" });
        navigate(AppPaths.ADD_PARTICIPANT);
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  return (
    <div className="login-wrapper">
      <FormErrorProvider
        onError={(error) => {
          if (error.type === "required") {
            return "Field is required";
          }
          return error?.message;
        }}
      >
        <FormContainer onSuccess={handleSubmit}>
          <div className="login-form">
            <TextFieldElement
              name="email"
              label="Email"
              type="email"
              required
              margin="dense"
              variant="standard"
            />
            <TextFieldElement
              name="password"
              type="password"
              label="Password"
              required
              variant="standard"
              margin="dense"
            />
            <Button type="submit">Login</Button>
          </div>
        </FormContainer>
      </FormErrorProvider>
    </div>
  );
};