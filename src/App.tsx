import MaxWidthWrapper from "./components/MaxWidthWrapper";
import Game from "./pages/Game";

function App() {
  return (
    <div className="App">
      <MaxWidthWrapper>
        <Game />
      </MaxWidthWrapper>
    </div>
  );
}

export default App;
