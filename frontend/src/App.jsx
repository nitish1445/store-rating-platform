import { BrowserRouter } from "react-router-dom";
import AppLayout from "./Layout/AppLayout";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </>
  );
};

export default App;
