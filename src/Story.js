import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const getOverlayStyle = (crop) => {
  const leftPanelWidth = crop.x - crop.width / 2;
  const rightPanelWidth = 1 - crop.x - crop.width;
  const topPanelHeight = crop.y - crop.height / 2;
  const bottomPanelHeight = 1 - crop.y - crop.height;

  return {
    "--overlay-left-width": `${leftPanelWidth * 100}%`,
    "--overlay-right-width": `${rightPanelWidth * 100}%`,
    "--overlay-top-height": `${topPanelHeight * 100}%`,
    "--overlay-bottom-height": `${bottomPanelHeight * 100}%`,
  };
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

  // REVIEW: I don't actually need `hideArtTriggerInView` nor `showArtTriggerInView` to render my app.
  // I just want to know the latest values and combine them into a single stream
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

  // TODO: this seems suspect, but how else to affect the <html> element?
  const handleScroll = () => {
    if (scrollContainer.current.scrollLeft > 0) {
      document.documentElement.classList.add("no-vertical-scroll");
    } else {
      document.documentElement.classList.remove("no-vertical-scroll");
    }
  };

  // TODO: allow for different content types
  const body = props.content.body.map((b, i) => {
    if (b.p) {
      return <p key={slug + i}>{b.p}</p>;
    } else if (b.fleuron) {
      return <hr key={slug + i} className="hr" />;
    }
    return null;
  });
  return (
    <div
      className="relative flex h-screen w-full snap-x snap-mandatory flex-nowrap overflow-auto snap-center"
      ref={scrollContainer}
      onClick={handlePageClick}
      onScroll={handleScroll}
    >
      <div
        ref={sentinelHideArtwork}
        className="left-2screen-minus-px absolute h-full w-px"
      ></div>
      <div
        ref={sentinelShowArtwork}
        className="left-screen absolute h-full w-px"
      ></div>
      <div className="flex flex-nowrap">
        <div
          className="z-1 sticky left-0 top-0 h-full w-screen bg-blue-500"
          style={artIsVisible ? artworkVisibleCSS : artworkHiddenCSS}
        ></div>
        <div
          className="z-2 -ml-screen relative w-screen snap-center window"
          style={getOverlayStyle(state.art.crop)}
        ></div>
        <div className="w-screen"></div>
      </div>
      <div className="min-w-screen-vw -ml-screen px-margin py-margin text-[2.5rem] columns-auto columns-[90vw] gap-[10vw] [&>*]:snap-center [&>*:first-child]:mt-0 [&>*:last-child]:after:ml-auto [&>*:last-child]:after:mr-[-5vw] [&>*:last-child]:after:block [&>*:last-child]:after:h-px [&>*:last-child]:after:w-[5vw] [&>*:last-child]:after:content-[''] [@media(min-width:55rem)]:[column-width:100vw] [@media(min-width:55rem)]:[column-gap:0] [@media(min-width:55rem)]:pl-0 [@media(min-width:55rem)]:pr-0 [@media(min-width:55rem)]:[&>*]:px-[calc((100vw-22em)/2)]">
        {body}
      </div>
    </div>
  );
}

export default Story;
