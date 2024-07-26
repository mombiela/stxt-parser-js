import { Constants } from '../js/stxt-parser.js';

export async function testConstants()
{
	let result = "";
	result += Constants.COMMENT_CHAR + "<br>";
	result += Constants.TAB_SPACES + "<br>";
	result += Constants.TAB + "<br>";
	result += Constants.SPACE + "<br>";  
	result += Constants.SEP_NODE + "<br>";
	result += Constants.ENCODING + "<br>";
	result += Constants.NAMESPACE + "<br>";
	return result;
}
