import React from "react";
import content from "./content.json";
import "./App.css";
import Story from "./Story";

function App() {
  const stories = content.stories.map((s) => (
    <Story key={s.slug} content={s} />
  ));
  return (
    <div>
      <div className="stories">{stories}</div>
    </div>
  );
}

export default App;
