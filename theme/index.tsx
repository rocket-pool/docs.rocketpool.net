import { Layout as BasicLayout } from 'rspress/theme';
import "./index.css";

const Layout = () => {
  return <BasicLayout beforeNavTitle={<a href="/"><img src="/images/logo.png" width="42" height="42" alt="Rocket Pool" className="mr-4" /></a>} />;
};

export  { Layout };

export * from "rspress/theme";
