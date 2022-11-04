import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./components/GlobalStyles";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyles>
          <App />
          <ToastContainer />
        </GlobalStyles>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
