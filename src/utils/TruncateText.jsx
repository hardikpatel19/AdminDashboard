// TruncateText.js
import React, { useRef, useState, useEffect } from 'react';
// import './styles.css'; // Ensure the correct path to your CSS file

function TruncateText({ text }) {
  const containerRef = useRef(null);
  const [truncatedText, setTruncatedText] = useState(text);

  useEffect(() => {
    const container = containerRef.current;
    const lineHeight = parseInt(window.getComputedStyle(container).lineHeight, 10);
    const maxHeight = lineHeight * 2; // Maximum height for 2 lines

    if (container.scrollHeight > maxHeight) {
      let truncated = text;
      while (container.scrollHeight > maxHeight && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
        container.textContent = `${truncated}...`;
      }
      setTruncatedText(container.textContent);
    }
  }, [text]);

  return (
    <div className="truncate" ref={containerRef}>
      {truncatedText}
    </div>
  );
}

export default TruncateText;
