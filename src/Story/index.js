import React from "react";
import "./index.css";

const getOverlayCSS = (crop) => {
  const leftPanelWidth = crop.x - crop.width / 2;
  const rightPanelWidth = 1 - crop.x - crop.width;
  const topPanelHeight = crop.y - crop.height / 2;
  const bottomPanelHeight = 1 - crop.y - crop.height;

  const styles = [
    { width: 1, height: topPanelHeight, position: "0% 0%" },
    { width: rightPanelWidth, height: 1, position: "100% 0%" },
    { width: 1, height: bottomPanelHeight, position: "0% 100%" },
    { width: leftPanelWidth, height: 1, position: "0% 0%" },
  ].reduce(
    (styles, { width, height, position }) => {
      styles.backgroundImage.push(`linear-gradient(white, white)`);
      styles.backgroundSize.push(`${width * 100}% ${height * 100}%`);
      styles.backgroundPosition.push(position);
      return styles;
    },
    {
      backgroundImage: [],
      backgroundSize: [],
      backgroundPosition: [],
    }
  );

  styles.backgroundImage = styles.backgroundImage.join(",");
  styles.backgroundSize = styles.backgroundSize.join(",");
  styles.backgroundPosition = styles.backgroundPosition.join(",");

  return styles;
};

function Story(props) {
  // TODO: choose which art based on viewport size
  const state = {
    art: props.content.art.mobile,
  };
  const slug = props.content.slug;

  const scrollContainer = React.createRef();

  const turnPage = (forwards) => {
    const delta = forwards ? window.innerWidth : -1 * window.innerWidth;
    scrollContainer.current.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  };

  const handlePageClick = (e) => {
    const position = e.clientX / window.innerWidth;
    const hotAreaWidth = 0.2;
    if (position >= 1 - hotAreaWidth) {
      turnPage(true);
    } else if (position <= hotAreaWidth) {
      turnPage(false);
    }
  };

  // TODO: allow for different content types
  const body = props.content.body.map((b, i) => <p key={slug + i}>{b.p}</p>);
  return (
    <div className="story" ref={scrollContainer} onClick={handlePageClick}>
      <div className="story__splash">
        <div className="story__art"></div>
        <div className="story__overlay" style={getOverlayCSS(state.art.crop)}>
          <h3>{props.content.title}</h3>
        </div>
        <div className="story__splash-spacer"></div>
      </div>

      <div className="story__body">{body}</div>
    </div>
  );
}

export default Story;
