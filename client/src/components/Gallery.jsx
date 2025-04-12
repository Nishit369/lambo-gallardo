import React, { useState, useEffect, useRef } from "react";

const LamborghiniTextureSelectorWithMenu = ({ textures, isLoading, error, onTextureSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const menuRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleTextureSelect = (texture) => {
    setSelectedTexture(texture);
    if (onTextureSelect) {
      onTextureSelect(texture);
    }
    setIsOpen(false); 
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && event.target !== document.querySelector('.texture-menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (isLoading) {
    return <div className="text-center py-6 text-gray-400">Loading stunning textures...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-6 text-center font-semibold">Error loading awesome textures.</div>;
  }

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={toggleOpen}
        className={`texture-menu-button bg-black text-white rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-300 hover:bg-gray-800 ${isOpen ? 'rounded-t-md rounded-b-none' : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Texture Selector Menu (Conditionally Rendered) */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 mt-1 bg-black rounded-md shadow-lg p-4 z-10"
          style={{ width: "300px" }} // Adjust width as needed
        >
          {/* Close Button */}
          <button
            onClick={toggleOpen}
            className="absolute top-2 right-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">
            Choose Your Finish
          </h3>
          <div
            className="overflow-y-auto grid grid-cols-3 gap-2 py-2"
            style={{ maxHeight: "200px" }} // Adjust max height for scroll
          >
            {textures.map((texture) => (
              <button
                key={texture._id}
                onClick={() => handleTextureSelect(texture)}
                className={`group w-20 h-20 rounded-md overflow-hidden shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 ${
                  selectedTexture?._id === texture._id
                    ? 'shadow-xl border-2 border-yellow-500 transform scale-105'
                    : 'hover:shadow-xl group-hover:brightness-110'
                }`}
              >
                {/* Display the base64 image directly in the src */}
                {/* {console.log("Image Data URL:", texture.photo)} */}
                <img
                  src={texture.image}
                  alt={texture.prompt}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </button>
            ))}
            {textures.length === 0 && !isLoading && !error && (
              <div className="text-gray-400 text-sm col-span-3 text-center">
                No awesome finishes available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Gallery = ({handleDecals}) => {
  const [textures, setTextures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCarTexture, setSelectedCarTexture] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/v1/clipdrop/all") // Assuming your API endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTextures(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching textures:", err);
        setError(err.message || "Failed to fetch textures");
        setIsLoading(false);
      });
  }, []);

  const handleTextureSelect = (texture) => {
    setSelectedCarTexture(texture);
    console.log("Selected in Parent:", texture);
    handleDecals("full",texture.image)
  };

  return (
    <div>
      {selectedCarTexture && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Selected Finish:</h4>
          <img
            src={selectedCarTexture.image}
            alt={selectedCarTexture.prompt}
            className="w-32 h-32 object-cover rounded-md shadow-md"
          />
          <p className="text-sm text-gray-600 mt-1">{selectedCarTexture.prompt}</p>
        </div>
      )}
      <LamborghiniTextureSelectorWithMenu
        textures={textures}
        isLoading={isLoading}
        error={error}
        onTextureSelect={handleTextureSelect}
      />
    </div>
  );
};

export default Gallery;