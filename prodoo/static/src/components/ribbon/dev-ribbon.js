// adding and removing a dev environnement ribbon 
var ribbon = document.getElementById('ribbon');


fetch('/prodoo/environnement')

    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text();
    })
    .then(text => {

        if (text == 'False') {
            return
        } else {
            ribbon.classList.remove("hidden");
            ribbon.innerHTML = text;
        }
    })
    .catch(error => {
        console.log("error", error)
    });

