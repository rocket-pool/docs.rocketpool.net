import { Layout as BasicLayout } from "@rspress/core/theme-original";
import "./index.css";

const Layout = () => {
  return (
    <BasicLayout
      beforeNavTitle={
        <a href="/">
          <img src="/images/logo.svg" width="42" height="42" alt="Rocket Pool" className="mr-4" />
        </a>
      }
    />
  );
};

export { Layout };

export * from "@rspress/core/theme-original";
