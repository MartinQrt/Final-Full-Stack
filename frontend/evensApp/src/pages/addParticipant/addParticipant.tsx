import { Button } from "@mui/material";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  FormErrorProvider,
  FormContainer,
  TextFieldElement,
  SelectElement,
  DatePickerElement,
  useForm,
} from "react-hook-form-mui";
import { Event, fetchAllEvents } from "../../api/eventsApi";
import {
  registerParticipant,
  RegisterParticipantRequest,
} from "../../api/participantApi";
import { SelectValue } from "../../types/selectValue";

import "./addParticipant.css";

export const AddParticipantPage = () => {
  const [eventOptions, setEventOptions] = useState<SelectValue[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const formMethods = useForm<RegisterParticipantRequest>();

  const loadOptions = () => {
    fetchAllEvents()
      .then((events) => setEventOptions(mapEvents(events)))
      .catch((err) =>
        enqueueSnackbar(`Could not fetch events: ${err}`, {
          variant: "error",
        })
      );
  };

  const mapEvents = (events: Event[]): SelectValue[] => {
    return events.map((event) => ({ id: event._id, label: event.name }));
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleSubmit = (formData: RegisterParticipantRequest) => {
    const request: RegisterParticipantRequest = {
      ...formData,
      birthday: dayjs(formData.birthday).format("YYYY-MM-DD"),
    };

    registerParticipant(request)
      .then(() => {
        formMethods.reset();
        enqueueSnackbar("Participant registered!", { variant: "success" });
      })
      .catch((err) =>
        enqueueSnackbar(`Could not register participant: ${err}`, {
          variant: "error",
        })
      );
  };

  return (
    <div className="add-participant-wrapper">
      <FormErrorProvider
        onError={(error) => {
          if (error.type === "required") {
            return "Field is required";
          }
          return error?.message;
        }}
      >
        <FormContainer formContext={formMethods} onSuccess={handleSubmit}>
          <h1> Register a participant </h1>
          <div className="login-form">
            <TextFieldElement
              name="fullName"
              label="Full name"
              required
              margin="dense"
              variant="standard"
            />
            <SelectElement
              name="eventId"
              label="Event"
              required
              variant="standard"
              margin="dense"
              options={eventOptions}
            />
            <TextFieldElement
              name="email"
              label="Email"
              type="email"
              required
              margin="dense"
              variant="standard"
            />
            <DatePickerElement
              name="birthday"
              label="Date of birth"
              required
              inputProps={{ variant: "standard" }}
            />
            <Button type="submit" variant="contained">Add participant</Button>
          </div>
        </FormContainer>
      </FormErrorProvider>
    </div>
  );
};