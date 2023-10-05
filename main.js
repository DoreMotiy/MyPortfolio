$(function () {
    $(".menubtn").click(function () {
        const hasCollapsing = $("#contents > .collapsing").length > 0 ? true : false;
        if (hasCollapsing) {
            return;
        }
        const id = $(this).attr("id");
        const no = id.slice(-1);
        if ($("#content" + no).hasClass("show")) {
            return;
        }
        $("#contents > .collapse").collapse("hide");
        $("#content" + no).collapse("show");
    });
});
