enum Platform {
  US,
  UK,
  EU,
}

const getPlatform = (country: string): Platform => {
  if (country == "US") {
    return Platform.US;
  } else if (country == "GB") {
    return Platform.UK;
  } else {
    return Platform.EU;
  }
};

const enabledPlatforms = () => {
  return {
    [Platform.US]: true,
    [Platform.UK]: false,
    [Platform.EU]: false,
  };
};

export { Platform, getPlatform, enabledPlatforms };
