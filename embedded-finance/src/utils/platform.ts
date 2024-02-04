enum Platform {
  US,
}

const getPlatform = (country: string): Platform => {
  switch (country) {
    case "US":
      return Platform.US;
    default:
      throw new Error(`Unsupported country ${country}`);
  }
};

const enabledPlatforms = () => {
  return {
    [Platform.US]: true,
  };
};

export { Platform, getPlatform, enabledPlatforms };
