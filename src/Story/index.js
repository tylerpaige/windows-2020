import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
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
    artIsVisible: true,
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

  const [artIsVisible, setArtVisibility] = useState(true);
  const [sentinelHideArtwork, hideArtTriggerInView] = useInView();
  const [sentinelShowArtwork, showArtTriggerInView] = useInView();

  useEffect(() => {
    if (hideArtTriggerInView) {
      setArtVisibility(false);
    } else if (showArtTriggerInView) {
      setArtVisibility(true);
    }
  }, [hideArtTriggerInView, showArtTriggerInView]);

  const artworkHiddenCSS = {
    opacity: 0,
    transition: `opacity 2s ease-in`,
    pointerEvents: "none",
  };

  const artworkVisibleCSS = {
    opacity: 1,
    transition: `opacity 300ms ease-out`,
    pointerEvents: "all",
  };

  const handleScroll = (e) => {
    if (scrollContainer.current.scrollLeft > 0) {
      document.documentElement.classList.add("no-vertical-scroll");
    } else {
      document.documentElement.classList.remove("no-vertical-scroll");
    }
  };

  // TODO: allow for different content types
  const body = props.content.body.map((b, i) => <p key={slug + i}>{b.p}</p>);
  return (
    <div
      className="story"
      ref={scrollContainer}
      onClick={handlePageClick}
      onScroll={handleScroll}
    >
      <div
        ref={sentinelHideArtwork}
        className="story__sentinel story__sentinel--artwork-fades-out"
      ></div>
      <div
        ref={sentinelShowArtwork}
        className="story__sentinel story__sentinel--artwork-fades-in"
      ></div>
      <div className="story__splash">
        <div
          className="story__art"
          style={artIsVisible ? artworkVisibleCSS : artworkHiddenCSS}
        ></div>
        <div
          className="story__overlay"
          style={getOverlayCSS(state.art.crop)}
        ></div>
        <div className="story__splash-spacer"></div>
      </div>
      <div className="story__body">{body}</div>
    </div>
  );
}

export default Story;
