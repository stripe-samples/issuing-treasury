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

export { Platform, getPlatform };
