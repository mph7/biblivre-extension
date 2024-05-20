console.log("teste");

// Crie um novo MutationObserver
var observer = new MutationObserver(function (mutations) {
    // Tente selecionar o campo de e-mail
    var emailField = document.querySelector(
        "#biblivre_circulation_form > fieldset > div > div:nth-child(1) > div.value > input[type=text]",
    );

    // Verifique se o campo de e-mail foi encontrado
    if (emailField) {
        // Se o campo de e-mail foi encontrado, defina seu valor e pare de observar as mudanças no DOM
        emailField.value = "teste@gmail.com";

        document.querySelector(
            "#biblivre_circulation_form_body > div:nth-child(4) > div.value > select > option:nth-child(2)",
        ).selected = true;

        observer.disconnect();
    }
});

// Inicie a observação das mudanças no DOM
// observer.observe(document.body, { childList: true, subtree: true });

console.log(document.querySelector("#circulation_user > div.page_title > div.buttons > a"));

document.querySelector("#circulation_user > div.page_title > div.buttons > a").addEventListener(
    "click",
    () => {
        console.log("clicou");

        var emailField = document.querySelector(
            "#biblivre_circulation_form > fieldset > div > div:nth-child(1) > div.value > input[type=text]",
        );

        emailField.value = "teste@gmail.com";
        document.querySelector(
            "#biblivre_circulation_form_body > div:nth-child(4) > div.value > select > option:nth-child(2)",
        ).selected = true;
    },

    // observer.observe(document.body, { childList: true, subtree: true });
);
