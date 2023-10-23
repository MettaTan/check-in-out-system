module.exports = {
  renderMainPage: async (req, res) => {
    const { getDB } = req.app.settings;

    const deptData = await getDB("deptDB").getData("/dept");

    const recentEntries = deptData.slice(-5);

    res.render("home", {
      header: "Personnel Check-in Check-out Menu",
      recentEntries,
    });
  },
  adminLogin: (req, res) => {
    const { input } = req.body,
      password = "123";

    const link = input === password ? "/admin" : "/";

    res.redirect(link);
  },
  checkNric: async (req, res) => {
    const { getDB } = req.app.settings,
      { nric, index } = req.body;

    const deptData = await getDB("deptDB").getData("/dept");

    const selectedEntry = deptData.slice(-5)[index];

    res.send(selectedEntry.nric === nric);
  },
  reprintReceipt: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      { type, index } = req.body.data;

    const deptData = await getDB("deptDB").getData("/dept"),
      feedbackData = await getDB("feedbackDB").getData("/dept");

    const deptEntry = deptData.slice(-5)[index],
      feedbackEntry = feedbackData.slice(-5)[index];

    let data = { dept: deptEntry };

    if (type === "checkout") {
      data.dept.timeIn = moment(deptEntry.timeIn, "DD-MM-YYYY HH:mm").format(
        "DD-MM-YYYY"
      );
      data = { ...data, ...{ feedback: feedbackEntry } };
    }

    res.render(`${type}/${type}Receipt`, data);
  },
  outputDB: async (req, res) => {
    const { getDB } = req.app.settings,
      { name } = req.query;

    if (name == "passDB" || name == "unusedPassDB") {
      const data = await getDB(name).getData("/");
      res.send(data);
    } else {
      const data = await getDB(name).push(`/dept`, [], true);
      res.send(data);
    }
  },
};
