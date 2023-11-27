import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchPosts, usersuggestions } from "../utils";

function AutocompleteSearch({ onSearch, user, dispatch }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!user || !user.token) {
      // User or token is not available, don't make requests
      return;
    }

    if (input.trim() === "") {
      setSuggestions([]);
      // If the input is empty, fetch all posts
      fetchPosts(user.token, dispatch, "", {}); // Empty object means fetch all posts
      return;
    }

    // Make an API request to fetch user suggestions based on input
    const fetchSuggestions = async (input) => {
      const suggestions = await usersuggestions(user.token, input);
      setSuggestions(suggestions);
    };

    fetchSuggestions(input);
  }, [input, dispatch, user]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion);
    setSuggestions([]); // Hide suggestions
    // Perform the search using fetchPosts here
    await fetchPosts(user.token, dispatch, "", { search: suggestion });
  };

  return (
    <div className="autocomplete-search relative">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search..."
        style={{
          // Add your input styles here
          width: "16rem",
          height: "30px",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 p-2 ">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                cursor: "pointer", // Add the cursor pointer style
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteSearch;
