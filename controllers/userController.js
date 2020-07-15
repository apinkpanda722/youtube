import routes from "../routes";
import passport from "passport";
import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash("error", "Password don't match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check email and/or password",
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: { id, avatar_url, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatar_url;
      user.name = name;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      githubId: id,
      avatarUrl: avatar_url,
      name,
      email,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  req.flash("success", "Welcome");
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao", {
  failureRedirect: "#!/login",
});

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  console.log(profile._json.kakao_account.profile);
  const {
    id,
    username: name,
    _json: {
      kakao_account: {
        email,
        profile: { profile_image_url },
      },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.name = name;
      user.avatarUrl = profile_image_url;
      user.kakaoId = id;
      user.email = email;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      kakaoId: id,
      avatarUrl: profile_image_url,
      name,
      email,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postKaKaoLogIn = (req, res) => {
  req.flash("success", "Welcome");
  res.redirect(routes.home);
};

export const naverLogin = passport.authenticate("naver");

export const naverLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    id,
    _json: { nickname, profile_image, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.naverId = id;
      user.avatarUrl = profile_image;
      user.name = nickname;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      naverId: id,
      avatarUrl: profile_image,
      name: nickname,
      email,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postNaverLogIn = (req, res) => {
  req.flash("success", "Welcome");
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", "Logged Out, see you later");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

/* export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't update profile");
    res.redirect(routes.editProfile);
  }
};
*/

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
