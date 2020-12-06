export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const authenticate = (response, next) => {
  setLocalStorage("access_token", response.data.access_token);
  next();
};

export const signout = () => {
  removeLocalStorage("access_token");
};

export const isAuthenticated = () => {
  if (localStorage.getItem("access_token")) {
    return JSON.parse(localStorage.getItem("access_token"));
  }
};
