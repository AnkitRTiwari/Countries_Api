import { Outlet, ScrollRestoration } from "react-router";

import "./App.css";
import "./animations.css";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Intro from "./components/Intro";
import { ThemeProvider } from "./contexts/Theme";
import useRipple from "./utilis/useRipple";

const App = () => {
  useRipple();
  return (
    <ThemeProvider>
      <Intro />
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
      <ScrollRestoration />
    </ThemeProvider>
  );
};

export default App;
