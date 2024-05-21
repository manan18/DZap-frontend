import "./App.css";
import CurrencyConvertor from "./components/currency-convertor";

function App() {
  return (
    <div className="min-h-screen bg-[url('https://img.freepik.com/free-vector/modern-abstract-minimal-poster-gradient-template-multicolored-light-gradation-background-vector_90220-942.jpg')] bg-cover flex flex-col items-center justify-center">
      <div className="container">
        <CurrencyConvertor />
      </div>
    </div>
  );
}

export default App;
