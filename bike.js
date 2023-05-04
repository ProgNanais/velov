var articleElt = document.getElementById("bikes");
articleElt.style.visibility = "hidden";

// Canvas function *************************************************************************************************************************

function drawCanvas (bike) {
    
    var buttonElt = document.getElementById("reservation");
    buttonElt.addEventListener("click", function () {
        
        buttonElt.style.visibility = "hidden";
    
        var clickX = new Array(); 
        var clickY = new Array(); 
        var paint; 
                    
        function addClick(x, y) { 
            clickX.push(x);
            clickY.push(y); 
        }
                    
        function redraw() {     
            context.strokeStyle = "black"; 
                        
            for (var i = 0; i < clickX.length; i++) { 
                context.beginPath(); 
                context.moveTo(clickX[i], clickY[i]); 
                context.lineTo(clickX[i-1], clickY[i-1]);
                context.stroke(); 
            }
        }
        
        function clear() {
            context.clearRect(0, 0, canvasElt.width, canvasElt.height);   
        }
        
        var signElt = document.createElement("p");
        signElt.textContent = "Signer pour valider la réservation : ";
                    
        var canvasElt = document.createElement("canvas");
        canvasElt.id = "canvas";
        canvasElt.style.border = "1px solid black"; 
        var context = canvasElt.getContext("2d"); 
        
        var boutonsCanvas = document.createElement("div");
        boutonsCanvas.id = "boutons";
        
        var submitElt = document.createElement("input");
        submitElt.id = "envoie";
        submitElt.setAttribute("type", "submit");
        submitElt.setAttribute("value", "Confirmer");
        
        var clearElt = document.createElement("input");
        clearElt.id = "clear";
        clearElt.setAttribute("type", "reset");
        clearElt.setAttribute("value", "effacer");
        
        articleElt.appendChild(signElt);
        articleElt.appendChild(canvasElt);
        articleElt.appendChild(boutonsCanvas);
        boutonsCanvas.appendChild(submitElt);
        boutonsCanvas.appendChild(clearElt);
                    
        canvasElt.addEventListener("mousedown", function (e) {
            var mouseX = e.pageX - this.offsetLeft; 
            var mouseY = e.pageY - this.offsetTop; 
                        
            paint = true;
            addClick(mouseX, mouseY); 
            redraw(); 
        });
                    
        canvasElt.addEventListener("mousemove", function(e) {
            if (paint) { 
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                redraw();
            }
        });
                    
        canvasElt.addEventListener("mouseup", function() {
            paint = false; 
        });
                    
        canvasElt.addEventListener("mouseleave", function() {
            paint = false;
        });
        
        clearElt.addEventListener("click", function() {
            clear(); 
        });
        
        submitElt.addEventListener("click", function() {
            boutonsCanvas.style.visibility = "hidden";
            canvasElt.style.visibility = "hidden";
            articleElt.style.visibility = "hidden";
            
            var nbBike = Number(bike.available_bikes) - 1;
            console.log("Nombres de vélo restant : " + nbBike);
            
            var titre = document.getElementById("title");
            titre.textContent= "";
            titre.textContent = "Votre vélo est réservé à la station " + bike.address;
        });
    });
}

// FIN Canvas's function *********************************************************************************************************************

// DEBUT INIT'MAP ****************************************************************************************************************************

function initMap() {
    var lyon = {lat: 45.760, lng: 4.850};
    var map = new google.maps.Map(document.getElementById("map"), {
        center: lyon,
        zoom: 12
    });
    
    var activeInfoWindow;
    
    // DEBUT Appel AjaxGEt *******************************************************************************************************************
    
    var appel = ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey={yourAPIkey}", function (results) {
        
        var markers = [];
        
        var response = JSON.parse(results);
        
        // DEBUT Boucle Marker ***************************************************************************************************************
        
        for (var i = 0; i < response.length; i++) {
            var coords = response[i].position;
            var latLng = new google.maps.LatLng(coords["lat"],coords["lng"]);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: "Vélo' v",
                name: response[i].name,
                address: response[i].address,
                status: response[i].status,
                available_bike_stands: response[i].available_bike_stands,
                available_bikes: response[i].available_bikes
            });
            
            markers.push(marker);
        }
        
        // FIN de la Boucle *****************************************************************************************************************
        
        
        // DEBUT de la Boucle des InfosWindow ***********************************************************************************************
        markers.forEach(function (marker) {
            var infowindow = new google.maps.InfoWindow({
                content: "<h3>" + marker.name + "<br />" + marker.status + "</h3>"
            });
            
            // DEBUT de l'évènement Marker **************************************************************************************************
            
            marker.addListener("click", function () {
                if (activeInfoWindow) {
                    activeInfoWindow.close();
                }
                infowindow.open(map, marker);
                activeInfoWindow = infowindow;
                
                
                articleElt.style.visibility = "visible";
                articleElt.innerHTML = "<h2>Détails de la station</h2><h3 class='merde'>Adresse de la station</h3><p>" + marker.address + "</p><h3 class='merde'>Nombre de place disponible pour poser votre vélo</h3><p>" + marker.available_bike_stands + "</p><h3 class='merde'>Nombre de vélo restants</h3><p>" + marker.available_bikes + "</p><p><input type='submit' id='reservation' value='Je réserve !' /></p><div id='canvasDiv'></div>";
                
                drawCanvas(marker);
            });
            
            // FIN de l'évènement MArker ***************************************************************************************************
        });
        
        // FIN de la boucle InfosWindow ****************************************************************************************************

        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath:"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"});
    });
    
    // FIN de l'appel Ajax *****************************************************************************************************************
}

// FIN de la fonction InitMAP **************************************************************************************************************


/*key = AIzaSyDQtV8hzCVuqrLG2_XByAgw1SbsoELgGZ0 */
/*
https://api.jcdecaux.com/vls/v1/stations?contract={contract_name}&apiKey={api_key}
key JCD = b506e30f70a76f1c22ffeb11395a7c7d15dcca86 */
