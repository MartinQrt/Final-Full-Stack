import { Button, Link } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../App";
import "./header.css";
import BoltIcon from "@mui/icons-material/Bolt";
import { useLocation, useNavigate } from "react-router-dom";
import { AppPaths } from "../../utils/appPaths";

export const Header = () => {
  const { authToken, setAuthContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentPath = useLocation();

  const handleLogout = () => {
    setAuthContext(undefined);
    localStorage.clear();
  };

  return (
    <div className="header">
      <div className="linksAndAppName">
        <div className="appName">
          <h2>Events App </h2>
          <BoltIcon className="appIcon" />
        </div>
        {authToken && (
          <div className="links">
            <Link
              component="button"
              onClick={() => navigate(AppPaths.ADD_PARTICIPANT)}
              className={
                currentPath.pathname === AppPaths.ADD_PARTICIPANT
                  ? "selectedLink"
                  : "notSelectedLink"
              }
            >
              Register participants
            </Link>
            <Link
              component="button"
              onClick={() => {
                navigate(AppPaths.ALL_EVENTS);
              }}
              className={
                currentPath.pathname === AppPaths.ALL_EVENTS
                  ? "selectedLink"
                  : "notSelectedLink"
              }
            >
              All events
            </Link>
            <Link
              component="button"
              onClick={() => {
                navigate(AppPaths.ALL_PARTICIPANTS);
              }}
              className={
                currentPath.pathname === AppPaths.ALL_PARTICIPANTS
                  ? "selectedLink"
                  : "notSelectedLink"
              }
            >
              All participants
            </Link>
          </div>
        )}
      </div>
      {authToken && (
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </div>
  );
};