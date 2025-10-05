import { MinefieldView } from "./components/MinefieldView";
import { MinefieldProvider } from "./providers/MinefieldProvider/MinefieldProvider";

function App() {
  return (
    <>
      <MinefieldProvider>
        <MinefieldView />
      </MinefieldProvider>
    </>
  );
}

export default App;
