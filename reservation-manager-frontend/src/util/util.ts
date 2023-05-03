import urls from "./constants";
import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      "Content-type": "application/json"
    }
  });

const getData = (url: string) => {
    return axios.get(url)
        .then(response => response.data)
};

const postData = (url: string, body: any) => {
    axios.post(url, JSON.stringify(body), {headers : {"Content-Type": "application/json"}})
        .then(response => response.data)
};

