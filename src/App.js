import React from "react";
import content from "./content.json";
import Story from "./Story";

function App() {
  const storiesClassName = "h-full snap-y snap-mandatory";
  const stories = content.stories.map((s) => (
    <Story key={s.slug} content={s} />
  ));
  return (
    <div className="h-full">
      <div className={storiesClassName}>{stories}</div>
    </div>
  );
}

export default App;
