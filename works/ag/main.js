const pow = [1, 4, 16, 64];
let data;
let nowArtifact;

class Artifact {
    constructor() {
        this.level = 0;
        this.type = this.rnd(data["typesNum"]);
        this.mainType = this.pickObj(data["mainProb"][this.type]);
        this.subQuantity = this.pickObj(data["quantityProb"]);
        this.subType = [];
        this.subValue = [];
        for (let i = 0; i < this.subQuantity; i++) {
            this.addSubType(i);
        }
        this.show();
    }

    rnd(range) {
        return Math.floor(Math.random() * range);
    }

    pickArr(arr) {
        return arr[this.rnd(arr.length)];
    }

    pickObj(obj) {
        let rate = 0;
        let rand = this.rnd(10000);
        for (const prop_key in obj) {
            rate += obj[prop_key];
            if (rand < rate) {
                return parseInt(prop_key);
            }
        }
    }

    isExist(obj, key, id) {
        return obj[key].includes(id);
    }

    search(obj, id) {
        for (const key in obj) {
            if (this.isExist(obj, key, id)) {
                return key;
            }
        }
    }

    addSubType(idx) {
        let afterArr;
        do {
            const groupKey = this.pickObj(data["subProb"][this.type]);
            const beforeArr = data["subGroup"][groupKey];
            afterArr = this.eraseStat(beforeArr);
        } while (afterArr.length === 0);
        this.subType[idx] = this.pickArr(afterArr);
        this.upgradeSubValue(idx);
    }

    eraseStat(arr) {
        return arr.filter((id) => id !== this.mainType && !this.subType.includes(id));
    }

    upgradeSubValue(idx) {
        if (this.subValue[idx] === undefined) {
            this.subValue[idx] = 0;
        }
        this.subValue[idx] += pow[this.rnd(4)];
    }

    fixSubValue(idx) {
        let res = 0;
        let t = this.subValue[idx];
        for (let i = 0; i < 4; i++) {
            res += data["subValue"][this.subType[idx]][i] * parseInt(t / pow[3 - i]);
            t %= pow[3 - i];
        }
        return this.fixStatValue(this.subType[idx], res);
    }

    fixStatValue(id, value) {
        let res = "";
        if (data["decimalGroup"].includes(id)) {
            res += parseFloat(value).toFixed(1);
            res += "%";
        } else {
            res += Math.round(value);
        }
        return res;
    }

    levelUp() {
        if (this.level === 20) {
            return;
        }
        this.level++;
        if (this.level % 4 == 0) {
            if (this.subQuantity === 3) {
                this.subQuantity++;
                this.addSubType(3);
            } else {
                this.enhanceStat();
            }
        }
        this.show();
    }

    enhanceStat() {
        this.upgradeSubValue(this.rnd(this.subQuantity));
    }

    show() {
        $(".level").text("+" + this.level);
        $(".type").text(data["typesJP"][this.type]);
        $(".main_stat").text(data["statsJP"][this.mainType]);
        $(".main_value").text(this.fixStatValue(this.mainType, data["mainValue"][this.search(data["mainGroup"], this.mainType)][this.level]));
        for (let i = 0; i < this.subQuantity; i++) {
            $(".sub_stat" + i).text("・" + data["statsJP"][this.subType[i]] + "+" + this.fixSubValue(i));
        }
        $(".sub_stat3").css("display", this.subQuantity === 4 ? "initial" : "none");
        if (nowArtifact === undefined) {
            this.firstShow();
        }
    }

    firstShow() {
        $(".upper").css("padding", "10px 20px");
        $(".lower").css("padding", "20px 20px");
        $(".stars").css("display", "initial");
        $(".level").css("display", "initial");
        $(".btn").css("height", "100px");
        $(".enhance").css("display", "initial");
    }
}

$(async function () {
    await axios
        .get("./data.json")
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            console.log(error);
        });

    $(".generate").click(function () {
        nowArtifact = new Artifact();
        console.log(nowArtifact);
    });
    $(".enhance").click(function () {
        nowArtifact.levelUp();
        console.log(nowArtifact);
    });
});
