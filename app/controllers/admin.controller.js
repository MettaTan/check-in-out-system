module.exports = {
  renderAdminPage: (req, res) => {
    res.render("admin/admin", { header: "Admin Panel" });
  },
  renderAddPass: (req, res) => {
    res.render("admin/addPass", { header: "Add Passphrase" });
  },
  processPass: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      { date, passphrase, PIN } = req.body.data;

    const unusedPassData = await getDB("unusedPassDB").getData("/"),
      formattedDate = moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");

    const oldEntries = unusedPassData[formattedDate],
      newEntries = Object.fromEntries(
        passphrase.map((entry, index) => [entry, PIN[index].toUpperCase()])
      );

    await getDB("unusedPassDB").push(
      `/${formattedDate}`,
      { ...oldEntries, ...newEntries },
      true
    );

    res.redirect("/admin/addPass");
  },
  renderPassTable: async (req, res) => {
    res.render("admin/passTable", { header: "Pass Table" });
  },
  getPassData: async (req, res) => {
    const { getDB } = req.app.settings;

    const unusedPassData = await getDB("unusedPassDB").getData("/"),
      passData = await getDB("passDB").getData("/");

    const unusedDates = Object.keys(unusedPassData),
      usedDates = Object.keys(passData);

    const datesArr = [...new Set([unusedDates, usedDates].flat())];

    let passArr = [];
    datesArr.forEach((date) => {
      [unusedPassData, passData].forEach((data, index) => {
        if (date in data) {
          Object.keys(data[date]).forEach((passphrase) => {
            const PIN = data[date][passphrase];

            const entry = {
              date: date,
              passphrase: passphrase,
              PIN: PIN,
              state: index === 0 ? "No" : "Yes",
            };

            passArr.push(entry);
          });
        }
      });
    });

    res.send({ data: passArr });
  },
  editPassEntry: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      {
        old: { date: oldDateStr, passphrase: oldPassphrase, state: oldState },
        new: {
          date: newDateStr,
          passphrase: newPassphrase,
          PIN: newPIN,
          state: newState,
        },
      } = req.body;

    const oldDate = moment(oldDateStr, "YYYY-MM-DD").format("DD-MM-YYYY"),
      newDate = moment(newDateStr, "YYYY-MM-DD").format("DD-MM-YYYY");

    const oldPassObj = await getDB(
        oldState === "No" ? "unusedPassDB" : "passDB"
      ).getData(`/${oldDate}`),
      newPassObj = await getDB(
        newState === "No" ? "unusedPassDB" : "passDB"
      ).getData("/");

    delete oldPassObj[oldPassphrase];
    let newPass = {};
    newPass[newPassphrase] = newPIN.toUpperCase();

    await getDB(oldState === "No" ? "unusedPassDB" : "passDB").push(
      `/${oldDate}`,
      oldPassObj,
      true
    );
    await getDB(newState === "No" ? "unusedPassDB" : "passDB").push(
      `/${newDate}`,
      { ...newPassObj[newDate], ...newPass },
      true
    );
  },
  deletePassEntry: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      { date, passphrase, state } = req.body;

    const dateStr = moment(date, "D MMM YYYY").format("DD-MM-YYYY");

    const passObj = await getDB(
      state === "No" ? "unusedPassDB" : "passDB"
    ).getData(`/${dateStr}`);

    delete passObj[passphrase];

    await getDB(state === "No" ? "unusedPassDB" : "passDB").push(
      `/${dateStr}`,
      passObj,
      true
    );
  },
  renderDeptRecords: async (req, res) => {
    res.render("admin/deptRecords", { header: "Department Records" });
  },
  getDeptData: async (req, res) => {
    const { getDB } = req.app.settings;

    const deptData = await getDB("deptDB").getData("/dept"),
      signatureData = await getDB("signatureDB").getData("/dept");

    let deptArr = [];
    deptData.forEach((entry, index) => {
      const deptObj = {
        ...{ index: index },
        ...entry,
        ...signatureData[index],
      };

      deptArr.push(deptObj);
    });

    res.send({ data: deptArr });
  },
  renderFeedbackRecords: async (req, res) => {
    res.render("admin/feedbackRecords", {
      header: "Feedback Records",
    });
  },
  getFeedbackData: async (req, res) => {
    const { getDB } = req.app.settings;

    const deptData = await getDB("deptDB").getData("/dept"),
      feedbackData = await getDB("feedbackDB").getData("/dept");

    let deptArr = [];
    deptData.forEach((entry, index) => {
      if (Object.keys(feedbackData[index]).length > 0) {
        const deptObj = {
          ...{ index: index },
          ...entry,
          ...feedbackData[index],
        };

        deptArr.push(deptObj);
      }
    });

    res.send({ data: deptArr });
  },
};
