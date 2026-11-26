const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const EventEmitter = require("node:events");
const zlib = require("node:zlib");
const { pipeline } = require("node:stream");

// 1
function getPath() {
    console.log({
        File: __filename,
        Dir: __dirname
    });
}

getPath();

// 2
function getFileName(filePath) {
    return path.basename(filePath);
}

const result2 = getFileName("/user/files/report.pdf");

console.log(result2);

// 3
function buildPath(file) {
    return path.format(file);
}

const result3 = buildPath({
    dir: "/folder",
    name: "app",
    ext: ".js"
});

console.log(result3);

// 4
function getFileExtension(filePath) {
    return path.extname(filePath);
}

const result4 = getFileExtension("/docs/readme.md");

console.log(result4);

// 5
function parsePath(filePath) {
    const parsed = path.parse(filePath);
    return {
        Name: parsed.name,
        Ext: parsed.ext
    };
}

const result5 = parsePath("/home/app/main.js");

console.log(result5);

// 6
function isAbsolute(filePath) {
    return path.isAbsolute(filePath);
}

const result6 = isAbsolute("/home/user/file.txt");

console.log(result6);

// 7
function joinSegments(...segments) {
    return path.join(...segments);
}

const result7 = joinSegments("src", "components", "App.js");

console.log(result7);

// 8
function resolvePath(relativePath) {
    return path.resolve(relativePath);
}

const result8 = resolvePath("./index.js");

console.log(result8);

// 9
function joinTwoPaths(path1, path2) {
    return path.join(path1, path2);
}

const result9 = joinTwoPaths("/folder1", "folder2/file.txt");

console.log(result9);

// 10
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log(`The ${path.basename(filePath)} is deleted.`);
    });
}

deleteFile("./file.txt");

// 11
function createFolder(folderPath) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Success");
}

createFolder("./newFolder");

// 12
const emitter = new EventEmitter();

emitter.on("start", () => {
    console.log("Welcome event triggered!");
});

emitter.emit("start");

// 13
emitter.on("login", (username) => {
    console.log(`User logged in: ${username}`);
});

emitter.emit("login", "Ahmed");

// 14
const noteContent = fs.readFileSync("./notes.txt", "utf-8");

console.log(noteContent);

// 15
fs.writeFile("./async.txt", "Async save", (err) => {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log("File saved");
});

// 16
const result16 = fs.existsSync("./notes.txt");

console.log(result16);

// 17
function getSystemInfo() {
    return {
        Platform: os.platform(),
        Arch: os.arch()
    };
}

const result17 = getSystemInfo();

console.log(result17);

// 18
const readStream = fs.createReadStream("./big.txt", "utf-8");

readStream.on("data", (chunk) => {
    console.log(chunk);
});

// 19
const sourceStream = fs.createReadStream("./source.txt");
const destStream = fs.createWriteStream("./dest.txt");

sourceStream.pipe(destStream);

destStream.on("finish", () => {
    console.log("File copied using streams");
});

// 20
pipeline(
    fs.createReadStream("./data.txt"),
    zlib.createGzip(),
    fs.createWriteStream("./data.txt.gz"),
    (err) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log("File compressed");
    }
);
