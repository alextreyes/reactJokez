import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
function JokeList({ numJokesToGet = 5 }) {
  // Set up state for jokes and loading
  const [jokes, setJokes] = useState([]); // Stores the jokes
  const [isLoading, setIsLoading] = useState(true); // Tracks loading status

  /* Retrieves jokes from the API. Wrapped in `useCallback` to memoize and avoid re-fetching. */
  const getJokes = useCallback(async () => {
    try {
      let jokes = []; // Temporary list to hold unique jokes
      let seenJokes = new Set(); // Set to store joke IDs we’ve already seen

      // Keep fetching jokes until we reach the desired count
      while (jokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let joke = res.data;

        // Check if joke is already in our list, if not, add it
        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id); // Mark joke as seen
          jokes.push({ ...joke, votes: 0 }); // Add joke to list with 0 votes
        } else {
          console.log("duplicate found!");
        }
      }

      // Update jokes in state and stop loading spinner
      setJokes(jokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [numJokesToGet]); // Dependency array to ensure it only reruns if numJokesToGet changes

  /* Run `getJokes` when the component first mounts */
  useEffect(() => {
    getJokes();
  }, [getJokes]);

  /* Resets the joke list, triggers a loading state, and then fetches new jokes */
  function generateNewJokes() {
    setIsLoading(true);
    getJokes(); // Fetch new jokes
  }

  /* Handles up/down votes. Updates joke votes by id. */
  function vote(id, delta) {
    setJokes((jokes) =>
      jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* Sort jokes by votes, with the highest votes first */
  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  // Show loading spinner if jokes are still loading
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  // Render jokes once loaded
  return (
    <div className="JokeList">
      {/* Button to get new jokes */}
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {/* Render sorted jokes, each with a Joke component */}
      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote} // Pass the vote function to Joke component
        />
      ))}
    </div>
  );
}

export default JokeList;
