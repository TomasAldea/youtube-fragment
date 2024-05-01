import { Footer } from "./components/Footer";
import { GuitarPlayer } from "./components/GuitarPlayer"
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";

function App() {

  return (
    <>
      <Header/>
      <GuitarPlayer/>
      
      <Footer/>
      <Analytics />
    </>
  )
}

export default App
