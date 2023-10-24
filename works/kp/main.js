function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}

function lengthCheck(...arr) {
    const length = arr[0].length;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length !== length) {
            return false;
        }
    }
    return true;
}

function strToArray(val, numFlg) {
    const str = val.replace(/\s/g, "");
    const arr = str.split(",");
    if (numFlg) {
        const converted = arr.map((num) => Number(num));
        return converted;
    }
    return arr;
}

function KPSolver(names, values, sizes, cap) {
    const n = values.length;
    let dp = new Array(cap + 1).fill(0);
    let choice = new Array(cap + 1).fill([]);

    for (let i = 0; i < n; i++) {
        for (let j = cap; j >= sizes[i]; j--) {
            if (dp[j] < dp[j - sizes[i]] + values[i]) {
                dp[j] = dp[j - sizes[i]] + values[i];
                choice[j] = [...choice[j - sizes[i]], names[i]];
            }
        }
    }

    return { total_value: dp[cap], chosen_items: choice[cap] };
}

function UKPSolver(names, values, sizes, cap) {
    const n = values.length;
    let dp = new Array(cap + 1).fill(0);
    let choice = new Array(cap + 1).fill([]);

    for (let i = 0; i < n; i++) {
        for (let j = sizes[i]; j <= cap; j++) {
            if (dp[j] < dp[j - sizes[i]] + values[i]) {
                dp[j] = dp[j - sizes[i]] + values[i];
                choice[j] = [...choice[j - sizes[i]], names[i]];
            }
        }
    }

    return { total_value: dp[cap], chosen_items: choice[cap] };
}

function countItems(arr, order) {
    let count = {};
    for (let i = 0; i < arr.length; i++) {
        if (count[arr[i]]) {
            count[arr[i]]++;
        } else {
            count[arr[i]] = 1;
        }
    }
    let result = {};
    for (let i = 0; i < order.length; i++) {
        if (count.hasOwnProperty(order[i])) {
            result[order[i]] = count[order[i]];
        }
    }

    return result;
}

function popAlert(score, result) {
    let sep = "";
    for (const key in result) {
        sep += key + " : " + result[key] + "\n";
    }
    sep += "総価値 : " + score;
    alert(sep);
}

$(function () {
    $("#changeKP").click(function () {
        if ($(this).text() === "0-1") {
            $(this).text("無制限");
        } else {
            $(this).text("0-1");
        }
    });

    $("#exam").click(function () {
        $("#name").val("缶コーヒー,水入りペッドボトル,バナナ,りんご,おにぎり,パン");
        $("#value").val("120,130,80,100,250,185");
        $("#size").val("10,12,7,9,21,16");
        $("#cap").val("65");
    });

    $("#solve").click(function () {
        const values = strToArray($("#value").val(), true);
        const sizes = strToArray($("#size").val(), true);
        const cap = Number($("#cap").val(), true);
        const nameVal = $("#name").val();
        const names = nameVal !== "" ? strToArray(nameVal, false) : values.map((num) => num.toString());
        if (!isNumber(cap) || !lengthCheck(values, sizes, names)) {
            alert("入力が不正です");
            return;
        }
        const isUKP = $("#changeKP").text() === "無制限";
        const res = isUKP ? UKPSolver(names, values, sizes, cap) : KPSolver(names, values, sizes, cap);
        const items = countItems(res.chosen_items, names);
        console.log(items);
        popAlert(res.total_value, items);
    });
});
