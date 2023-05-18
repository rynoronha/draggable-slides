import React from "react";
import "./Slide.scss";

const Slide = ({
  slide,
  index,
  draggedSlide,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
  markerPosition,
}) => {
  const isDragging = draggedSlide === slide;
  const isMarkerVisible = markerPosition && markerPosition.index === index;
  const markerPositionStyle =
    markerPosition && markerPosition.position === "top" ? "top" : "bottom";
  const markerOffsetStyle =
    markerPositionStyle === "top" ? "-10px" : "calc(100% + 6px)";

  return (
    <div
      key={slide.id}
      draggable
      onDragStart={(event) => handleDragStart(event, slide)}
      onDragOver={(event) => handleDragOver(event, index)}
      onDragEnd={handleDragEnd}
      onDrop={(event) => handleDrop(event, slide)}
      className="slide-container"
    >
      <div className="slide-content">
        <span className="slide-title">{slide.title}</span>
        {isDragging && (
          <>
            {isMarkerVisible && (
              <div
                className="marker"
                style={{
                  [markerPositionStyle]: markerOffsetStyle,
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Slide;
