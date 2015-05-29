
//console.log(dados_csv.length);

var ruas = {}; 
$(dados_csv).each(function() {
	ruas[this.LOGRADOURO.trim()] || (ruas[this.LOGRADOURO.trim()] = []);
	ruas[this.LOGRADOURO.trim()].push(this);
}); 
var logradouros = Object.keys(ruas);
logradouros.sort();

$("#busca_rua").typeahead({
	source: function(pesquisa, callBack) {
		//callBack([pesquisa, pesquisa, pesquisa]);
		var resultado = [];
		$(logradouros).each(function(i, rua){
			if (resultado.length < 10 && rua.toLowerCase().indexOf(pesquisa.toLowerCase()) >= 0) {
				resultado.push(rua);
			}
		});
		console.log(resultado.length);
		callBack(resultado);
	}
});

function mostraTela(idTela) {
	$("#div_selecionarRua,#div_resumo,#div_selecionarNum").addClass("hidden");
	$("#" + idTela).removeClass("hidden");
}

function carregaResumo(dadosRua) {
	mostraTela("div_resumo");
	$("#p_logradouro").text(dadosRua.LOGRADOURO.trim() || "N/D");
	$("#p_nroini").text(dadosRua.NROINI.trim() || "N/D");
	$("#p_nrofim").text(dadosRua.NROFIM.trim() || "N/D");
	$("#p_lado").text(dadosRua.LADO.trim() || "N/D");
	$("#p_horacoleta").text(dadosRua.HORACOLETA.trim() || "N/D");
	$("#p_diascoleta").text(dadosRua.DIASCOLETA.trim() || "N/D");
}

$("#btn_selecionarRua").click(function(){
	var rua = $("#busca_rua").val();
	if (ruas[rua]) {
		console.log(ruas[rua]);
		if (ruas[rua].length == 1) {
			carregaResumo(ruas[rua][0]);
		} else {
			mostraTela("div_selecionarNum");
			$("#p_logradouro_numero").text(rua);
		} 
	}
});

function buscaRuaPorNumero(rua, numero) {
	console.log([rua, numero, ruas[rua]]);
	var selecao = null;
	$(ruas[rua]).each(function(){
		var ini = this.NROINI.trim();
		var fim = this.NROFIM.trim();
		if (!numero || +ini <= numero && +fim >= numero) {
			selecao = this;
		}
	});
	console.log(["selecao", selecao])
	return selecao;
}

$('#btn_selecionarNum').click(function(){
	var numero = $("#busca_numero").val();
	console.log(numero);
	if (+numero) {
		var rua = $("#busca_rua").val();
		var dadosRua = buscaRuaPorNumero(rua, numero);
		if (dadosRua) {
			console.log(dadosRua);
			carregaResumo(dadosRua);
		}
	}
});

function getNextId() {
	var id = +localStorage.getItem("id") + 1;
	localStorage.setItem("id", id);
	return id;
}

$('#btn_criarLembrete').click(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        if (window.plugin) {

            // set some global defaults for all local notifications
            window.plugin.notification.local.setDefaults({
                autoCancel : true // removes the notification from notification centre when clicked
            });
    
            // triggered when a notification was clicked outside the app (background)
            window.plugin.notification.local.onclick = function (id, state, json) {
                var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
            };

            // triggered when a notification is executed while using the app (foreground)
            // on Android this may be triggered even when the app started by clicking a notification
            window.plugin.notification.local.ontrigger = function (id, state, json) {
                var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
                navigator.notification.alert(message, null, 'Notification received while the app was in the foreground', 'Close');
            };
    
        };
    });

    DemoViewModel = kendo.data.ObservableObject.extend({

        showMessageWithoutSound: function () {
            this.notify({
                     id : 1,
                  title : 'I\'m the title!',
                message : 'Sssssh!',
                  sound : null,
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithDefaultSound: function () {
            this.notify({
                     id : '2', // you don't have to use an int by the way.. '1a' or just 'a' would be fine
                  title : 'Sorry for the noise',
                message : 'Unless you have sound turned off',
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithData: function () {
            this.notify({
                     id : 3,
                message : 'I have data, click me to see it',
                   json : JSON.stringify({ test: 123 }),
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithBadge: function () {
            this.notify({
                     id : 4,
                  title : 'Your app now has a badge',
                message : 'Clear it by clicking the \'Cancel all\' button',
                  badge : 1,
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithSoundEveryMinute: function () {
            this.notify({
                     id : 5,
                  title : 'I will bother you every minute',
                message : '.. until you cancel all notifications',
                 repeat : 'minutely',
             autoCancel : false,
                   date : this.getNowPlus10Seconds()
            });
        },

        cancelAll: function () {
            if (!this.checkSimulator()) {
                window.plugin.notification.local.cancelAll(function() {alert('ok, all cancelled')});
            }
        },
         
        getScheduledNotificationIDs: function () {
            if (!this.checkSimulator()) {
                window.plugin.notification.local.getScheduledIds(function (scheduledIds) {
                    navigator.notification.alert(scheduledIds.join(', '), null, 'Scheduled Notification ID\'s', 'Close');
                })
            }
        },
         
        notify: function (payload) {
            if (!this.checkSimulator()) {
                window.plugin.notification.local.add(payload, function(){alert('ok, scheduled')});
            }
        },

        getNowPlus10Seconds: function () {
            return new Date(new Date().getTime() + 10*1000);
        },

        checkSimulator: function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.plugin === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);
