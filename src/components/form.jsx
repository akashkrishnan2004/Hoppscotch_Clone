
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import "./css/form.css";

function RequestForm() {
  const [forms, setForms] = useState([
    {
      id: 1,
      method: "GET",
      url: "",
      headers: "",
      body: "",
      bearerToken: "",
      showBearerTokenInput: false,
      response: null,
    },
  ]);
  const [activeFormId, setActiveFormId] = useState(1);

  const addNewForm = () => {
    const newForm = {
      id: forms.length + 1,
      method: "GET",
      url: "",
      headers: "",
      body: "",
      bearerToken: "",
      showBearerTokenInput: false,
      response: null,
    };
    setForms([...forms, newForm]);
    setActiveFormId(newForm.id);
  };

  const handleInputChange = (id, field, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  const toggleBearerTokenInput = (id) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? { ...form, showBearerTokenInput: !form.showBearerTokenInput }
          : form
      )
    );
  };

  const sendRequest = async (id) => {
    const form = forms.find((form) => form.id === id);

    if (!form.url.trim()) {
      toast.error("Please enter a URL before sending the request.");
      return;
    }

    try {
      const parsedHeaders = JSON.parse(form.headers || "{}");

      if (form.bearerToken.trim()) {
        parsedHeaders["Authorization"] = `Bearer ${form.bearerToken}`;
      }

      const res = await axios({
        method: form.method,
        url: form.url,
        headers: parsedHeaders,
        data: JSON.parse(form.body || "{}"),
      });

      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === id
            ? {
                ...f,
                response: {
                  status: res.status,
                  statusText: res.statusText,
                  headers: res.headers,
                  data: res.data,
                },
              }
            : f
        )
      );
    } catch (error) {
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === id
            ? {
                ...f,
                response: {
                  error: error.message,
                  ...(error.response && {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data,
                  }),
                },
              }
            : f
        )
      );
    }
  };

  const closeTab = (id) => {
    if (id === 1) return;
    const updatedForms = forms.filter((form) => form.id !== id);
    setForms(updatedForms);

    if (id === activeFormId && updatedForms.length > 0) {
      setActiveFormId(updatedForms[0].id);
    }
  };

  return (
    <div className="request-form-container">
      <h1 className="request-form-container-head1">HOPPSCOTCH</h1>
      <div className="tabs-container">
        {forms.map((form) => (
          <div
            key={form.id}
            className={`tab ${activeFormId === form.id ? "active" : ""}`}
            onClick={() => setActiveFormId(form.id)}
          >
            Form {form.id}
            {form.id !== 1 && (
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(form.id);
                }}
              >
                &times;
              </span>
            )}
          </div>
        ))}
        <button onClick={addNewForm} className="add-tab-button">
          +
        </button>
      </div>

      <div className="form-content">
        {forms.map(
          (form) =>
            activeFormId === form.id && (
              <div key={form.id} className="items">
                <div className="top-items">
                  <div className="select-input">
                    <select
                      value={form.method}
                      onChange={(e) =>
                        handleInputChange(form.id, "method", e.target.value)
                      }
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={form.url}
                      onChange={(e) =>
                        handleInputChange(form.id, "url", e.target.value)
                      }
                    />
                  </div>
                  <button
                    onClick={() => sendRequest(form.id)}
                    className="send-button"
                  >
                    Send
                  </button>
                </div>
                <button
                  className="toggle-bearer-button"
                  onClick={() => toggleBearerTokenInput(form.id)}
                >
                  {form.showBearerTokenInput
                    ? "Hide Bearer Token Input"
                    : "Show Bearer Token Input"}
                </button>
                <div className="bottom-items">
                  <textarea
                    placeholder="Enter Headers (JSON)"
                    className="headersTextArea"
                    value={form.headers}
                    onChange={(e) =>
                      handleInputChange(form.id, "headers", e.target.value)
                    }
                  ></textarea>
                  <textarea
                    placeholder="Enter Body (JSON)"
                    className="bodyTextArea"
                    value={form.body}
                    onChange={(e) =>
                      handleInputChange(form.id, "body", e.target.value)
                    }
                  ></textarea>
                  {/* <button
                    className="toggle-bearer-button"
                    onClick={() => toggleBearerTokenInput(form.id)}
                  >
                    {form.showBearerTokenInput
                      ? "Hide Bearer Token Input"
                      : "Show Bearer Token Input"}
                  </button> */}
                  {form.showBearerTokenInput && (
                    <textarea
                      placeholder="Enter Bearer Token (one line per entry)"
                      className="bearer-token-input"
                      value={form.bearerToken}
                      onChange={(e) =>
                        handleInputChange(
                          form.id,
                          "bearerToken",
                          e.target.value
                        )
                      }
                    ></textarea>
                  )}
                </div>

                <div className="response-container">
                  <h3>Response</h3>
                  {form.response ? (
                    <pre>{JSON.stringify(form.response, null, 2)}</pre>
                  ) : (
                    <p>No response yet</p>
                  )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default RequestForm;
