module.exports = {
  autofill: async (req, res) => {
    const { getDB } = req.app.settings,
      { nric } = req.body;

    const deptData = await getDB("deptDB").getData("/dept");

    let lastMatchedEntry;
    for (let i = deptData.length - 1; i >= 0; i--) {
      const entry = deptData[i];
      if (entry.timeOut === null && entry.nric === nric)
        lastMatchedEntry = entry;
    }
    // const lastMatchedEntry = deptData.findLast((entry) => entry.timeOut === null && entry.nric === nric);

    res.send(lastMatchedEntry ? lastMatchedEntry : false);
  },
  renderCheckoutForm: (req, res) => {
    (feedbackSelect = {
      count: {
        col: 3,
        label: "No. of visits to Saerin Engineering",
        values: ["1", "2", "3", "3+"],
      },
      role: {
        col: 3,
        label: "Role in Team",
        values: ["Developer", "Researcher", "Assistant", "Other"],
      },
      purpose: {
        col: 7,
        label: "Please indicate the purpose of your visit today",
        values: [
          "Access Special Purpose Lab",
          "Access File Room",
          "Access Warehouse",
          "Visit Gallery of Artefacts",
          "Loan/Return Equipment",
        ],
      },
      wait: {
        col: 6,
        label:
          "Time spent waiting to be escorted from guardroom after checking in",
        values: ["<15 min", "~30 min", ">45 min"],
      },
      time: {
        col: 6,
        label: "Time spent in Restricted Zone to fulfil your purpose of visit",
        values: ["<15 min", "~30 min", ">45 min"],
      },
    }),
      (feedBackQuestions = {
        service:
          "Was the service level rendered by the support staff during your visit adequate?",
        paperwork:
          "Was the amount of paperwork required to fulfil your purpose of visit reasonable?",
      });
    res.render("checkout/checkoutForm", {
      header: "Check-out",
      feedbackSelect,
      feedBackQuestions,
    });
  },
  processCheckout: async (req, res) => {
    const { moment, getDB } = req.app.settings,
      {
        dept,
        signature: { signatureOut },
        feedback,
      } = req.body;

    const deptData = await getDB("deptDB").getData("/dept"),
      signatureData = await getDB("signatureDB").getData("/dept");

    let matchedIndex;
    for (let i = deptData.length - 1; i >= 0; i--) {
      const entry = deptData[i];
      if (
        entry.timeIn === dept.timeIn &&
        entry.nric === dept.nric.toUpperCase()
      )
        matchedIndex = i;
    }
    // const matchedIndex = deptData.findLastIndex((entry) => entry.timeIn === dept.timeIn && entry.nric === dept.nric);

    const deptEntry = {
      ...deptData[matchedIndex],
      ...{ timeOut: dept.timeOut },
    };

    await getDB("deptDB").push(`/dept[${matchedIndex}]`, deptEntry, true);
    await getDB("signatureDB").push(
      `/dept[${matchedIndex}]`,
      { ...signatureData[matchedIndex], ...{ signatureOut: signatureOut } },
      true
    );
    await getDB("feedbackDB").push(`/dept[${matchedIndex}]`, feedback, true);

    deptEntry.timeIn = moment(deptEntry.timeIn, "DD-MM-YYYY HH:mm").format(
      "DD-MM-YYYY"
    );

    res.render("checkout/checkoutReceipt", {
      dept: deptEntry,
      feedback,
    });
  },
};
