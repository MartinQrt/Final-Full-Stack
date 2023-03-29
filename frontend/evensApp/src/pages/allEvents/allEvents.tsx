import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { fetchAllEvents, Event, CreateEventRequest, createEvent, deleteEvent } from "../../api/eventsApi";
import DeleteIcon from "@mui/icons-material/Delete";

import "./allEvents.css";
import { Button } from "@mui/material";
import { FormErrorProvider, FormContainer, TextFieldElement, SelectElement, DatePickerElement, useForm } from "react-hook-form-mui";
import EditIcon from "@mui/icons-material/Edit";
import { AppPaths } from "../../utils/appPaths";
import { useNavigate } from "react-router-dom";

export const AllEventsPage = () => {
  const [eventData, setEventData] = useState<(Event & { id: number })[]>([]);
  const [loading, setIsloading] = useState(false);
  const formMethods = useForm<CreateEventRequest>();
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Event name", flex: 1 },
    { field: "location", headerName: "Event location", flex: 1 },
    {
      headerName: "Actions",
      field: "_id",
      sortable: false,
      filterable: false,
      renderCell: (cellData) => {
        const rowData: Event = cellData.row;
        return (
          <div className="action-cell">
            <EditIcon
              onClick={() =>
                navigate(AppPaths.EDIT_EVENT.replace(":id", rowData._id))
              }
            />
            <DeleteIcon
              onClick={(event) => handleDeleteEvent(rowData._id, event)}
            />
          </div>
        );
      },
    },
  ];

  const handleDeleteEvent = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsloading(true);
    deleteEvent(id)
      .then(() => {
        loadOptions();
        enqueueSnackbar(`Event deleted`, {
          variant: "success",
        });
      })
      .catch(err => {
        setIsloading(false);
        enqueueSnackbar(`Could not delete event: ${err}`, {
          variant: "error",
        });
      })
  }

  const loadOptions = () => {
    setIsloading(true);
    fetchAllEvents()
      .then((events) => {
        setIsloading(false);
        setEventData(mapOptions(events));
      })
      .catch((err) => {
        setIsloading(false);
        enqueueSnackbar(`Could not fetch events: ${err}`, {
          variant: "error",
        });
      });
  };

   const handleSubmit = (formData: CreateEventRequest) => {
     createEvent(formData)
       .then(() => {
         formMethods.reset();
         loadOptions();
         enqueueSnackbar("Event created!", { variant: "success" });
       })
       .catch((err) =>
         enqueueSnackbar(`Could not create event: ${err}`, {
           variant: "error",
         })
       );
   };

  const mapOptions = (events: Event[]) => {
    return events.map((event, index) => ({
      id: index,
      _id: event._id,
      name: event.name,
      location: event.location,
    }));
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div>
      <h1>All Events:</h1>
      <DataGrid
        autoHeight={true}
        rows={eventData}
        loading={loading}
        columns={columns}
        disableVirtualization={true}
        onRowClick={(selectedRow) => console.log(selectedRow.row)}
        rowSelection={false}
        disableRowSelectionOnClick={true}
      />
      <FormErrorProvider
        onError={(error) => {
          if (error.type === "required") {
            return "Field is required";
          }
          return error?.message;
        }}
      >
        <FormContainer formContext={formMethods} onSuccess={handleSubmit}>
          <h2> Create a new event </h2>
          <div className="event-form">
            <TextFieldElement
              name="name"
              label="Event name"
              required
              margin="dense"
              variant="standard"
            />
            <TextFieldElement
              name="location"
              label="Location"
              required
              margin="dense"
              variant="standard"
            />
            <Button type="submit" variant="contained">
              Add event
            </Button>
          </div>
        </FormContainer>
      </FormErrorProvider>
    </div>
  );
};