# act.js
Act

Active entities for JavaScript.

Reactivity emerges from activity.

Overview

Act is based on a single concept: active entities.

An active entity is a value or function that participates in automatic dependency tracking.

Everything is an active entity.

Core idea

An active entity is a function:

read by calling it
written by calling it with an argument
value();      // read
value(x);     // write
Values
let count = act(0);

count();   // 0

count(1);

count();   // 1
Derived values

Active entities can depend on other active entities.

Dependencies are tracked automatically during execution.

let a = act(1);
let b = act(2);

let sum = act(() => a() + b());

sum(); // 3

a(5);

sum(); // 7
Dynamic dependencies

Only the active execution path is tracked.

let flag = act(true);
let a = act(1);
let b = act(2);

let value = act(() => {
    if (flag()) return a();
    return b();
});

Changing flag updates dependencies automatically.

Side effects

Side effects are functions executed inside active entities.

They are not special constructs.

let count = act(0);

act(() => {
    console.log(count());
});

count(1);
count(2);
Principle

Active entities are the only building block.

They can represent values and computations.

Relationships between them are discovered during execution.

Mental model
active entity ─┐
               ├── dependency tracking ──> updates
active entity ─┘
Summary
One concept: active entities
One interface: value() / value(x)
Dependencies are discovered at runtime
Side effects are regular functions inside active entities

Reactivity emerges from activity.
