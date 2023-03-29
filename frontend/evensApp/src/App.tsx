import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { createContext, useEffect, useMemo, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { AuthenticatedRoute } from "./components/authenticated-route/authenticatedRoute";
import { Header } from "./components/header/header";
import { AddParticipantPage } from "./pages/addParticipant/addParticipant";
import { LoginPage } from "./pages/login/login";
import { theme } from "./theme/theme";
import { AppPaths } from "./utils/appPaths";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AllEventsPage } from "./pages/allEvents/allEvents";
import { AllParticipantsPage } from "./pages/allParticipants/allParticipants";
import { EditParticipant } from "./pages/editParticipant/editParticipant";
import { EditEvent } from "./pages/editEvent/editEvent";

const router = [
  {
    path: AppPaths.LOGIN,
    element: <LoginPage />,
  },
  {
    path: AppPaths.ADD_PARTICIPANT,
    element: (
      <AuthenticatedRoute>
        <AddParticipantPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: AppPaths.EDIT_PARTICIPANT,
    element: (
      <AuthenticatedRoute>
        <EditParticipant />
      </AuthenticatedRoute>
    ),
  },
  {
    path: AppPaths.EDIT_EVENT,
    element: (
      <AuthenticatedRoute>
        <EditEvent />
      </AuthenticatedRoute>
    ),
  },
  {
    path: AppPaths.ALL_EVENTS,
    element: (
      <AuthenticatedRoute>
        <AllEventsPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: AppPaths.ALL_PARTICIPANTS,
    element: (
      <AuthenticatedRoute>
        <AllParticipantsPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <AuthenticatedRoute>
        <Navigate to={AppPaths.ADD_PARTICIPANT} />
      </AuthenticatedRoute>
    ),
  },
];

export const AuthContext = createContext<{
  authToken?: string | null;
  setAuthContext: any;
}>({
  authToken: "",
  setAuthContext: () => {},
});

function App() {
  const [authToken, setAuthContext] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const value = useMemo(() => ({ authToken, setAuthContext }), [authToken]);
  const routes = useRoutes(router);

  useEffect(() => {
    authToken && localStorage.setItem("authToken", authToken);
  }, [authToken]);

  return (
    <AuthContext.Provider value={value}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <>
              <Header />
              <div className="appContainer">{routes}</div>
            </>
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </AuthContext.Provider>
  );
}

export default App;