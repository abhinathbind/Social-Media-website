import axios from "axios";

export const makeRequest = axios.create({
  //baseURL: "http://localhost:5000/api/",
   baseURL:"https://socialmedia-three.vercel.app/api/",
  withCredentials: true,
});
