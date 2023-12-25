const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000, //15 minutes
    httpOnly: true,
    sameSite: "none",
  });
};

const setRfreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
    httpOnly: true,
    sameSite: "none",
  });
};

module.exports = { setAccessTokenCookie, setRfreshTokenCookie };
