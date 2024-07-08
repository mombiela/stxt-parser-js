import { mainConent } from './transform_main.js';
import { LineSplitter } from './js/LineSplitter.js';

export function transform(hash, node) 
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
	else if(name == "code")
	{
		$("<pre class='code'>").text(text).appendTo(parent);
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




