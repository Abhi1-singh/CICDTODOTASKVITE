// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://cicdtodotask.onrender.com/api"
// });

// export default api;


// src/api/api.js
// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://cicdtodotask.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;



// import axios from "axios";

// const isLocalhost =
//   window.location.hostname === "localhost";

// const api = axios.create({
//   baseURL: isLocalhost
//     ? "http://localhost:3000/api"
//     : "https://cicdtodotask.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
