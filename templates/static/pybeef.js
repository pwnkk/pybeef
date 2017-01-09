if(typeof pybeef === "undefined" && typeof window.pybeef === "undefined"){
	var pybeef = {
		version : "1.0",
		//要执行的命令
		commands : new Array(),
		//
		components : new Array(),

		execute : function(fn) {
			if( typeof pybeef.websocket == "undefined"){
				this.commands.push(fn);
			}
			else{
				fn();
			}
		},

		regcmp : function(component){
			this.components.push(component);
		}
	};
}
