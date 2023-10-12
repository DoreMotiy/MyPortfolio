$(function () {
    function calc(deck_size, key_num, hand_num, simulate_num) {
        let i, j, k;
        let pull_num = 0;
        console.log(deck_size, key_num, hand_num);
        for (i = 0; i < simulate_num; i++) {
            let deck = new Array(deck_size);
            deck.fill(0);
            deck.fill(1, 0, key_num);
            for (j = deck_size - 1; j > 0; j--) {
                k = Math.floor(Math.random() * (j + 1));
                [deck[j], deck[k]] = [deck[k], deck[j]];
            }
            if (deck.findIndex((elem) => elem == 1) < hand_num) {
                pull_num++;
            }
        }

        console.log(deck_size, key_num, hand_num, pull_num, simulate_num);
        $(".result").text(Math.round((pull_num / simulate_num) * 100000) / 1000 + "%");
    }

    function check_number(num) {
        const pattern = /^([1-9]\d*|0)$/;
        if (pattern.test(num)) {
            if (num == 0) {
                return false;
            }
            return true;
        }
        return false;
    }

    $(".calc").click(function () {
        let deck_size, key_num, hand_num, simulate_num;
        let deck_size_val = $(".deck_size").val();
        let key_num_val = $(".key_num").val();
        let hand_num_val = $(".hand_num").val();
        let simulate_num_val = $(".simulate_num").val();
        if (check_number(deck_size_val) && check_number(key_num_val) && check_number(hand_num_val) && check_number(simulate_num_val)) {
            deck_size = parseInt(deck_size_val);
            key_num = parseInt(key_num_val);
            hand_num = parseInt(hand_num_val);
            simulate_num = parseInt(simulate_num_val);
            if (deck_size > key_num && deck_size > hand_num) {
                calc(deck_size, key_num, hand_num, simulate_num);
            } else {
                $(".result").text("数字を正しく入力して下さい");
                console.log("koitu");
            }
        } else {
            $(".result").text("数字を正しく入力して下さい");
        }
    });

    $(".deck_size").val("");
    $(".key_num").val("");
    $(".hand_num").val("");
    $(".simulate_num").val("200000");
    $(".result").text("");
});
