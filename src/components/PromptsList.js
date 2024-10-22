import React from "react";
import PropTypes from "prop-types";
import { predefinedPrompts } from "../data/predefinedPrompts";
import { predefinedPromptsForPlayer } from "../data/predefinedPromptsForPlayer";
import "./PromptsList.css";

function PromptsList({ handlePromptClick, isPlayerPrompt = false, playerName = "" }) {
  // Determine which set of prompts to use based on isPlayerPrompt
  const promptsToDisplay = isPlayerPrompt ? predefinedPromptsForPlayer : predefinedPrompts;

  return (
    <div className="predefined-prompts">
      {promptsToDisplay.map((p, index) => (
        <button
          key={index}
          className="prompt-button"
          onClick={() => handlePromptClick(!isPlayerPrompt ? p : p.replace("{playerName}", playerName))}
          aria-label={`Predefined prompt: ${!isPlayerPrompt ? p : p.replace("{playerName}", playerName)}`}
        >
          {!isPlayerPrompt ? p : p.replace("{playerName}", playerName)}
        </button>
      ))}
    </div>
  );
}

PromptsList.propTypes = {
  handlePromptClick: PropTypes.func.isRequired,
  isPlayerPrompt: PropTypes.bool,
  playerName: PropTypes.string,
};

export default PromptsList;
