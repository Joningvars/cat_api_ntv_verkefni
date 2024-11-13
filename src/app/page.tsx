"use client";

import { useEffect, useState } from "react";

type CatImage = {
  id: string;
  url: string;
};

const CAT_API_URL = "https://catfact.ninja/fact/";
const CAT_IMG_URL = "https://api.thecatapi.com/v1/images/search?limit=9";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<CatImage[]>([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Function that fetches cat images
    const getCatImages = async () => {
      const response = await fetch(CAT_IMG_URL);
      if (!response.ok) {
        throw new Error("Network response error");
      }
      const data = await response.json();

      // Pop one image if there are images
      if (data.length > 0) {
        data.pop(); // Remove the last image
      }

      setImages(data); // Set the images state
    };

    const getData = async () => {
      await getCatImages();
      setIsLoading(false);
    };

    getData();
  }, [reload]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-rows-3 grid-cols-3 gap-5">
        {images.map((img) => (
          <ImgComponent key={img.id} img={img} />
        ))}
        <button
          onClick={() => {
            setReload(!reload);
          }}
          className="bg-blue-600 p-4 rounded col-start-2 hover:bg-blue-700 transition "
        >
          Reload Images
        </button>
      </div>
    </div>
  );
}

const ImgComponent = ({ img }: { img: CatImage }) => {
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const getFact = async () => {
    // Start loading before fetching
    setIsLoading(true);
    try {
      const response = await fetch(CAT_API_URL);
      if (!response.ok) {
        throw new Error("Network response error");
      }
      const factData = await response.json();
      setFact(factData.fact);
    } catch (error) {
      console.error("Error fetching fact:", error);
      setFact("Failed to load fact.");
    } finally {
      // Stop loading after fetching
      setIsLoading(false);
    }
  };

  const handleOnClick = () => {
    // Set clicked state to true
    setIsClicked(!isClicked);

    // Fetch a new fact when image is clicked
    getFact();
  };

  return (
    <div className="relative" onClick={handleOnClick}>
      <img src={img.url} className="h-60 w-60 object-cover" alt="Cat" />
      {isClicked && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center transition">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : (
            <p className="text-white text-center p-2">{fact}</p>
          )}
        </div>
      )}
    </div>
  );
};
