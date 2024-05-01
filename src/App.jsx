import { Footer } from "./components/Footer";
import { GuitarPlayer } from "./components/GuitarPlayer";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <NextUIProvider>
      <Header />
      <GuitarPlayer />
      <Footer />
      <Analytics />
    </NextUIProvider>
  );
}

export default App;
