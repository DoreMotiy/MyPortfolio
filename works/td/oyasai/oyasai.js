// Ready
$(document).ready(() => {
    console.log("Ready!!");

    saisyo();
});

let all_name = ["toma", "green", "stra", "cu"];

let all_obj = {
    toma: {
        isname: "トマト",
        value: "200",
    },
    green: {
        isname: "ピーマン",
        value: "200",
    },
    stra: {
        isname: "いちご",
        value: "200",
    },
    cu: {
        isname: "きゅうり",
        value: "200",
    },
};
// addボタン押下時の処理
$("#toma_btn").click(function () {
    tuika("toma");
    kazu_henkou("toma");
});

$("#green_btn").click(function () {
    x2 = 200;
    tuika("green");
    kazu_henkou("green");
});

$("#stra_btn").click(function () {
    x3 = 200;
    tuika("stra");
    kazu_henkou("stra");
});

$("#cu_btn").click(function () {
    tuika("cu");
    kazu_henkou("cu");
});

$("#counter").click(function () {
    let sum = 0;
    sum += all_obj["toma"]["value"] * kazutoru("toma");
    sum += all_obj["green"]["value"] * kazutoru("green");
    sum += all_obj["stra"]["value"] * kazutoru("stra");
    sum += all_obj["cu"]["value"] * kazutoru("cu");
    $(".sum_price").text("合計：" + sum + "円");
});

function tuika(KEYYYY) {
    let tnum = localStorage.getItem(KEYYYY);
    if (tnum == null) {
        tnum = "0";
    }
    let num = parseInt(tnum);
    num += 1;
    localStorage.setItem(KEYYYY, num);
    $("p." + KEYYYY).css("display", "block");
}

function kazutoru(KEYYYY) {
    let tnum = localStorage.getItem(KEYYYY);
    if (tnum == null) {
        tnum = "0";
    }
    let num = parseInt(tnum);
    return num;
}

function saisyo() {
    for (let i = 0; i < all_name.length; i++) {
        $(".shopping").append(`<p class="${all_name[i]}">${all_obj[all_name[i]]["isname"]} ${all_obj[all_name[i]]["value"]}円 × ${kazutoru(all_name[i])}</p>`);
        if (kazutoru(all_name[i]) == 0) {
            $("p." + all_name[i]).css("display", "none");
        }
    }
}

function kazu_henkou(KEYYYY) {
    let isname = all_obj[KEYYYY]["isname"];
    let isvalue = all_obj[KEYYYY]["value"];
    $("." + KEYYYY).text(isname + " " + isvalue + "円  × " + kazutoru(KEYYYY));
}
