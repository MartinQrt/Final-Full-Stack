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
import { useParams } from "react-router-dom";
import { Event, fetchAllEvents } from "../../api/eventsApi";
import { editParticipant, EditParticipantRequest, getParticipant, Participant } from "../../api/participantApi";
import { SelectValue } from "../../types/selectValue";

import './editParticipant.css';

export const EditParticipant = () => {
  const { id } = useParams();
  const [participant, setParticipant] = useState<Participant>();
  const [loading, setLoading] = useState(false);
  const [eventOptions, setEventOptions] = useState<SelectValue[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const formMethods = useForm<any>();

  const loadOptions = () => {
    return fetchAllEvents()
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
  
  const handleSubmit = (formData: EditParticipantRequest) => {
     const request: EditParticipantRequest = {
       ...formData,
       birthday: dayjs(formData.birthday).format("YYYY-MM-DD"),
     };

    if (!id) {
      throw new Error('id is not defined, bad state');
    }

    editParticipant(id, request)
      .then(() => {
        loadPartipant(id);
        formMethods.reset();
        enqueueSnackbar("Participant updated!", { variant: "success" });
      })
      .catch((err) =>
        enqueueSnackbar(`Could not edit participant: ${err}`, {
          variant: "error",
        })
      );
  };

  const loadPartipant = (id: string) => {
    setLoading(true);
    getParticipant(id).then((response) => {
      loadOptions().then(() => {
        setLoading(false);
        setParticipant(response);
        formMethods.setValue("email", response.email);
        formMethods.setValue("fullName", response.fullName);
        formMethods.setValue("eventId", response.event);
        formMethods.setValue("birthday", dayjs(response.birthDate));
      });
    });
  }

  useEffect(() => {
    if (!id) {
      throw new Error("Id missing from path");
    }

    loadPartipant(id);
  }, []);

  return (
    <div className="edit-participant-wrapper">
      {!loading && participant && (
        <FormErrorProvider
          onError={(error) => {
            if (error.type === "required") {
              return "Field is required";
            }
            return error?.message;
          }}
        >
          <FormContainer
            formContext={formMethods}
            onSuccess={handleSubmit}
          >
            <h1>Edit participant: </h1>
            <div className="edit-participant-form">
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
              <Button type="submit" variant="contained">
                Edit participant
              </Button>
            </div>
          </FormContainer>
        </FormErrorProvider>
      )}
    </div>
  );
};