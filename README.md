# wrabbit :rabbit: :rabbit2:
Wrap scripts by providing the wrapping function.

## Installation
Run the following commands to download and install the application:

```sh
$ npm i -g wrabbit
```

or from git:

```sh
$ git clone git@github.com:jillix/wrabbit.git wrabbit
$ cd wrabbit
$ npm install
```

Then you can run:

```sh
$ wrabbit -h
# or
$ ./bin/wrabbit -h
```

## Documentation
### `req(url, callback)`
Creates a request to the provided url.

#### Params
- **String** `url`: The script url.
- **Function** `callback`: The callback function.

#### Return
- **Request** The request object.

### `wrap(content, wrapline)`
Wrap content with the wrapping code.

#### Params
- **String** `content`: The content to wrap.
- **String** `wrapline`: The wrapping line (which will be prepended to the content).

#### Return
- **String** The wrapped content.

### `wrapUrl(url, wrapline, callback)`
Wraps the content of a script by providing its url.

#### Params
- **String** `url`: The script url.
- **String** `wrapline`: The wrapping line (which will be prepended to the content).
- **Function** `callback`: The callback function.

#### Return
- **Request** The request object.

### `stream(url, wrapline, stream, callback)`
Pipes data from the provided url to a stream.

#### Params
- **String** `url`: The script url.
- **String** `wrapline`: The wrapping line (which will be prepended to the content).
- **String** `stream`: The output stream.
- **Function** `callback`: An optional callback. If provided, it should handle the stream ending.

### `server(options, callback)`
Starts the `Wrabbit` server.

#### Params
- **Object|Number** `options`: The `Lien` server options or the server port.
- **Function** `callback`: The callback function called after the server is started.


## How to contribute

1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.
