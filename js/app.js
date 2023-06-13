var editando = false;

$("#borrar").prop("disabled", true);

if (navigator.serviceWorker) {
	navigator.serviceWorker.register("/sw.js");
}

$("#imagen").change(function () {
	var imagen;
	var file = this.files[0];
	var reader = new FileReader();
	reader.onloadend = function () {
		$("#imagen-producto").attr("src", reader.result);
	};
	reader.readAsDataURL(file);
});

$("body").on("click", "td", function () {
	if (!editando) {
		$("#borrar").prop("disabled", false);
		$("#limpiar").prop("disabled", true);
		var fila = $(this).closest("tr");
		var id = fila.attr("id");
		if (fila.hasClass("table-active")) {
			fila.removeClass("table-active");
			$("#id").val("");
		} else {
			$(".table-active").removeClass("table-active");
			fila.addClass("table-active");
			$("#id").val(id);
		}
	}
});

$("body").on("dblclick", "td", function () {
	editando = true;
	$("#borrar").prop("disabled", true);
	$("#limpiar").prop("disabled", false);
	var fila = $(this).closest("tr");
	var id = fila.attr("id");
	$("#id").val(id);
	var elemento = fila.children();
	$("#nombre").val(elemento[0].textContent);
	$("#tamaño").val(elemento[1].textContent);
	$("#cantidad").val(elemento[2].textContent);
	$("#precio").val(elemento[3].textContent);
	$("#total").val(elemento[4].textContent);
	$("#imagen-producto").attr("src", elemento[5].children[0].src);
	$(".table-active").removeClass("table-active");
	//$("#borrar").prop("disabled", true);
});

$("#cantidad, #precio").on("change", function () {
	var cantidad = $("#cantidad").val();
	var precio = $("#precio").val();
	var total = cantidad * precio;
	$("#total").val(total);
});
