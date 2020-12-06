import axios from "axios";
import moment from "moment";

export async function deleteAccess(token) {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_URI}/google/revoke`,
    {
      data: null,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getAuthUrl(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/google/generateUrl`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function insertIntoGoogle(
  user_id,
  event,
  time,
  name,
  email,
  description
) {
  const starttime = moment(time).format("YYYY-MM-DD HH:mm:ss");
  const response = axios.post(
    `${process.env.REACT_APP_API_URI}/google/insertEvent/${user_id}`,
    {
      event,
      starttime,
      name,
      email,
      description,
    }
  );
  return response;
}
