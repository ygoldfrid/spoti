import axios from "axios";
import { toast } from "react-toastify";

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
    console.log(error);
    toast.error("An unexpected error occurred");
  } else if (error.response.status === 401) {
    window.location = "/logout";
    toast.error("Your session expired");
  } else if (error.response.status === 403) {
    toast.info("Premium account required to play songs");
  }

  return Promise.reject(error);
});

function setAccessToken(accessToken) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setAccessToken,
};
