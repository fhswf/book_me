import axios from "axios";

export async function saveUserEvent(
  token,
  name,
  location,
  description,
  isActive,
  eventurl,
  rangedays,
  calendardays,
  bufferbefore,
  bufferafter,
  duration,
  starttimemon,
  endtimemon,
  starttimetue,
  endtimetue,
  starttimewen,
  endtimewen,
  starttimethu,
  endtimethu,
  starttimefri,
  endtimefri,
  starttimesat,
  endtimesat,
  starttimesun,
  endtimesun
) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URI}/events/addEvent`,
    {
      name,
      location,
      description,
      isActive,
      eventurl,
      rangedays,
      calendardays,
      bufferbefore,
      bufferafter,
      duration,
      starttimemon,
      endtimemon,
      starttimetue,
      endtimetue,
      starttimewen,
      endtimewen,
      starttimethu,
      endtimethu,
      starttimefri,
      endtimefri,
      starttimesat,
      endtimesat,
      starttimesun,
      endtimesun,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function deleteEvent(token, id) {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_URI}/events/deleteEvent/${id}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response;
}

export async function getEventByID(token, id) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getEvent/${id}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response;
}

export async function updateEvent(
  token,
  id,
  name,
  location,
  description,
  eventurl,
  rangedays,
  duration,
  calendardays,
  bufferafter,
  bufferbefore,
  starttimemon,
  endtimemon,
  starttimetue,
  endtimetue,
  starttimewen,
  endtimewen,
  starttimethu,
  endtimethu,
  starttimefri,
  endtimefri,
  starttimesat,
  endtimesat,
  starttimesun,
  endtimesun,
  isActive
) {
  const response = await axios.put(
    `${process.env.REACT_APP_API_URI}/events/updateEvent/${id}`,
    {
      data: {
        name,
        location,
        description,
        eventurl,
        rangedays,
        duration,
        calendardays,
        bufferafter,
        bufferbefore,
        starttimemon,
        endtimemon,
        starttimetue,
        endtimetue,
        starttimewen,
        endtimewen,
        starttimethu,
        endtimethu,
        starttimefri,
        endtimefri,
        starttimesat,
        endtimesat,
        starttimesun,
        endtimesun,
        isActive,
      },
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getActiveEvents(user_id) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getActiveEvents`,
    {
      params: { user: user_id },
    }
  );
  return response;
}
export async function getAvailableTimes(day, url, userid) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getAvailable`,
    {
      params: {
        day: day,
        eventurl: url,
        user: userid,
      },
    }
  );
  return response;
}

export async function getUsersEvents(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getEvents`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getEventByUrlAndUser(user_id, event_url) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getEventBy`,
    {
      params: { user: user_id, url: event_url },
    }
  );
  return response;
}
