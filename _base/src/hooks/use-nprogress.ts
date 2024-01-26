import Router from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";

export function useNProgress() {
  useEffect(() => {
    Router.events.on("routeChangeStart", nProgress.start);
    Router.events.on("routeChangeError", nProgress.done);
    Router.events.on("routeChangeComplete", nProgress.done);

    return () => {
      Router.events.off("routeChangeStart", nProgress.start);
      Router.events.off("routeChangeError", nProgress.done);
      Router.events.off("routeChangeComplete", nProgress.done);
    };
  }, []);
}
