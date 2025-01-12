import "./App.css";
import "./styles/main.scss";
import { Nav } from "./components/Nav";
import { useEffect, useState } from "react";
import Image from "./abis/Image.json";
import Web3 from "web3";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { TbPlugConnected } from "react-icons/tb";
import { MintP } from "./components/MintP";

function App() {
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);

  const init = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();

        setWeb3API({
          provider: window.ethereum,
          web3: web3,
          contract: null,
        });
        setAccount(accounts[0]);
        localStorage.setItem("connectedAccount", accounts[0]);

        console.log("Using window.ethereum");
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask: https://metamask.io/download/");
    }
  };

  useEffect(() => {
    const stayConnect = async () => {
      const savedAccount = localStorage.getItem("connectedAccount");
      if (savedAccount && window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();

          if (accounts.includes(savedAccount)) {
            setWeb3API({
              provider: window.ethereum,
              web3: web3,
              contract: null,
            });
            setAccount(savedAccount);
          }
        } catch (error) {
          console.log("Failed to stay connected: ", error);
        }
      }
    };

    stayConnect();
  }, []);

  useEffect(() => {
    const initContract = async () => {
      if (web3API.web3) {
        try {
          const netId = await web3API.web3.eth.net.getId();
          const netDeployment = Image.networks[netId];

          if (!netDeployment) {
            console.error("Contract not deployed on the current network");
            return;
          }

          const contract = new web3API.web3.eth.Contract(
            Image.abi,
            netDeployment.address
          );

          setWeb3API((prev) => ({ ...prev, contract }));
        } catch (error) {
          console.error("Failed to initialize the contract:", error);
        }
      }
    };

    initContract();
  }, [web3API.web3]);

  useEffect(() => {
    if (web3API.provider) {
      // Listen for account changes
      web3API.provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          console.log("Please connect to MetaMask.");
        }
      });

      // Listen for network changes
      web3API.provider.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, [web3API.provider]);

  return (
    <div className="App">
      <Nav account={account} />
      <header className="App-header flex flex-col mt-32">
        <div className="flex flex-row items-center text-5xl font-bold mx-auto">
          <span className="status online" />
          <p>Minting</p>
        </div>
        <div className="flex justify-center mx-auto mt-28 text-4xl relative">
          <span className="absolute bg-yellow-500 w-44 h-16 rounded-lg translate-y-2 translate-x-2"></span>
          <button
            onClick={init}
            disabled={web3API.provider}
            className={`relative ${
              web3API.provider
                ? "bg-green-600"
                : "bg-[#000957] hover:bg-[#3e5cb5] hover:translate-x-1 hover:translate-y-1 focus:ring-2 focus:ring-yellow-500"
            } text-white px-[70px] py-[14px] rounded-lg shadow-lg  transition duration-300`}
          >
            {web3API.provider ? <PiPlugsConnectedFill /> : <TbPlugConnected />}
          </button>
        </div>

        <MintP contract={web3API.contract} account={account}/>
      </header>
    </div>
  );
}

export default App;
