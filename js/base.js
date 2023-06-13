const CacheImagenes = "cacheImagenes-1";

function cambiarEdicion() {
	editando = globalThis.editando;
	if (editando) {
		editando = false;
	}
}

(function () {
	"use strict";
	var table = $("tbody");

	const nombre = $("#nombre");
	const tamaño = $("#tamaño");
	const cantidad = $("#cantidad");
	const precio = $("#precio");
	const total = $("#total");
	const imagen = $("#imagen-producto");

	const guardar = $("#guardar");
	const limpiar = $("#limpiar");
	const borrar = $("#borrar");

	let db = new PouchDB("abarrotes");
	let remoteCouch = false;

	db.changes({
		since: "now",
		live: true,
	}).on("change", showProductos);

	function limpiarValores() {
		cambiarEdicion();
		$("#id").val("");
		nombre.val("");
		tamaño.val("");
		cantidad.val("");
		precio.val("");
		total.val("");
		imagen.attr("src", "images/camara.png");
	}

	function addProducto() {
		if ($("#id").val() === "") {
			let producto = {
				_id: new Date().toISOString(),
				nombre: nombre.val(),
				tamaño: tamaño.val(),
				cantidad: cantidad.val(),
				precio: precio.val(),
				total: total.val(),
				imagen: imagen.attr("src"),
			};
			db.put(producto, function callback(err, result) {
				if (!err) {
					console.log("Se ha guardado el registro satisfactoriamente!");
					limpiarValores();
					cambiarEdicion();
				}
			});
		} else {
			db.get($("#id").val())
				.then((doc) => {
					console.log(doc);
					doc.nombre = nombre.val();
					doc.tamaño = tamaño.val();
					doc.cantidad = cantidad.val();
					doc.precio = precio.val();
					doc.total = total.val();
					doc.imagen = imagen.attr("src");
					db.put(doc);
				})
				.then(limpiarValores)
				.then(cambiarEdicion);
		}
	}

	function showProductos() {
		db.allDocs(
			{
				include_docs: true,
				descending: false,
			},
			function (err, doc) {
				mostrarTabla(doc.rows);
			}
		);
	}

	function mostrarTabla(productos) {
		let stringHtml = "";
		productos.forEach(function (producto) {
			stringHtml += `
            <tr id="${producto.doc._id}">
                <td>${producto.doc.nombre}</td>
                <td>${producto.doc.tamaño}</td>
                <td>${producto.doc.cantidad}</td>
                <td>${producto.doc.precio}</td>
                <td>${producto.doc.total}</td>
                <td class="text-center"><img src="${producto.doc.imagen}" width="80px"></td>
            </tr>
            `;
			//fila.append($("<td>").html(`<button class="btn btn-danger" onclick="borrarProducto('${producto.doc._id}')">Borrar</button>`));
		});
		table.html(stringHtml);
	}

	function borrarProducto() {
		db.get($("#id").val()).then((doc) => {
			db.remove(doc);
		});
	}

	

	$("#form").submit(function (e) {
		e.preventDefault();
		if(nombre.val() === ""){
			nombre.addClass("is-invalid");
			nombre.focus();
			return false;
		} else {
			nombre.removeClass("is-invalid");
		}
		if(tamaño.val() === ""){
			tamaño.addClass("is-invalid");
			tamaño.focus();
			return false;
		} else {
			tamaño.removeClass("is-invalid");
		}
		if(cantidad.val() === "" || cantidad.val() < 0){
			cantidad.addClass("is-invalid");
			cantidad.focus();
			return false;
		} else {
			cantidad.removeClass("is-invalid");
		}
		if(precio.val() === "" || precio.val() < 0){
			precio.addClass("is-invalid");
			precio.focus();
			return false;
		} else {
			precio.removeClass("is-invalid");
		}
		if(!(nombre.val() === "" || tamaño.val() === "" || cantidad.val() === "" || precio.val() === "")){
			addProducto();
		}
	});

	guardar.click(() => {
		$("#borrar").prop("disabled", true);
		$("#limpiar").prop("disabled", false);
		$("#form").submit();
	});

	limpiar.click(()=>{
		$("#borrar").prop("disabled", true);
		$("#limpiar").prop("disabled", false);
		limpiarValores
	});
	borrar.click(()=>{
		$("#borrar").prop("disabled", true);
		$("#limpiar").prop("disabled", false);
		borrarProducto();
	});

	showProductos();
})();
