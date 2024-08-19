var idGlobalWebStorage=0;
var idGlobalIndexDB=0;
/* Organizare conform Lab  */
/* Am o clasa Produs cu care instantez un nou obiect la fiecare adaugare de produs */
class Produs {
  constructor(id, nume, cantitate) {
    this.id = id;
    this.nume = nume;
    this.cantitate = cantitate;
  }
}

/* Clasa de baza care este  mostenita de cele doua clase de stocare (Local Storage & IndexDB) */
class StorageManager {
  constructor(produs) {
    this.produs = produs;
  }
  // Metoda pentru a adăuga un produs în stocare
  AdaugaProdusManager() {
    // trebuie implementată în clasele derivate
  }

  // Metoda pentru a prelua toate produsele din stocare
  adaugaInTabelManager(data) {
    // trebuie implementată în clasele derivate
  }
  /* Metoda unde  */
  letWorkerKnow(){
  }
}

class WebStorageManager extends StorageManager {
  constructor(produs) { 
    super(produs);
  }
  /*
  preloadData() {
    if (this.storageAvailable('localStorage')) {
      const produse = JSON.parse(localStorage.getItem('produse') || '[]');
      for (const produs of produse) {
        this.adaugaInTabelManager(produs);
      }
    }
  }*/

  AdaugaProdusManager() {
    /* Daca ambele campuri sunt completate */
    if( (this.produs.nume != '') &&  (this.produs.cantitate != '') ){
      console.log(this.produs.nume)

      /*Daca am posibilitatea de stocare in acest mod */
      if (this.storageAvailable("localStorage")) {
          // Salvăm produsul în Web Storage API
          const produse = JSON.parse(localStorage.getItem('produse') || '[]');
          produse.push(this.produs);
          localStorage.setItem('produse', JSON.stringify(produse)); 
              
      } else {
          alert("NO LOCAL STORAGE POSSIBILITY");
          return null;
      }
      
      /* Returnez produsul nou adaugat pentru a-l folosi la tabel */
      return this.produs;
    }
    else{
      alert("Element null");
    }
  }

  /* Functia care adauga intr-un tabel toate datele incarcate intr-o sesiune de browser (nu preincarca si celelalte date) */
  adaugaInTabelManager(data) {
    // Actualizăm tabelul cu lista de cumpărături
    const tbody = document.querySelector('table tbody');
    const row = tbody.insertRow();
    row.insertCell().textContent = data.nume;
    row.insertCell().textContent = data.cantitate;
  }


  letWorkerKnow(){
    const manager = this;
    console.log("sunt in letWorkerKnow ");  

    // Creăm un obiect de tip Web Worker
  const worker = new Worker('continut/js/worker.js');
  const newProdus = manager.AdaugaProdusManager(); 
  worker.postMessage(JSON.stringify(newProdus));

  // Ascultăm evenimentul 'message' de la worker
  worker.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("sunt in Anunta si primeste-> ", data);  

    // Dacă primim mesajul "Adauga in tabel", adăugăm noul produs în tabel
    manager.adaugaInTabelManager(data);
    
  };
  }

  storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "_storage_test_";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
}

class IndexedDBManager extends StorageManager {
  constructor(produs) {
    console.log("IndexedDBManager constructor");
    super(produs);
    this.dbName = "produse";
    this.dbVersion = 1;
  }
 
  AdaugaProdusManager() {
    console.log("AdaugaProdusManager");
    if ((this.produs.nume != "") && (this.produs.cantitate != "")) {
      // Generate a unique id for the product
  
      console.log(this.produs.nume);

      const request = window.indexedDB.open(this.dbName, this.dbVersion);

    
      request.onerror = (event) => {
        alert("Eroare la deschiderea bazei de date.");
      };
      
      request.onsuccess = (event) => {
        console.log("IndexedDBManager  request.onsuccess ");

        const db = event.target.result;
        const transaction = db.transaction(["produse"], "readwrite");
        const objectStore = transaction.objectStore("produse");
        const addRequest = objectStore.add(this.produs);

        addRequest.onsuccess = function () {
          console.log("IndexedDBManager   addRequest.onsuccess");

          console.log("Produsul a fost adaugat in IndexedDB");
        };

        transaction.oncomplete = function () {
          db.close();
        };
      };

      /* Cerere de deschidere a bazei de date pt update  */
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore("produse", { keyPath: "id" });
        objectStore.createIndex("nume", "nume", { unique: false });
        objectStore.createIndex("cantitate", "cantitate", { unique: false });
        
      };

      return this.produs;
    } else {
      alert("Element null");
    }
  }
  adaugaInTabelManager(data) {
    // Actualizăm tabelul cu lista de cumpărături
    const tbody = document.querySelector("table tbody");
    const row = tbody.insertRow();
    row.insertCell().textContent = data.nume;
    row.insertCell().textContent = data.cantitate;
  }

  letWorkerKnow() {
    const manager = this;
    console.log("sunt in letWorkerKnow IndexedDBManager");

    // Creăm un obiect de tip Web Worker
    const worker = new Worker("continut/js/worker.js");
    const newProdus = manager.AdaugaProdusManager();
    worker.postMessage(JSON.stringify(newProdus)); //transofrm obiect java in json

    // Ascultăm evenimentul 'message' de la worker
    worker.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("sunt in Anunta IndexedDBManagersi primeste -> ", data);

      // Dacă primim mesajul "Adauga in tabel", adăugăm noul produs în tabel
      manager.adaugaInTabelManager(data);
    };
  }
}

/*Functie apelata la evenimentul butonului Adauga */
function Anunta(){
  const nume = document.getElementsByName('nume')[0].value;
  const cantitate = document.getElementsByName('cantitate')[0].value;
  const modalitateStocare = document.getElementsByName('modalitate-stocare')[0].value;

  if (modalitateStocare === 'web-storage') {
    let produs = new Produs(idGlobalWebStorage, nume, cantitate);
    idGlobalWebStorage=idGlobalWebStorage+1;
    let webStorageManager = new WebStorageManager(produs);
    webStorageManager.letWorkerKnow();
  } else if (modalitateStocare === 'indexed-db') {
    let produs = new Produs(idGlobalIndexDB, nume, cantitate);
    idGlobalIndexDB=idGlobalIndexDB+1;
    // implementare pentru IndexedDB
    let indexDBManager = new IndexedDBManager(produs);
    indexDBManager.letWorkerKnow();

  } else {
    alert('Modalitate de stocare invalidă');
    return;
  }
}


function preIncarcaTabel(){
  console.log("preIncarcaTabel");
}
