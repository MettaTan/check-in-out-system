module.exports = {
  renderCheckinForm: (req, res) => {
    res.render("checkin/checkinForm", { header: "Check-in" });
  },
  getPass: async (req, res) => {
    const { moment, getDB } = req.app.settings;

    const unusedPassData = await getDB("unusedPassDB").getData("/"),
      currentDate = moment().format("DD-MM-YYYY");

    res.send(unusedPassData[currentDate]);
  },
  checkPassphrase: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      { passphrase } = req.body;

    const unusedPassData = await getDB("unusedPassDB").getData("/"),
      currentDate = moment().format("DD-MM-YYYY");

    const passphraseObj =
      currentDate in unusedPassData ? unusedPassData[currentDate] : [];

    res.send(passphrase in passphraseObj);
  },
  checkPIN: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      { passphrase, PIN } = req.body;

    const currentDate = moment().format("DD-MM-YYYY");

    const passphraseObj = await getDB("unusedPassDB").getData(
      `/${currentDate}`
    );

    res.send(PIN === passphraseObj[passphrase]);
  },
  processCheckin: async (req, res) => {
    const { moment, getDB, nullSignature } = req.app.settings,
      { dept, signature, pass } = req.body;

    dept.nric = dept.nric.toUpperCase();

    let teamObj = {};

    if ("teamFullName" in dept && "teamNric" in dept) {
      const { teamFullName, teamNric } = dept;

      teamObj = Object.fromEntries(
        teamFullName.map((element, index) => [element, teamNric[index]])
      );

      ["teamFullName", "teamNric"].forEach((property) => delete dept[property]);
    }

    let passObj = {};

    switch (dept.purpose) {
      case "Access Special Purpose Lab":
      case "Access File Room":
      case "Access Warehouse":
        const { passphrase, PIN } = pass,
          currentDate = moment().format("DD-MM-YYYY");

        passObj = Object.fromEntries(
          passphrase.map((element, index) => [element, PIN[index]])
        );

        const unusedPassObj = await getDB("unusedPassDB").getData(
            `/${currentDate}`
          ),
          usedPassData = await getDB("passDB").getData("/");

        Object.keys(passObj).forEach(
          (passphrase) => delete unusedPassObj[passphrase]
        );

        await getDB("unusedPassDB").push(
          `/${currentDate}`,
          unusedPassObj,
          true
        );
        await getDB("passDB").push(
          `/${currentDate}`,
          { ...usedPassData[currentDate], ...passObj },
          true
        );
        break;
      case "Loan/Return Equipment":
        passObj[pass.passphrase[0]] = "";
      default:
    }

    const deptEntry = {
      ...dept,
      ...{
        timeOut: null,
        pass: passObj,
        team: teamObj,
      },
    };

    await getDB("deptDB").push("/dept[]", deptEntry, true);
    await getDB("signatureDB").push(
      "/dept[]",
      { ...signature, ...{ signatureOut: nullSignature } },
      true
    );
    await getDB("feedbackDB").push("/dept[]", {}, true);

    res.render("checkin/checkinReceipt", { dept: deptEntry });
  },
};
