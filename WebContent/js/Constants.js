export class Constants {
  static COMMENT_CHAR = '#';
  static TAB_SPACES = 4;
  static TAB = '\t';
  static SPACE = ' ';
  static SEP_NODE = ':';
  static ENCODING = 'UTF-8';
  static NAMESPACE = 'Namespace';
}

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
