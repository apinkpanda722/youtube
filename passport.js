import passport from "passport";
import GithubStrategy from "passport-github";
import KaKaoStrategy from "passport-kakao";
import NaverStrategy from "passport-naver";
import User from "./models/User";
import {
  githubLoginCallback,
  kakaoLoginCallback,
  naverLoginCallback,
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

passport.use(
  new KaKaoStrategy(
    {
      clientID: process.env.KaKao_ID,
      clientSecret: process.env.KaKao_SECRET,
      callbackURL: `http://localhost:4000${routes.kakaoCallback}`,
    },
    kakaoLoginCallback
  )
);

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: `http://localhost:4000${routes.naverCallback}`,
    },
    naverLoginCallback
  )
);

// KaKao는 이 부분이 따로 필요하다
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
