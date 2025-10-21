# DI CONTAINER

This project is an attempt at implementing my own dependency injection (DI) container, primarily to gain a deeper understanding of how it works. It is not intended for production use.

The Awilix implementation is included to demonstrate how this interface can work with different DI implementations. The test suite runs seamlessly on both versions.

The Awilix version was added quickly, so I didn’t spend time on features like load_modules or the regex. When I first created this basic DI container, I liked the idea of automatically loading modules, but I’ve since reconsidered and no longer think it’s a good approach. I decided to keep that code in the playground rather than remove it entirely, even though it currently lacks test coverage.
