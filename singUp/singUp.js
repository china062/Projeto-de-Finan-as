const inputName = document.getElementById("nomeUserRegistro");
const inputEmail = document.getElementById("emailUserRegistro");
const inputPassword = document.getElementById("senhaUserRegistro");
const inputConfirmPassword = document.getElementById("confirmarSenhaUserRegistro");
const buttonRegister = document.getElementById("buttonRegister")
const errorMessages = document.querySelectorAll(".erro");

inputName.addEventListener("invalid", () => inputName.setCustomValidity("Por favor, informe seu nome."));
inputEmail.addEventListener("invalid", () => inputEmail.setCustomValidity("Por favor, informe seu email."));
inputPassword.addEventListener("invalid", () => inputPassword.setCustomValidity("Por favor, informe sua senha."));
inputConfirmPassword.addEventListener("invalid", () => inputConfirmPassword.setCustomValidity("Por favor, confirme sua senha."));

inputName.addEventListener("input", () => inputName.setCustomValidity(""));
inputEmail.addEventListener("input", () => inputEmail.setCustomValidity(""));
inputPassword.addEventListener("input", () => inputPassword.setCustomValidity(""));
inputConfirmPassword.addEventListener("input", () => inputConfirmPassword.setCustomValidity(""));

buttonRegister.addEventListener("click", eventRegister)

async function eventRegister(event) {
    event.preventDefault();

    errorMessages.forEach(span => span.textContent = "");
    let errorMsg = false;

    if (inputPassword.value.length < 6) {
        errorMessages[2].textContent = "Sua senha deve conter pelo menos 6 caracteres.";
        errorMsg = true;
    }

    if (!inputPassword.value.includes("!") &&
        !inputPassword.value.includes("@") &&
        !inputPassword.value.includes("#") &&
        !inputPassword.value.includes("*")) {
        errorMessages[2].textContent = "Sua senha deve conter pelo menos um caractere especial (!, @, #, *).";
        errorMsg = true;
    }

    if (inputConfirmPassword.value !== inputPassword.value) {
        errorMessages[3].textContent = "As senhas devem ser iguais.";
        errorMsg = true;
    }

    if (errorMsg) return;

    function criptografarSenha(senha) {
        return CryptoJS.MD5(senha).toString();
        };

    let senhaCriptografada = criptografarSenha(inputPassword.value)
    let confirmarSenhaCriptografada = criptografarSenha(inputConfirmPassword.value)

    const dados = {
        nome: inputName.value,
        email: inputEmail.value,
        senha: senhaCriptografada
    };

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const msg = await res.text();
        console.log(msg);
        alert(msg);
        window.location.href = "/index.html";
    } catch (err) {
        console.error("Erro:", err);
        alert("Erro ao cadastrar usuário!");
    }


};