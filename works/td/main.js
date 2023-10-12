$(document).ready(function () {
    //localstorageのkey
    const storage_key = "KEY";

    //メモの配列
    let arr_memo = [];

    //各色の配列
    obj_colors = { red: [], blue: [], green: [], yellow: [] };

    //変換するためのオブジェクト
    const obj_convert = {
        color_code: {
            class_name: {
                "#ffadad": ".t_red",
                "#adffff": ".t_blue",
                "#adffad": ".t_green",
                "#ffffad": ".t_yellow",
            },
            obj_name: {
                "#ffadad": obj_colors.red,
                "#adffff": obj_colors.blue,
                "#adffad": obj_colors.green,
                "#ffffad": obj_colors.yellow,
            },
        },
        class_name: {
            t_red: obj_colors.red,
            t_blue: obj_colors.blue,
            t_green: obj_colors.green,
            t_yellow: obj_colors.yellow,
        },
        obj_name: {
            red: ".t_red",
            blue: ".t_blue",
            green: ".t_green",
            yellow: ".t_yellow",
        },
    };

    //ページ読み込み時に表示する
    readmemo();

    //localstorageに保存する
    function savestorage() {
        localStorage.setItem(storage_key, JSON.stringify(arr_memo)); //オブジェクト -> JSON
    }

    //localstorageを変換して返す
    function getstorage() {
        let src = localStorage.getItem(storage_key); //localstorageを読み込む
        let res = JSON.parse(src); //JSON -> オブジェクト
        return res;
    }

    //メモを追加する
    function addmemo() {
        let memo_txt = $(".add_txt").val(); //メモの内容
        let color_value = $("option:selected").val(); //選ばれてる色
        hyoujimemo(memo_txt, color_value);
        savememo(memo_txt, color_value);
        tbodyhidden();
    }

    //メモを表示する
    function hyoujimemo(memo_txt, memo_color) {
        let checkmark = String.fromCodePoint(0x2713); //Unicodeのチェックマーク
        let temp = `<tr><td class="x_btn" bgcolor=${memo_color}>${checkmark}</td><td class="memo_txt" bgcolor=${memo_color}>${memo_txt}</td></tr>`; //行のHTML
        let class_name = obj_convert.color_code.class_name[memo_color]; //メモの色 -> クラス名
        $(class_name).append(temp); //テーブルに新しい行を追加
        $(".add_txt").val(""); //打ち込む所を空白にする
    }

    //メモを新たに保存する
    function savememo(memo_txt, memo_color) {
        let obj_memo = { mtxt: memo_txt, bgc: memo_color }; //オブジェクトの形にする
        let obj_color = obj_convert.color_code.obj_name[memo_color]; //メモの色 -> その色の配列
        obj_color.push(obj_memo); //配列の末尾に追加する
        arr_memo = obj_colors.red.concat(obj_colors.blue, obj_colors.green, obj_colors.yellow); //各色の配列を結合する
        savestorage();
    }

    //メモを削除する
    function delmemo(memo_row) {
        let idx = memo_row.index(); //テーブルの行のインデックスを取る
        let par = memo_row.parent(); //行の親要素 = tbody
        let par_class = $(par).attr("class"); //tbodyのクラスを取得
        let selecter = "." + par_class + " tr"; //".(tbodyのクラス名) tr"という形にする
        $(selecter).eq(idx).remove(); //tbodyの中のidx番目の行を消す
        let obj_color = obj_convert.class_name[par_class]; //クラス名 -> 色の配列
        obj_color.splice(idx, 1); //色の配列から消す
        arr_memo = obj_colors.red.concat(obj_colors.blue, obj_colors.green, obj_colors.yellow); //各色の配列を結合する
        savestorage();
        tbodyhidden();
    }

    //メモをリセットする
    function resetmemo() {
        //各tbodyの子要素を全て消す
        $(".t_red").children().remove();
        $(".t_blue").children().remove();
        $(".t_green").children().remove();
        $(".t_yellow").children().remove();
        //各色の配列をリセットする
        obj_colors.red.splice(0);
        obj_colors.blue.splice(0);
        obj_colors.green.splice(0);
        obj_colors.yellow.splice(0);
        //配列の中身をリセットする
        arr_memo.splice(0);
        localStorage.clear(); //localStorageの全項目を消す
    }

    //メモを読み込む
    function readmemo() {
        let obj = getstorage();
        if (obj == null) {
            //localstorageに何もないなら抜ける
            return;
        }
        //項目の数だけループする
        for (let i = 0; i < obj.length; i++) {
            let memo_txt = obj[i].mtxt; //メモの内容
            let memo_color = obj[i].bgc; //メモの色
            let obj_memo = { mtxt: memo_txt, bgc: memo_color }; //オブジェクトの形にする
            let obj_color = obj_convert.color_code.obj_name[memo_color]; //メモの色 -> その色の配列
            obj_color.push(obj_memo); //配列の末尾に追加する
            arr_memo = obj_colors.red.concat(obj_colors.blue, obj_colors.green, obj_colors.yellow); //各色の配列を結合する
            savestorage();
            hyoujimemo(memo_txt, memo_color);
        }
        tbodyhidden();
    }

    //空のtbodyを非表示にする
    function tbodyhidden() {
        //各色の配列をループでまわす
        for (const obj_color in obj_colors) {
            let selecter = obj_convert.obj_name[obj_color]; //オブジェクト名 -> クラス名
            if (obj_colors[obj_color].length == 0) {
                //中身がないtbodyを非表示にする
                $(selecter).css("display", "none");
            } else {
                //中身がるtbodyを表示する
                $(selecter).css("display", "table-row-group");
            }
        }
    }

    /*クリックイベントの追加*/
    //追加ボタン
    $(".add_btn").click(function () {
        addmemo();
    });

    //レボタン
    //こう書くと後から追加された行にも対応できるらしい
    $(document).on("click", ".x_btn", function () {
        delmemo($(this).parent()); //レボタンの行を渡す
    });

    //リセットボタン
    $(".reset_btn").click(function () {
        resetmemo();
    });
});
