import React from "react";

function OnboardWidget({ url }: any) {
  const handleLogout = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    window.location.replace("/auth/login");
  };
  return (
    <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="pt-12 max-w-md w-full space-y-12">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-dark-gray-900">
            Finish Onboarding
          </h2>
          <p className="mt-6 max-w-2xl text-base text-dark-gray-500">
            To have access to all features, please complete onboarding.
          </p>
        </div>
        <div className="rounded-md shadow-sm">
          <div className="p-4 content-center">
            <button
              id="continue-onboarding"
              type="button"
              className="relative flex justify-center items-center w-full p-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-color hover:bg-accent-color-light active:ring-2 active:ring-offset-2 active:ring-light-red-900"
              onClick={(e) => {
                window.location.replace(url);
              }}
            >
              Continue Onboarding
            </button>
          </div>
          <div className="p-4">
            <button
              onClick={handleLogout}
              id="logout"
              type="button"
              className="relative flex justify-center items-center w-full p-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-color hover:bg-accent-color-light active:ring-2 active:ring-offset-2 active:ring-light-red-900"
            >
              {" "}
              Logout{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardWidget;
