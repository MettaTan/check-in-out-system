const express = require("express"),
  cors = require("cors"),
  express_ejs_layouts = require("express-ejs-layouts");

const app = express(),
  port = 8000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(cors());

app.use(express_ejs_layouts);
app.set("layout", "layouts/layout");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

const middlewares = require("./utils/middlewares/definitions");

app.set("moment", middlewares.moment);
app.set("getDB", middlewares.getDB);
app.set("nullSignature", middlewares.nullSignature);

const indexRoutes = require("./routers/index.routes"),
  checkinRoutes = require("./routers/checkin.routes"),
  checkoutRoutes = require("./routers/checkout.routes"),
  adminRoutes = require("./routers/admin.routes");

app.use("/", indexRoutes);
app.use("/checkin", checkinRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/admin", adminRoutes);

const ExpressError = require("./utils/errors/ExpressError");

app.all("*", ExpressError.notFound);
app.use(ExpressError.renderError);

app.listen(port, () => {
  console.log(`Time: ${app.settings.moment()}`);
  console.log("Express is listening on http://127.0.0.1" + ":" + port);
  console.log("-".repeat(process.stdout.columns));
});
