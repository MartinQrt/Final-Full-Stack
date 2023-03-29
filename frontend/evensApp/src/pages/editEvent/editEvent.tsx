import { Button } from "@mui/material";
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
import { editEvent, EditEventRequest, Event, fetchEvent } from "../../api/eventsApi";

import "./editEvent.css";

export const EditEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const formMethods = useForm<EditEventRequest>();

  const handleSubmit = (formData: EditEventRequest) => {
    if (!id) {
      throw new Error("id is not defined, bad state");
    }

    editEvent(id, formData)
      .then(() => {
        loadEvent(id);
        formMethods.reset();
        enqueueSnackbar("Event updated!", { variant: "success" });
      })
      .catch((err) =>
        enqueueSnackbar(`Could not edit event: ${err}`, {
          variant: "error",
        })
      );
  };

  const loadEvent = (id: string) => {
    setLoading(true);
    fetchEvent(id).then((response) => {
        setLoading(false);
        setEvent(response);
        formMethods.setValue("name", response.name);
        formMethods.setValue("location", response.location);
    });
  };

  useEffect(() => {
    if (!id) {
      throw new Error("Id missing from path");
    }

    loadEvent(id);
  }, []);

  return (
    <div className="edit-event-wrapper">
      {!loading && event && (
        <FormErrorProvider
          onError={(error) => {
            if (error.type === "required") {
              return "Field is required";
            }
            return error?.message;
          }}
        >
          <FormContainer formContext={formMethods} onSuccess={handleSubmit}>
            <h1>Edit event: </h1>
            <div className="edit-event-form">
              <TextFieldElement
                name="name"
                label="Event name"
                required
                margin="dense"
                variant="standard"
              />
              <TextFieldElement
                name="location"
                label="Event location"
                required
                margin="dense"
                variant="standard"
              />
              <Button type="submit" variant="contained">
                Edit event
              </Button>
            </div>
          </FormContainer>
        </FormErrorProvider>
      )}
    </div>
  );
};