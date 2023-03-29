import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  deleteParticipant,
  getAllParticipants,
  Participant,
} from "../../api/participantApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AppPaths } from "../../utils/appPaths";

import './allParticipants.css';


export const AllParticipantsPage = () => {
  const [participantsData, setParticipantsData] = useState<
    (Participant & { id: number })[]
  >([]);
  const [loading, setIsloading] = useState(false);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Participant name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "birthDate",
      headerName: "Birth date",
      flex: 1,
      renderCell: (cell) => dayjs(cell.row.birthDate).format("YYYY-MM-DD"),
    },
    {
      field: "event",
      headerName: "Event name",
      flex: 1,
      renderCell: (cell) => cell.row.event.name,
    },
    {
      headerName: "Actions",
      field: "_id",
      sortable: false,
      filterable: false,
      renderCell: (cellData) => {
        const rowData: Participant = cellData.row;
        return (
          <div className="action-cell">
            <DeleteIcon
              onClick={(event) => handleDeleteParticipant(rowData._id, event)}
            />
            <EditIcon
              onClick={() =>
                navigate(AppPaths.EDIT_PARTICIPANT.replace(":id", rowData._id))
              }
            />
          </div>
        );
      },
    },
  ];

  const handleDeleteParticipant = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsloading(true);
    deleteParticipant(id)
      .then(() => {
        loadOptions();
        enqueueSnackbar(`Participant deleted`, {
          variant: "success",
        });
      })
      .catch((err) => {
        setIsloading(false);
        enqueueSnackbar(`Could not delete participant: ${err}`, {
          variant: "error",
        });
      });
  };

  const loadOptions = () => {
    setIsloading(true);
    getAllParticipants()
      .then((participants) => {
        setIsloading(false);
        setParticipantsData(mapOptions(participants));
      })
      .catch((err) => {
        setIsloading(false);
        enqueueSnackbar(`Could not fetch participants: ${err}`, {
          variant: "error",
        });
      });
  };

  const mapOptions = (participants: Participant[]) => {
    return participants.map((participant, index) => ({
      ...participant,
      id: index,
    }));
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div>
      <h1>All participants:</h1>
      <DataGrid
        autoHeight={true}
        rows={participantsData}
        loading={loading}
        columns={columns}
        disableVirtualization={true}
        rowSelection={false}
        disableRowSelectionOnClick={true}
      />
    </div>
  );
};