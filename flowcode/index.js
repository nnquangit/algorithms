import fetch from "node-fetch";
const colours = {
  red: "\x1b[31m%s",
  green: "\x1b[32m%s",
  yellow: "\x1b[33m%s",
  white: "\x1b[0m%s",
};
//--------------------
const P = ["\\", "|", "/", "-"];
let x = 0;
const loader = () =>
  setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    x %= P.length;
  }, 250);
// setTimeout(() => {
//   clearInterval(loader);
// }, 5000);

Object.prototype.getPath = function (s) {
  const stringToObj = function (path, obj) {
    var parts = path.split("."),
      part;
    var last = parts.pop();
    while ((part = parts.shift())) {
      if (typeof obj[part] != "object") obj[part] = {};
      obj = obj[part];
    }
    return obj[last];
  };
  return s == "" ? this : stringToObj(s, this);
};

const types = {
  excute: async (action, level, parent) => {
    level = level ?? 0;
    action.data = {};
    action.parent = parent;
    const colorTypes = {
      default: colours.white,
      check: colours.red,
      action: colours.green,
      date: colours.yellow,
      fetch: colours.yellow,
    };

    console.log(
      colorTypes[action.type] || colorTypes.default,
      "-".repeat(level * 4),
      action.label
    );

    if (action.type && types[action.type]) {
      return await types[action.type](action, level);
    }

    return;
  },
  isRunAble: async (action, level) => {
    let isRun = true;
    if (action.conditions) {
      await Promise.all(
        action.conditions.map(async (child) => {
          isRun = isRun && (await types.excute(child, level + 1, action));
        })
      );
    }

    return isRun;
  },
  collectData: async (action, level) => {
    if (action.collect) {
      await Promise.all(
        action.collect.map(async (child) => {
          action.data[child.key] = await types.excute(child, level + 1, action);
        })
      );
    }
  },
  action: async (action, level) => {
    await types.collectData(action, level);

    if (!(await types.isRunAble(action, level))) {
      return;
    }

    if (action.actions) {
      await Promise.all(
        action.actions.map(async (child) => {
          await types.excute(child, level + 1, action);
        })
      );
    }

    return;
  },
  date: (action, level) => new Date(),
  fetch: async (action, level) => (await fetch(action.url)).json(),
  check: (action, level) => {
    switch (action.op) {
      case "ignore":
        return true;
        break;
      case "==":
        return action.getPath(action.path) == action.value;
        break;
    }
    return false;
  },
  debug: (action, level) => console.log(action.getPath(action.path)),
};

const tasks = {
  label: `Run Application`,
  type: "action",
  collect: [
    { label: `Get mysql connection`, key: "date", type: "date" },
    {
      label: `Get 3party connection`,
      key: "profile",
      type: "fetch",
      url: "https://reqres.in/api/users/1",
    },
    {
      label: `Get socket connection`,
      key: "customer",
      type: "fetch",
      url: "https://reqres.in/api/users/2",
    },
    {
      label: `Get odoo connection`,
      key: "user",
      type: "fetch",
      url: "https://reqres.in/api/users/3",
    },
    {
      label: `Get queue connection`,
      key: "queue",
      type: "fetch",
      url: "https://reqres.in/api/users/4",
    },
    {
      label: `Get elastic connection`,
      key: "queue",
      type: "fetch",
      url: "https://reqres.in/api/users/5",
    },
  ],
  conditions: [
    {
      label: `Verify mysql connection`,
      type: "check",
      op: "==",
      path: "parent.data.profile.data.id",
      value: "1",
    },
    { label: `Verify 3party connection`, type: "check", op: "ignore" },
    { label: `Verify socket connection`, type: "check", op: "ignore" },
    { label: `Verify odoo connection`, type: "check", op: "ignore" },
    { label: `Verify queue connection`, type: "check", op: "ignore" },
    { label: `Verify elastic connection`, type: "check", op: "ignore" },
  ],
  actions: [
    {
      label: `Watting for client`,
      type: "routes",
      routes: [
        { url: "/user", label: `Watting for client`, type: "action", path: "" },
      ],
    },
  ],
};

const devices = {
  LAMP_01: "1",
  SWITCH_01: "0",
  TEMP_01: "46",
};

types.excute(tasks);
