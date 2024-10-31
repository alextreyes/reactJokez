import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */
function Joke({ id, vote, votes, text }) {
  return (
    <div className="Joke">
      <div className="Joke-votearea">
        {/* Calls the `vote` function from props, passing in id and +1 */}
        <button onClick={() => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        {/* Calls the `vote` function from props, passing in id and -1 */}
        <button onClick={() => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {/* Shows the current votes count */}
        {votes}
      </div>

      {/* Displays the joke text */}
      <div className="Joke-text">{text}</div>
    </div>
  );
}

export default Joke;
