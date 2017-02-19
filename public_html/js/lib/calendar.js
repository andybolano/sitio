function dia_semana(fecha){   
    fecha=fecha.split('-');  
    if(fecha.length!=3){  
            return null;  
    }  
    //Vector para calcular día de la semana de un año regular.  
    var regular =[0,3,3,6,1,4,6,2,5,0,3,5];   
    //Vector para calcular día de la semana de un año bisiesto.  
    var bisiesto=[0,3,4,0,2,5,0,3,6,1,4,6];   
    //Vector para hacer la traducción de resultado en día de la semana.  
    var semana=[1,2,3,4,5,6,7];  
    //Día especificado en la fecha recibida por parametro.  
    var dia=fecha[2];  
    //Módulo acumulado del mes especificado en la fecha recibida por parametro.  
    var mes=fecha[1]-1;  
    //Año especificado por la fecha recibida por parametros.  
    var anno=fecha[0];  
    //Comparación para saber si el año recibido es bisiesto.  
    if((anno % 4 == 0) && !(anno % 100 == 0 && anno % 400 != 0))  
        mes=bisiesto[mes];  
    else  
        mes=regular[mes];  
    //Se retorna el resultado del calculo del día de la semana.  
    return semana[Math.ceil(Math.ceil(Math.ceil((anno-1)%7)+Math.ceil((Math.floor((anno-1)/4)-Math.floor((3*(Math.floor((anno-1)/100)+1))/4))%7)+mes+dia%7)%7)];  
} 


