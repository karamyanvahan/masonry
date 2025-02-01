import { Layout } from "Layout";
import { DetailsPage } from "pages/DetailsPage";
import { HomePage } from "pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";

export const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:id" element={<DetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
