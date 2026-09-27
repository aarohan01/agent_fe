"use client";

import { useState } from "react";

// Hardcoded, later change to env
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function Home() {
  const [query, setQuery] = useState("");
  const [searchedMovie, setSearchedMovie] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


async function searchMovie(movieName) {
  const searchTerm = movieName.trim();

  if (!searchTerm) {
    return;
  }

  setLoading(true);
  setError(null);
  setSearchedMovie(searchTerm);

  try {
    const response = await fetch(
      `${API_URL}?movie_name=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const data = await response.json();

    console.log(data);

    setResult(data);

  } catch (err) {
    setError(err.message);

  } finally {
    setLoading(false);
  }
}


  function handleSubmit(e) {
    e.preventDefault();

    searchMovie(query);
  }


  function handleSuggestionClick(suggestion) {
    setQuery(suggestion);

    searchMovie(suggestion);
  }


  return (
    <main className="page">

      <div className="movie-review">

        <h1 className="title">
          Movie Review
        </h1>


        {/* Search */}

        <form
          className="search-row"
          onSubmit={handleSubmit}
        >

          <input
            className="search-input"
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            className="search-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </form>


        {/* Suggestions */}

        <section className="suggestions-area">

          {result?.suggestions?.length > 0 && (
            <>
              <strong>Did you mean:</strong>

              <div className="suggestions">
                {result.suggestions.map((suggestion) => (

                  <span
                    className="suggestion"
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </span>

                ))}
              </div>
            </>
          )}

        </section>


        {/* Error */}

        {error && (
          <p className="status-message">
            {error}
          </p>
        )}


        {/* Results */}

        {result && !loading && (

          <section className="result-area">

            {/* Movie not found */}

            {!result.movie_found && (
              <p className="status-message">
                Movie not found
              </p>
            )}


            {/* Movie found */}

            {result.movie_found && (
              <>

                <h2 className="movie-title">
                  {searchedMovie}
                </h2>


                <div className="result-section">

                  <h3>Details</h3>

                  <p>
                    {result.details || "Details not available."}
                  </p>

                </div>


                <div className="result-section">

                  <h3>Review Summary</h3>


                  {/* Reviews not found */}

                  {!result.reviews_found && (
                    <p>Reviews not found</p>
                  )}


                  {/* Reviews found */}

                  {result.reviews_found && (
                    <>

                      <p>
                        <strong>Positives:</strong>{" "}
                        {result.positives}
                      </p>

                      <p>
                        <strong>Negatives:</strong>{" "}
                        {result.negatives}
                      </p>

                      <p>
                        <strong>Overall:</strong>{" "}
                        {result.overall}
                      </p>

                    </>
                  )}

                </div>

              </>
            )}

          </section>

        )}

      </div>

    </main>
  );
}