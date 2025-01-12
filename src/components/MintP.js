import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";

export const MintP = ({ contract, account }) => {
  const [totalSupply, setTotalSupply] = useState(null);
  const [images, setImages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      try {
        const totalSupply = await contract.methods.totalSupply().call();
        const totalSupplyToNumber = Number(totalSupply);
        setTotalSupply(totalSupplyToNumber);

        const imagesUrl = [];
        for (let i = 0; i < totalSupplyToNumber; i++) {
          const image = await contract.methods.Images(i).call();
          imagesUrl.push(image);
        }
        setImages(imagesUrl);
      } catch (err) {
        console.error("failed to get Images: ", err);
      }
    };

    if (contract) {
      getImages();
    }
  }, [contract, refresh]);

  async function sendImage() {
    try {
      await contract.methods.mint(inputVal).send({ from: account });
    } catch (error) {
      console.error("transaction failed: ", error);
    }

    setRefresh(true);
  }

  return (
    <div className="w-full h-full flex flex-col mx-auto">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!inputVal.startsWith("https://")) {
            alert("The image format is not available!");
            return;
          }
          sendImage();
          setInputVal("");
        }}
        className="flex flex-col items-center gap-6 mx-auto mt-24"
      >
        <div className="relative flex flex-row items-center gap-3">
          <input
            className="w-52 bg-[#ffffff] p-2 border-e-8 focus:border-r-emerald-800"
            placeholder="Add your photo in http://..."
            value={inputVal}
            onChange={(event) => setInputVal(event.target.value)}
          />
          <div
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer ${
              inputVal ? "visible opacity-100" : "invisible opacity-0"
            } transition-opacity duration-200`}
            onClick={() => setInputVal("")}
          >
            <MdCancel fontSize="20px" color="red" />
          </div>
        </div>
        <input
          className="w-32 rounded-md bg-[#11b873] text-white hover:bg-[#11b8b5] transition-all delay-100 duration-200 ease-in"
          type="submit"
          disabled={inputVal == ""}
        />
      </form>

      <div className="w-full h-full flex justify-center mt-24 mx-auto">
        {images.length > 0 ? (
          <div className="w-[40%] flex flex-row justify-center flex-wrap gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="w-72 h-48 bg-gray-200 flex flex-wrap items-start justify-center overflow-hidden rounded-lg shadow-lg"
              >
                <span className="absolute w-72 h-48 rounded-lg bg-transparent hover:bg-blue-950 hover:opacity-35 transition-all duration-300 ease-in-out" />

                <img
                  className="w-full h-full object-cover"
                  src={image}
                  draggable={false}
                  alt={`Image ${index}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No items found!</p>
        )}
      </div>
    </div>
  );
};
