"use strict";angular.module("xltecApp",["angular-jwt","ui.bootstrap","ngAnimate","ngResource","ngRoute","ngTouch","ngSanitize","uiSwitch","chart.js","smart-table","angularjs-dropdown-multiselect","ui.bootstrap.datetimepicker","rt.select2","pascalprecht.translate","tmh.dynamicLocale"]).config(["$routeProvider","$httpProvider","$translateProvider","tmhDynamicLocaleProvider",function(a,b,c,d){b.interceptors.push("tokenInterceptor"),b.defaults.headers.common["x-auth-token"]=localStorage.getItem("token")||"",c.preferredLanguage("es_CR"),d.localeLocationPattern("bower_components/angular-i18n/angular-locale_{{locale}}.js"),a.when("/",{templateUrl:"views/main.html",controller:"MainController"}).when("/404",{templateUrl:"404.html"}).when("/users",{templateUrl:"views/users.html",controller:"userController"}).when("/login",{templateUrl:"views/login.html",controller:"LoginController"}).when("/devices",{templateUrl:"views/devices.html",controller:"DevicesController"}).when("/permissions",{templateUrl:"views/permissions.html",controller:"PermissionsController"}).when("/processes",{templateUrl:"views/processes.html",controller:"ProcessesController"}).when("/codes",{templateUrl:"views/codes.html",controller:"CodesController"}).otherwise({redirectTo:"/404"})}]).constant("LOCALES",{locales:{es_CR:"Español"},preferredLocale:"es_CR"}),angular.module("xltecApp").controller("MainController",["$scope","$http","config",function(a,b,c){a.graphs=[],b.get(c.backEnd+"users/auditors/json").then(function(a){return Promise.all(a.data.map(function(a){return b.get(c.backEnd+"process/report/"+a.username.substring(0,2)+"?name="+a.name)}))}).then(function(b){b.forEach(function(b){a.graphs.push({user:Object.keys(b.data)[0],processes:{titles:Object.keys(b.data).map(function(a){return b.data[a].map(function(a){return Object.keys(a)[0]})})[0],data:Object.keys(b.data).map(function(a){return b.data[a].map(function(a){return Object.keys(a).map(function(b){return a[b]})[0]})})[0]}})})})}]),angular.module("xltecApp").controller("userController",["$scope","$http","config","$uibModal","sharedProperties","authManager",function(a,b,c,d,e,f){function g(){b.get(c.backEnd+"users").then(function(b){a.users=b.data,e.setter(null)})}a.isAdmin=f.isAdmin(),g(),a.openModal=function(a){e.setter(null),a&&e.setter(a);var f=d.open({templateUrl:"modal.html",controller:"userModalController"});f.result.then(function(d){d.allowedDevices=d.allowedDevices.map(function(a){return Object.keys(a).map(function(b){return a[b]})[0]}),d.roles=d.roles.map(function(a){return Object.keys(a).map(function(b){return a[b]})[0]}),a?b.put(c.backEnd+"users/"+a.username,JSON.stringify(d)).then(g):b.post(c.backEnd+"users",d,{headers:{"Content-type":"application/json"}}).then(g,function(a){console.error(a)})})},a["delete"]=function(a){var e=d.open({templateUrl:"views/confirmModal.html",controller:"ConfirmModalController"});e.result.then(function(){b["delete"](c.backEnd+"users/"+a).then(g)})}}]).controller("userModalController",["$scope","$uibModalInstance","$http","config","sharedProperties","authManager",function(a,b,c,d,e,f){a.form={allowedDevices:[],roles:[]},a.isAdmin=f.isAdmin();var g=e.getter();g&&(a.form={name:g.name,username:g.username,allowedDevices:g.allowedDevices.map(function(a){return{id:a._id}}),roles:g.roles.map(function(a){return{id:a}})}),a.translations={checkAll:"Seleccionar todos",uncheckAll:"Quitar todos",buttonDefaultText:"Seleccione los valores deseados",dynamicButtonTextSuffix:"seleccionado(s)"},a.devices=[],a.roles=[{id:"admin",label:"Administrador"},{id:"gestor",label:"Gestor de Procesos"},{id:"audit",label:"Auditor"},{id:"other",label:"Otro"}],c.get(d.backEnd+"devices").then(function(b){a.devices=b.data.map(function(a){return{id:a._id,label:a.name}})}),a.addUser=function(a){b.close(a)},a.cancel=function(){b.dismiss()}}]).controller("ConfirmModalController",["$scope","$uibModalInstance",function(a,b){a.yes=function(){b.close()},a.no=function(){b.dismiss()}}]),angular.module("xltecApp").controller("NavBarController",["$scope","$location","jwtHelper","authManager","$uibModal",function(a,b,c,d,e){function f(){return localStorage.getItem("token")?!c.isTokenExpired(localStorage.getItem("token")):!1}a.isActive=function(a){return a===b.path()},a.isAdmin=d.isAdmin(),a.isGestor=d.isGestor(),a.isLoginPage=function(){return"/login"===b.path()},a.$on("$routeChangeSuccess",function(){return f()?a.isLoginPage()&&f()?b.path("/"):a.isLoginPage()||f()?void(a.user=c.decodeToken(localStorage.getItem("token")).name):b.path("/login"):b.path("/login")}),a.isOpen=function(){return!a.opened},a.toggle=function(){a.opened=!a.opened},a.logout=function(){localStorage.removeItem("token"),b.path("/login")},a.changePassword=function(){e.open({templateUrl:"views/modalChangePassword.html",controller:"credentialsController"})}}]).controller("credentialsController",["$scope","$uibModalInstance","$http","config","jwtHelper",function(a,b,c,d,e){a.form={},a.changePassword=function(f){if(f.old)if(f["new"])if(f.repeat)if(f["new"]!==f.repeat)a.err="La contraseña nueva no es idéntica en ambos campos";else if(f["new"]===f.old)a.err="La contraseña nueva no puede ser idéntica a la anterior";else{var g=e.decodeToken(localStorage.getItem("token")).username;c.patch(d.backEnd+"users/"+g,f,{headers:{"Content-type":"application/json"}}).then(function(){b.close()},function(b){a.err=b.data.message})}else a.err="Debe repetir la nueva contraseña";else a.err="La contraseña nueva es un campo requerido";else a.err="La contraseña actual es un campo requerido"}}]),angular.module("xltecApp").filter("currentYear",["$filter",function(a){return function(){return a("date")(new Date,"yyyy")}}]),angular.module("xltecApp").controller("LoginController",["$scope","$http","$location","config",function(a,b,c,d){a.status=!1,a.login=function(e){b.post(d.backEnd+"login",{username:e.Usuario.$modelValue,password:e.Contraseña.$modelValue,rememberMe:a.status},{headers:{"Content-type":"application/json"}}).then(function(a){localStorage.setItem("token",a.headers("x-auth-token")),c.path("/")})}}]),angular.module("xltecApp").animation(".alert",function(){return{enter:function(a,b){return a.css("display","none").fadeIn(750,b),function(){a.stop()}},leave:function(a,b){return a.fadeOut(1e3,b),function(){a.stop()}}}}),angular.module("xltecApp").constant("config",{backEnd:"//xltec.herokuapp.com/api/"}),angular.module("xltecApp").filter("roles",function(){return function(a){switch(a){case"admin":return"Administrador";case"gestor":return"Gestor  de Procesos";case"audit":return"Auditor";case"other":return"Otro";default:return a}}}),angular.module("xltecApp").service("sharedProperties",function(){var a={};return{getter:function(){return a},setter:function(b){a=b}}}),angular.module("xltecApp").controller("DevicesController",["$scope","$http","config","authManager","$uibModal","sharedProperties",function(a,b,c,d,e,f){function g(){b.get(c.backEnd+"devices").then(function(b){a.devices=b.data})}a.devices=[],a.isAdmin=d.isAdmin(),a.isGestor=d.isGestor(),g(),a.openModal=function(a){f.setter(null),a&&f.setter(a);var d=e.open({templateUrl:"modal.html",controller:"devicesModalController"});d.result.then(function(d){a?b.put(c.backEnd+"devices/"+a._id,JSON.stringify(d)).then(g):b.post(c.backEnd+"devices",d,{headers:{"Content-type":"application/json"}}).then(g,function(a){console.error(a)})})},a["delete"]=function(a){var d=e.open({templateUrl:"views/confirmModal.html",controller:"ConfirmModalController"});d.result.then(function(){b["delete"](c.backEnd+"devices/"+a).then(g)})}}]).controller("devicesModalController",["$scope","authManager","$uibModalInstance","sharedProperties",function(a,b,c,d){a.isAdmin=b.isAdmin(),a.isGestor=b.isGestor(),a.form={};var e=d.getter();e&&(a.form={name:e.name,mac:e.mac}),a.addDevice=function(a){c.close(a)},a.cancel=function(){c.dismiss()}}]),angular.module("xltecApp").service("authManager",["jwtHelper",function(a){var b=!1;return b=localStorage.getItem("token")?a.decodeToken(localStorage.getItem("token")).roles.indexOf("admin")>-1:!1,{isAdmin:function(){return localStorage.getItem("token")?a.decodeToken(localStorage.getItem("token")).roles.indexOf("admin")>-1:!1},isGestor:function(){return localStorage.getItem("token")?a.decodeToken(localStorage.getItem("token")).roles.indexOf("gestor")>-1:!1},isAudit:function(){return localStorage.getItem("token")?a.decodeToken(localStorage.getItem("token")).roles.indexOf("gestor")>-1:!1}}}]),angular.module("xltecApp").directive("macAddress",function(){return{restrict:"E",template:['<div class="form-group" ng-if="isAdmin || isGestor">',"<label>MAC</label>",'<input class="form-control" placeholder="00:00:00:00:00:00" name="mac" ng-model="form.mac" ng-pattern="/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/" required>',"</div>",'<div class="form-group">','<div class=" alert" ng-class="{\'alert-danger\': formulario.$error.pattern}">','{{ formulario.$error.pattern ? "El formato de la MAC es invalido." : ""}}',"</div>","</div>"].join(""),link:function(){}}}),angular.module("xltecApp").controller("PermissionsController",["$scope","$http","authManager","config","$uibModal","sharedProperties",function(a,b,c,d,e,f){function g(){b.get(d.backEnd+"permissions").then(function(b){a.permissions=b.data})}a.isAdmin=c.isAdmin(),a.isGestor=c.isGestor(),a.permissions=[],g(),a.openModal=function(a){f.setter(null),a&&f.setter(a);var c=e.open({templateUrl:"modal.html",controller:"permissionModalController"});c.result.then(function(c){c.users=c.users.map(function(a){return a.id}),a?b.put(d.backEnd+"permissions/"+a._id,JSON.stringify(c)).then(g):b.post(d.backEnd+"permissions",c,{headers:{"Content-type":"application/json"}}).then(g,function(a){console.error(a)})})},a["delete"]=function(a){var c=e.open({templateUrl:"views/confirmModal.html",controller:"ConfirmModalController"});c.result.then(function(){b["delete"](d.backEnd+"permissions/"+a).then(g)})}}]).controller("permissionModalController",["$scope","authManager","$uibModalInstance","sharedProperties","$http","config",function(a,b,c,d,e,f){a.isAdmin=b.isAdmin(),a.isGestor=b.isGestor(),a.form={users:[]},a.auditors=[],e.get(f.backEnd+"users/auditors/json").then(function(b){a.auditors=b.data.map(function(a){return{id:a._id,label:a.name}})});var g=d.getter();g&&(a.form={from:new Date(g.from),until:new Date(g.until),users:g.users.map(function(a){return{id:a._id}})}),a.addPermission=function(b){b.from>b.until?a.err="La fecha desde no puede estar posterior a hasta":b.from.getTime()===b.until.getTime()?a.err="Desde y hasta no pueden ser iguales":c.close(b)},a.cancel=function(){c.dismiss()},a.translations={checkAll:"Seleccionar todos",uncheckAll:"Quitar todos",buttonDefaultText:"Seleccione los valores deseados",dynamicButtonTextSuffix:"seleccionado(s)"},a.open=function(b){b.preventDefault(),b.stopPropagation(),a.dateOpened=!0},a.dateOptions={showWeeks:!1}}]),angular.module("xltecApp").controller("ProcessesController",["$scope","authManager","$location","$http","config",function(a,b,c,d,e){b.isAdmin()||b.isGestor()||c.path("/404"),a.processData=[],a.processes=[{id:"migration",name:"Migración"},{id:"baggage",name:"Equipaje"},{id:"customs",name:"Aduanas"},{id:"entrance",name:"Seguimiento de Entrada"},{id:"taxes",name:"Impuestos"},{id:"checkIn",name:"CheckIn"},{id:"security",name:"Seguridad"},{id:"xRays",name:"Rayos X"},{id:"commercial",name:"Seguimiento Comercial"},{id:"boarding",name:"Abordaje"},{id:"departure",name:"Seguimiento de Salida"}],a.$watch("selected",function(){a.selected&&(a.processData=[],d.get(e.backEnd+"process/"+a.selected).then(function(b){a.processData=b.data}))}),a.getData=function(){return Object.keys(a.processData).map(function(b){return a.processData[b]})},a.getHeaders=function(){return Object.keys(a.processData)},a.download=function(a){location.href=e.backEnd+"process/"+a+"/xlsx"},a["delete"]=function(b){d["delete"](e.backEnd+"process/"+b).then(function(){a.processData=[]})}}]),angular.module("xltecApp").filter("oadate",function(){return function(a){return moment.fromOADate(a).format("DD/MM/YYYY h:mm:ss a")}}),angular.module("xltecApp").controller("CodesController",["$scope","$http","config","authManager","sharedProperties","$uibModal",function(a,b,c,d,e,f){function g(){b.get(c.backEnd+"codes").then(function(b){a.codes=b.data})}a.codes=[],a.isAdmin=d.isAdmin(),a.isGestor=d.isGestor(),a.$on("$viewContentLoaded",g),a.openModal=function(a){e.setter(null),a&&e.setter(a);var b=f.open({templateUrl:"modal.html",controller:"codesModalController"});b.result.then(g)},a["delete"]=function(a){var d=f.open({templateUrl:"views/confirmModal.html",controller:"ConfirmModalController"});d.result.then(function(){b["delete"](c.backEnd+"codes/"+a).then(g)})}}]).controller("codesModalController",["$scope","authManager","$uibModalInstance","sharedProperties","$http","config",function(a,b,c,d,e,f){a.form={},a.processes=[{id:"Migración",name:"Migración"},{id:"Equipaje",name:"Equipaje"},{id:"Aduanas",name:"Aduanas"},{id:"Seguimiento Entrada",name:"Seguimiento de Entrada"},{id:"Impuestos",name:"Impuestos"},{id:"CheckIn",name:"CheckIn"},{id:"Seguridad",name:"Seguridad"},{id:"Rayos X",name:"Rayos X"},{id:"Seguimiento Comercial",name:"Seguimiento Comercial"},{id:"Abordaje",name:"Abordaje"},{id:"Seguimiento Salida",name:"Seguimiento de Salida"}];var g=d.getter();g&&(a.form={code:g.code,observation:g.observation,process:g.process}),a.addCode=function(b){b.code?b.observation?b.process?g?e.put(f.backEnd+"codes/"+g._id,JSON.stringify(b)).then(function(a){c.close(a.data)},function(a){console.error(a)}):e.post(f.backEnd+"codes",b,{headers:{"Content-type":"application/json"}}).then(function(a){c.close(a.data)},function(a){console.error(a)}):a.err="Debe especificar un proceso para el código":a.err="Debe darle una descripción al código":a.err="Debe especificar un código"},a.cancel=function(){c.dismiss()}}]),function(){var a="undefined"==typeof require||null===require||require.amd?this.moment:require("moment");a.fromOADate=function(b){var c=new Date(864e5*(b-25569)),d=c.getTimezoneOffset();return c=new Date(864e5*(b-25569+d/1440)),a(c)},a.fn.toOADate=function(a){a=a||this._d||new Date;var b=a.getTimezoneOffset()/1440,c=a.getTime()/864e5+(25569-b);return c}}.call(this),angular.module("xltecApp").factory("tokenInterceptor",["$q",function(a){return{response:function(a){return a.headers("x-auth-token")&&localStorage.setItem("token",a.headers("x-auth-token")),a},responseError:function(b){return a.reject(b)}}}]),angular.module("xltecApp").run(["$templateCache",function(a){a.put("views/codes.html",'<div class="container"> <div class="row"> <h1 class=""> <span>C&oacute;digos</span> <button class="btn btn-transparent fa fa-plus-circle" ng-click="openModal()" uib-tooltip="Agregar permiso" ng-if="isAdmin || isGestor"> </button> </h1> </div> <div class="row"> <!--<div class="col-md-4 form-group">\n            <div class="input-group">\n                <div class="input-group-addon">\n                    <span class="fa fa-search"></span>\n                </div>\n                <input type="text" placeholder="B&uacute;squeda" uib-tooltip="Puede buscar por cualquiera de los p&aacute;rametros de la tabla" class="form-control" ng-model="search"/>\n                <div class="input-group-addon">\n                    <a style="text-decoration: none;" ng-click="search = \'\'" class="fa fa-close"></a>\n                </div>\n            </div>\n        </div>--> <div class="col-md-8 col-md-offset-2"> <table st-table="displayed" st-safe-src="codes" class="table table-hover table-striped table-responsive"> <thead> <tr> <th st-sort="code">C&oacute;digo</th> <th>Observación</th> <th st-sort="process">Proceso</th> <th></th> </tr> <tr> <th> <input st-search="code" placeholder="Buscar por código" class="input-sm form-control" type="search"> </th> <th> <input st-search="observation" placeholder="Buscar por observación" class="input-sm form-control" type="search"> </th> <th> <input st-search="process" placeholder="Buscar por proceso" class="input-sm form-control" type="search"> </th> </tr> </thead> <tbody> <tr ng-repeat="code in displayed | filter:search" ng-if="codes.length > 0"> <td class="col-md-2">{{ code.code }}</td> <td class="col-md-4">{{ code.observation }}</td> <td class="col-md-2">{{ code.process }}</td> <td class="col-md-2"> <a ng-if="isAdmin || isGestor" ng-click="openModal(code)" class="col-md-2 col-xs-6" uib-tooltip="Editar dispositivo"> <i class="glyphicon glyphicon-pencil"></i> </a> <a ng-if="isAdmin" ng-click="delete(code._id)" class="col-md-2 col-md-offset-2 col-xs-6 col-xs-offset-0" uib-tooltip="Eliminar dispositivo"> <i class="glyphicon glyphicon-trash" style="color: rgb(210,50,50)"></i> </a> </td> </tr> <tr ng-if="codes.length === 0"> <td colspan="4"> <p class="text-center"> No hay c&oacute;digos registrados en este momento </p> </td> </tr> </tbody> <tfoot> <tr> <td colspan="4" class="text-right"> <div st-pagination st-items-by-page="10" st-displayed-pages="5"></div> </td> </tr> </tfoot> </table> </div> </div> </div> <script type="text/ng-template" id="modal.html"><div class="modal-header">\n        <h3>{{form.name ? \'Actualizar\' : \'Agregar\'}} dispositivo</h3>\n    </div>\n    <div class="modal-body">\n        <form name="formulario">\n            <div class="form-group">\n                <label>C&oacute;digo</label>\n                <input class="form-control" placeholder="C&oacute;digo" ng-model="form.code" autofocus>\n            </div>\n            <div class="form-group">\n                <label>Observaci&oacute;n</label>\n                <input class="form-control" placeholder="C&oacute;digo" ng-model="form.observation">\n            </div>\n            <div class="form-group">\n                <label>Proceso</label>\n                <select2 class="col-md-12" ng-model="form.process" s2-options="process.id as process.name for process in processes"></select2>\n            </div>\n            <div class="form-group">\n                <div class="alert alert-danger" ng-class="{hidden: !err}">\n                    {{err}}\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" type="submit" ng-click="addCode(form)">{{form.name ? \'Actualizar\' : \'Agregar\'}}</button>\n        <button class="btn btn-default" type="button" ng-click="cancel()">Cancelar</button>\n    </div></script>'),a.put("views/confirmModal.html",'<div class="modal-body"> <p>¿Realmente desea eliminar este elemento?</p> </div> <div class="modal-footer"> <button class="btn btn-danger" type="button" ng-click="yes()">Sí</button> <button class="btn btn-success" type="button" ng-click="no()">No</button> </div>'),a.put("views/devices.html",'<div class="container"> <div class="row"> <h1 class=""> <span>Dispositivos</span> <button class="btn btn-transparent fa fa-plus-circle" ng-click="openModal()" uib-tooltip="Agregar permiso" ng-if="isAdmin || isGestor"> </button> </h1> </div> <div class="row"> <div class="col-md-8 col-md-offset-2"> <table st-table="displayed" st-safe-src="devices" class="table table-hover table-striped table-responsive"> <thead> <tr> <th st-sort="name" style="cursor: pointer">Nombre</th> <th st-sort="mac" style="cursor: pointer">Mac</th> <th>Usuarios Asociados</th> <th></th> </tr> </thead> <tbody> <tr ng-repeat="device in displayed" ng-if="devices.length > 0"> <td>{{device.name}}</td> <td>{{device.mac}}</td> <td> <p ng-if="device.linkedUsers.length > 0" ng-repeat="user in device.linkedUsers"> {{user.name}} </p> <p ng-if="device.linkedUsers.length === 0"> No tiene usuarios asociados </p> </td> <td> <a ng-if="isAdmin || isGestor" ng-click="openModal(device)" class="col-md-2 col-xs-6" uib-tooltip="Editar dispositivo"> <i class="glyphicon glyphicon-pencil"></i> </a> <a ng-if="isAdmin" ng-click="delete(device.mac)" class="col-md-2 col-md-offset-2 col-xs-6 col-xs-offset-0" uib-tooltip="Eliminar dispositivo"> <i class="glyphicon glyphicon-trash" style="color: rgb(210,50,50)"></i> </a> </td> </tr> <tr ng-if="devices.length === 0"> <td colspan="4"> <p class="text-center"> No hay dispositivos registrados </p> </td> </tr> </tbody> </table> </div> </div> </div> <script type="text/ng-template" id="modal.html"><div class="modal-header">\n        <h3>{{form.name ? \'Actualizar\' : \'Agregar\'}} dispositivo</h3>\n    </div>\n    <div class="modal-body">\n        <form name="formulario">\n            <div class="form-group" ng-if="isAdmin || isGestor">\n                <label>Nombre</label>\n                <input class="form-control" placeholder="Nombre" ng-model="form.name" required autofocus>\n            </div>\n            <mac-address></mac-address>\n        </form>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" type="button" ng-click="addDevice(form)">{{form.name ? \'Actualizar\' : \'Agregar\'}}</button>\n        <button class="btn btn-default" type="button" ng-click="cancel()">Cancelar</button>\n    </div></script>'),a.put("views/login.html",'<style type="text/css">body {\n        background: #eee !important;\n    }\n\n    .wrapper {\n        margin-top: 80px;\n        margin-bottom: 80px;\n    }\n\n    .form-signin {\n        max-width: 380px;\n        padding: 15px 35px 45px;\n        margin: 0 auto;\n        background-color: #fff;\n        border: 1px solid rgba(0, 0, 0, 0.1);\n    }\n    .form-signin .form-signin-heading,\n    .form-signin .checkbox {\n        margin-bottom: 30px;\n    }\n    .form-signin .checkbox {\n        font-weight: normal;\n    }\n    .form-signin .form-control {\n        position: relative;\n        font-size: 16px;\n        height: auto;\n        padding: 10px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n    }\n    .form-signin .form-control:focus {\n        z-index: 2;\n    }\n    .form-signin input[type="text"] {\n        margin-bottom: -1px;\n        border-bottom-left-radius: 0;\n        border-bottom-right-radius: 0;\n    }\n    .form-signin input[type="password"] {\n        margin-bottom: 20px;\n        border-top-left-radius: 0;\n        border-top-right-radius: 0;\n    }\n    .btn span{\n        position: relative;\n        left: -35% !important;\n        transition: 1s;\n    }\n    .btn:hover span{\n        left: 35% !important;\n        transition: 1s;\n    }</style> <div class="wrapper"> <form name="loginForm" class="form-signin" ng-submit="login(loginForm)"> <h2 class="form-signin-heading">Iniciar Sesión</h2> <input type="text" ng-model="username" class="form-control" name="Usuario" placeholder="Usuario" required autofocus> <input type="password" ng-model="password" class="form-control" name="Contraseña" placeholder="Contrase&ntilde;a" required> <switch id="rememberMe" name="rememberMe" ng-model="status" on="Sí" off="No" class="green"></switch> <button class="btn btn-lg btn-primary btn-block" type="submit"> <span> Entrar <i class="glyphicon glyphicon-arrow-right"></i> </span> </button> <div style="margin-top: 2rem" ng-if="loginForm.$error.required" ng-messages="loginForm.$error" class="alert alert-danger" role="alert"> <div ng-repeat="error in loginForm.$error.required" ng-message="required"> {{error.$name}} es un campo requerido </div> </div> </form> </div>'),a.put("views/main.html",'<div class="container"> <h1>Variables Operativas</h1> <div class="col-md-4" ng-repeat="data in graphs"> <div> <p class="text-center">{{ data.user }}</p> <hr> <canvas class="chart chart-doughnut" ng-if="data.processes.titles.length > 0" chart-data="data.processes.data" chart-labels="data.processes.titles" chart-legend="true"> </canvas> <div ng-if="data.processes.titles.length === 0"> <p class="text-center">No presenta datos</p> </div> <hr> </div> </div> </div>'),a.put("views/modalChangePassword.html",'<div class="modal-header"> <h3> Cambiar contrase&ntilde;a</h3> </div> <div class="modal-body"> <form name="credentialsForm"> <div class="form-group"> <label>Contrase&ntilde;a actual</label> <input name="oldPass" type="password" ng-model="form.old" class="form-control" placeholder="Actual"> </div> <div class="form-group"> <label>Nueva Contraseña</label> <input name="newPass" type="password" ng-model="form.new" class="form-control" placeholder="Nueva"> </div> <div class="form-group"> <label>Usuarios permitidos</label> <input name="repeatPass" type="password" ng-model="form.repeat" class="form-control" placeholder="Repita"> </div> <div class="form-group"> <div class="alert alert-danger" ng-if="err" role="alert"> {{err}} </div> </div> </form> </div> <div class="modal-footer"> <button class="btn btn-primary" type="button" ng-click="changePassword(form)">Cambiar</button> <button class="btn btn-default" type="button" ng-click="cancel()">Cancelar</button> </div>'),a.put("views/permissions.html",'<div class="container"> <div class="row"> <h1 class=""> <span>Permisos</span> <button class="btn btn-transparent fa fa-plus-circle" ng-click="openModal()" uib-tooltip="Agregar permiso" ng-if="isAdmin || isGestor"> </button> </h1> </div> <div class="row"> <div class="col-md-8 col-md-offset-2"> <table st-table="displayed" st-safe-src="permissions" class="table table-hover table-striped table-responsive"> <thead> <tr> <th st-sort="from" style="cursor: pointer">Desde</th> <th st-sort="until" style="cursor: pointer">Hasta</th> <th>Usuarios Permitidos</th> <th></th> </tr> </thead> <tbody> <tr ng-repeat="permission in displayed" ng-if="permissions.length > 0"> <td>{{permission.from | date:\'dd/MM/yyyy\'}}</td> <td>{{permission.until | date:\'dd/MM/yyyy\'}}</td> <td> <p ng-if="permission.users.length > 0" ng-repeat="user in permission.users"> {{user.name}} </p> <p ng-if="permission.users.length === 0"> No hay usuarios permitidos </p> </td> <td> <a ng-if="isAdmin || isGestor" ng-click="openModal(permission)" class="col-md-2 col-xs-6" uib-tooltip="Editar permiso"> <i class="glyphicon glyphicon-pencil"></i> </a> <a ng-if="isAdmin" ng-click="delete(permission._id)" class="col-md-2 col-md-offset-2 col-xs-6 col-xs-offset-0" uib-tooltip="Eliminar permiso"> <i class="glyphicon glyphicon-trash" style="color: rgb(210,50,50)"></i> </a> </td> </tr> <tr ng-if="permissions.length === 0"> <td colspan="4"> <p class="text-center"> No hay permisos registrados </p> </td> </tr> </tbody> </table> </div> </div> </div> <script type="text/ng-template" id="modal.html"><div class="modal-header">\n        <h3> {{form.from ? \'Actualizar\' : \'Agregar\'}} Permiso</h3>\n    </div>\n    <div class="modal-body">\n        <form name="formulario">\n            <div class="form-group" ng-if="isAdmin || isGestor">\n                    <label>Desde</label>\n                    <datetimepicker class="col-md-12"\n                                    hour-step="1"\n                                    minute-step="5" ng-model="form.from" show-meridian="true"\n                                    date-format="dd/MM/yyyy" date-options="dateOptions"\n                                    datepicker-append-to-body="false"\n                                    readonly-time="true"\n                                    readonly-date="false"\n                                    name="datetimepicker"\n                                    show-spinners="true"\n                                    current-text="Hoy"\n                                    clear-text="Limpiar"\n                                    close-text="Cerrar">\n                    </datetimepicker>\n            </div>\n            <div class="form-group" ng-if="isAdmin || isGestor">\n                    <label>Hasta</label>\n                    <datetimepicker class="col-md-12"\n                                    hour-step="1"\n                                    minute-step="5" ng-model="form.until" show-meridian="true"\n                                    date-format="dd/MM/yyyy" date-options="dateOptions"\n                                    datepicker-append-to-body="false"\n                                    readonly-date="false"\n                                    hidden-time="false"\n                                    hidden-date="false"\n                                    name="datetimepicker"\n                                    show-spinners="true"\n                                    current-text="Hoy"\n                                    clear-text="Limpiar"\n                                    close-text="Cerrar">\n                    </datetimepicker>\n            </div>\n            <div class="form-group">\n                <label>Usuarios permitidos</label>\n                <div ng-dropdown-multiselect required\n                     options="auditors"\n                     selected-model="form.users"\n                     translation-texts="translations"\n                     checkboxes="true">\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="alert alert-danger" ng-class="{hidden: !err}">\n                    {{err}}\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" type="button" ng-click="addPermission(form)">{{form.from ? \'Actualizar\' : \'Agregar\'}}</button>\n        <button class="btn btn-default" type="button" ng-click="cancel()">Cancelar</button>\n    </div></script>'),a.put("views/processes.html",'<div class="container"> <div class="row"> <h1 class=""> <span>Procesos</span> </h1> </div> <div class="row"> <div class="col-md-4"> <select2 class="col-md-12" ng-model="selected" s2-options="process.id as process.name for process in processes"></select2> </div> <div class="col-md-3 col-md-offset-5"> <div class="btn-group"> <button ng-click="download(selected)" uib-tooltip="Descargar datos" class="btn btn-success" ng-class="{disabled: processData.length == 0}"> <i class="fa fa-download"></i> </button> <button ng-click="delete(selected)" uib-tooltip="Eliminar datos" class="btn btn-danger" ng-class="{disabled: processData.length == 0}"> <i class="fa fa-trash-o"></i> </button> </div> </div> <div class="col-md-8 col-md-offset-2"> <table st-table="displayed" st-safe-src="processData" class="table table-hover table-striped table-responsive"> <thead> <tr> <th>Auditor</th> <th>Fecha</th> <th>Proceso</th> </tr> </thead> <tbody> <tr ng-repeat="data in displayed" ng-if="processData.length > 0"> <td>{{data.auditor}}</td> <td>{{data.date | oadate}}</td> <td>{{data.process}}</td> </tr> <tr ng-if="processData.length === 0"> <td colspan="4"> <p class="text-center"> No hay procesos registrados en este momento </p> </td> </tr> </tbody> </table> </div> </div> </div> <script type="text/ng-template" id="confirmDelete"><div class="modal-body">\n        <p>¿Realmente desea eliminar los datos de {{process}}?</p>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-danger" type="button" ng-click="yes()">Sí</button>\n        <button class="btn btn-success" type="button" ng-click="no()">No</button>\n    </div></script>'),a.put("views/users.html",'<div class="container"> <div class="row"> <h1 class=""> <span>Usuarios</span> <button class="btn btn-transparent fa fa-plus-circle" ng-click="openModal()" uib-tooltip="Agregar permiso" ng-if="isAdmin || isGestor"> </button> </h1> </div> <div class="row"> <div class="col-md-8 col-md-offset-2"> <table st-table="displayed" st-safe-src="users" class="table table-hover table-striped table-responsive"> <thead> <tr> <th st-sort="username" style="cursor: pointer">Usuario</th> <th st-sort="name" style="cursor: pointer">Nombre</th> <th>Dispositivos permitidos</th> <th>Roles</th> <th></th> </tr> </thead> <tbody> <tr ng-repeat="user in displayed"> <td>{{user.username}}</td> <td>{{user.name}}</td> <td> <p ng-if="user.allowedDevices.length > 0" ng-repeat="device in user.allowedDevices"> {{device.name}} </p> <p ng-if="user.allowedDevices.length === 0"> No tiene dispositivos asociados </p> </td> <td> <p ng-repeat="role in user.roles">{{role | roles}}</p> </td> <td> <a ng-if="isAdmin || isGestor" ng-click="openModal(user)" class="col-md-2 col-xs-6" uib-tooltip="Editar usuario"> <i class="glyphicon glyphicon-pencil"></i> </a> <a ng-if="isAdmin" ng-click="delete(user.username)" class="col-md-2 col-md-offset-2 col-xs-6 col-xs-offset-0" uib-tooltip="Eliminar usuario"> <i class="glyphicon glyphicon-trash" style="color: rgb(210,50,50)"></i> </a> </td> </tr> </tbody> </table> </div> </div> </div> <script type="text/ng-template" id="modal.html"><div class="modal-header">\n        <h3>{{form.name ? \'Actualizar\' : \'Agregar\'}} usuario</h3>\n    </div>\n    <div class="modal-body">\n        <form>\n            <input type="text" name="fakeFieldUsername" hidden>\n            <input type="password" name="fakeFieldPassword" hidden>\n            <div class="form-group" ng-if="isAdmin">\n                <label>Nombre</label>\n                <input class="form-control" placeholder="Nombre" ng-model="form.name" required autofocus>\n            </div>\n            <div class="form-group" ng-if="isAdmin">\n                <label>Username</label>\n                <input class="form-control" placeholder="Username" ng-model="form.username" required>\n            </div>\n            <div class="form-group" ng-if="isAdmin">\n                <label>Contraseña</label>\n                <input type="password" class="form-control" placeholder="Contraseña" ng-model="form.password" required>\n            </div>\n            <div class="form-group">\n                <label>Dispositivos permitidos</label>\n                <div ng-dropdown-multiselect required\n                     options="devices"\n                     selected-model="form.allowedDevices"\n                     translation-texts="translations"\n                     checkboxes="true">\n                </div>\n            </div>\n            <div class="form-group" ng-if="isAdmin">\n                <label>Roles</label>\n                <div ng-dropdown-multiselect required\n                     options="roles"\n                     selected-model="form.roles"\n                     translation-texts="translations"\n                     checkboxes="true">\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" type="button" ng-click="addUser(form)">{{form.name ? \'Actualizar\' : \'Agregar\'}}</button>\n        <button class="btn btn-default" type="button" ng-click="cancel()">Cancelar</button>\n    </div></script>');
}]);