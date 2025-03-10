class CaptchaSession {
    doFetch(img, input, button, path, callback) {
        if(this.fetchCallback != undefined && this.fetchCallback != null) {
            this.fetchCallback();
        }

        if(path != undefined && path != null) {
            img.src = path + "/img/loading.gif";
        } else {
            img.src = "img/loading.gif";
        }

        if(input.disabled) {
            input.disabled = false;
            input.value = "";
        }

        this.fetchCaptcha((json) => {
            img.src = this.url + json["img"];
            this.id = json["id"];

            button.onclick = () => {
                this.validateCaptcha(input.value, this.id, (json) => {
                    var _status = document.getElementById("zamcaptcha-input");
                    _status.value = json["message"];
                    _status.disabled = true;
                    button.onclick = () => {};
                    callback(json);
                });
            }
        });
    }

    setFetchCallback(callback) {
        this.fetchCallback = callback;
    }

    constructor(protocol, url, path, callback) {
        this.url = protocol + "://" + url;
        this.elem = document.getElementById("zamcaptcha");

        var img = document.createElement("img");
        img.className = "zamcaptcha-img";
        img.width = 300;
        img.height = 150;
        img.draggable = false;

        if(path != undefined && path != null) {
            img.src = path + "/img/loading.gif";
        } else {
            img.src = "img/loading.gif";
        }

        var cont = document.createElement("div");
        cont.className = "zamcaptcha-container";

        var button = document.createElement("button");
        button.innerText = "Verifica";
        button.className = "zamcaptcha-button";
        button.type = "button";

        var retry = document.createElement("button");
        retry.innerHTML = "&#8635;";
        retry.className = "zamcaptcha-retry";
        retry.type = "button";
        retry.id = "zamcaptcha-retry";

        var spacer = document.createElement("div");
        spacer.className = "zamcaptcha-spacer";

        var input = document.createElement("input");
        input.id = "zamcaptcha-input";
        input.type = "text";

        cont.appendChild(input);
        cont.appendChild(retry);
        cont.appendChild(button);

        this.elem.appendChild(img);
        this.elem.appendChild(cont);

        this.doFetch(img, input, button, path, callback);

        retry.onclick = () => {
            this.doFetch(img, input, button, path, callback);
        };
    }

    async validateCaptcha(input, id, callback) {
        const req = this.url + "/api/captcha/validate?id=" + id + "&match=" + input;
        const response = await fetch(req);
        const json = await response.json();

        callback(json);
    }

    async fetchCaptcha(callback) {
        const response = await fetch(this.url + "/api/captcha/get");
        const json = await response.json();

        callback(json);
    }
}