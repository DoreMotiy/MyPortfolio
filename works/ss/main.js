const HW_B = 3;
const HW = 9;
const HW_2 = 81;
const BOX_STEP = [0, 1, 2, 9, 10, 11, 18, 19, 20];

$(function () {
    for (let r = 0; r < HW; r++) {
        for (let c = 0; c < HW; c++) {
            selector = ".r" + r + ".c" + c;
            $(selector).css({
                top: "calc(100% / 9 * " + r + ")",
                left: "calc(100% / 9 * " + c + ")",
            });
        }
    }

    $(".cell").click(function () {
        $(this).toggleClass("selected").siblings().removeClass("selected");
    });

    $(".numbtn").click(function () {
        $(".cell.selected").text($(this).val()).removeClass("selected");
    });

    $("#solvebtn").click(function () {
        const prob = [];
        $(".cell").each(function () {
            const txt = $(this).text();
            prob.push(txt === "" ? 0 : parseInt(txt));
        });
        let sudoku = new Sudoku(prob);
        const res = sudoku.solve();
        if (res === undefined) {
            return;
        }
        for (let i = 0; i < HW_2; i++) {
            if ($("#" + i).text() === "") {
                $("#" + i).css("color", "red");
            } else {
                $("#" + i).css("color", "black");
            }
            $("#" + i).text(res[i]);
        }
    });
});

class Cell {
    constructor(pos) {
        this.pos = pos;
        this.num = 0;
        this.candidates = 0x3fe;
        this.candidateCount = HW;
        this.relatedCells = [];
        this.changedCells = [];
        this.selected = false;
    }

    setNum(num) {
        const mask = 1 << num;
        if ((this.candidates & mask) === 0) {
            return false;
        }
        this.num = num;
        for (const cell of this.relatedCells) {
            if (cell.num === 0 && cell.candidates & mask) {
                if (cell.candidatesCount === 1) {
                    this.resetNum();
                    return false;
                }
                cell.candidates ^= mask;
                cell.candidatesCount--;
                this.changedCells.push(cell);
            }
        }
        return true;
    }

    resetNum() {
        const mask = 1 << this.num;
        this.changedCells.forEach((cell) => {
            cell.candidates ^= mask;
            cell.candidatesCount++;
        });
        this.num = 0;
        this.changedCells = [];
    }

    setRelatedCells(cells) {
        const row = Math.floor(this.pos / HW);
        const col = this.pos % HW;
        const boxStart = Math.floor(row / HW_B) * HW_B * HW + Math.floor(col / HW_B) * HW_B;

        for (let i = 0; i < HW; i++) {
            this.addRelatedCell(cells, i * HW + col);
            this.addRelatedCell(cells, row * HW + i);
            this.addRelatedCell(cells, boxStart + BOX_STEP[i]);
        }
    }

    addRelatedCell(cells, pos) {
        const cell = cells[pos];
        if (pos !== this.pos && !this.relatedCells.includes(cell)) {
            this.relatedCells.push(cell);
        }
    }
}

class EmptyList {
    constructor() {
        this.list = [];
        this.length = 0;
    }

    push(cell) {
        this.list.push(cell);
        this.length++;
    }

    pop() {
        let selectedCell;
        let minLength = HW + 1;
        for (const cell of this.list.filter((c) => !c.selected)) {
            if (cell.candidateCount === 1) {
                selectedCell = cell;
                break;
            }
            if (cell.candidateCount < minLength) {
                minLength = cell.candidateCount;
                selectedCell = cell;
            }
        }
        selectedCell.selected = true;
        this.length--;
        return selectedCell;
    }

    restore(cell) {
        cell.selected = false;
        this.length++;
    }
}

class Sudoku {
    constructor(prob) {
        this.prob = prob;
        this.cells = Array(HW_2)
            .fill()
            .map((_, i) => new Cell(i));
        this.cells.forEach((cell) => {
            cell.setRelatedCells(this.cells);
        });
        this.emptyList = new EmptyList();
    }

    solve() {
        for (const cell of this.cells) {
            const num = this.prob[cell.pos];
            if (num === 0) {
                this.emptyList.push(cell);
            } else if (!cell.setNum(num)) {
                alert("重複があるよ");
                return;
            }
        }
        if (this.emptyList.length === 0) {
            alert("空白マスがないよ");
            return;
        }
        if (!this.backTracking()) {
            alert("解けなかったよ");
            return;
        }
        return this.cells.map((cell) => cell.num);
    }

    backTracking() {
        const cell = this.emptyList.pop();
        for (let i = 1; i <= HW; i++) {
            if (cell.setNum(i)) {
                if (this.emptyList.length === 0 || this.backTracking()) {
                    return true;
                }
                cell.resetNum();
            }
        }
        this.emptyList.restore(cell);
        return false;
    }
}
