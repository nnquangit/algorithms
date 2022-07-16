import fetch from "node-fetch";

const types = {
  excute: async (action, level) => {
    level = level ?? 0;
    console.log("-> ".padStart(level * 8, "-") + action.label);

    if (types[action.type]) {
      return await types[action.type](action, level);
    }

    return;
  },
  action: async (action, level) => {
    // let isRun = true && action.conditions.length;

    //   if (action.conditions) {
    //     action.conditions.forEach((a) => (isRun = isRun && excute(a, level + 1)));
    //   }

    action.data = {};

    if (action.collect) {
      action.collect.forEach(async (c) => {
        action.data[action.key] = await types.excute(c, level + 1);
      });
    }

    if (action.actions) {
      action.actions.forEach(async (child) => {
        child.parent = action;
        await types.excute(child, level + 1);
      });
    }

    return;
  },
  fetch: (action, level) => fetch(action.url),
  debug: (action, level) => console.log(action),
};
const nodes = [];
const tasks = [
  {
    id: "1",
    label: `Smart garden`,
    type: "action",
    conditions: [],
    actions: [
      {
        id: "2",
        label: `Turn on light`,
        type: "action",
        collect: [
          { key: "profile", type: "fetch", label: `Fetch Profile`, url: "https://reqres.in/api/users/1" },
          { key: "customer", type: "fetch", label: `Fetch Customer`, url: "https://reqres.in/api/users/2" },
        ],
        // conditions: [{ label: `Check time 6pm -> 6am`, type: "ignore" }],
        actions: [{ label: `Tunr on lamp 1`, type: "debug" }],
      },
    ],
  },
];

const devices = {
  LAMP_01: "1",
  SWITCH_01: "0",
  TEMP_01: "46",
};

tasks.forEach((t) => types.excute(t));

//--------------------
// const P = ["\\", "|", "/", "-"];
// let x = 0;
// const loader = () =>
//   setInterval(() => {
//     process.stdout.write(`\r${P[x++]}`);
//     x %= P.length;
//   }, 250);
// setTimeout(() => {
//   clearInterval(loader);
// }, 5000);
