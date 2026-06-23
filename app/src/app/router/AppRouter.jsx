import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { lazyPages } from "./pageLoaders";

function PageFallback() {
  return (
    <main className="elc-container" style={{ padding: "40px 0" }}>
      <p>लोड हुँदैछ...</p>
    </main>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/map" element={<lazyPages.Map />} />
        {routes.map(({ path, pageName }) => {
          const Page = lazyPages[pageName];
          if (!Page) {
            return null;
          }
          return <Route key={path} path={path} element={<Page />} />;
        })}
      </Routes>
    </Suspense>
  );
}
