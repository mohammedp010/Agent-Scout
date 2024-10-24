import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access query params
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import PromptsList from "./PromptsList";
import Navbar from "./Navbar"; // Import the Navbar component if not included in App.js
import "./ChatUI.css";
import ApiService from "../api/apiClient"; // Import the updated ApiService

// Loader Component
const Loader = React.memo(() => (
  <div className="loadingio-spinner-ellipsis-small" aria-label="Loading">
    <div className="ldio-yzaezf3dcmj">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
));

// Predefined Questions and Answers with Markdown
const predefinedQA = {
  "Best agents for beginners in Valorant.": `**For beginners in Valorant**, choosing an agent that is simple to understand and forgiving to play can help you focus on improving your aim and game sense without getting overwhelmed by complex abilities. Here are some of the best agents for beginners:

### 1.  **Brimstone**  (Controller)

-   **Role:**  Provides smokes and support for your team.
-   **Abilities:**
    -   _Sky Smokes:_  Deploy multiple smoke clouds from a distance, making it easy to block enemy sightlines.
    -   _Stim Beacon:_  Buffs fire rate and speed for teammates.
    -   _Incendiary:_  A fire grenade that deals damage over time, great for area control.
    -   **Why good for beginners:**  His abilities are straightforward, and his smokes can be placed from anywhere on the map, allowing you to focus on positioning and helping your team without needing fast reflexes.

### 2.  **Sage**  (Sentinel)

-   **Role:**  Healer and team protector.
-   **Abilities:**
    -   _Healing Orb:_  Heals teammates or yourself.
    -   _Barrier Orb:_  Builds a large, high wall to block off areas.
    -   _Slow Orb:_  Creates a slow field that hampers enemy movement.
    -   _Resurrection (Ultimate):_  Revives a dead teammate.
    -   **Why good for beginners:**  Sage’s healing and barriers make her a forgiving choice, allowing you to focus on team play. You can help teammates even if your aim isn’t perfect yet.

### 3.  **Phoenix**  (Duelist)

-   **Role:**  Entry fragger with self-sustaining abilities.
-   **Abilities:**
    -   _Hot Hands:_  A fireball that damages enemies and heals Phoenix.
    -   _Curveball:_  A flashbang that blinds enemies.
    -   _Blaze:_  A wall of fire that blocks vision and can heal you when standing inside.
    -   _Run It Back (Ultimate):_  Revives you at your starting point if you die during its duration.
    -   **Why good for beginners:**  Phoenix’s kit is easy to grasp. He can heal himself with fire-based abilities, which makes mistakes more forgiving, and his flashes are easy to control.

### 4.  **Killjoy**  (Sentinel)

-   **Role:**  Defensive, focuses on area denial and controlling sites.
-   **Abilities:**
    -   _Nanoswarm:_  A grenade that deploys a damaging nanobot swarm.
    -   _Turret:_  Deploys a turret that shoots at enemies in its range.
    -   _Alarmbot:_  Deploys a bot that tracks and weakens enemies.
    -   _Lockdown (Ultimate):_  A large-radius device that detains all enemies caught in its range.
    -   **Why good for beginners:**  Killjoy’s abilities don’t require complex mechanics. Her turret and bots work passively, allowing you to learn positioning and site control while contributing to your team’s defense.

### 5.  **Reyna**  (Duelist)

-   **Role:**  A self-sufficient fragger who thrives on kills.
-   **Abilities:**
    -   _Leer:_  A near-sighted flash that goes through walls.
    -   _Devour:_  Heals you after you kill an enemy.
    -   _Dismiss:_  Turns you invulnerable and intangible for a short time after a kill.
    -   _Empress (Ultimate):_  Enhances all abilities, granting faster fire rate and automatic healing.
    -   **Why good for beginners:**  Reyna’s self-sustaining kit is great for solo players, and her healing ability makes her forgiving if you win fights. However, she’s kill-dependent, so aim and dueling skills will still need to improve.

### 6.  **Sova**  (Initiator)

-   **Role:**  Information gatherer, helps reveal enemies' positions.
-   **Abilities:**
    -   _Recon Bolt:_  Fires an arrow that reveals enemies.
    -   _Shock Bolt:_  Fires an arrow that deals damage in an area.
    -   _Owl Drone:_  A flying drone that tags enemies.
    -   _Hunter's Fury (Ultimate):_  Fires long-range energy blasts across the map.
    -   **Why good for beginners:**  Sova's ability to scout and gather information allows you to contribute to your team even if your shooting isn’t perfect yet. His utility helps with map awareness and strategy.

Each of these agents offers a balance of utility and simplicity, making them ideal for players new to  _Valorant_. As you gain more experience, you’ll better understand your playstyle and may gravitate toward other agents or roles.`,
  
  "How to counter Phoenix's abilities?": `**Countering Phoenix in Valorant** involves understanding his abilities and finding ways to mitigate their impact. Here’s how to deal with each of his abilities effectively:

1. **Curveball (Flash)**
   - **Description:** Phoenix throws a flashbang that curves around corners, blinding enemies.
   - **Counter Strategies:**
     - *Preemptive positioning:* Avoid predictable angles where Phoenix might use his flash. If you hear him preparing the ability, try repositioning to an off-angle to catch him after he uses it.
     - *Turn away from the flash:* If you see the Curveball coming around a corner, quickly turn your screen away to avoid getting blinded.
     - *Use utility:* Agents like Omen or Brimstone can deploy smokes to obscure vision, making it harder for Phoenix to flash effectively.
     - *Aggressive push post-flash:* If Phoenix flashes around a corner, some players will push immediately. Being ready to prefire or peek unexpectedly can catch him off-guard.

2. **Hot Hands (Fireball)**
   - **Description:** Phoenix throws a fireball that creates a zone dealing damage to enemies and healing him.
   - **Counter Strategies:**
     - *Avoid standing in the fire:* The fire covers a limited area, so reposition quickly to avoid taking damage. If he uses it to block a path, consider alternative routes.
     - *Engage from long range:* Phoenix has to be in or near his fire to benefit from healing. Taking long-range duels prevents him from capitalizing on his healing.
     - *Area denial utility:* Use abilities that cover large spaces (like Killjoy’s Nanoswarm or Viper’s Snake Bite) to force Phoenix out of safe areas where he might heal.

3. **Blaze (Wall of Fire)**
   - **Description:** Phoenix creates a wall of fire that blocks vision and heals him when he stands inside.
   - **Counter Strategies:**
     - *Wait for the wall to dissipate:* Phoenix’s fire wall doesn’t last long, so if he uses it to block off a site or choke point, wait for it to fade, rather than rushing through.
     - *Shoot through the wall:* The wall only blocks vision, not bullets. If you know Phoenix or his teammates are behind it, you can prefire or spray through the fire.
     - *Information-gathering utility:* Use recon abilities (like Sova’s Recon Bolt or Fade’s Haunt) to reveal Phoenix or enemies hiding behind the wall.
     - *Pre-fire or bait:* Phoenix might push through his own wall to surprise you, but if you're prepared, you can anticipate and prefire his aggressive plays.

4. **Run It Back (Ultimate)**
   - **Description:** Phoenix creates a clone of himself that allows him to be revived at a set location if killed during the ultimate.
   - **Counter Strategies:**
     - *Identify the starting point:* Phoenix's clone will always return to the location where he activated his ultimate. If you find this location, you can wait for him to respawn and take him out easily.
     - *Avoid overcommitting:* Don’t waste all your utility or overextend to kill Phoenix during his ultimate, as he’ll just respawn. Try to play defensively and focus on eliminating him when he returns to his original position.
     - *Time your engagements:* If Phoenix is low on health after using Run It Back, you can wait for his ultimate to end and engage him with a health advantage.
     - *Punish aggressive pushes:* Many Phoenix players push recklessly during their ultimate since they don’t risk dying. Set up traps or hold angles to punish his overconfidence.`,
  
  "What is the best map to select for a rookie in Valorant??": `**For a rookie in Valorant**, the best map to start with is **Bind**. This map is beginner-friendly for several reasons:

1. **Simple Layout**
   - *Description:* Bind has a straightforward two-site design (A and B) with relatively fewer complex angles and choke points.
   - *Benefit:* It’s easy to understand and memorize, which is crucial for beginners who are still learning how to navigate maps efficiently.

2. **No Middle Area**
   - *Description:* Unlike maps like Split or Haven, Bind does not have a "mid" area that players have to control.
   - *Benefit:* This simplifies gameplay as you don’t have to worry about splitting your attention across three areas (mid, A site, and B site), allowing you to focus on just two.

3. **Teleporters**
   - *Description:* The map features teleporters that allow you to quickly rotate between sites, making it easier to reposition or retreat.
   - *Benefit:* This can be beneficial for beginners as it adds an extra layer of mobility without requiring advanced map control tactics. Teleporters also add an element of surprise, which can help newer players catch the enemy off-guard, even if they’re not highly skilled in gunplay.

4. **Balanced for Attackers and Defenders**
   - *Description:* Bind is considered balanced between attackers and defenders with no overly complex choke points or long sightlines.
   - *Benefit:* This balance makes it easier for rookies to feel comfortable on either side (attack or defense).

5. **Limited Verticality**
   - *Description:* Bind doesn’t have multiple vertical levels or complex high-ground/low-ground mechanics like Split or Ascent.
   - *Benefit:* This makes it easier for new players to aim and position themselves since there are fewer unpredictable angles.`,
};

const predefinedQAForPlayer = {
  "What’s KD ratio and how much should it be?": `
The  **K/D ratio**  (Kill/Death ratio) in  _Valorant_  represents the number of kills a player gets compared to the number of times they die in a match. It’s calculated as:

K/D Ratio=Number of KillsNumber of DeathsK/D Ratio=Number of DeathsNumber of Kills​

### For example:

-   If you get 10 kills and die 5 times in a match, your K/D ratio is  10/5=2.010/5=2.0.
-   If you get 5 kills and die 10 times, your K/D ratio is  5/10=0.55/10=0.5.

### What is a Good K/D Ratio?

There’s no strict rule for what a "good" K/D ratio is, but here are some general benchmarks:

-   **1.0 K/D Ratio:**  This means you get one kill for every death, which is average. If you're maintaining a 1.0 K/D ratio, you're essentially breaking even—you're contributing by getting kills, but you're also dying as often as you're fragging.
    
-   **Above 1.0 K/D Ratio:**  Anything above 1.0 means you’re getting more kills than deaths, which is generally considered good. A K/D ratio of  **1.5 to 2.0**  is solid, showing you're contributing well to your team.
    
-   **Below 1.0 K/D Ratio:**  A K/D ratio below 1.0 indicates you’re dying more than you’re killing, which can be a sign that you need to improve your mechanics or positioning.
    

### Should You Worry About K/D Ratio?

While the K/D ratio can give insight into your performance,  _Valorant_  is a  **team-based game**, and the outcome of the match (winning or losing) is far more important than individual stats. Players who prioritize utility, communication, and objective play (such as planting the spike, defusing, or supporting teammates) might not have the highest K/D, but they can still be incredibly valuable to the team.

### Factors to Consider Beyond K/D:

-   **Role in the Team:**  Duelists like  _Jett_  or  _Reyna_  are expected to have higher K/D ratios since they are designed to take fights. Support agents like  _Sage_  or  _Brimstone_  may not always rack up kills but can provide significant value through healing, utility, and assisting teammates.
    
-   **Impact Kills:**  Not all kills are equal. Getting a kill that opens up a site or prevents a spike defuse can have a much bigger impact than just farming kills. Focus on kills that directly affect the outcome of rounds.
    
-   **Objective Play:**  Planting or defusing the spike, gathering information for your team, or denying enemies key areas is often more important than just chasing kills.
    

### In conclusion:

-   For casual players, a K/D ratio of  **around 1.0**  is decent.
-   A K/D ratio  **above 1.5**  is considered good for most players.
-   However, don't focus solely on K/D—team play and utility usage are crucial in  _Valorant_. Winning the game should always be the priority over individual stats.`,
  
  "What’s her average score?": `Florescent is a high skill player of **VALORANT** and her average combat score is **287.5** which is pretty great.`,
};

function ChatUI() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation(); // Hook to access the current location

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const playerId = queryParams.get("id");
  const playerName = queryParams.get("name");

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt === "") return;

    // Add user message
    const userMessage = { sender: "user", text: trimmedPrompt };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setPrompt("");
    setIsLoading(true);
    setError(null);

    // Check if the question is in predefined QA
    const matchedAnswer = predefinedQA[trimmedPrompt];
    const matchedAnswerForPlayer = playerId ? predefinedQAForPlayer[trimmedPrompt] : null;

    if (matchedAnswer) {
      // Simulate API delay with setTimeout
      setTimeout(() => {
        const aiMessage = { sender: "ai", text: matchedAnswer };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsLoading(false);
      }, 3000); // 3 seconds delay
    }else if(matchedAnswerForPlayer){
      setTimeout(() => {
        const aiMessage = { sender: "ai", text: matchedAnswerForPlayer };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsLoading(false);
      }, 3000); // 3 seconds delay
    } else {
      // Proceed with API call for other questions
      try {
        const aiResponse = await ApiService.getAIResponse(trimmedPrompt);
        const aiMessage = { sender: "ai", text: aiResponse };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch AI response. Please try again.");
        const aiMessage = { sender: "ai", text: "Sorry, I couldn't process your request. Please try again later." };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } finally {
        setIsLoading(false);
      }
    }

    // Scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePromptClick = (selectedPrompt) => {
    setPrompt(selectedPrompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-ui-container">
      {/* Conditional Context Box */}
      {messages.length > 0 && (
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "ai" ? "ai-message" : "user-message"}`}
              style={{
                textAlign: msg.sender === "ai" ? "left" : "right",
              }}
            >
              {msg.sender === "ai" ? (
                <ReactMarkdown
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    p: ({ node, ...props }) => <span {...props} />, // Render paragraphs as span to prevent extra spacing
                    ul: ({ node, ...props }) => <ul style={{ margin: 0, paddingLeft: '20px' }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ margin: 0, paddingLeft: '20px' }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: '2px' }} {...props} />,
                    strong: ({ node, ...props }) => <strong {...props} />,
                    em: ({ node, ...props }) => <em {...props} />,
                    // Add more customizations as needed
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              )}
            </div>
          ))}
          {isLoading && (
            <div
              className="chat-message ai-message"
              style={{
                textAlign: "left",
              }}
            >
              <Loader />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}
      {messages.length === 0 && (
        <PromptsList
          handlePromptClick={handlePromptClick}
          isPlayerPrompt={playerId && playerName}
          playerName={playerName}
        />
      )}

      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-form-container">
          {playerId && playerName && (
            <div className="context-box">
              Questions about <strong>{playerName}</strong>
            </div>
          )}
          <div className="textarea-button-group">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                playerId && playerName
                  ? `Ask about ${playerName}...`
                  : "Type your message..."
              }
              className="prompt-textarea"
              aria-label="Chat prompt input"
              rows={1}
              maxLength={500}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              aria-label="Send message"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : <img src="/send-svgrepo-com.svg" alt="Send" />}
            </button>
          </div>
        </div>
      </form>

      {/* Display Error Message if Any */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ChatUI;
