import React from "react";

import { withAuthRequiringOnboarded } from "../middleware/auth-middleware";

export const getServerSideProps = withAuthRequiringOnboarded(async () => {
  return {
    redirect: { destination: "/overview", permanent: false },
  };
});

const Page = () => {
  return <></>;
};

export default Page;
