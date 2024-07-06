import { mainConent } from './transform_main.js';

export function transform(hash, node) 
{
    const content = $("#content");

	// Primera parte del contenido	
	content.append(mainConent);
	let result = $("<div>");
	result.append("<h1>HASH: " + hash + "</h1>");
	let pre = $("<pre>").text(node.toString());
	result.append(pre);
	content.append(result);
	
	// Insertamos texto
	const innerContent = $("#inner_content");
	
	const childs = node.getChilds();
	for(let i = 0; i<childs.length; i++)
	{
		let child = childs[i];
		renderChild(child, innerContent);
	}
}

function renderChild(child, innerContent)
{
		$("<pre>").text(child.toString()).appendTo(innerContent);
}
