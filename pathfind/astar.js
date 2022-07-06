const Astar = {};

class Point {
  constructor(x, y, parent, weight) {
    Object.assign(this, { id: `${x}|${y}`, x, y, parent, w: weight || 0 });
  }

  isMatch(node) {
    return this.x === node.x && this.y === node.y;
  }

  getPath() {
    let parent = this.parent;
    let result = [this.id];
    while (parent) {
      result.push(parent.id);
      parent = parent.parent;
    }
    return result.reverse();
  }
}

class Grid {
  constructor(size, wall) {
    Object.assign(this, { size, wall });
  }

  log(current, neighbors, queue) {
    console.log("".padStart(50, "-"));
    console.log(current.id);
    console.log("neighbors", neighbors.map((e) => e.id).join(", "));
    console.log("queue", queue.map((e) => e.id).join(", "));
  }

  findPath(root, target) {
    //
  }

  dijkstra_astar(root, target) {
    var Open = [root];
    var Closed = [];
    var Paths = [];
    var Visit = [root.id];

    while (!!Open.length) {
      var best = 0;
      for (var i = 1; i < Open.length; i++) {
        if (Open[i].w <= Open[best].w) {
          best = i;
        }
      }

      var current = Open.splice(best, 1)[0];
      if (current.isMatch(target)) {
        Paths.push(current);
      }

      var neighbors = this.neighbors(current, target);
      neighbors.forEach((neighbor) => {
        if (Visit.indexOf(neighbor.id) === -1) {
          Visit.push(neighbor.id);
          Open.push(neighbor);
        }
      });

      this.log(current, neighbors, Open);
      Closed.push(current.id);
    }

    return Paths;
  }

  dfs(root, target) {
    var Open = [root];
    var Closed = [];
    var Paths = [];
    var Visit = [root.id];

    while (!!Open.length) {
      var current = Open.pop();
      if (current.isMatch(target)) {
        Paths.push(current);
      }

      var neighbors = this.neighbors(current, target);
      neighbors.forEach((neighbor) => {
        if (Visit.indexOf(neighbor.id) === -1) {
          Visit.push(neighbor.id);
          Open.push(neighbor);
        }
      });

      this.log(current, neighbors, Open);
      Closed.push(current.id);
    }

    return Paths;
  }

  bfs(root, target) {
    var Open = [root];
    var Closed = [];
    var Paths = [];
    var Visit = [root.id];

    while (!!Open.length) {
      var current = Open.shift();
      if (current.isMatch(target)) {
        Paths.push(current);
      }

      var neighbors = this.neighbors(current, target);
      neighbors.forEach((neighbor) => {
        if (Visit.indexOf(neighbor.id) === -1) {
          Visit.push(neighbor.id);
          Open.push(neighbor);
        }
      });

      this.log(current, neighbors, Open);
      Closed.push(current.id);
    }

    return Paths;
  }

  isWalkable(node) {
    if (this.wall.indexOf(`${node.id}`) > -1) {
      return false;
    }

    if (node.x < 0 || node.x >= this.size) {
      return false;
    }

    if (node.y < 0 || node.y >= this.size) {
      return false;
    }

    return true;
  }

  weight(x, y, x1, y1) {
    return Math.abs(x - x1) + Math.abs(y - y1);
  }

  neighbors(current, target) {
    var results = [];
    var x = current.x;
    var y = current.y;

    // prettier-ignore
    var N = new Point(x, y - 1, current, current.w + this.weight(x, y - 1, target.x, target.y) );
    // prettier-ignore
    var S = new Point(x, y + 1, current, current.w + this.weight(x, y + 1, target.x, target.y) );
    // prettier-ignore
    var E = new Point(x + 1, y, current, current.w + this.weight(x + 1, y, target.x, target.y) );
    // prettier-ignore
    var W = new Point(x - 1, y, current, current.w + this.weight(x - 1, y, target.x, target.y) );

    this.isWalkable(N) && results.push(N);
    this.isWalkable(S) && results.push(S);
    this.isWalkable(E) && results.push(E);
    this.isWalkable(W) && results.push(W);

    return results;
  }
}

const test = new Grid(6, ["2|2", "3|2", "3|3", "1|1"]);
// const path = test.dfs(new Point(1, 5), new Point(4, 1));

test
  .dijkstra_astar(new Point(1, 5), new Point(4, 1))
  // .bfs(new Point(1, 5), new Point(4, 1))
  // .dfs(new Point(1, 5), new Point(4, 1))
  .map((x) => console.log(x.getPath().join(" -> ")));
