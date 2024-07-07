import { mainConent } from './transform_main.js';

export function transform(hash, node) 
{
    const content = $("#content");

	// Primera parte del contenido	
	content.append(mainConent);
	
	// Para debug
	let result = $("<div class='container-fluid'>");
	result.append("<h2>HASH: " + hash + "</h2>");
	let pre = $("<pre>").text(node.toString());
	result.append(pre);
	content.append(result);
	
	// Insertamos childs
	const innerContent = $("#inner_content");
	const childs = node.getChilds();
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
	else if (name == "part")
	{
		$("<h3>").text(text + "->" + childs.length).appendTo(parent);
	}
	else
	{
		$("<pre>").text(child.toString()).appendTo(parent);
	}
	
	// Childs
	for(let i = 0; i<childs.length; i++)
	{
		let ch = childs[i];
		renderChild(ch, parent);
	}		
}
