export function esDominioValido(dominio) 
{
    // Expresión regular para verificar nombres de dominio v�lidos
    const regexDominio = /^([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
    return regexDominio.test(dominio);
}

