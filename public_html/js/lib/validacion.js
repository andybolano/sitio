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
