import { Outlet } from "react-router";

import "./App.css";
import Header from "./components/Header";
import { useContext, useState } from "react";
import { ThemeContext, ThemeProvider } from "./contexts/Theme";

const App = () => {
  // const a = useContext(ThemeContext);
  // console.log(a);

  return (
    <ThemeProvider>
      <Header />
      <Outlet />
    </ThemeProvider>
  );
};

export default App;
