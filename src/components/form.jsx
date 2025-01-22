
import React, { useState } from "react";
import axios from "axios";

import "./css/form.css";

function RequestForm() {
  const [forms, setForms] = useState([
    { id: 1, method: "GET", url: "", headers: "", body: "", response: null },
  ]);
  const [activeFormId, setActiveFormId] = useState(1);

  const addNewForm = () => {
    const newForm = {
      id: forms.length + 1,
      method: "GET",
      url: "",
      headers: "",
      body: "",
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

  const sendRequest = async (id) => {
    const form = forms.find((form) => form.id === id);

    try {
      const res = await axios({
        method: form.method,
        url: form.url,
        headers: JSON.parse(form.headers || "{}"),
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

    // Adjust active tab after closing
    if (id === activeFormId && updatedForms.length > 0) {
      setActiveFormId(updatedForms[0].id);
    }
  };

  return (
    <div className="request-form-container">
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
                  <button
                    onClick={() => sendRequest(form.id)}
                    className="send-button"
                  >
                    Send
                  </button>
                </div>
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
