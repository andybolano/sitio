function validarNumero(e) {
  var key;
    if(window.event){
  	   key = e.keyCode;
  	}else if(e.which){
	     key = e.which;
	  }
     if (key < 48 || key > 57){
          if(key == 46 || key == 8){ return true; }
             else { return false; }
     }
        return true;
}

function validarTexto(e) {
    
  tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8) return true; 
      patron =/[A-Za-z\s]/; 
      tecla_final = String.fromCharCode(tecla);
      return patron.test(tecla_final); 
} 

function validarEmail(email,token) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(email) )

      if(token == 1){
        document.getElementById("user").value=""
       
      }else{
        document.getElementById("email").value="";
      
     }
  }
  
function format(input)
{
var num = input.value.replace(/\./g,'');
if(!isNaN(num)){
num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
num = num.split('').reverse().join('').replace(/^[\.]/,'');
input.value = num;
}
 
else{ alert('Solo se permiten numeros');
input.value = input.value.replace(/[^\d\.]*/g,'');
}
}


/*
devuelve valores:
0: son iguales.
<0: la primera fecha es menor.
>0: la primera fecha es mayor.
*/
function dateComapreTo(fecha1, fecha2) {
var temp = new Array();
temp  = fecha1.split("-");  
var f1 =  new Date(temp[0], temp[1], temp[2]);
temp  = fecha2.split("-");  
var f2 =  new Date(temp[0], temp[1], temp[2]);
return f1.getTime() - f2.getTime();
}
