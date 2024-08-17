import React from "react";
import { Route, Routes } from "react-router-dom";
import Registration from "../pages/Registration";
import Home from "../pages/Home";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Registration />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AllRoutes;