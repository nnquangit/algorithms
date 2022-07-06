function fibo(n) {
  var last = 0;
  var next = 1;
  for (var i = 0; i < n; i++) {
    var oldLast = last;
    last = next;
    next = oldLast + next;
  }
  return last;
}

console.log(fibo(90));
