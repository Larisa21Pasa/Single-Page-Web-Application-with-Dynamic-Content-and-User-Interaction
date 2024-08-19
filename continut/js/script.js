
/* Functia care schimba continutul paginii index.html cu continutul celorlalte pagini */
function schimbaContinut(resursa, jsFisier, jsFunctie) {
  /* Creez un obiect de tipul XMLHttpRequest pentru a trata requesturile */

    var httpReq=new XMLHttpRequest();
    httpReq.onreadystatechange=function(){
      /* Daca cererea este finalizata cu succes si HTTP are continut valid */
        if(this.readyState==4 && this.status==200)
        {

          /* Preiau continutul tagului main (prezent in toate paginile ) */
            document.getElementById("continut").innerHTML=this.responseText;
            if (jsFisier) 
            {
              /* Daca am specificat vreun fisier js , imi creez un tag de tip script unde adaug functia preluata din parametri*/
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                  /*Aceasta functie se executa la incarcarea paginii */
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                /* Setez atributul src al tagului script (ex <script src="./js/script.js"></script>) */
                elementScript.src = jsFisier;
                /* Si se ataseaza scriptul in partea de top al tagului main */
                document.head.appendChild(elementScript);
            } else {
              /* Daca nu exista vreo cale catre js, se mai verifica daca exista vreo functie spre a fi apelata */
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
            if(resursa=="create.html")
            {
                help();
            }
           
        }
    }
    /*se deschide o conexiune HTTP GET către serverul local, cu resursa specificată ca parametru si trimit cererea HTTP */
    httpReq.open('GET',"http://localhost:5678/"+resursa,true);
    httpReq.send();
}

/* Functia care preia din XML persoanele si incarca un tabel creat dinamic din js in pagina HTML, apoi trimite cererea HTTP corespunzatoare */
function incarcaPersoane() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      loadTable(this);
      }
    };
    console.log("sunt in incarca persoane")
    xhttp.open("GET", "http://localhost:5678/resurse/persoane.xml", true);
    console.log(" xhttp.open")

    xhttp.send();
}

function loadTable(xml) {
    console.log("sunt in incarca loadTable")

    var i;
    var xmlDoc = xml.responseXML;
    var table="<tr><th>Nume</th><th>Prenume</th><th>Varsta</th><th>Strada</th><th>Numar</th><th>Localitate</th><th>Judet</th><th>Tara</th><th>Job Actual</th><th>Job Anterior</th><th>Vechime Job Actual</th><th>Liceu</th><th>Facultate</th><th>Calificari</th></tr>";
    var x = xmlDoc.getElementsByTagName("persoana");
    for (i = 0; i <x.length; i++) {
      table += "<tr><td>" +
      x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("strada")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("numar")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("localitate")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("judet")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("tara")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("job_actual")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("job_anterior")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("vechime_job_actual")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("liceul")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("facultate")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("calificari")[0].childNodes[0].nodeValue +
      "</td></tr>";
    }
    document.getElementById("xmlTable").innerHTML = table;
  }
  
/* Functia care preia  datele de logare ale unui utilizator si le valideaza prin verificarea lor intr-un json*/
  function verificaUtilizator() {
    //preiau datele de input
    var utilizator = document.getElementById("utilizator").value;
    var parola = document.getElementById("parola").value;

    //preiau un request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { //verific daca crerea s-a realizat cu succes
            var utilizatori = JSON.parse(this.responseText); //serializez in json
            var gasit = false;
            for (var i = 0; i < utilizatori.length; i++) {
                if (utilizatori[i].utilizator == utilizator && utilizatori[i].parola == parola) {
                    gasit = true;
                    break;
                }
            }
            if (gasit) {
                document.getElementById("rezultat").innerHTML = "Utilizator și parolă corecte.";
            } else {
                document.getElementById("rezultat").innerHTML = "Utilizator sau parolă incorecte.";
            }
        }
    };
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}

/* Lab 7 Tema 3 -> Functie care preia datele din formularul "Inregistreaza" */
function inregistreazaUtilizator() {
    // preiau datele de input
    var utilizator = document.getElementById("id_utilizator").value;
    var parola = document.getElementById("id_password").value;
    var email = document.getElementById("id_email").value;
    var telefon = document.getElementById("id_phone").value;
  
    // creez un obiect JSON cu datele
    var utilizatorJson = {
      "utilizator": utilizator,
      "parola": parola,
      "email": email,
      "telefon": telefon
    };
  
    // preiau un request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          console.log("JSON-ul a fost salvat cu succes!");
        } else {
          console.log("Eroare la comunicarea cu serverul! Cod status: " + xhttp.status);
        }
      }
    };
    xhttp.onerror = function() {
        console.log("Eroare la comunicarea cu serverul!");
      };
    xhttp.open("POST", "resurse/utilizatori.json", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(utilizatorJson));
  }
  
