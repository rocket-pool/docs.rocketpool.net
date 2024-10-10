import Theme from "rspress/theme";
import "./index.css";

const Layout = () => {
  return <Theme.Layout beforeNavTitle={<a href="/"><img src="/images/logo.png" width="42" height="42" alt="Rocket Pool" className="mr-4" /></a>} />;
};

export default {
  ...Theme,
  Layout,
};

export * from "rspress/theme";
