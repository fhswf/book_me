import axios from "axios";

export async function getUserById(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/users/user`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function updateUser(token, user) {
  const response = await axios.put(
    `${process.env.REACT_APP_API_URI}/users/user`,
    { data: user },
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
