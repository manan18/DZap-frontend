import {useEffect} from "react";
import {useState} from "react";
import CurrencyDropdown from "./dropdown";
import {HiArrowsRightLeft} from "react-icons/hi2";
import Loader from "./Loader";


const CurrencyConverter = () => {
  const [loading,setLoading]=useState(true)
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  // Currencies -> https://api.frankfurter.app/currencies
  const fetchCurrencies = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/currency/getAll");
      const data = await res.json()
      setCurrencies(data);
      setLoading(false)
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);


  // Conversion -> https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
  const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/currency/convert?from=${fromCurrency}&to=${toCurrency}&amt=${amount}`)
      const data = await res.json();

      setConvertedAmount(data.amt + " " + toCurrency);
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if(loading){
    console.log("Log is here!")
    return <div className="flex justify-center items-center mx-auto">
      <Loader loading={loading}/>
      </div>

  }
  return (
    <div className="max-w-2xl mx-auto my-10 p-6 px-10 bg-black bg-opacity-60 rounded-2xl shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-white ">
        DZap Converter
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end ">
        <CurrencyDropdown
          className="text-white"
          favorites={favorites}
          currencies={currencies}
          title="From:"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          handleFavorite={handleFavorite}
        />
        {/* swap currency button */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-white rounded-full cursor-pointer hover:bg-green-300"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          currency={toCurrency}
          setCurrency={setToCurrency}
          title="To:"
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-white"
        >
          Amount:
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={convertCurrency}
          className={`px-5 py-2 bg-violet-600 text-white rounded-md hover:bg-green-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${converting ? "animate-pulse" : ""}`}
        >
          Convert
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-4 text-lg font-medium text-right text-white">
          Converted Amount: {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
