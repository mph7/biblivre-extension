async function getAuthor(authorId) {
    return fetch("https://openlibrary.org" + authorId + ".json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            authorName = data.personal_name.split(" ");
            return (
                authorName[authorName.length - 1].toUpperCase() +
                ", " +
                authorName.slice(0, authorName.length - 1).join(" ")
            );
        })
        .catch(function (error) {
            console.error("Error:", error);
        });
}

async function getBook(isbn) {
    return fetch("https://openlibrary.org/isbn/" + isbn + ".json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(async (data) => {
            return {
                title: data.title,
                author: await getAuthor(data.authors[0].key),
                date: data.publish_date,
            };
        })
        .catch(function (error) {
            console.error("Error:", error);
        });
}

const isbnButton = document.createElement("a");
isbnButton.innerHTML = "Buscar por ISBN";
isbnButton.classList.add("button", "center");

//create notification
extensionMessage = document.createElement("div");
extensionMessage.innerHTML =
    '<div class="message success" style="display: block;"> <div>Carregando, por favor aguarde!</div>    </div>';
extensionMessage.setAttribute("id", "extension-messages");

isbnButton.addEventListener("click", async function (event) {
    event.preventDefault();
    const isbn = document.querySelector(
        "#biblivre_form > div:nth-child(1) > fieldset > div.subfields > div > div.value > input",
    ).value;

    // Insert loading message
    document.querySelector("#messages").append(extensionMessage);

    const book = await getBook(isbn);

    let noTitle;
    let noAuthor;
    let noDate;

    // Set title
    try {
        if (book.title != undefined) {
            document.querySelector(
                "#biblivre_form > div:nth-child(2) > fieldset > div.subfields > div:nth-child(3) > div.value > input",
            ).value = book.title;
        }
    } catch (error) {
        noTitle = true;
    }

    // Set author
    try {
        if (book.author != undefined) {
            document.querySelector(
                "#biblivre_form > div:nth-child(3) > fieldset > div.subfields > div:nth-child(2) > div.value > input",
            ).value = book.author;
        }
    } catch (error) {
        noAuthor = true;
    }

    // Set publication date
    try {
        if (book.date != undefined) {
            document.querySelector(
                "#biblivre_form > div:nth-child(4) > fieldset > div.subfields > div:nth-child(3) > div.value > input",
            ).value = book.date;
        }
    } catch (error) {
        noDate = true;
    }

    let notificationString;
    filtered = [noTitle, noAuthor, noDate].filter((x) => x === true);
    let fields = [];
    if (noTitle) fields.push("Título");
    if (noAuthor) fields.push("Autor");
    if (noDate) fields.push("Data de publicação");

    if (filtered.length !== 0) {
        if (filtered.length === 1) notificationString = `O campo ${fields.join("")} não foi encontrados.`;
        else if (filtered.length > 1) {
            last = fields.pop();
            notificationString = `Os campos ${fields.join(", ")} e ${last} não foram encontrados.`;
        }
    } else {
        notificationString = "Dados do livro inseridos com sucesso!";
    }

    let createdExtensionMessage = document.querySelector("#extension-messages > div > div");
    createdExtensionMessage.innerHTML = notificationString;
    setTimeout(() => {
        document.querySelector("#extension-messages").remove();
    }, 2000);
});

document.querySelector(".biblivre_form_body .field .clear").before(isbnButton);

const createIsbnButton = document.createElement("a");
createIsbnButton.innerHTML = "Novo registro por ISBN";
createIsbnButton.classList.add("button", "center");

const buttonDiv = document.createElement("div");
buttonDiv.classList.add("buttons", "buttons-div");
buttonDiv.append(createIsbnButton);
buttonDiv.onclick = () => CatalogingInput.newRecord();

buttonDiv.addEventListener("click", (e) => {});

document.querySelector("#cataloging_search > div.page_title").append(buttonDiv);
