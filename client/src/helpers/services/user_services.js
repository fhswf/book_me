import axios from "axios";

export async function getUserById(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/users/getUser`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getUserByUrl(url) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/users/findUserByUrl`,
    {
      params: { url: url },
    }
  );
  return response;
}
