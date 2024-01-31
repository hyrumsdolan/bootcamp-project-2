const greeting = "Hello, world!";
const farewell = "Goodbye, world!";
const longString =
	"This is a very long string that will likely exceed the width of 180 characters, which we have set as our printWidth in Prettier. Prettier should automatically break this line into multiple lines to ensure that no line exceeds the maximum length.";

function saySomething(message) {
	console.log(message);
}

saySomething(greeting);
saySomething(farewell);
saySomething(longString);
