export interface Event {
    _id: string;
    name: string;
    location: string;
}

export interface CreateEventRequest {
    name: string;
    location: string;
}

export interface EditEventRequest {
    name: string;
    location: string;
}

export const fetchEvent = async (id: string): Promise<Event> => {
    return fetch(`/api/events/${id}`, {
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

export const fetchAllEvents = async (): Promise<Event[]> => {
    return fetch("/api/events", {
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

export const createEvent = async (
    request: CreateEventRequest
): Promise<void> => {
    return fetch("/api/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Autorization: `Bear ${localStorage.getItem("authToken")}`,
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

export const deleteEvent = async (eventId: string) => {
    return fetch(`/api/event/${eventId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    })
        .then((response) => {
            if(!response.ok) {
                return response.text().then((result) => Promise.reject(result));
            }

            return response.json();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const editEvent = async (eventId: string, request: EditEventRequest) => {
    return fetch(`/api/events/${eventId}`, {
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