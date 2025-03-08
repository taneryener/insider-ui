import { createBrowserRouter } from "react-router-dom";
import MainPage from '@/pages/MainPage.tsx';
import FixturePage from '@/pages/FixturePage.tsx';
import WeekPage from '@/pages/WeekPage.tsx';

const router = createBrowserRouter([
  { path: "/weeks", element: <WeekPage /> },
  { path: "/fixture", element: <FixturePage /> },
  { path: "/", element: <MainPage /> },
]);

export default router;
