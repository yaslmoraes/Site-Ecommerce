document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/produtoss")
    .then(response => response.text())
    .then(text => {
        console.log("Resposta da API:", text); 
        return JSON.parse(text); 
    })
    .then(produtos => {
        console.log("Produtos carregados:", produtos);
        const productList = document.getElementById("product-list");

        produtos.forEach(produto => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            productItem.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}" width="200" height="200">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p>R$ ${Number(produto.preco).toFixed(2)}</p>
                <button class="btn">Adicionar ao Carrinho</button>
            `;

            productList.appendChild(productItem);
        });
    })
    .catch(error => console.error("Erro ao carregar produtos:", error));

});

document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("cadastro-form");

    formCadastro.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        fetch("http://localhost:5000/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err)); 
            }
            return response.json(); 
        })
        .then(data => {
            console.log("Usuário cadastrado:", data);
            window.location.href = "/login";
        })
        .catch(error => {
            console.error("Erro ao cadastrar:", error);
            alert(error.error || "Erro desconhecido ao cadastrar.");
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("login-form"); // Seleciona o formulário de login pelo ID

    formLogin.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede que o formulário seja enviado de forma tradicional

        // Pegue os dados do formulário
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // Enviar os dados para o servidor via POST
        fetch("http://localhost:5000/logar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err)); 
            }
            return response.json(); 
        })
        .then(data => {
            console.log("Login realizado:", data);
            window.location.href = "/";
        })
        .catch(error => {
            console.error("Erro ao fazer login:", error); 
            alert(error.error || "Erro desconhecido ao fazer login.");
        });
    });
});



