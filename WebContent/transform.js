export function transform(hash, node) 
{
	let result = $("<div>");
	result.append("<h1>HASH: " + hash + "</h1>");
	let pre = $("<pre>").text(node.toString());
	result.append(pre);
	
    return result;
}
