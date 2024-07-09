import { mainConent } from './transform_main.js';
import { LineSplitter } from './js/LineSplitter.js';

export function transform(hash, node, navigation) 
{
    const content = $("#content");

	// Primera parte del contenido	
	content.append(mainConent);
	
	// Para debug
	/*
	let result = $("<div class='container-fluid'>");
	result.append("<h2>HASH: " + hash + "</h2>");
	let pre = $("<pre>").text(node.toString());
	result.append(pre);
	content.append(result);
	*/
	
	// Insertamos childs
	const innerContent = $("#inner_content");
	const childs = node.getChilds();
	let code = 0;
	let plantuml = 0;
	for(let i = 0; i<childs.length; i++)
	{
		let child = childs[i];
		renderChild(child, innerContent);
	}
	
	// Insertamos navegación
	insertNavigation(navigation);
}

function renderChild(child, parent)
{
	const name = child.getName();
	const text = child.getText();
	const childs = child.getChilds();
	
	if(name == "h1" || name == "title")
	{
		$("<h1>").text(text).appendTo(parent);
	}
	else if(name == "h2")
	{
		$("<h2>").text(text).appendTo(parent);
	}
	else if(name == "h3")
	{
		$("<h3>").text(text).appendTo(parent);
	}
	else if(name == "text")
	{
		$("<div>").html(marked.parse(text)).appendTo(parent);
	}
	else if(name == "alert")
	{
		$("<div class='alerta'>").html(marked.parse(text)).appendTo(parent);
	}
	else if(name == "assert")
	{
		$("<div class='assert'>").html(marked.parse(text)).appendTo(parent);
	}
	else if(name == "code")
	{
		makeCode(text, parent);
	}
	else if(name == "plantuml")
	{
		$("<img>").attr("uml", text).appendTo(parent);
	}
	else if (name == "part")
	{
		$("<h3>").text(text).appendTo(parent);
		
		// Childs
		let ul = $("<ul>").appendTo(parent);
		for(let i = 0; i<childs.length; i++)
		{
			let ch = renderTema(childs[i]);
			ch.appendTo(ul);
		}		
	}
	else
	{
		$("<pre>").text(child.toString()).appendTo(parent);
	}
}

function renderTema(child)
{
	let text = child.getText();
	let lineSplitter = LineSplitter.split(text);
	let url = lineSplitter.prefix;
	let descrip = lineSplitter.centralText;
	let link = $("<a>").attr("href",window.location.href + url).text(descrip);
	let li = $("<li>").append(link);
	return li;
}

function makeCode(text, parent)
{
	/*
    String all = "<div style='position:relative'><a class='copy_button' href='#' onclick='navigator.clipboard.writeText(decodeURIComponent(escape(atob(\"" 
            + new String(Base64.encodeBase64(replaceWithEmpty(input).getBytes("UTF-8"))) + "\"))));alert(\"¡Copiado!\");return false;'><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"none\" viewBox=\"0 0 24 24\" class=\"icon-sm\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z\" clip-rule=\"evenodd\"></path></svg></a>";
    
    return all + "<pre class='code'>" + replaceWithStrong(StringEscapeUtils.escapeHtml4(input)) + "</pre></div>";
	*/
	
	let div = $("<div style='position:relative'>").appendTo(parent);
	let a   = $("<a class='copy_button' href='#'><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"none\" viewBox=\"0 0 24 24\" class=\"icon-sm\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z\" clip-rule=\"evenodd\"></path></svg></a>")
				.appendTo(div).click(function(ev){
					ev.preventDefault();
					navigator.clipboard.writeText(replaceWithEmpty(text));
					alert("Copiado!");
					});
	let pre = $("<pre class='code'>").text(text).appendTo(div);
	let html = replaceWithStrong(pre.html());
	pre.html(html);
}

function replaceWithStrong(text) {
    if (text === null) return "";
    return text.replace(/\*\*\*(.*?)\*\*\*/g, "<strong>$1</strong>");
}

function replaceWithEmpty(text) {
    if (text === null) return "";
    return text.replace(/\*\*\*(.*?)\*\*\*/g, "$1");
}

/* ********** */
/* Navegación */
/* ********** */

function insertNavigation(navigation)
{
	// Hilo de ariadna
	console.log("NAVIGATION: " + JSON.stringify(navigation,null,3));
	const hiloAriadna = $("#hilo_ariadna");
	const hilo = navigation.hilo_ariadna;
	if (hilo && hilo.length>0)
	{
		$("#hilo_ariadna").empty();
		for (let i = 0; i<hilo.length; i++)
		{
			let elem = hilo[i];
			$("<a>").attr("href",elem.url).text(elem.descrip).appendTo(hiloAriadna);
			if (i != hilo.length -1)
			{
				$("<span>").text(">").appendTo(hiloAriadna);
			}
		}
	}
	else
	{
		$("#hilo_ariadna").html("&nbsp;");
	}
	
	// Navegación
	if (navigation.next || navigation.prev)
	{
		const navDiv = $("<div class='row avigation'>Navigation</div>").appendTo("#nav1");
		
		
		navDiv.clone().appendTo("#nav2");
	}
	
	
	/*
	#if(${navigation.getNext(${doc_name})} || ${navigation.getPrevious(${doc_name})})
	<div class="row" id="navigation">
		<div class="col-6">
			#if(${navigation.getPrevious(${doc_name})})
				<a href="${navigation.getPrevious(${doc_name})}">
					&#x25C4; Anterior
				</a>
			#end
		</div>
		
		<div class="col-6 text-end">
			#if(${navigation.getNext(${doc_name})})
				<a href="${navigation.getNext(${doc_name})}">
					Siguiente &#x25BA;
				</a>
			#end
		</div>
	</div>
	#end
	*/
	
	
}

