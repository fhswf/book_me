
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
  console.log('authenticate: %s', response.data.access_token);
  setLocalStorage("access_token", response.data.access_token);
  next();
};

export const signout = () => {
  console.log('signout');
  removeLocalStorage("access_token");
};

export const isAuthenticated = () => {
  console.log('isAuthenticated: %s', localStorage.getItem("access_token"));
  if (localStorage.getItem("access_token")) {
    return JSON.parse(localStorage.getItem("access_token"));
  }
};
