const http = require("http");
const request = require('request');
const fs = require("fs");

const host = 'localhost';
const port = 3000;


const requestListener = function (rick, roll) {
    let contentheader =
        {
            "Content-Type": "text/html; charset=utf-8"
        };
    switch (rick.url) {
        case "/":
            roll.writeHead(200, contentheader);
            roll.end("<h1>Добро пожаловать!</h1>");
            break
        case "/save":

            roll.writeHead(200, contentheader);

            const URL = 'http://ithub.ru';

            request(URL, function (err, res, body) {
                if (err) throw err;
                let links = body.split(" ").filter(function (i) {
                    return i.indexOf("href=") != -1 && i.indexOf("http") != -1
                });
                let newlinks = links.map(function (e) {
                    let newvalue = e.replace('href="', '');
                    let qpoz = newvalue.indexOf('http');
                    newvalue = newvalue.substring(qpoz);
                    qpoz = newvalue.indexOf('"');
                    if (qpoz > 0) {
                        newvalue = newvalue.substring(0, qpoz);
                    }
                    qpoz = newvalue.indexOf('<');
                    if (qpoz > 0) {
                        newvalue = newvalue.substring(0, qpoz);
                    }

                    return newvalue;
                });
                let newlinksunic = {};
                for (let i = 0; i < newlinks.length; i++) {
                    newlinksunic[newlinks[i]] = newlinks[i];
                }
                console.log(Object.values(newlinksunic));

                let newlinksunicstrings = Object.values(newlinksunic);
                fs.writeFileSync("links.txt", '');
                for (let i = 0; i < newlinksunicstrings.length; i++) {
                    fs.appendFileSync("links.txt", newlinksunicstrings[i] + "\n");
                }
                roll.end("<h1>Файл сохранён!</h1>");
            });
            // Метод map() создаёт новый массив с результатом вызова указанной функции для каждого элемента массива
            break;
        case "/read":
            roll.writeHead(200, contentheader);
            let result = fs.readFileSync("links.txt");
            let links = result.toString("utf-8").split("\n");
            roll.write("<ol>");
            for (let i = 0; i < links.length; i++) {
                if (links[i]!= ""){
                roll.write("<li>" + links[i] + "</li>");
            }}
            roll.end("</ol>");
            break
    }
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


// Ваша программа должна представлять веб-сервер, который запускается в консоли как:
// > node main.js

// Веб-сервер должен уметь обрабатывать три запроса HTTP-методом GET:
// "/", "/save" и "/read"
// Например, если сервер использует хост localhost и порт 3000, то к серверу можно обратиться как:
// http://localhost:3000/
// http://localhost:3000/save
// http://localhost:3000/read

// При запросе корня сервера, то есть "/" сервер должен вернуть строку "Добро пожаловать!" в виде html-заголовка первого уровня

// При запросе "/save" сервер должен:
// - запросить и получить содержимое страницы по адресу https://ithub.ru
// - выбрать из полученного содержимого у всех ссылок значения атрибута href.
// - отобрать уникальные (неповторяющиеся) и только абсолютные (начинающиеся с http или https) url-адреса
// - записать отобранные адреса в файл с именем links.txt в произвольном формате
// - вернуть строку "Файл сохранён" в виде html-заголовка первого уровня

// При запросе "/read" сервер должен:
// - зачитать файл links.txt, который содержит список url-адресов
// - вернуть содержимое файла в виде html списка

// Не забудьте отследить возможные ошибки