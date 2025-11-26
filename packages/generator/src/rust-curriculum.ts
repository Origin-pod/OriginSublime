export interface RustLesson {
    day: number;
    topic: string;
    resource: string;
    description: string;
}

export const RUST_CURRICULUM: RustLesson[] = [
    {
        day: 1,
        topic: "Variables and Mutability",
        resource: "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html",
        description: "Learn how to declare variables, constants, and shadowing."
    },
    {
        day: 2,
        topic: "Data Types",
        resource: "https://doc.rust-lang.org/book/ch03-02-data-types.html",
        description: "Understand scalar and compound types (tuples, arrays) in Rust."
    },
    {
        day: 3,
        topic: "Functions",
        resource: "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html",
        description: "Learn how to define functions, parameters, and return values."
    },
    {
        day: 4,
        topic: "Control Flow",
        resource: "https://doc.rust-lang.org/book/ch03-05-control-flow.html",
        description: "Master if expressions and loops (loop, while, for)."
    },
    {
        day: 5,
        topic: "Ownership",
        resource: "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html",
        description: "Understand the core concept of Rust: Ownership, Stack, and Heap."
    },
    {
        day: 6,
        topic: "References and Borrowing",
        resource: "https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html",
        description: "Learn how to use references to access data without taking ownership."
    },
    {
        day: 7,
        topic: "The Slice Type",
        resource: "https://doc.rust-lang.org/book/ch04-03-slices.html",
        description: "Work with string slices and array slices."
    },
    {
        day: 8,
        topic: "Structs",
        resource: "https://doc.rust-lang.org/book/ch05-01-defining-structs.html",
        description: "Define and instantiate structs to group related data."
    },
    {
        day: 9,
        topic: "Method Syntax",
        resource: "https://doc.rust-lang.org/book/ch05-03-method-syntax.html",
        description: "Define methods and associated functions for structs."
    },
    {
        day: 10,
        topic: "Enums and Pattern Matching",
        resource: "https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html",
        description: "Define enums and use the match control flow construct."
    }
];
