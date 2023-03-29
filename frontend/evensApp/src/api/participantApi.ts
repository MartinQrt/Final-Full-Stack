import { Event } from "./eventsApi";

export interface RegisterParticipantRequest {
  email: string;
  eventId: string;
  birthday: string;
  fullName: string;
}

export interface Participant {
  birthDate: Date;
  email: string;
  fullName: string;
  _id: string;
  event: Event;
}

export interface EditParticipantRequest {
  birthday: string;
  email: string;
  fullName: string;
  eventId: string;
}

export const registerParticipant = (request: RegisterParticipantRequest) => {
    return fetch("/api/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((result) => Promise.reject(result));
        }
  
        return response.json();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
  
  export const getAllParticipants = (): Promise<Participant[]> => {
    return fetch("/api/participants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((result) => Promise.reject(result));
        }
  
        return response.json();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
  
  export const deleteParticipant = (participantId: string): Promise<void> => {
    return fetch(`/api/participants/${participantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((result) => Promise.reject(result));
        }
  
        return response.json();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
  
  export const getParticipant = (participantId: string): Promise<Participant> => {
    return fetch(`/api/participants/${participantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((result) => Promise.reject(result));
        }
  
        return response.json();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
  
  export const editParticipant = (
    participantId: string,
    request: EditParticipantRequest
  ): Promise<Participant> => {
    return fetch(`/api/participants/${participantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((result) => Promise.reject(result));
        }
  
        return response.json();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };