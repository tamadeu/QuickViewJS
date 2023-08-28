var url = `users.json`;
const xhr = new XMLHttpRequest();
xhr.open("GET", url, false);
xhr.send();

const users = JSON.parse(xhr.responseText);

qv({
    "users": users.users,
    "siteName": "quickviewJS",
    "date": new Date(),
    "qttyProducts": 100,
    "name": "Talles"
});