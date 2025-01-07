class CaptchaSession {
    constructor(protocol, url) {
        this.url = protocol + "://" + url;
        this.elem = document.getElementById("zamcaptcha");

        var img = document.createElement("img");
        img.className = "zamcaptcha-img";
        img.width = 300;
        img.height = 150;
        img.draggable = false;

        var cont = document.createElement("div");
        cont.className = "zamcaptcha-container";

        var button = document.createElement("button");
        button.innerText = "Verifica";
        button.className = "zamcaptcha-button";

        var spacer = document.createElement("div");
        spacer.className = "zamcaptcha-spacer";

        var input = document.createElement("input");
        input.className = "zamcaptcha-input";
        input.type = "text";

        var status = document.createElement("p");
        status.id = "zamcaptcha-status";

        cont.appendChild(input);
        cont.appendChild(spacer);
        cont.appendChild(status);
        cont.appendChild(button);

        this.elem.appendChild(img);
        this.elem.appendChild(cont);

        this.fetchCaptcha((json) => {
            img.src = this.url + json["img"];
            this.id = json["id"];

            button.onclick = () => {
                this.validateCaptcha(input.value, this.id, (json) => {
                    var _status = document.getElementById("zamcaptcha-status");
                    _status.innerText = json["message"];
                });
            }
        });
    }

    async validateCaptcha(input, id, callback) {
        const req = this.url + "/validateCaptcha?id=" + id + "&match=" + input;
        const response = await fetch(req);
        const json = await response.json();

        callback(json);
    }

    async fetchCaptcha(callback) {
        const response = await fetch(this.url + "/getCaptcha");
        const json = await response.json();

        callback(json);
    }
}

window.onload = () => {
    var session = new CaptchaSession("http", "localhost:8080");
};