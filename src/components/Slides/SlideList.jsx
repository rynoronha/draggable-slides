import React, { useRef, useState } from "react";
import Slide from "./Slide";
import "./SlideList.scss";

const Slides = ({ slides }) => {
  const [draggedSlide, setDraggedSlide] = useState(null);
  const [slidesList, setSlidesList] = useState(slides);
  const [previousSlides, setPreviousSlides] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const containerRef = useRef(null);

  const handleDragStart = (event, slide) => {
    setPreviousSlides(slidesList);
    setDraggedSlide(slide);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.target.parentNode);
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    const draggedSlideIndex = slidesList.findIndex(
      (slide) => slide === draggedSlide
    );
    if (index !== draggedSlideIndex) {
      const updatedSlides = [...slidesList];
      updatedSlides.splice(draggedSlideIndex, 1);
      updatedSlides.splice(index, 0, draggedSlide);
      setSlidesList(updatedSlides);
    }

    const containerElement = containerRef.current;
    const containerRect = containerElement.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;
    const mouseY = event.clientY;
    const scrollOffset = 20; // Adjust this value to control the scroll speed

    if (mouseY < containerTop + scrollOffset) {
      // Scroll up
      containerElement.scrollTop -= scrollOffset;
    } else if (mouseY > containerBottom - scrollOffset) {
      // Scroll down
      containerElement.scrollTop += scrollOffset;
    }

    const slideElements = Array.from(containerElement.children);
    const slideIndex = slideElements.findIndex((element) =>
      element.contains(event.target)
    );
    const slideRect = slideElements[slideIndex].getBoundingClientRect();
    const slideTop = slideRect.top - containerTop;
    const slideHeight = slideRect.height;
    const slideMidPoint = slideTop + slideHeight / 2;

    const markerPosition = {
      index,
      position: mouseY < slideMidPoint ? "top" : "bottom",
    };
    setMarkerPosition(markerPosition);
  };

  const handleDragEnd = () => {
    setDraggedSlide(null);
    setMarkerPosition(null);
  };

  const handleUndo = () => {
    if (previousSlides.length > 0) {
      setSlidesList(previousSlides);
      setPreviousSlides([]);
    }
  };

  const handleDrop = (event, slide) => {
    event.preventDefault();
    const draggedSlideIndex = slidesList.findIndex((s) => s === draggedSlide);
    const dropIndex = slidesList.findIndex((s) => s === slide);

    if (
      draggedSlideIndex !== -1 &&
      dropIndex !== -1 &&
      draggedSlide.id !== slide.id
    ) {
      const updatedSlides = [...slidesList];
      updatedSlides.splice(draggedSlideIndex, 1);
      updatedSlides.splice(dropIndex, 0, draggedSlide);
      setPreviousSlides(slidesList);
      setSlidesList(updatedSlides);
    }
  };

  const handleReset = () => {
    setSlidesList(slides);
    setPreviousSlides([]);
  };

  const handleRandomize = () => {
    const randomizedSlides = [...slidesList];
    for (let i = randomizedSlides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedSlides[i], randomizedSlides[j]] = [
        randomizedSlides[j],
        randomizedSlides[i],
      ];
    }
    setSlidesList(randomizedSlides);
    setPreviousSlides([]);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "0 80px",
      }}
    >
      <div className="actions-container">
        <h2 className="actions-title">Actions</h2>
        <div className="buttons-container">
          <button
            style={{ marginBottom: "4px" }}
            onClick={handleUndo}
            disabled={previousSlides.length === 0}
          >
            Undo Last
          </button>
          <button style={{ marginBottom: "4px" }} onClick={handleReset}>
            Reset
          </button>
          <button onClick={handleRandomize}>Random</button>
        </div>
      </div>
      <div className="container" ref={containerRef}>
        {slidesList.map((slide, index) => (
          <Slide
            key={slide.id}
            slide={slide}
            index={index}
            draggedSlide={draggedSlide}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            handleDrop={handleDrop}
            markerPosition={markerPosition}
          />
        ))}
      </div>
    </div>
  );
};

export default Slides;
