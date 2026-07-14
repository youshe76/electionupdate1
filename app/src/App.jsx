import AppRouter from "./app/router/AppRouter";
import ScrollToTop from "./utils/scrollToTop";

export default function App() {
  return <>
    <ScrollToTop />
    <AppRouter />
  </>
}
