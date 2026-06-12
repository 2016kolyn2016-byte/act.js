# act.js

Active entities for JavaScript.

Reactivity emerges from activity.

Concept

Act is based on a single idea: active entities.

An active entity is a function that can be:

read by calling it
written by calling it with a value
value();      // read
value(x);     // write
Values
let count = act(0);

count();   // 0
count(1);
count();   // 1
Computations

Active entities can depend on other active entities.

Dependencies are tracked automatically.

let a = act(1);
let b = act(2);

let sum = act(() => a() + b());

sum(); // 3

a(5);

sum(); // 7
Dynamic dependencies

Only the executed path is tracked.

let flag = act(true);
let a = act(1);
let b = act(2);

let value = act(() => flag() ? a() : b());
Side effects

Functions executed inside active entities react to dependency changes.

let count = act(0);

act(() => {
    console.log(count());
});

count(1);
count(2);
Model

Active entities form a dependency graph at runtime.

Updates propagate through dependent entities.

Summary
One concept: active entities
One interface: value() / value(x)
Dependencies are automatic
Execution builds the graph
Updates propagate through dependencies

Reactivity emerges from activity.
